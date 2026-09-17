import sys
import argparse
from pathlib import Path
from datetime import datetime, timezone

# Ensure backend root directory is in sys.path for module resolution
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.core.database import get_database, test_connection

# 16 Demo Video Mappings (2 units for each of the 8 selected subjects)
DEMO_VIDEOS = [
    # CSE101 - Professional English & Communication
    {
        "subject_code": "CSE101",
        "unit_number": 1,
        "title": "Active Listening in English - Communication Skills",
        "youtube_id": "k-sS9Xw21gM",
        "youtube_url": "https://www.youtube.com/watch?v=k-sS9Xw21gM",
        "duration": "13:16",
    },
    {
        "subject_code": "CSE101",
        "unit_number": 2,
        "title": "Emails in English - How to Write Professional Emails",
        "youtube_id": "kY31w01W2cE",
        "youtube_url": "https://www.youtube.com/watch?v=kY31w01W2cE",
        "duration": "14:55",
    },
    # CSE102 - Engineering Mathematics I
    {
        "subject_code": "CSE102",
        "unit_number": 1,
        "title": "The Essence of Calculus - Fundamental Concepts",
        "youtube_id": "WUvTyaaNkzM",
        "youtube_url": "https://www.youtube.com/watch?v=WUvTyaaNkzM",
        "duration": "17:04",
    },
    {
        "subject_code": "CSE102",
        "unit_number": 2,
        "title": "The Paradox of the Derivative - Differential Calculus",
        "youtube_id": "9vKqVkMQHKk",
        "youtube_url": "https://www.youtube.com/watch?v=9vKqVkMQHKk",
        "duration": "16:25",
    },
    # CSE301 - Discrete Mathematics
    {
        "subject_code": "CSE301",
        "unit_number": 1,
        "title": "Introduction to Propositional Logic",
        "youtube_id": "q6qWq9m_J2s",
        "youtube_url": "https://www.youtube.com/watch?v=q6qWq9m_J2s",
        "duration": "11:04",
    },
    {
        "subject_code": "CSE301",
        "unit_number": 2,
        "title": "Set Theory - Basics of Sets and Relations",
        "youtube_id": "R9K4r-4H-rY",
        "youtube_url": "https://www.youtube.com/watch?v=R9K4r-4H-rY",
        "duration": "11:42",
    },
    # CSE302 - Data Structures
    {
        "subject_code": "CSE302",
        "unit_number": 1,
        "title": "Introduction to Data Structures & Abstract Data Types",
        "youtube_id": "bum_19loj9A",
        "youtube_url": "https://www.youtube.com/watch?v=bum_19loj9A",
        "duration": "10:04",
    },
    {
        "subject_code": "CSE302",
        "unit_number": 2,
        "title": "Data Structures: Introduction to Linked Lists",
        "youtube_id": "njTh_OwMljA",
        "youtube_url": "https://www.youtube.com/watch?v=njTh_OwMljA",
        "duration": "11:48",
    },
    # AIDS101 - Technical English
    {
        "subject_code": "AIDS101",
        "unit_number": 1,
        "title": "Technical Writing Course for Beginners",
        "youtube_id": "kU7iN_QdJqM",
        "youtube_url": "https://www.youtube.com/watch?v=kU7iN_QdJqM",
        "duration": "1:47:08",
    },
    {
        "subject_code": "AIDS101",
        "unit_number": 2,
        "title": "How to Write Technical Documentation & Guides",
        "youtube_id": "J_7s_t5H650",
        "youtube_url": "https://www.youtube.com/watch?v=J_7s_t5H650",
        "duration": "47:15",
    },
    # AIDS102 - Linear Algebra and Calculus
    {
        "subject_code": "AIDS102",
        "unit_number": 1,
        "title": "Vectors | Essence of Linear Algebra, Chapter 1",
        "youtube_id": "fNk_zzaMoSs",
        "youtube_url": "https://www.youtube.com/watch?v=fNk_zzaMoSs",
        "duration": "09:52",
    },
    {
        "subject_code": "AIDS102",
        "unit_number": 2,
        "title": "Linear Combinations, Span, and Basis Vectors",
        "youtube_id": "k7N2Z02_u28",
        "youtube_url": "https://www.youtube.com/watch?v=k7N2Z02_u28",
        "duration": "09:59",
    },
    # AIDS301 - Probability and Statistics
    {
        "subject_code": "AIDS301",
        "unit_number": 1,
        "title": "Introduction to Probability: Independent and Dependent Events",
        "youtube_id": "uzkc-qNVoOk",
        "youtube_url": "https://www.youtube.com/watch?v=uzkc-qNVoOk",
        "duration": "09:40",
    },
    {
        "subject_code": "AIDS301",
        "unit_number": 2,
        "title": "p-values: What They Are and How to Interpret Them",
        "youtube_id": "vemZtEM63GY",
        "youtube_url": "https://www.youtube.com/watch?v=vemZtEM63GY",
        "duration": "11:22",
    },
    # AIDS302 - Data Structures and Algorithms
    {
        "subject_code": "AIDS302",
        "unit_number": 1,
        "title": "Data Structures Easy to Advanced Course",
        "youtube_id": "RBSGKlAvoiM",
        "youtube_url": "https://www.youtube.com/watch?v=RBSGKlAvoiM",
        "duration": "8:03:17",
    },
    {
        "subject_code": "AIDS302",
        "unit_number": 2,
        "title": "Bubble Sort Algorithm - CS50 Shorts",
        "youtube_id": "RT-hUXUWv2I",
        "youtube_url": "https://www.youtube.com/watch?v=RT-hUXUWv2I",
        "duration": "05:21",
    },
]


