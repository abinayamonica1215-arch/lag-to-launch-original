"""
AI Analysis Service for Lag to Launch Quiz Performance.

This module provides AI-driven educational analysis for quiz assessment results
using Google's official GenAI SDK (`google-genai`) with structured Pydantic outputs.

Beginner Guide to key parts of this service:
1. Pydantic Model (`QuizAIAnalysis`): Defines the exact JSON schema that Gemini MUST return.
2. Custom Exception (`AIServiceError`): Wraps any AI errors safely so FastAPI won't crash.
3. GenAI Client (`genai.Client`): Connects to the Gemini API using the GEMINI_API_KEY environment variable.
4. Resilient Retries: Retries transient errors (such as 503 UNAVAILABLE or network timeouts)
   up to 2 times with short exponential backoff (0.5s, 1.0s). Non-transient errors (like 401 auth or 400 bad requests) fail fast.
"""

import logging
import os
import time
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

# Import Google's official GenAI SDK
try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


# Default Gemini model used for fast, educational feedback
DEFAULT_GEMINI_MODEL = "gemini-3.6-flash"

# Configure safe logging
logger = logging.getLogger("lag_to_launch.ai_service")


class QuizAIAnalysis(BaseModel):
    """
    Structured Pydantic model defining the expected JSON schema from the Gemini AI model.
    Using Pydantic guarantees predictable, typed data from the LLM.
    """
    summary: str = Field(
        ...,
        description="A concise overall summary of the student's performance on this assessment."
    )
    performance_level: str = Field(
        ...,
        description="Categorization of performance: 'Strong' (>=80%), 'Developing' (50-79%), or 'Needs Improvement' (<50%)."
    )
    strong_topics: List[str] = Field(
        default_factory=list,
        description="List of specific topics where the student performed well based on correct questions."
    )
    weak_topics: List[str] = Field(
        default_factory=list,
        description="List of specific topics where the student struggled based on wrong questions."
    )
    explanation: str = Field(
        ...,
        description="Student-friendly explanation analyzing why performance was at this level."
    )
    recommendations: List[str] = Field(
        default_factory=list,
        description="Actionable, practical study recommendations tailored to the student's result."
    )
    next_steps: List[str] = Field(
        default_factory=list,
        description="Specific topics or revision steps the student should focus on next."
    )


