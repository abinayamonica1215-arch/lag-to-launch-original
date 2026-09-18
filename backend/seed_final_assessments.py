#!/usr/bin/env python3
"""
seed_final_assessments.py
=========================
Reads the 100 questions inside CATEGORY_QUESTION_BANKS from
  src/api/assessment.js
and upserts them into the MongoDB `final_assessment_questions` collection,
generating one document per (subject_code x question) combination.

HOW THE JS IS EXTRACTED
-----------------------
1. The script reads assessment.js as plain text.
2. It locates the CATEGORY_QUESTION_BANKS block using regex + brace-depth
   walking (safe because no question text contains bare '{' or '}').
3. The extracted JS object literal is fed to Node.js via subprocess to produce
   canonical JSON (no hand-written JS->JSON parser needed, and the original
   assessment.js is never modified).

USAGE
-----
  # Preview only -- no MongoDB writes:
  python seed_final_assessments.py --dry-run

  # Upsert only missing documents (idempotent):
  python seed_final_assessments.py

VERIFIED SUBJECT-CODE MAPPING (audit 2026-09-18)
-------------------------------------------------
  Data Structures & Algorithms  -> CSE302, AIDS302, CS302
  Discrete Mathematics          -> CSE301
  Database Management Systems   -> CSE402, AIDS402, CS402
  Computer Networks             -> AIDS404
  Operating Systems             -> CSE401, CS403

ECE subjects are intentionally excluded -- no ECE subject in the seeded
MongoDB data covers any of the five question categories above.

WHAT THIS SCRIPT DOES NOT TOUCH
--------------------------------
  - src/api/assessment.js          (read-only)
  - Any existing MongoDB collection (no deletions, no overwrites)
  - The 65 weak_link/dynamic_self fallback questions
  - The 6 placement readiness questions
  - Any daily_questions collection
"""

import sys
import os
import json
import re
import argparse
import subprocess
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict

# ---------------------------------------------------------------------------
# Path layout
# ---------------------------------------------------------------------------
# This script lives at: backend/seed_final_assessments.py
BACKEND_DIR   = Path(__file__).resolve().parent          # .../backend/
REPO_ROOT     = BACKEND_DIR.parent                       # repo root
ASSESSMENT_JS = REPO_ROOT / "src" / "api" / "assessment.js"

# Make `app.*` importable (same pattern used by seed_data.py)
sys.path.insert(0, str(BACKEND_DIR))

# ---------------------------------------------------------------------------
# Verified category -> subject_code mapping
# ---------------------------------------------------------------------------
CATEGORY_TO_SUBJECT_CODES = {
    "Data Structures & Algorithms": ["CSE302", "AIDS302", "CS302"],
    "Discrete Mathematics":          ["CSE301"],
    "Database Management Systems":   ["CSE402", "AIDS402", "CS402"],
    "Computer Networks":             ["AIDS404"],
    "Operating Systems":             ["CSE401", "CS403"],
}

# The four tiers that exist inside CATEGORY_QUESTION_BANKS
EXPECTED_TIERS = {"assessment1", "assessment2", "assessment3", "final"}

# Target MongoDB collection
TARGET_COLLECTION = "final_assessment_questions"


# ===========================================================================
# JS Extraction
# ===========================================================================

