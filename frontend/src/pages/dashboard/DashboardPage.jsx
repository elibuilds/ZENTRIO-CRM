import { useContext, useEffect, useState } from 'react'
import { dashboardApi } from '../../api/dashboard'
import AuthContext from '../../components/context/AuthProvider'
import './DashboardPage.css'

function DashboardPage({ onViewPipeline, onViewTasks }) {
  const { auth } = useContext(AuthContext)
  const [snapshot, setSnapshot] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    dashboardApi.getSnapshot()
      .then((data) => {
        if (active) setSnapshot(data)
      })
      .catch(() => {
        if (active) setError('The dashboard summary could not be loaded.')
      })

    return () => { active = false }
  }, [])

  if (error) {
    return <DashboardMessage title="Dashboard unavailable" message={error} />
  }

  if (!snapshot) {
    return <DashboardMessage title="Loading your workspace" message="Preparing the latest sales summary..." loading />
  }

  const pipelineTotal = snapshot.pipeline.reduce((sum, stage) => sum + stage.value, 0)

  return (
    <main className="dashboard-page">
      <header className="dashboard-heading">
        <div>
          <p className="dashboard-kicker">Sales workspace</p>
          <h1>Good morning{auth?.username ? `, ${auth.username}` : ''}</h1>
          <p>Here&apos;s how your pipeline is moving today.</p>
        </div>
        <button className="dashboard-primary-button" type="button" onClick={onViewPipeline}>
          View pipeline <span aria-hidden="true">→</span>
        </button>
      </header>

      <section className="dashboard-metrics" aria-label="Sales metrics">
        {snapshot.metrics.map((metric) => (
          <article className="dashboard-metric-card" key={metric.label}>
            <span className={`dashboard-metric-icon dashboard-tone-${metric.tone}`} aria-hidden="true">↗</span>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <small><b>{metric.change}</b> {metric.detail}</small>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel dashboard-pipeline-panel">
          <div className="dashboard-panel-heading">
            <div>
              <h2>Pipeline overview</h2>
              <p>{formatCurrency(pipelineTotal)} across {snapshot.pipeline.reduce((sum, stage) => sum + stage.count, 0)} active deals</p>
            </div>
            <button className="dashboard-text-button" type="button" onClick={onViewPipeline}>Open board</button>
          </div>
          <div className="dashboard-stages">
            {snapshot.pipeline.map((stage) => {
              const width = pipelineTotal > 0 ? `${Math.round((stage.value / pipelineTotal) * 100)}%` : '0%'
              return (
                <div className="dashboard-stage" key={stage.stage}>
                  <div className="dashboard-stage-label"><span style={{ backgroundColor: stage.color }} />{stage.stage}<b>{stage.count}</b></div>
                  <div className="dashboard-progress" aria-label={`${stage.stage}: ${formatCurrency(stage.value)}`}><span style={{ width, backgroundColor: stage.color }} /></div>
                  <strong>{formatCurrency(stage.value)}</strong>
                </div>
              )
            })}
          </div>
        </article>

        <article className="dashboard-panel dashboard-task-panel">
          <div className="dashboard-panel-heading">
            <div><h2>Upcoming tasks</h2><p>Stay on top of your next steps.</p></div>
            <button className="dashboard-text-button" type="button" onClick={onViewTasks}>View all</button>
          </div>
          <ul className="dashboard-task-list">
            {snapshot.tasks.length === 0 && <li className="dashboard-empty-note">No tasks tracked yet.</li>}
            {snapshot.tasks.map((task) => (
              <li key={task.id}>
                <span className="dashboard-task-check" aria-hidden="true" />
                <div><strong>{task.title}</strong><small className={task.urgency === 'today' ? 'dashboard-due-today' : ''}>{task.due}</small></div>
              </li>
            ))}
          </ul>
        </article>

        <article className="dashboard-panel dashboard-activity-panel">
          <div className="dashboard-panel-heading"><div><h2>Recent activity</h2><p>What your team has been working on.</p></div></div>
          <ul className="dashboard-activity-list">
            {snapshot.activities.map((activity) => (
              <li key={activity.id}>
                <span className={`dashboard-activity-avatar dashboard-tone-${activity.tone}`}>{activity.initials}</span>
                <p><strong>{activity.name}</strong> {activity.action}<small>{activity.time}</small></p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  )
}

function DashboardMessage({ loading = false, message, title }) {
  return <main className="dashboard-page"><section className="dashboard-message" aria-busy={loading}><h1>{title}</h1><p>{message}</p></section></main>
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export default DashboardPage
