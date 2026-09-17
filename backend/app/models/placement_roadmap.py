from datetime import datetime
from pydantic import BaseModel, Field


class PlacementRoadmapItem(BaseModel):
    category: str = Field(..., description="Category name (Aptitude, Communication, Technical)")
    current_percentage: float = Field(..., description="Student's current score percentage in this category")
    priority: str = Field(..., description="Priority level: 'high' (<50%), 'medium' (50-69.99%), or 'satisfactory' (>=70%)")
    focus_areas: list[str] = Field(..., description="List of focus areas to study")
    recommended_action: str = Field(..., description="Deterministic recommended action string")


class PlacementRoadmapResponse(BaseModel):
    roadmap_id: str = Field(..., description="MongoDB ObjectId string for roadmap document")
    source_result_id: str = Field(..., description="MongoDB ObjectId string for source placement readiness result")
    source_percentage: float = Field(..., description="Overall score percentage from source readiness result")
    ready: bool = Field(..., description="Overall readiness status")
    message: str = Field(..., description="Summary or recommendation message")
    roadmap: list[PlacementRoadmapItem] = Field(..., description="List of required preparation roadmap items sorted by priority")
    created_at: datetime = Field(..., description="Timestamp when roadmap was created")


class PlacementRoadmapListResponse(BaseModel):
    roadmaps: list[PlacementRoadmapResponse] = Field(..., description="List of historical placement preparation roadmap snapshots")
