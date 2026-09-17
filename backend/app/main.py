from fastapi import FastAPI
from app.api.departments import router as departments_router
from app.api.subjects import router as subjects_router
from app.api.topics import router as topics_router
from app.api.videos import router as videos_router
from app.api.auth import router as auth_router
from app.api.students import router as students_router
from app.api.arrears import router as arrears_router
from app.api.assessments import router as assessments_router
from app.api.analysis import router as analysis_router
from app.api.roadmap import router as roadmap_router
from app.api.progress import router as progress_router
from app.api.learning_content import router as learning_content_router
from app.api.daily_assessments import router as daily_assessments_router
from app.api.study_activity import router as study_activity_router
from app.api.final_assessments import router as final_assessments_router
from app.api.placement_readiness import router as placement_readiness_router
from app.api.placement_roadmap import router as placement_roadmap_router

app = FastAPI(title="Lag to Launch API")

app.include_router(departments_router, prefix="/api")
app.include_router(subjects_router, prefix="/api")
app.include_router(topics_router, prefix="/api")
app.include_router(videos_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(students_router, prefix="/api")
app.include_router(arrears_router, prefix="/api")
app.include_router(assessments_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
app.include_router(roadmap_router, prefix="/api")
app.include_router(progress_router, prefix="/api")
app.include_router(learning_content_router, prefix="/api")
app.include_router(daily_assessments_router, prefix="/api")
app.include_router(study_activity_router, prefix="/api")
app.include_router(final_assessments_router, prefix="/api")
app.include_router(placement_readiness_router, prefix="/api")
app.include_router(placement_roadmap_router, prefix="/api")






@app.get("/")
def home():
    return {"message": "Lag to Launch Backend is running"}
