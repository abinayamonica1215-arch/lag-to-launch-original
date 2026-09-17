from app.models.academic import (
    Department,
    DepartmentListResponse,
    Subject,
    SubjectListResponse,
    Topic,
    TopicListResponse,
    Video,
    VideoListResponse,
    LearningContentTopicItem,
    LearningContentResponse,
)
from app.models.auth import (
    StudentRegisterRequest,
    StudentResponse,
    StudentRegisterResponse,
    StudentLoginRequest,
    StudentLoginResponse,
)
from app.models.arrears import (
    ArrearCreateRequest,
    ArrearItem,
    ArrearCreateResponse,
    ArrearCompleteResponse,
    ArrearListResponse,
    ArrearDeleteResponse,
)

from app.models.assessments import (
    AssessmentCreateRequest,
    AssessmentUpdateRequest,
    AssessmentItem,
    AssessmentCreateResponse,
    AssessmentUpdateResponse,
    AssessmentListResponse,
    AssessmentDeleteResponse,
)
from app.models.analysis import (
    SubjectAnalysisItem,
    AnalysisSummary,
    WeakAreaAnalysisResponse,
)
from app.models.roadmap import (
    StudentInfo,
    RoadmapSummary,
    TopicRoadmapItem,
    SubjectRoadmapItem,
    RecoveryRoadmapResponse,
)
from app.models.progress import (
    ProgressCreateUpdate,
    ProgressItem,
    ProgressListResponse,
    ProgressSummary,
    SubjectTopicProgress,
    SubjectProgressResponse,
    ProgressDeleteResponse,
    TopicProgressDetailResponse,
)

from app.models.daily_assessments import (
    DailyQuestion,
    DailyAssessmentQuestionResponse,
    AnswerSubmission,
    DailyAssessmentSubmitRequest,
    DailyAssessmentResult,
    DailyAssessmentSubmitResponse,
)
from app.models.study_activity import (
    StudyActivityCreateRequest,
    StudyActivityItem,
    StudyActivityListResponse,
    TopicStudyActivityResponse,
)
from app.models.final_assessments import (
    FinalAssessmentQuestion,
    FinalAssessmentQuestionResponse,
    FinalAnswerSubmission,
    FinalAssessmentSubmitRequest,
    FinalAssessmentResult,
    FinalAssessmentSubmitResponse,
)
from app.models.placement_readiness import (
    PlacementReadinessQuestion,
    PlacementReadinessQuestionResponse,
    PlacementReadinessAnswer,
    PlacementReadinessSubmitRequest,
    PlacementReadinessResult,
    PlacementReadinessSubmitResponse,
    PlacementReadinessListResponse,
)
from app.models.placement_roadmap import (
    PlacementRoadmapItem,
    PlacementRoadmapResponse,
    PlacementRoadmapListResponse,
)

__all__ = [
    "Department",
    "DepartmentListResponse",
    "Subject",
    "SubjectListResponse",
    "Topic",
    "TopicListResponse",
    "Video",
    "VideoListResponse",
    "LearningContentTopicItem",
    "LearningContentResponse",
    "StudentRegisterRequest",
    "StudentResponse",
    "StudentRegisterResponse",
    "StudentLoginRequest",
    "StudentLoginResponse",
    "ArrearCreateRequest",
    "ArrearItem",
    "ArrearCreateResponse",
    "ArrearCompleteResponse",
    "ArrearListResponse",
    "ArrearDeleteResponse",
    "AssessmentCreateRequest",
    "AssessmentUpdateRequest",
    "AssessmentItem",
    "AssessmentCreateResponse",
    "AssessmentUpdateResponse",
    "AssessmentListResponse",
    "AssessmentDeleteResponse",
    "SubjectAnalysisItem",
    "AnalysisSummary",
    "WeakAreaAnalysisResponse",
    "StudentInfo",
    "RoadmapSummary",
    "TopicRoadmapItem",
    "SubjectRoadmapItem",
    "RecoveryRoadmapResponse",
    "ProgressCreateUpdate",
    "ProgressItem",
    "ProgressListResponse",
    "ProgressSummary",
    "SubjectTopicProgress",
    "SubjectProgressResponse",
    "ProgressDeleteResponse",
    "TopicProgressDetailResponse",
    "DailyQuestion",
    "DailyAssessmentQuestionResponse",
    "AnswerSubmission",
    "DailyAssessmentSubmitRequest",
    "DailyAssessmentResult",
    "DailyAssessmentSubmitResponse",
    "StudyActivityCreateRequest",
    "StudyActivityItem",
    "StudyActivityListResponse",
    "TopicStudyActivityResponse",
    "FinalAssessmentQuestion",
    "FinalAssessmentQuestionResponse",
    "FinalAnswerSubmission",
    "FinalAssessmentSubmitRequest",
    "FinalAssessmentResult",
    "FinalAssessmentSubmitResponse",
    "PlacementReadinessQuestion",
    "PlacementReadinessQuestionResponse",
    "PlacementReadinessAnswer",
    "PlacementReadinessSubmitRequest",
    "PlacementReadinessResult",
    "PlacementReadinessSubmitResponse",
    "PlacementReadinessListResponse",
    "PlacementRoadmapItem",
    "PlacementRoadmapResponse",
    "PlacementRoadmapListResponse",
]





