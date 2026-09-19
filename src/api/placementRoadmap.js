import apiClient from './client';

/**
 * Priority thresholds mirror backend logic in placement_roadmap.py:
 *   >= 70  → satisfactory (excluded from roadmap)
 *   >= 50  → medium priority
 *   < 50   → high priority
 */
function derivePriority(pct) {
  if (pct >= 70) return 'satisfactory';
  if (pct >= 50) return 'medium';
  return 'high';
}

/**
 * Build a client-side placement roadmap from the categoryBreakdown array that
 * submitPlacementAssessment() stores in localStorage under the key
 * 'lag_to_launch_readiness_result'.
 *
 * Each breakdown item looks like:
 *   { category: 'Data Structures & Algorithms', score: 0 | 50 | 100 }
 *
 * Returns a PlacementRoadmapResponse-shaped object so the UI can use it
 * identically to the live backend response.
 */
function buildLocalFallbackRoadmap() {
  try {
    const raw = localStorage.getItem('lag_to_launch_readiness_result');
    if (!raw) return null;

    const stored = JSON.parse(raw);
    const breakdown = stored.categoryBreakdown || [];
    const sourcePercentage = stored.percentage || 0;

    const roadmap = breakdown
      .map((item) => {
        const pct = typeof item.score === 'number' ? item.score : 0;
        const priority = derivePriority(pct);
        if (priority === 'satisfactory') return null;

        return {
          category: item.category,
          current_percentage: pct,
          priority,
          focus_areas: [`Core ${item.category} concepts`, 'Problem solving', 'Fundamentals review'],
          recommended_action:
            priority === 'high'
              ? `Focus heavily on ${item.category} fundamentals before your next placement attempt.`
              : `Practice intermediate ${item.category} problems to strengthen consistency.`,
        };
      })
      .filter(Boolean)
      // high priority first, then medium
      .sort((a, b) => (a.priority === 'high' && b.priority !== 'high' ? -1 : 1));

    const ready = roadmap.length === 0;

    return {
      roadmap_id: null,
      source_result_id: stored.assessmentId || null,
      source_percentage: sourcePercentage,
      ready,
      message: ready
        ? 'Your scores indicate satisfactory preparation across assessed categories.'
        : `Placement preparation roadmap generated from your assessment score of ${sourcePercentage}%.`,
      roadmap,
      created_at: null,
      _source: 'local', // flag so UI can show an appropriate note
    };
  } catch {
    return null;
  }
}

export const placementRoadmapApi = {
  /**
   * Fetch the placement preparation roadmap for the current student.
   *
   * Strategy:
   *  1. Call GET /placement-roadmap (backend deterministic roadmap generator).
   *  2. On 404 (no backend assessment result yet) or any network failure,
   *     fall back to building a roadmap from localStorage.
   *  3. Returns null only when both the backend and localStorage are empty.
   */
  async getPlacementRoadmap() {
    try {
      const data = await apiClient.get('/placement-roadmap');
      return { ...data, _source: 'backend' };
    } catch (err) {
      // 404 means no backend assessment result exists yet — use local fallback.
      // Network errors (TypeError / AbortError) also fall through to local.
      const is404 = err.status === 404;
      const isNetwork =
        err.name === 'AbortError' ||
        err.name === 'TypeError' ||
        (err.message && err.message.includes('Failed to fetch'));

      if (is404 || isNetwork) {
        console.info('[PlacementRoadmap] Backend unavailable or no result found. Using local fallback.');
        return buildLocalFallbackRoadmap();
      }

      // Unexpected server error — rethrow so the UI can show a meaningful message.
      throw err;
    }
  },
};

export default placementRoadmapApi;
