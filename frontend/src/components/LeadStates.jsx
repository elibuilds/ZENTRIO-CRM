export function LoadingState() {
  return (
    <div className="table-shell" aria-busy="true" aria-label="Loading leads">
      <div className="loading-label">Loading leads...</div>
      <div className="skeleton-table">
        {[1, 2, 3, 4, 5].map((row) => (
          <div className="skeleton-row" key={row}>
            <span /><span /><span /><span /><span /><span />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-panel">
      <div className="state-icon state-icon-error" aria-hidden="true">!</div>
      <h2>We couldn&apos;t load your leads</h2>
      <p>{message || 'Something went wrong while connecting to the leads service.'}</p>
      <div className="state-actions">
        <button className="button button-primary" type="button" onClick={onRetry}>Try again</button>
      </div>
    </div>
  )
}

export function EmptyState({ filtered, onClear }) {
  return (
    <div className="state-panel">
      <div className="state-icon" aria-hidden="true">{filtered ? '⌕' : '+'}</div>
      <h2>{filtered ? 'No leads match your filters' : 'No leads yet'}</h2>
      <p>
        {filtered
          ? 'Try adjusting your search or filters to find what you are looking for.'
          : 'Add your first lead to start building your sales pipeline.'}
      </p>
      {filtered ? (
        <button className="button button-secondary" type="button" onClick={onClear}>Clear filters</button>
      ) : (
        <button className="button button-primary" type="button">Add your first lead</button>
      )}
    </div>
  )
}
