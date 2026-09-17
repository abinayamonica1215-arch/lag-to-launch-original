from pydantic import BaseModel


class Department(BaseModel):
    code: str
    name: str
    description: str


class DepartmentListResponse(BaseModel):
    departments: list[Department]


class Subject(BaseModel):
    code: str
    title: str
    description: str


class SubjectListResponse(BaseModel):
    department_code: str
    semester: int
    subjects: list[Subject]


class Topic(BaseModel):
    unit_number: int
    title: str
    description: str


class TopicListResponse(BaseModel):
    subject_code: str
    subject_title: str
    topics: list[Topic]


class Video(BaseModel):
    title: str
    youtube_url: str
    youtube_id: str
    duration: str


class VideoListResponse(BaseModel):
    topic_id: str
    videos: list[Video]


class LearningContentTopicItem(BaseModel):
    id: str
    unit_number: int
    title: str
    description: str


class LearningContentResponse(BaseModel):
    subject_code: str
    subject_title: str
    topics: list[LearningContentTopicItem]