def _extract_cqb_block(source):
    """
    Locate the CATEGORY_QUESTION_BANKS object literal inside the JS source
    using regex to find the declaration and brace-depth walking to find its
    closing brace.

    Returns the raw JS block string including its outer '{' and '}'.

    Raises
    ------
    ValueError : if the declaration cannot be found or braces are unmatched.
    """
    pattern = r"export\s+const\s+CATEGORY_QUESTION_BANKS\s*=\s*\{"
    m = re.search(pattern, source)
    if not m:
        raise ValueError(
            "Could not locate 'export const CATEGORY_QUESTION_BANKS = {' in assessment.js.\n"
            "Has the constant been renamed, moved, or removed?"
        )

    # The regex ends at the character after the opening '{',
    # so the '{' itself is at m.end() - 1.
    brace_start = m.end() - 1
    depth = 0

    for i in range(brace_start, len(source)):
        ch = source[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return source[brace_start : i + 1]

    raise ValueError(
        "CATEGORY_QUESTION_BANKS has an unmatched opening brace -- "
        "assessment.js may be malformed."
    )


def load_category_question_banks():
    """
    Extract and parse CATEGORY_QUESTION_BANKS from assessment.js.

    1. Reads the file and extracts only the CATEGORY_QUESTION_BANKS block.
    2. Passes the block to Node.js for JSON serialisation.
    3. Returns the parsed Python dict.

    Raises
    ------
    FileNotFoundError : assessment.js not found.
    ValueError        : block not found or braces unmatched.
    RuntimeError      : Node.js not installed, timed out, or returned an error.
    """
    if not ASSESSMENT_JS.exists():
        raise FileNotFoundError(
            f"assessment.js not found at:\n  {ASSESSMENT_JS}\n"
            "Make sure this script is run from the backend/ directory "
            "or the repository root."
        )

    source = ASSESSMENT_JS.read_text(encoding="utf-8")
    print(f"[Extract] Reading {ASSESSMENT_JS.name}  ({len(source):,} bytes)")

    js_block = _extract_cqb_block(source)

    # Count approximate line range for logging
    prefix = source[:source.find(js_block)]
    line_start = prefix.count("\n") + 1
    line_end   = line_start + js_block.count("\n")
    print(
        f"[Extract] CATEGORY_QUESTION_BANKS block isolated  "
        f"({len(js_block):,} chars, lines {line_start}-{line_end})"
    )

    # Feed the isolated block to Node.js as CommonJS to get canonical JSON.
    node_script = (
        "const CATEGORY_QUESTION_BANKS = " + js_block + ";\n"
        "process.stdout.write(JSON.stringify(CATEGORY_QUESTION_BANKS));"
    )

    try:
        result = subprocess.run(
            ["node", "--input-type=commonjs"],
            input=node_script,
            capture_output=True,
            text=True,
            timeout=20,
        )
    except FileNotFoundError:
        raise RuntimeError(
            "Node.js ('node') was not found on PATH.\n"
            "Install Node.js (https://nodejs.org) and ensure it is on your PATH,\n"
            "then re-run this script."
        )
    except subprocess.TimeoutExpired:
        raise RuntimeError(
            "Node.js timed out (>20 s) while serialising CATEGORY_QUESTION_BANKS."
        )

    if result.returncode != 0:
        raise RuntimeError(
            f"Node.js exited with code {result.returncode}.\n"
            f"stderr:\n{result.stderr.strip()}"
        )

    if not result.stdout.strip():
        raise RuntimeError(
            "Node.js produced no output -- CATEGORY_QUESTION_BANKS may be undefined "
            "in the extracted block."
        )

    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            f"Node.js output is not valid JSON: {exc}\n"
            f"stdout (first 500 chars):\n{result.stdout[:500]}"
        )

    if not isinstance(data, dict):
        raise RuntimeError(
            f"Expected CATEGORY_QUESTION_BANKS to be a JS object (dict), "
            f"got {type(data).__name__}."
        )

    print(
        f"[Extract] Parsed successfully via Node.js -- "
        f"{len(data)} top-level category key(s) found."
    )
    return data


# ===========================================================================
# Question Validation
# ===========================================================================

