const pipelineDeals = [
  { id: 'deal-1', title: 'Website redesign', company: 'Brightline Studio', value: 9600, stage: 'New', owner: 'AM', nextActivity: 'Qualify lead' },
  { id: 'deal-2', title: 'Annual platform plan', company: 'Northstar Labs', value: 32000, stage: 'Qualified', owner: 'AM', nextActivity: 'Call today, 2:00 PM' },
  { id: 'deal-3', title: 'Team expansion', company: 'Vertex Health', value: 18500, stage: 'Proposal', owner: 'SK', nextActivity: 'Demo tomorrow' },
  { id: 'deal-4', title: 'Enterprise rollout', company: 'Cedar & Co.', value: 44700, stage: 'Negotiation', owner: 'JR', nextActivity: 'Review proposal' },
  { id: 'deal-5', title: 'Operations workspace', company: 'Harbor & Pine', value: 12800, stage: 'New', owner: 'SK', nextActivity: 'Send introduction' },
  { id: 'deal-6', title: 'Growth package', company: 'Mosaic Works', value: 21400, stage: 'Qualified', owner: 'JR', nextActivity: 'Book discovery call' },
]

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

export const pipelineStages = ['New', 'Qualified', 'Proposal', 'Negotiation']

export const pipelineApi = {
  async list() {
    await wait(350)
    return pipelineDeals.map((deal) => ({ ...deal }))
  },

  async updateStage(dealId, stage) {
    await wait(200)
    const deal = pipelineDeals.find((item) => item.id === dealId)
    if (!deal) throw new Error('Deal not found.')

    deal.stage = stage
    return { ...deal }
  },
}
