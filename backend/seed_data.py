import sys
from pathlib import Path
from datetime import datetime, timezone

# Ensure backend root directory is in sys.path for module resolution
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.core.database import get_database, test_connection

# Seed dataset definition adhering to prototype structure
DEPARTMENTS = [
    {
        "code": "CSE",
        "name": "Computer Science and Engineering",
        "semesters": {
            1: [
                ("CSE101", "Professional English & Communication"),
                ("CSE102", "Engineering Mathematics I"),
                ("CSE103", "Engineering Physics"),
                ("CSE104", "Programming in C"),
            ],
            3: [
                ("CSE301", "Discrete Mathematics"),
                ("CSE302", "Data Structures"),
                ("CSE303", "Digital Principles and System Design"),
                ("CSE304", "Object Oriented Programming in C++"),
            ],
            4: [
                ("CSE401", "Operating Systems"),
                ("CSE402", "Database Management Systems"),
                ("CSE403", "Design and Analysis of Algorithms"),
                ("CSE404", "Computer Architecture"),
            ],
            7: [
                ("CSE701", "Cloud Computing"),
                ("CSE702", "Artificial Intelligence & Machine Learning"),
                ("CSE703", "Cryptography and Network Security"),
                ("CSE704", "Software Testing and Quality Assurance"),
            ],
        },
    },
    {
        "code": "AIDS",
        "name": "Artificial Intelligence and Data Science",
        "semesters": {
            1: [
                ("AIDS101", "Technical English"),
                ("AIDS102", "Linear Algebra and Calculus"),
                ("AIDS103", "Engineering Chemistry"),
                ("AIDS104", "Python Programming for Data Science"),
            ],
            3: [
                ("AIDS301", "Probability and Statistics"),
                ("AIDS302", "Data Structures and Algorithms"),
                ("AIDS303", "Foundations of Data Science"),
                ("AIDS304", "Object Oriented Programming in Java"),
            ],
            4: [
                ("AIDS401", "Machine Learning Fundamentals"),
                ("AIDS402", "Database Systems and Data Warehousing"),
                ("AIDS403", "Exploratory Data Analysis"),
                ("AIDS404", "Computer Networks"),
            ],
            7: [
                ("AIDS701", "Deep Learning & Neural Networks"),
                ("AIDS702", "Big Data Analytics"),
                ("AIDS703", "Natural Language Processing"),
                ("AIDS704", "AI Ethics and Governance"),
            ],
        },
    },
    {
        "code": "CS",
        "name": "Cyber Security",
        "semesters": {
            1: [
                ("CS101", "Communicative English"),
                ("CS102", "Calculus and Differential Equations"),
                ("CS103", "Physics for Information Science"),
                ("CS104", "Problem Solving and C Programming"),
            ],
            3: [
                ("CS301", "Number Theory and Cryptography"),
                ("CS302", "Data Structures and Algorithm Analysis"),
                ("CS303", "Computer Organization and Logic Design"),
                ("CS304", "Object Oriented Concepts"),
            ],
            4: [
                ("CS401", "Network Security Protocols"),
                ("CS402", "Database Management & Security"),
                ("CS403", "Operating System Concepts & Security"),
                ("CS404", "Ethical Hacking Fundamentals"),
            ],
            7: [
                ("CS701", "Cyber Forensics and Incident Response"),
                ("CS702", "Cloud Security and Virtualization"),
                ("CS703", "Malware Analysis and Reverse Engineering"),
                ("CS704", "Information Security Policy and Governance"),
            ],
        },
    },
    {
        "code": "ECE",
        "name": "Electronics and Communication Engineering",
        "semesters": {
            1: [
                ("ECE101", "Technical English & Report Writing"),
                ("ECE102", "Engineering Mathematics I"),
                ("ECE103", "Physics for Electronics"),
                ("ECE104", "Basic Electrical and Circuit Analysis"),
            ],
            3: [
                ("ECE301", "Transforms and Partial Differential Equations"),
                ("ECE302", "Electronic Devices and Circuits"),
                ("ECE303", "Digital Electronics"),
                ("ECE304", "Signals and Systems"),
            ],
            4: [
                ("ECE401", "Electromagnetic Fields"),
                ("ECE402", "Linear Integrated Circuits"),
                ("ECE403", "Analog Communication Systems"),
                ("ECE404", "Microprocessors and Microcontrollers"),
            ],
            7: [
                ("ECE701", "Optical Communication & Networks"),
                ("ECE702", "Embedded Systems and IoT"),
                ("ECE703", "VLSI Design"),
                ("ECE704", "Wireless Communication"),
            ],
        },
    },
]