def validate_question(q, bank_key, tier):
    """
    Validate a single question dict.
    Returns a (possibly empty) list of human-readable error strings.
    """
    errors = []

    if not isinstance(q, dict):
        return [f"Question is not a dict (got {type(q).__name__})"]

    required_fields = ("id", "category", "question", "options", "correctOptionIndex")
    for field in required_fields:
        if field not in q:
            errors.append(f"Missing required field '{field}'")

    # options validation
    if "options" in q:
        opts = q["options"]
        if not isinstance(opts, list):
            errors.append(f"'options' must be a list, got {type(opts).__name__}")
        elif len(opts) == 0:
            errors.append("'options' list is empty")
        else:
            for idx_o, o in enumerate(opts):
                if not isinstance(o, str) or not str(o).strip():
                    errors.append(f"Option at index {idx_o} is empty or not a string")

    # correctOptionIndex validation
    if "correctOptionIndex" in q and "options" in q and isinstance(q["options"], list):
        idx = q["correctOptionIndex"]
        if not isinstance(idx, int):
            errors.append(
                f"'correctOptionIndex' must be an int, got {type(idx).__name__}"
            )
        elif idx < 0 or idx >= len(q["options"]):
            errors.append(
                f"'correctOptionIndex' {idx} is out of range "
                f"for options list of length {len(q['options'])}"
            )
        else:
            correct_text = str(q["options"][idx]).strip()
            if not correct_text:
                errors.append(
                    f"The option at correctOptionIndex {idx} resolves to an empty string"
                )

    # question text
    if "question" in q and not str(q.get("question", "")).strip():
        errors.append("'question' text is an empty string")

    # id
    if "id" in q and not str(q.get("id", "")).strip():
        errors.append("'id' is an empty string")

    return errors


# ===========================================================================
# Document Building
# ===========================================================================

def build_documents(banks):
    """
    Walk CATEGORY_QUESTION_BANKS and produce a flat list of MongoDB documents,
    one per (subject_code x question) combination.

    Parameters
    ----------
    banks : the parsed CATEGORY_QUESTION_BANKS dict

    Returns
    -------
    (docs, summary)
    docs    : list of dicts ready for upsert
    summary : dict with counts and diagnostics
    """
    docs = []
    validation_errors = []
    unmapped_categories = set()

    count_by_subject  = defaultdict(int)
    count_by_tier     = defaultdict(int)
    count_by_category = defaultdict(int)

    source_question_count = 0
    now = datetime.now(timezone.utc)

    for bank_key, tier_dict in banks.items():
        if not isinstance(tier_dict, dict):
            validation_errors.append(
                f"[{bank_key}] Value is not a dict -- entire category skipped."
            )
            continue

        for tier, tier_data in tier_dict.items():
            if tier not in EXPECTED_TIERS:
                validation_errors.append(
                    f"[{bank_key}][{tier}] Unexpected tier name "
                    f"(expected one of {sorted(EXPECTED_TIERS)}) -- tier skipped."
                )
                continue

            if not isinstance(tier_data, dict):
                validation_errors.append(
                    f"[{bank_key}][{tier}] Tier value is not a dict -- tier skipped."
                )
                continue

            questions = tier_data.get("questions")
            if not isinstance(questions, list) or len(questions) == 0:
                validation_errors.append(
                    f"[{bank_key}][{tier}] 'questions' is missing or empty -- tier skipped."
                )
                continue

            for q in questions:
                source_question_count += 1
                q_errors = validate_question(q, bank_key, tier)

                if q_errors:
                    q_id = q.get("id", "<no id>") if isinstance(q, dict) else "<not a dict>"
                    validation_errors.append(
                        f"[{bank_key}][{tier}] Question '{q_id}': "
                        + "; ".join(q_errors)
                    )
                    continue

                category    = str(q["category"]).strip()
                correct_idx = int(q["correctOptionIndex"])
                correct_ans = str(q["options"][correct_idx]).strip()

                subject_codes = CATEGORY_TO_SUBJECT_CODES.get(category)
                if not subject_codes:
                    unmapped_categories.add(category)
                    continue

                for code in subject_codes:
                    doc = {
                        # _id is intentionally omitted -- MongoDB generates ObjectId
                        "question_id":     str(q["id"]).strip(),
                        "subject_code":    code,
                        "category":        category,
                        "assessment_type": tier,
                        "question":        str(q["question"]).strip(),
                        "options":         [str(o).strip() for o in q["options"]],
                        "correct_answer":  correct_ans,
                        "created_at":      now,
                    }
                    docs.append(doc)
                    count_by_subject[code]      += 1
                    count_by_tier[tier]         += 1
                    count_by_category[category] += 1

    summary = {
        "source_questions":    source_question_count,
        "total_mapped_docs":   len(docs),
        "count_by_subject":    dict(sorted(count_by_subject.items())),
        "count_by_tier":       dict(sorted(count_by_tier.items())),
        "count_by_category":   dict(count_by_category),
        "unmapped_categories": sorted(unmapped_categories),
        "validation_errors":   validation_errors,
    }
    return docs, summary


