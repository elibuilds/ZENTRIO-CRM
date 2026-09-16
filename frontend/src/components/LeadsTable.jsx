import { getAllowedStages, leadFilterOptions } from '../api/leads'

const stageTones = { NEW: 'blue', CONTACTED: 'indigo', PROPOSAL: 'purple', WON: 'green', LOST: 'gray' }

function LeadsTable({ deals, onStageChange, selectedDealIds, onSelectionChange }) {
  const allDealsSelected = deals.length > 0 && deals.every((deal) => selectedDealIds.includes(deal.id))
  const toggleDealSelection = (dealId) => onSelectionChange((current) => (
    current.includes(dealId) ? current.filter((id) => id !== dealId) : [...current, dealId]
  ))

  return (
    <div className="table-wrapper">
      <table>
        <caption className="sr-only">Deal list</caption>
        <thead><tr>
          <th scope="col" className="selection-column"><input aria-label="Select all deals" checked={allDealsSelected} onChange={() => onSelectionChange(allDealsSelected ? [] : deals.map((deal) => deal.id))} type="checkbox" /></th>
          <th scope="col">Deal</th><th scope="col">Contact ID</th><th scope="col">Stage</th><th scope="col">Value</th><th scope="col">Created</th><th scope="col">Updated</th>
        </tr></thead>
        <tbody>{deals.map((deal) => (
          <tr key={deal.id}>
            <td className="selection-column"><input aria-label={`Select ${deal.title}`} checked={selectedDealIds.includes(deal.id)} onChange={() => toggleDealSelection(deal.id)} type="checkbox" /></td>
            <td><strong className="deal-title">{deal.title}</strong><span className="deal-id">Deal #{deal.id}</span></td>
            <td>{deal.contact_id}</td>
            <td><select className={`cell-select status-select status-${stageTones[deal.stage]}`} aria-label={`Change stage for ${deal.title}`} value={deal.stage} onChange={(event) => onStageChange(deal.id, event.target.value)}>
              {getAllowedStages(deal.stage).map((value) => {
                const option = leadFilterOptions.stages.find((item) => item.value === value)
                return <option key={value} value={value}>{option.label}</option>
              })}
            </select></td>
            <td className="value-cell">{formatCurrency(deal.value)}</td>
            <td><span className="read-only-cell">{formatDate(deal.created_at)}</span></td>
            <td><span className="read-only-cell">{formatDate(deal.updated_at)}</span></td>
          </tr>
        ))}</tbody>
      </table>
      <footer className="table-footer"><span>Showing {deals.length} {deals.length === 1 ? 'deal' : 'deals'}</span><span className="footer-note">Stage changes follow the pipeline rules</span></footer>
    </div>
  )
}

function formatCurrency(value) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value) }
function formatDate(value) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value)) }

export default LeadsTable
