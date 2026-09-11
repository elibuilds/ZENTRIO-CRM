const mockLeads = [
  {
    id: 'lead-1',
    name: 'Olivia Bennett',
    company: 'Northstar Labs',
    email: 'olivia@northstarlabs.com',
    stage: 'Qualified',
    stageTone: 'indigo',
    value: 32000,
    owner: 'AM',
    ownerName: 'Alex Morgan',
    nextActivity: 'Today, 2:00 PM',
    updatedAt: '2 hours ago',
  },
  {
    id: 'lead-2',
    name: 'Marcus Chen',
    company: 'Vertex Health',
    email: 'marcus@vertexhealth.com',
    stage: 'Proposal',
    stageTone: 'purple',
    value: 18500,
    owner: 'SK',
    ownerName: 'Sam Kim',
    nextActivity: 'Tomorrow, 9:30 AM',
    updatedAt: 'Yesterday',
  },
  {
    id: 'lead-3',
    name: 'Sofia Rodriguez',
    company: 'Brightline Studio',
    email: 'sofia@brightline.studio',
    stage: 'New',
    stageTone: 'blue',
    value: 9600,
    owner: 'AM',
    ownerName: 'Alex Morgan',
    nextActivity: 'No activity',
    updatedAt: '3 days ago',
  },
  {
    id: 'lead-4',
    name: 'James Wilson',
    company: 'Cedar & Co.',
    email: 'james@cedarandco.com',
    stage: 'Negotiation',
    stageTone: 'amber',
    value: 44700,
    owner: 'JR',
    ownerName: 'Jordan Reed',
    nextActivity: 'Sep 16, 11:00 AM',
    updatedAt: '4 days ago',
  },
]

//mock api to simulate integration with backend

const wait = (duration) => new Promise((resolve) => {
  setTimeout(resolve, duration)
})

export const leadApi = {
  async list(params = {}) {
    await wait(650)

    if (params.simulateError) {
      throw new Error('Unable to connect to the leads service.')
    }

    const search = params.search?.trim().toLowerCase() ?? ''
    const leads = mockLeads.filter((lead) => {
      const matchesSearch = !search
        || [lead.name, lead.company, lead.email].some((value) => value.toLowerCase().includes(search))
      const matchesStage = !params.stage || lead.stage === params.stage
      const matchesOwner = !params.owner || lead.ownerName === params.owner

      return matchesSearch && matchesStage && matchesOwner
    })

    return {
      data: leads,
      pagination: {
        page: 1,
        pageSize: 25,
        total: leads.length,
        totalPages: leads.length ? 1 : 0,
      },
    }
  },
}

export const leadFilterOptions = {
  stages: ['New', 'Qualified', 'Proposal', 'Negotiation'],
  owners: ['Alex Morgan', 'Sam Kim', 'Jordan Reed'],
}