# ===========================================================================
# Summary Printer
# ===========================================================================

def print_summary(summary, dry_run):
    mode_label = "DRY-RUN PREVIEW -- NO WRITES" if dry_run else "PRE-INSERTION SUMMARY"
    w = 66

    print()
    print("=" * w)
    print(f"  {mode_label}")
    print("=" * w)

    print(f"\n  Source questions extracted   : {summary['source_questions']}")
    print(f"  Total documents to upsert   : {summary['total_mapped_docs']}")
    print(f"  Target collection           : {TARGET_COLLECTION}")

    print("\n  Documents by subject_code:")
    for code, cnt in summary["count_by_subject"].items():
        print(f"    {code:<12}  {cnt:>3} documents")

    print("\n  Documents by assessment_type:")
    for tier, cnt in summary["count_by_tier"].items():
        print(f"    {tier:<16}  {cnt:>3} documents")

    print("\n  Documents by category:")
    for cat, cnt in summary["count_by_category"].items():
        print(f"    {cat:<38}  {cnt:>3} documents")

    if summary["unmapped_categories"]:
        print(f"\n  !  Unmapped categories (no subject_code -- skipped):")
        for cat in summary["unmapped_categories"]:
            print(f"       - {cat}")

    if summary["validation_errors"]:
        print(f"\n  !  Validation errors / warnings  ({len(summary['validation_errors'])}):")
        for err in summary["validation_errors"]:
            print(f"       {err}")

    print()
    if dry_run:
        print("  [DRY-RUN]  Database was NOT touched.")
    print("=" * w)
    print()


# ===========================================================================
# MongoDB Upsert
# ===========================================================================

def upsert_documents(docs):
    """
    Upsert each document into `final_assessment_questions`.

    Uniqueness key  : (subject_code, question_id)
    Strategy        : $setOnInsert -- existing documents are NEVER overwritten.
    Effect          : running the script twice is safe and idempotent.

    Returns
    -------
    (inserted_count, skipped_count)
    """
    from app.core.database import get_database   # deferred -- only in non-dry-run path

    db = get_database()
    if db is None:
        raise RuntimeError(
            "get_database() returned None.\n"
            "Check that MONGODB_URI is set in backend/.env and MongoDB is reachable."
        )

    collection = db[TARGET_COLLECTION]
    inserted = 0
    skipped  = 0

    for doc in docs:
        filter_key = {
            "subject_code": doc["subject_code"],
            "question_id":  doc["question_id"],
        }
        result = collection.update_one(
            filter_key,
            {"$setOnInsert": doc},
            upsert=True,
        )
        if result.upserted_id is not None:
            inserted += 1
        else:
            skipped += 1

    return inserted, skipped


# ===========================================================================
# Entry Point
# ===========================================================================

