const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const pipelineStages = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'PROPOSAL', label: 'Proposal' },
  { value: 'WON', label: 'Won' },
  { value: 'LOST', label: 'Lost' },
]

const allowedTransitions = {
  NEW: ['CONTACTED', 'LOST'],
  CONTACTED: ['PROPOSAL', 'LOST'],
  PROPOSAL: ['WON', 'LOST'],
  WON: [],
  LOST: [],
}

export function getAllowedStages(currentStage) {
  return [currentStage, ...(allowedTransitions[currentStage] ?? [])]
}

async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || `Request failed with status ${response.status}`)
  }
  return response.json()
}

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 60) return `Updated ${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `Updated ${hours}h ago`
  return `Updated ${Math.round(hours / 24)}d ago`
}

// The backend doesn't track a deal owner or company name yet (no user
// assignment, no contact join) — these fields fill in with what's
// actually available rather than fabricated placeholders.
function toPipelineCard(deal) {
  return {
    ...deal,
    owner: '—',
    company: `Contact #${deal.contact_id}`,
    nextActivity: timeAgo(deal.updated_at),
  }
}

export const pipelineApi = {
  async list() {
    const response = await fetch(`${API_BASE}/pipeline`)
    const grouped = await handleResponse(response)
    // Flatten the {NEW: [...], CONTACTED: [...]} shape into a single deal list
    return Object.values(grouped).flat().map(toPipelineCard)
  },

  async updateStage(dealId, stage) {
    const response = await fetch(`${API_BASE}/deals/${dealId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    })
    return handleResponse(response)
  },

  async getHistory(dealId) {
    const response = await fetch(`${API_BASE}/deals/${dealId}/history`)
    return handleResponse(response)
  },
}
