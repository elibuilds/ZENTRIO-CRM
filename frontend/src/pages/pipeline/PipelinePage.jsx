import { useEffect, useState } from 'react'
import { pipelineApi, pipelineStages } from '../../api/pipeline'
import './PipelinePage.css'

function PipelinePage() {
  const [deals, setDeals] = useState([])
  const [draggedDealId, setDraggedDealId] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    pipelineApi.list()
      .then(setDeals)
      .catch(() => setError('The pipeline could not be loaded.'))
      .finally(() => setIsLoading(false))
  }, [])

  const moveDeal = async (dealId, nextStage) => {
    const deal = deals.find((item) => item.id === dealId)
    if (!deal || deal.stage === nextStage) return

    const previousDeals = deals
    setDeals((currentDeals) => currentDeals.map((item) => (
      item.id === dealId ? { ...item, stage: nextStage } : item
    )))

    try {
      await pipelineApi.updateStage(dealId, nextStage)
    } catch {
      setDeals(previousDeals)
      setError('The stage change could not be saved. Please try again.')
    }
  }

  if (isLoading) return <PipelineMessage title="Loading pipeline" message="Preparing your active deals..." loading />
  if (error && deals.length === 0) return <PipelineMessage title="Pipeline unavailable" message={error} />

  return (
    <main className="pipeline-page">
      <header className="pipeline-heading">
        <div>
          <p className="pipeline-kicker">Sales workspace</p>
          <h1>Pipeline</h1>
          <p>Move deals forward as conversations progress.</p>
        </div>
        <button className="pipeline-primary-button" type="button">+ Add deal</button>
      </header>

      {error && <p className="pipeline-error" role="alert">{error}</p>}

      <section className="pipeline-board" aria-label="Deal pipeline">
        {pipelineStages.map((stage) => {
          const stageDeals = deals.filter((deal) => deal.stage === stage)
          const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0)
          const isDropTarget = draggedDealId !== null

          return (
            <section
              className={`pipeline-column${isDropTarget ? ' pipeline-column-droppable' : ''}`}
              key={stage}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => { moveDeal(draggedDealId, stage); setDraggedDealId(null) }}
            >
              <header className="pipeline-column-heading">
                <div><h2>{stage}</h2><span>{stageDeals.length}</span></div>
                <strong>{formatCurrency(stageValue)}</strong>
              </header>
              <div className="pipeline-deal-list">
                {stageDeals.map((deal) => (
                  <article
                    className="pipeline-deal-card"
                    draggable
                    key={deal.id}
                    onDragEnd={() => setDraggedDealId(null)}
                    onDragStart={() => setDraggedDealId(deal.id)}
                  >
                    <div className="pipeline-card-topline"><span className="pipeline-card-handle" aria-hidden="true">⠿</span><span className="pipeline-owner">{deal.owner}</span></div>
                    <h3>{deal.title}</h3>
                    <p>{deal.company}</p>
                    <strong>{formatCurrency(deal.value)}</strong>
                    <footer>
                      <span>{deal.nextActivity}</span>
                      <label>
                        <span className="pipeline-sr-only">Change stage for {deal.title}</span>
                        <select value={deal.stage} onChange={(event) => moveDeal(deal.id, event.target.value)}>
                          {pipelineStages.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </label>
                    </footer>
                  </article>
                ))}
                {stageDeals.length === 0 && <p className="pipeline-empty-column">Drop a deal here</p>}
              </div>
            </section>
          )
        })}
      </section>
    </main>
  )
}

function PipelineMessage({ loading = false, message, title }) {
  return <main className="pipeline-page"><section className="pipeline-message" aria-busy={loading}><h1>{title}</h1><p>{message}</p></section></main>
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export default PipelinePage
