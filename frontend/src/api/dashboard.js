const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || `Request failed with status ${response.status}`)
  }
  return response.json()
}

const stageMeta = {
  NEW: { label: 'New', color: '#5b7cfa' },
  CONTACTED: { label: 'Contacted', color: '#6d55d8' },
  PROPOSAL: { label: 'Proposal', color: '#a85bd5' },
  WON: { label: 'Won', color: '#168258' },
  LOST: { label: 'Lost', color: '#a6afbd' },
}

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`
  return `${Math.round(hours / 24)}d ago`
}

// Builds the metric cards from real aggregate numbers. No "change" figure
// is shown since the backend doesn't track historical comparisons yet.
function buildMetrics(summary) {
  return [
    { label: 'Open pipeline value', value: formatCurrency(summary.open_value), change: '', detail: '', tone: 'indigo' },
    { label: 'Total deals', value: String(summary.total_deals), change: '', detail: '', tone: 'blue' },
    { label: 'Conversion rate', value: `${summary.conversion_rate}%`, change: '', detail: '', tone: 'green' },
    { label: 'Won this month', value: String(summary.won_this_month), change: '', detail: '', tone: 'violet' },
  ]
}

function buildPipeline(stageBreakdown) {
  return Object.entries(stageBreakdown).map(([stage, { count, value }]) => ({
    stage: stageMeta[stage]?.label || stage,
    count,
    value,
    color: stageMeta[stage]?.color || '#a6afbd',
  }))
}

// The backend has no separate "who did what" activity log or user
// attribution yet — this reflects deal stage changes, which is the
// real activity data that exists today.
function buildActivities(recentDeals) {
  return recentDeals.map((deal) => ({
    id: deal.id,
    initials: deal.stage.slice(0, 2),
    name: deal.title,
    action: `is now in ${stageMeta[deal.stage]?.label || deal.stage}`,
    time: timeAgo(deal.updated_at),
    tone: 'indigo',
  }))
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export const dashboardApi = {
  async getSnapshot() {
    const [summary, recentActivity] = await Promise.all([
      fetch(`${API_BASE}/dashboard/summary`).then(handleResponse),
      fetch(`${API_BASE}/dashboard/recent-activity`).then(handleResponse),
    ])

    return {
      metrics: buildMetrics(summary),
      pipeline: buildPipeline(summary.stage_breakdown),
      activities: buildActivities(recentActivity),
      tasks: [], // No task-tracking feature exists in the backend yet
    }
  },
}