def main():
    parser = argparse.ArgumentParser(
        description=(
            "Seed final_assessment_questions from CATEGORY_QUESTION_BANKS "
            "in src/api/assessment.js."
        )
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help=(
            "Extract and map questions, print a full summary, "
            "then EXIT without touching the database."
        ),
    )
    args = parser.parse_args()

    print()
    print("=" * 66)
    print("  seed_final_assessments.py")
    print(
        f"  Mode : "
        f"{'DRY-RUN (no inserts)' if args.dry_run else 'NORMAL (upsert missing docs)'}"
    )
    print("=" * 66)
    print()

    # ------------------------------------------------------------------
    # Step 1 -- Extract CATEGORY_QUESTION_BANKS
    # ------------------------------------------------------------------
    try:
        banks = load_category_question_banks()
    except FileNotFoundError as exc:
        print(f"[ERROR] {exc}", file=sys.stderr)
        sys.exit(1)
    except (ValueError, RuntimeError) as exc:
        print(f"[ERROR] Extraction failed:\n  {exc}", file=sys.stderr)
        sys.exit(1)

    # Quick sanity check on top-level keys
    found_cats    = set(banks.keys())
    expected_cats = set(CATEGORY_TO_SUBJECT_CODES.keys())
    missing_cats  = expected_cats - found_cats
    extra_cats    = found_cats    - expected_cats

    if missing_cats:
        print(
            f"[WARN]  Expected categories not found in extracted data "
            f"(will have zero documents):\n  {sorted(missing_cats)}"
        )
    if extra_cats:
        print(
            f"[INFO]  Extra categories found in JS (no subject mapping -- will be skipped):\n"
            f"  {sorted(extra_cats)}"
        )

    # ------------------------------------------------------------------
    # Step 2 -- Build document list
    # ------------------------------------------------------------------
    print("[Map]   Building document list ...")
    try:
        docs, summary = build_documents(banks)
    except Exception as exc:
        print(f"[ERROR] Document building raised an unexpected error:\n  {exc}", file=sys.stderr)
        sys.exit(1)

    # ------------------------------------------------------------------
    # Step 3 -- Print summary (always, regardless of --dry-run)
    # ------------------------------------------------------------------
    print_summary(summary, dry_run=args.dry_run)

    # ------------------------------------------------------------------
    # Step 4 -- Exit early if --dry-run
    # ------------------------------------------------------------------
    if args.dry_run:
        print("[DRY-RUN]  Exiting. The database was not modified.")
        sys.exit(0)

    # ------------------------------------------------------------------
    # Step 5 -- Connect to MongoDB (normal run only)
    # ------------------------------------------------------------------
    print("[DB]    Testing MongoDB connection ...")
    try:
        from app.core.database import test_connection
        if not test_connection():
            print(
                "[ERROR] MongoDB connection test failed.\n"
                "        Check MONGODB_URI in backend/.env and MongoDB Atlas status.",
                file=sys.stderr,
            )
            sys.exit(1)
        print("[DB]    Connection OK.")
    except ImportError as exc:
        print(
            f"[ERROR] Cannot import app.core.database -- "
            f"run this script from the backend/ directory:\n  {exc}",
            file=sys.stderr,
        )
        sys.exit(1)

    if not docs:
        print("[INFO]  No valid documents were produced. Nothing to insert.")
        sys.exit(0)

    # ------------------------------------------------------------------
    # Step 6 -- Upsert
    # ------------------------------------------------------------------
    print(
        f"[DB]    Upserting {len(docs)} document(s) into "
        f"'{TARGET_COLLECTION}' ..."
    )
    try:
        inserted, skipped = upsert_documents(docs)
    except RuntimeError as exc:
        print(f"[ERROR] Upsert failed:\n  {exc}", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:
        print(f"[ERROR] Unexpected error during upsert:\n  {exc}", file=sys.stderr)
        sys.exit(1)

    w = 66
    print()
    print("=" * w)
    print("  INSERTION COMPLETE")
    print("=" * w)
    print(f"  Inserted (new docs)      : {inserted}")
    print(f"  Skipped  (already exist) : {skipped}")
    print(f"  Total processed          : {inserted + skipped}")
    print("=" * w)
    print()


if __name__ == "__main__":
    main()
