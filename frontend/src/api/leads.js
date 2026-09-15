const mockDeals = [
  { id: 1, contact_id: 101, title: 'Website redesign', value: 9600, stage: 'NEW', created_at: '2026-09-10T09:20:00Z', updated_at: '2026-09-14T14:10:00Z' },
  { id: 2, contact_id: 102, title: 'Annual platform plan', value: 32000, stage: 'CONTACTED', created_at: '2026-09-08T13:05:00Z', updated_at: '2026-09-15T08:45:00Z' },
  { id: 3, contact_id: 103, title: 'Team expansion', value: 18500, stage: 'PROPOSAL', created_at: '2026-09-03T10:30:00Z', updated_at: '2026-09-14T16:30:00Z' },
  { id: 4, contact_id: 104, title: 'Enterprise rollout', value: 44700, stage: 'WON', created_at: '2026-08-28T11:00:00Z', updated_at: '2026-09-13T09:15:00Z' },
  { id: 5, contact_id: 105, title: 'Operations workspace', value: 12800, stage: 'LOST', created_at: '2026-08-26T08:50:00Z', updated_at: '2026-09-12T12:00:00Z' },
]

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

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

export const leadApi = {
  async list(params = {}) {
    await wait(350)
    const search = params.search?.trim().toLowerCase() ?? ''
    const deals = mockDeals.filter((deal) => {
      const matchesSearch = !search || [deal.title, String(deal.contact_id), String(deal.id)].some((value) => value.toLowerCase().includes(search))
      return matchesSearch && (!params.stage || deal.stage === params.stage)
    })
    return { data: deals.map((deal) => ({ ...deal })) }
  },

  async updateStage(dealId, stage) {
    await wait(200)
    const deal = mockDeals.find((item) => item.id === dealId)
    if (!deal) throw new Error('Deal not found.')
    if (!getAllowedStages(deal.stage).includes(stage)) throw new Error(`A deal cannot move from ${deal.stage} to ${stage}.`)
    deal.stage = stage
    deal.updated_at = new Date().toISOString()
    return { ...deal }
  },
}
