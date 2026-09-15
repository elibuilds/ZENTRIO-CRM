const dashboardSnapshot = {
  metrics: [
    { label: 'Open pipeline', value: '$104,800', change: '+12.5%', detail: 'vs. last month', tone: 'indigo' },
    { label: 'Active deals', value: '24', change: '+4', detail: 'this month', tone: 'blue' },
    { label: 'Win rate', value: '32%', change: '+3.2%', detail: 'vs. last month', tone: 'green' },
    { label: 'Average deal', value: '$18,420', change: '+8.1%', detail: 'vs. last month', tone: 'violet' },
  ],
  pipeline: [
    { stage: 'New', count: 8, value: 22400, color: '#5b7cfa' },
    { stage: 'Contacted', count: 7, value: 31600, color: '#6d55d8' },
    { stage: 'Proposal', count: 5, value: 26800, color: '#a85bd5' },
    { stage: 'Won', count: 4, value: 24000, color: '#168258' },
    { stage: 'Lost', count: 2, value: 8400, color: '#a6afbd' },
  ],
  activities: [
    { id: 'activity-1', initials: 'AM', name: 'Alex Morgan', action: 'moved Northstar Labs to Qualified', time: '12 min ago', tone: 'indigo' },
    { id: 'activity-2', initials: 'SK', name: 'Sam Kim', action: 'scheduled a demo with Vertex Health', time: '48 min ago', tone: 'blue' },
    { id: 'activity-3', initials: 'JR', name: 'Jordan Reed', action: 'sent a proposal to Cedar & Co.', time: '2 hrs ago', tone: 'violet' },
    { id: 'activity-4', initials: 'AM', name: 'Alex Morgan', action: 'created Brightline Studio', time: 'Yesterday', tone: 'green' },
  ],
  tasks: [
    { id: 'task-1', title: 'Follow up with Northstar Labs', due: 'Today, 2:00 PM', urgency: 'today' },
    { id: 'task-2', title: 'Prepare Vertex Health demo', due: 'Tomorrow, 9:30 AM', urgency: 'soon' },
    { id: 'task-3', title: 'Review Cedar & Co. proposal', due: 'Sep 16, 11:00 AM', urgency: 'soon' },
  ],
}

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

export const dashboardApi = {
  async getSnapshot() {
    await wait(350)
    return dashboardSnapshot
  },
}
