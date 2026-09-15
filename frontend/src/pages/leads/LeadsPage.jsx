import { useCallback, useEffect, useState } from 'react'
import { leadApi, leadFilterOptions } from '../../api/leads'
import LeadsTable from '../../components/LeadsTable'
import { EmptyState, ErrorState, LoadingState } from '../../components/LeadStates'
import './LeadsPage.css'

const initialFilters = { search: '', stage: '' }

function LeadsPage() {
  const [filters, setFilters] = useState(initialFilters)
  const [deals, setDeals] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedDealIds, setSelectedDealIds] = useState([])

  const loadDeals = useCallback(async () => {
    setStatus('loading')
    setErrorMessage('')
    try { const response = await leadApi.list(filters); setDeals(response.data); setStatus('success') }
    catch (error) { setErrorMessage(error.message); setStatus('error') }
  }, [filters])

  useEffect(() => {
    const timeoutId = setTimeout(loadDeals, 250)
    return () => clearTimeout(timeoutId)
  }, [loadDeals])

  const hasActiveFilters = Object.values(filters).some(Boolean)
  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const clearFilters = () => setFilters(initialFilters)

  const handleStageChange = async (dealId, stage) => {
    const previousDeals = deals
    setDeals((current) => current.map((deal) => (deal.id === dealId ? { ...deal, stage } : deal)))
    try {
      const updatedDeal = await leadApi.updateStage(dealId, stage)
      setDeals((current) => current.map((deal) => (deal.id === dealId ? updatedDeal : deal)))
    } catch (error) {
      setDeals(previousDeals)
      setErrorMessage(error.message)
      setStatus('error')
    }
  }

  return (
    <main className="leads-page">
      <header className="page-heading">
        <div><p className="eyebrow">Sales workspace</p><h1>Deals</h1><p className="page-description">Review deals and move them through your sales pipeline.</p></div>
        <button className="button button-primary" type="button"><span aria-hidden="true">+</span>Add deal</button>
      </header>
      <section className="leads-card" aria-label="Deals">
        <div className="toolbar">
          <label className="search-field"><span className="sr-only">Search deals</span><span className="search-icon" aria-hidden="true">⌕</span><input type="search" placeholder="Search by deal, contact ID, or deal ID" value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} /></label>
          <label className="select-field"><span className="sr-only">Filter by stage</span><select value={filters.stage} onChange={(event) => updateFilter('stage', event.target.value)}><option value="">All stages</option>{leadFilterOptions.stages.map((stage) => <option key={stage.value} value={stage.value}>{stage.label}</option>)}</select></label>
          {hasActiveFilters && <button className="button button-quiet" type="button" onClick={clearFilters}>Clear filters</button>}
        </div>
        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorState message={errorMessage} onRetry={loadDeals} />}
        {status === 'success' && deals.length === 0 && <EmptyState filtered={hasActiveFilters} onClear={clearFilters} />}
        {status === 'success' && deals.length > 0 && <LeadsTable deals={deals} onStageChange={handleStageChange} selectedDealIds={selectedDealIds} onSelectionChange={setSelectedDealIds} />}
      </section>
    </main>
  )
}

export default LeadsPage