def seed_database():
    """
    Seeds the MongoDB database with departments, subjects, and topics.
    Uses upsert logic based on unique index keys to ensure idempotence.
    """
    print("[Seed] Testing MongoDB database connection...")
    if not test_connection():
        print("[Seed] Connection failed. Exiting.")
        sys.exit(1)

    db = get_database()
    now = datetime.now(timezone.utc)

    dept_count = 0
    subj_count = 0
    topic_count = 0

    print("[Seed] Inserting/updating seed data...")
    for dept_data in DEPARTMENTS:
        dept_code = dept_data["code"]
        dept_name = dept_data["name"]

        # 1. Upsert Department
        db.departments.update_one(
            {"code": dept_code},
            {
                "$setOnInsert": {"created_at": now},
                "$set": {"code": dept_code, "name": dept_name, "updated_at": now},
            },
            upsert=True,
        )
        dept_count += 1

        for semester, subjects in dept_data["semesters"].items():
            for code, name in subjects:
                # 2. Upsert Subject
                subj_filter = {
                    "department_code": dept_code,
                    "semester": semester,
                    "code": code,
                }
                db.subjects.update_one(
                    subj_filter,
                    {
                        "$setOnInsert": {"created_at": now},
                        "$set": {
                            "department_code": dept_code,
                            "semester": semester,
                            "code": code,
                            "name": name,
                            "updated_at": now,
                        },
                    },
                    upsert=True,
                )
                subj_count += 1

                # Retrieve Subject ID for topic referencing
                subject_doc = db.subjects.find_one(subj_filter)
                subject_id = subject_doc["_id"]

                # 3. Upsert 4 Topics per Subject (Unit 1 to Unit 4)
                for unit_num in range(1, 5):
                    topic_title = f"Unit {unit_num}"
                    topic_filter = {
                        "subject_id": subject_id,
                        "unit_number": unit_num,
                    }
                    db.topics.update_one(
                        topic_filter,
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
                        upsert=True,
                    )
                    topic_count += 1

    print(
        f"[Seed] Upsert operation finished. Processed {dept_count} departments, "
        f"{subj_count} subjects, and {topic_count} topics."
    )


def verify_database():
    """
    Verifies database contents after seeding and reports metrics.
    """
    db = get_database()

    total_departments = db.departments.count_documents({})
    total_subjects = db.subjects.count_documents({})
    total_topics = db.topics.count_documents({})
    total_videos = db.videos.count_documents({})

    print("\n================ DATABASE VERIFICATION SUMMARY ================")
    print(f"Total Departments : {total_departments}")
    print(f"Total Subjects    : {total_subjects}")
    print(f"Total Topics      : {total_topics}")
    print(f"Total Videos      : {total_videos}")
    print("---------------------------------------------------------------")

    # Subjects per department
    print("Subjects per Department:")
    dept_codes = db.departments.distinct("code")
    for code in sorted(dept_codes):
        cnt = db.subjects.count_documents({"department_code": code})
        print(f"  - Department '{code}': {cnt} subjects")

    print("---------------------------------------------------------------")
    # Subjects per department + semester
    print("Subjects per Department + Semester:")
    for code in sorted(dept_codes):
        semesters = sorted(db.subjects.distinct("semester", {"department_code": code}))
        for sem in semesters:
            cnt = db.subjects.count_documents({"department_code": code, "semester": sem})
            print(f"  - Dept '{code}', Semester {sem}: {cnt} subjects")

    print("---------------------------------------------------------------")
    # Topics per subject
    subjects = list(db.subjects.find({}, {"_id": 1, "code": 1}))
    topics_per_subj = [db.topics.count_documents({"subject_id": s["_id"]}) for s in subjects]

    unique_topic_counts = set(topics_per_subj) if topics_per_subj else {0}
    min_topics = min(topics_per_subj) if topics_per_subj else 0
    max_topics = max(topics_per_subj) if topics_per_subj else 0

    print("Topics per Subject:")
    print(f"  - Total subjects checked: {len(subjects)}")
    print(f"  - Min topics per subject: {min_topics}")
    print(f"  - Max topics per subject: {max_topics}")
    print(f"  - Every subject has exactly 4 topics: {unique_topic_counts == {4}}")
    print("===============================================================\n")


if __name__ == "__main__":
    seed_database()
    verify_database()
