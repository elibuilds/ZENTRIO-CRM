import { useCallback, useEffect, useState } from 'react'
import { leadApi, leadFilterOptions } from '../../api/leads'
import LeadsTable from '../../components/LeadsTable'
import { EmptyState, ErrorState, LoadingState } from '../../components/LeadStates'
import './LeadsPage.css'

const initialFilters = {
  search: '',
  stage: '',
  owner: '',
}

function LeadsPage() {
  const [filters, setFilters] = useState(initialFilters)
  const [leads, setLeads] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedLeadIds, setSelectedLeadIds] = useState([])

  const loadLeads = useCallback(async () => {
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await leadApi.list(filters)
      setLeads(response.data)
      setStatus('success')
    } catch (error) {
      setErrorMessage(error.message)
      setStatus('error')
    }
  }, [filters])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadLeads()
    }, 250)

    return () => clearTimeout(timeoutId)
  }, [loadLeads])

  const hasActiveFilters = Object.values(filters).some(Boolean)

  const updateFilter = (key, value) => {
    setFilters((currentFilters) => ({ ...currentFilters, [key]: value }))
  }

  const clearFilters = () => {
    setFilters(initialFilters)
  }

  const handleRetry = () => {
    loadLeads()
  }

  return (
    <main className="leads-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Sales workspace</p>
          <h1>Leads</h1>
          <p className="page-description">Track, qualify, and move your opportunities forward.</p>
        </div>
        <button className="button button-primary" type="button">
          <span aria-hidden="true">+</span>
          Add lead
        </button>
      </header>

      <section className="leads-card" aria-label="Leads">
        <div className="toolbar">
          <label className="search-field">
            <span className="sr-only">Search leads</span>
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search by name, company, or email"
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
            />
          </label>

          <label className="select-field">
            <span className="sr-only">Filter by stage</span>
            <select value={filters.stage} onChange={(event) => updateFilter('stage', event.target.value)}>
              <option value="">All stages</option>
              {leadFilterOptions.stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
            </select>
          </label>

          <label className="select-field">
            <span className="sr-only">Filter by owner</span>
            <select value={filters.owner} onChange={(event) => updateFilter('owner', event.target.value)}>
              <option value="">All owners</option>
              {leadFilterOptions.owners.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
            </select>
          </label>

          {hasActiveFilters && (
            <button className="button button-quiet" type="button" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorState message={errorMessage} onRetry={handleRetry} />}
        {status === 'success' && leads.length === 0 && (
          <EmptyState filtered={hasActiveFilters} onClear={clearFilters} />
        )}
        {status === 'success' && leads.length > 0 && (
          <LeadsTable
            leads={leads}
            selectedLeadIds={selectedLeadIds}
            onSelectionChange={setSelectedLeadIds}
            onUpdateLead={(leadId, changes) => {
              setLeads((currentLeads) => currentLeads.map((lead) => (
                lead.id === leadId ? { ...lead, ...changes } : lead
              )))
            }}
          />
        )}
      </section>
    </main>
  )
}

export default LeadsPage
