const pipelineDeals = [
  { id: 'deal-1', title: 'Website redesign', company: 'Brightline Studio', value: 9600, stage: 'NEW', owner: 'AM', nextActivity: 'Qualify lead' },
  { id: 'deal-2', title: 'Annual platform plan', company: 'Northstar Labs', value: 32000, stage: 'CONTACTED', owner: 'AM', nextActivity: 'Call today, 2:00 PM' },
  { id: 'deal-3', title: 'Team expansion', company: 'Vertex Health', value: 18500, stage: 'PROPOSAL', owner: 'SK', nextActivity: 'Demo tomorrow' },
  { id: 'deal-4', title: 'Enterprise rollout', company: 'Cedar & Co.', value: 44700, stage: 'WON', owner: 'JR', nextActivity: 'Review proposal' },
  { id: 'deal-5', title: 'Operations workspace', company: 'Harbor & Pine', value: 12800, stage: 'NEW', owner: 'SK', nextActivity: 'Send introduction' },
  { id: 'deal-6', title: 'Growth package', company: 'Mosaic Works', value: 21400, stage: 'LOST', owner: 'JR', nextActivity: 'Closed Sep 12' },
]

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

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

export const pipelineApi = {
  async list() {
    await wait(350)
    return pipelineDeals.map((deal) => ({ ...deal }))
  },

  async updateStage(dealId, stage) {
    await wait(200)
    const deal = pipelineDeals.find((item) => item.id === dealId)
    if (!deal) throw new Error('Deal not found.')
    if (!getAllowedStages(deal.stage).includes(stage)) {
      throw new Error(`A deal cannot move from ${deal.stage} to ${stage}.`)
    }

    deal.stage = stage
    return { ...deal }
  },
}
