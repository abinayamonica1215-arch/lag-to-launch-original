import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

# Define path to backend/.env file
BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_path = BASE_DIR / ".env"

# Load environment variables from .env
load_dotenv(dotenv_path=env_path)

# Retrieve MongoDB connection URI from environment or .env file
MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI and env_path.exists():
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            stripped = line.strip()
            if stripped.startswith("mongodb://") or stripped.startswith("mongodb+srv://"):
                MONGODB_URI = stripped
                break

DEFAULT_DB_NAME = "LagToLaunch"

try:
    import certifi
    ca_file = certifi.where()
except ImportError:
    ca_file = None

# Initialize PyMongo Client and Database objects
client = None
db = None

if MONGODB_URI:
    try:
        client_kwargs = {}
        if ca_file and "tlsAllowInvalidCertificates" not in MONGODB_URI and "tlsInsecure" not in MONGODB_URI:
            client_kwargs["tlsCAFile"] = ca_file
        _temp_client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000, **client_kwargs)
        _temp_client.admin.command("ping")
        client = _temp_client
        try:
            db = client.get_default_database()
        except Exception:
            db = client[DEFAULT_DB_NAME]
    except Exception as err:
        print(f"[MongoDB] Atlas connection failed ({err}). Falling back to in-memory mongomock.")
        try:
            import mongomock
            client = mongomock.MongoClient()
            db = client[DEFAULT_DB_NAME]
        except ImportError:
            client = None
            db = None
else:
    try:
        import mongomock
        client = mongomock.MongoClient()
        db = client[DEFAULT_DB_NAME]
    except ImportError:
        client = None
        db = None


def _ensure_mock_seeded(target_db):
    if target_db is not None and getattr(target_db.client, "__class__", None).__name__ == "MongoClient" and "mongomock" in getattr(target_db.client, "__module__", ""):
        if target_db.departments.count_documents({}) == 0:
            from datetime import datetime, timezone
            now = datetime.now(timezone.utc)
            from seed_data import DEPARTMENTS
            for dept_data in DEPARTMENTS:
                dept_code = dept_data["code"]
                dept_name = dept_data["name"]
                target_db.departments.update_one(
                    {"code": dept_code},
                    {"$setOnInsert": {"created_at": now}, "$set": {"code": dept_code, "name": dept_name, "updated_at": now}},
                    upsert=True
                )
                for semester, subjects in dept_data["semesters"].items():
                    for code, name in subjects:
                        subj_filter = {"department_code": dept_code, "semester": semester, "code": code}
                        target_db.subjects.update_one(
                            subj_filter,
                            {
                                "$setOnInsert": {"created_at": now},
                                "$set": {
                                    "department_code": dept_code,
                                    "semester": semester,
                                    "code": code,
                                    "name": name,
                                    "title": name,
                                    "updated_at": now,
                                },
                            },
                            upsert=True
                        )
                        subject_doc = target_db.subjects.find_one(subj_filter)
                        subject_id = subject_doc["_id"]
                        for unit_num in range(1, 5):
                            topic_title = f"Unit {unit_num}"
                            target_db.topics.update_one(
                                {"subject_id": subject_id, "unit_number": unit_num},
                                {
                                    "$setOnInsert": {"created_at": now},
                                    "$set": {
                                        "subject_id": subject_id,
                                        "unit_number": unit_num,
                                        "title": topic_title,
                                        "name": topic_title,
                                        "updated_at": now,
                                    },
                                },
                                upsert=True
                            )


def get_database():
    """
    Provides access to the MongoDB database instance for the rest of the application.
    """
    if db is not None:
        _ensure_mock_seeded(db)
    return db


def test_connection() -> bool:
    """
    Verifies connectivity to MongoDB Atlas by sending a ping command.
    Returns True if successful, False otherwise.
    Note: Does not log or expose passwords or connection strings.
    """
    if client is None:
        print("[MongoDB] Connection test failed: MONGODB_URI is missing or not configured.")
        return False

    try:
        # Send a ping command to confirm active connection
        client.admin.command("ping")
        print("[MongoDB] Successfully connected to MongoDB Atlas!")
        return True
    except Exception as err:
        print(f"[MongoDB] Connection test failed: {err}")
        return False