def seed_demo_videos(dry_run: bool = True):
    """
    Seeds demo video records into db.videos using dynamic topic lookup.
    If dry_run is True (default), builds and validates the documents without inserting them.
    """
    db = get_database()
    if db is None:
        print("[Error] Database connection not available.")
        return

    now = datetime.now(timezone.utc)

    prepared_count = 0
    skipped_count = 0
    missing_subject_count = 0
    missing_topic_count = 0

    prepared_docs = []

    mode_str = "DRY RUN (Preview Only - No Insert)" if dry_run else "EXECUTE (Inserting to MongoDB)"
    print(f"\n================ DEMO VIDEO SEED SCRIPT ================")
    print(f"Execution Mode: {mode_str}")
    print("--------------------------------------------------------")

    for item in DEMO_VIDEOS:
        code = item["subject_code"]
        unit = item["unit_number"]
        title = item["title"]
        yt_id = item["youtube_id"]
        yt_url = item["youtube_url"]
        duration = item["duration"]

        # 1. Dynamic Subject Lookup by subject_code
        subject = db.subjects.find_one({"code": code})
        if not subject:
            print(f"[ERROR] Missing subject for code: '{code}'")
            missing_subject_count += 1
            continue

        subject_id = subject["_id"]

        # 2. Dynamic Topic Lookup by subject_id + unit_number
        topic = db.topics.find_one({"subject_id": subject_id, "unit_number": unit})
        if not topic:
            print(f"[ERROR] Missing topic for subject '{code}', Unit {unit}")
            missing_topic_count += 1
            continue

        topic_id = topic["_id"]

        # 3. Check for existing video record to prevent duplicates
        existing = db.videos.find_one({"topic_id": topic_id, "youtube_id": yt_id})
        if existing:
            print(f"[SKIP] Video '{yt_id}' already exists for topic_id '{topic_id}' ({code} Unit {unit})")
            skipped_count += 1
            continue

        # 4. Prepare video document adhering to MongoDB schema
        doc = {
            "topic_id": topic_id,
            "title": title,
            "youtube_url": yt_url,
            "youtube_id": yt_id,
            "duration": duration,
            "created_at": now,
            "updated_at": now,
        }
        prepared_docs.append(doc)
        prepared_count += 1
        print(f"[PREPARED] {code} Unit {unit} (topic_id: {topic_id}) -> '{title}' ({yt_id})")

    # 5. Insert if execute mode, otherwise preview
    if not dry_run and prepared_docs:
        result = db.videos.insert_many(prepared_docs)
        print(f"\n[SUCCESS] Inserted {len(result.inserted_ids)} video documents into db.videos.")
    elif dry_run:
        print(f"\n[DRY RUN] Read-only verification completed. {prepared_count} video documents prepared.")

    # 6. Report Summary
    print("\n---------------- SEED SUMMARY REPORT ----------------")
    print(f"Prepared Count        : {prepared_count}")
    print(f"Skipped Count         : {skipped_count}")
    print(f"Missing Subject Count : {missing_subject_count}")
    print(f"Missing Topic Count   : {missing_topic_count}")
    print(f"Total db.videos Count : {db.videos.count_documents({})}")
    print("================================---------------------\n")

    return {
        "prepared_count": prepared_count,
        "skipped_count": skipped_count,
        "missing_subject_count": missing_subject_count,
        "missing_topic_count": missing_topic_count,
        "total_db_videos": db.videos.count_documents({}),
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed 16 Demo Video Records into MongoDB")
    parser.add_argument(
        "--execute",
        action="store_true",
        help="Execute the insertion into db.videos (default is dry-run mode)",
    )
    args = parser.parse_args()

    # Default is dry-run (dry_run=True) unless --execute flag is explicitly passed
    is_dry_run = not args.execute
    seed_demo_videos(dry_run=is_dry_run)
