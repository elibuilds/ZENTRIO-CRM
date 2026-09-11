import { leadFilterOptions } from '../api/leads'
import EditableCell from './EditableCell'

const stageTones = {
  New: 'blue',
  Qualified: 'indigo',
  Proposal: 'purple',
  Negotiation: 'amber',
}

function LeadsTable({
  leads,
  onSelectionChange,
  onUpdateLead,
  selectedLeadIds,
}) {
  const allLeadsSelected = leads.length > 0 && selectedLeadIds.length === leads.length

  const toggleLeadSelection = (leadId) => {
    onSelectionChange((currentSelection) => (
      currentSelection.includes(leadId)
        ? currentSelection.filter((id) => id !== leadId)
        : [...currentSelection, leadId]
    ))
  }

  const toggleAllLeads = () => {
    onSelectionChange(allLeadsSelected ? [] : leads.map((lead) => lead.id))
  }

  return (
    <div className="table-wrapper">
      <table>
        <caption className="sr-only">Lead list</caption>
        <thead>
          <tr>
            <th scope="col" className="selection-column">
              <input
                aria-label="Select all leads"
                checked={allLeadsSelected}
                onChange={toggleAllLeads}
                type="checkbox"
              />
            </th>
            <th scope="col">Lead</th>
            <th scope="col">Company</th>
            <th scope="col">Email</th>
            <th scope="col">Stage</th>
            <th scope="col">Value</th>
            <th scope="col">Owner</th>
            <th scope="col">Next activity</th>
            <th scope="col">Updated</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td className="selection-column">
                <input
                  aria-label={`Select ${lead.name}`}
                  checked={selectedLeadIds.includes(lead.id)}
                  onChange={() => toggleLeadSelection(lead.id)}
                  type="checkbox"
                />
              </td>
              <td>
                <div className="lead-cell">
                  <div className="avatar" aria-hidden="true">{getInitials(lead.name)}</div>
                  <div className="cell-editor">
                    <EditableCell
                      ariaLabel={`Edit name for ${lead.name}`}
                      value={lead.name}
                      onSave={(name) => onUpdateLead(lead.id, { name })}
                    />
                  </div>
                </div>
              </td>
              <td>
                <EditableCell
                  ariaLabel={`Edit company for ${lead.name}`}
                  value={lead.company}
                  onSave={(company) => onUpdateLead(lead.id, { company })}
                />
              </td>
              <td>
                <EditableCell
                  ariaLabel={`Edit email for ${lead.name}`}
                  value={lead.email}
                  type="email"
                  onSave={(email) => onUpdateLead(lead.id, { email })}
                />
              </td>
              <td>
                <select
                  className={`cell-select status-select status-${stageTones[lead.stage]}`}
                  aria-label={`Change stage for ${lead.name}`}
                  value={lead.stage}
                  onChange={(event) => onUpdateLead(lead.id, {
                    stage: event.target.value,
                    stageTone: stageTones[event.target.value],
                  })}
                >
                  {leadFilterOptions.stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                </select>
              </td>
              <td>
                <EditableCell
                  ariaLabel={`Edit value for ${lead.name}`}
                  value={lead.value}
                  type="number"
                  onSave={(value) => onUpdateLead(lead.id, { value: Number(value) || 0 })}
                />
              </td>
              <td>
                <select
                  className="cell-select owner-select"
                  aria-label={`Change owner for ${lead.name}`}
                  value={lead.ownerName}
                  onChange={(event) => onUpdateLead(lead.id, {
                    ownerName: event.target.value,
                    owner: getInitials(event.target.value),
                  })}
                >
                  {leadFilterOptions.owners.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
                </select>
              </td>
              <td>
                <EditableCell
                  ariaLabel={`Edit next activity for ${lead.name}`}
                  value={lead.nextActivity}
                  muted={lead.nextActivity === 'No activity'}
                  onSave={(nextActivity) => onUpdateLead(lead.id, { nextActivity })}
                />
              </td>
              <td><span className="read-only-cell">{lead.updatedAt}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer className="table-footer">
        <span>Showing {leads.length} {leads.length === 1 ? 'lead' : 'leads'}</span>
        <span className="footer-note">Click any cell to edit</span>
      </footer>
    </div>
  )
}

function getInitials(value) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default LeadsTable
