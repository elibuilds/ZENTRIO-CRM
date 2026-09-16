const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const leadFilterOptions = {
  stages: [
    { value: 'NEW', label: 'New' }, { value: 'CONTACTED', label: 'Contacted' },
    { value: 'PROPOSAL', label: 'Proposal' }, { value: 'WON', label: 'Won' }, { value: 'LOST', label: 'Lost' },
  ],
}

const allowedTransitions = { NEW: ['CONTACTED', 'LOST'], CONTACTED: ['PROPOSAL', 'LOST'], PROPOSAL: ['WON', 'LOST'], WON: [], LOST: [] }

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

export const leadApi = {
  async list(params = {}) {
    const query = new URLSearchParams()
    if (params.search) query.set('search', params.search)
    if (params.stage) query.set('stage', params.stage)

    const response = await fetch(`${API_BASE}/leads?${query.toString()}`)
    const body = await handleResponse(response)
    return { data: body.leads, total: body.total }
  },

  async create(lead) {
    const response = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })
    return handleResponse(response)
  },

  async update(dealId, updates) {
    const response = await fetch(`${API_BASE}/leads/${dealId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    return handleResponse(response)
  },

  async remove(dealId) {
    const response = await fetch(`${API_BASE}/leads/${dealId}`, { method: 'DELETE' })
    return handleResponse(response)
  },

  async updateStage(dealId, stage) {
    const response = await fetch(`${API_BASE}/deals/${dealId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    })
    return handleResponse(response)
  },
}