class AIServiceError(Exception):
    """
    Custom exception raised when the AI analysis service encounters an error.
    This allows API endpoints to catch AI failures cleanly without crashing the server.
    """
    def __init__(self, message: str, status_code: int = 500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def _is_transient_error(exc: Exception) -> bool:
    """
    Determines whether an exception represents a transient failure (e.g. 503 UNAVAILABLE,
    429 Rate Limit, or temporary network timeouts) that is safe to retry.

    Returns False for permanent errors like 401/403 (Auth/Invalid Key) or 400 (Bad Request).
    """
    err_str = str(exc).lower()

    # Permanent authentication or request format errors — DO NOT RETRY
    if "401" in err_str or "unauthorized" in err_str or "invalid api key" in err_str:
        return False
    if "403" in err_str or "forbidden" in err_str or "permission_denied" in err_str:
        return False
    if "400" in err_str or "invalid_argument" in err_str:
        return False

    # Transient capacity / overload errors — RETRY
    if "503" in err_str or "unavailable" in err_str or "high demand" in err_str or "overloaded" in err_str:
        return True
    if "429" in err_str or "resource_exhausted" in err_str or "rate limit" in err_str:
        return True
    if "connecterror" in err_str or "timeout" in err_str or "connection" in err_str or "socket" in err_str:
        return True

    return False


def analyze_quiz_performance(
    subject: str,
    assessment_type: str,
    score: int,
    total: int,
    percentage: int,
    correct_questions: List[Dict[str, Any]],
    wrong_questions: List[Dict[str, Any]],
    model_name: str = DEFAULT_GEMINI_MODEL,
    max_retries: int = 2,
    base_backoff_sec: float = 0.5,
) -> QuizAIAnalysis:
    """
    Analyzes quiz performance data using Google Gemini Flash model with structured JSON output and
    resilient retry handling for transient 503 / capacity errors.

    Parameters:
        subject: Subject name (e.g., 'Data Structures and Algorithms')
        assessment_type: Quiz mode (e.g., 'dynamic_self' or 'weak_link')
        score: Number of questions correctly answered
        total: Total number of questions in the quiz
        percentage: Calculated percentage score (0 to 100)
        correct_questions: List of question dicts answered correctly (with topic metadata)
        wrong_questions: List of question dicts answered incorrectly (with topic metadata)
        model_name: Configured Gemini model identifier (defaults to 'gemini-3.6-flash')
        max_retries: Maximum number of retry attempts after initial failure (defaults to 2)
        base_backoff_sec: Initial backoff delay in seconds (defaults to 0.5s)

    Returns:
        QuizAIAnalysis: Validated Pydantic object containing structured feedback.

    Raises:
        AIServiceError: If API key is missing, SDK is unavailable, or Gemini request fails.
    """
    # 1. Verify that google-genai library is installed
    if not GENAI_AVAILABLE:
        raise AIServiceError(
            message="google-genai package is not installed. Please install google-genai.",
            status_code=500,
        )

    # 2. Retrieve Gemini API key securely from environment variable
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or not api_key.strip():
        raise AIServiceError(
            message="GEMINI_API_KEY environment variable is missing or empty. Please set GEMINI_API_KEY in environment.",
            status_code=503,
        )

    # 3. Format topic metadata safely from correct & wrong questions
    correct_topic_summary = []
    for q in correct_questions:
        q_text = q.get("question") or q.get("text") or "Question"
        topic = q.get("topic") or "General"
        correct_topic_summary.append(f"- Topic: {topic} | Question: {q_text[:80]}")

    wrong_topic_summary = []
    for q in wrong_questions:
        q_text = q.get("question") or q.get("text") or "Question"
        topic = q.get("topic") or "General"
        wrong_topic_summary.append(f"- Topic: {topic} | Question: {q_text[:80]}")

    correct_str = "\n".join(correct_topic_summary) if correct_topic_summary else "None"
    wrong_str = "\n".join(wrong_topic_summary) if wrong_topic_summary else "None"

    # 4. Construct prompt enforcing strict analysis boundaries
    prompt = f"""You are an expert computer science tutor analyzing a student's quiz results for Lag to Launch.

    ASSESSMENT DATA:
    - Subject: {subject}
    - Assessment Type: {assessment_type}
    - Score: {score} / {total}
    - Percentage: {percentage}%

    CORRECTLY ANSWERED QUESTIONS ({len(correct_questions)} total):
    {correct_str}

    INCORRECTLY ANSWERED QUESTIONS ({len(wrong_questions)} total):
    {wrong_str}

    STRICT INSTRUCTIONS:
    1. Analyze ONLY the supplied quiz performance data above.
    2. Identify patterns in the student's correct and wrong answers.
    3. Identify strong and weak topics using ONLY the topic metadata present in the supplied data.
    4. Never invent topics that are not present in the supplied question data.
    5. Never change the numerical score ({score}/{total}) or percentage ({percentage}%).
    6. Never claim the student answered a question correctly if it is listed under incorrect questions.
    7. Explain performance in simple, encouraging, student-friendly language.
    8. Provide practical, actionable recommendations and next steps for revision.
    """

    client = genai.Client(api_key=api_key.strip())
    max_attempts = max_retries + 1
    last_exception = None

    # 5. Execute Gemini API call with retry loop for transient errors
    for attempt in range(1, max_attempts + 1):
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=QuizAIAnalysis,
                    temperature=0.2,  # Low temperature for consistent, analytical feedback
                ),
            )

            if not response:
                raise AIServiceError("Empty response received from Gemini AI model.")

            # Check if SDK automatically parsed the response object
            if hasattr(response, "parsed") and response.parsed is not None:
                if isinstance(response.parsed, QuizAIAnalysis):
                    return response.parsed
                if isinstance(response.parsed, dict):
                    return QuizAIAnalysis.model_validate(response.parsed)

            # Fallback to parsing text content
            if hasattr(response, "text") and response.text:
                return QuizAIAnalysis.model_validate_json(response.text)

            raise AIServiceError("Failed to extract structured AI analysis from response.")

        except AIServiceError:
            raise
        except Exception as exc:
            last_exception = exc
            is_transient = _is_transient_error(exc)

            logger.warning(
                f"[Gemini AI Service] Attempt {attempt}/{max_attempts} failed for model '{model_name}'. "
                f"Transient: {is_transient}. Error summary: {str(exc)[:150]}"
            )

            # Stop retrying if error is permanent or max attempts reached
            if not is_transient or attempt == max_attempts:
                break

            # Short exponential backoff: 0.5s after attempt 1, 1.0s after attempt 2
            backoff = base_backoff_sec * (2 ** (attempt - 1))
            time.sleep(backoff)

    # 6. Raise clean AIServiceError if retries exhausted
    raise AIServiceError(
        message=f"Gemini AI analysis service failed after {max_attempts} attempts: {str(last_exception)}",
        status_code=500,
    ) from last_exception
