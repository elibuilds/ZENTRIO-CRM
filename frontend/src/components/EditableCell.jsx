import { useState } from 'react'

function EditableCell({ ariaLabel, muted = false, onSave, type = 'text', value }) {
  const [draft, setDraft] = useState(value)

  const saveDraft = () => {
    if (draft !== value) {
      onSave(draft)
    }
  }

  return (
    <input
      aria-label={ariaLabel}
      className={`cell-input${muted ? ' muted-cell' : ''}`}
      min={type === 'number' ? 0 : undefined}
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.currentTarget.blur()
        }
      }}
      onBlur={saveDraft}
      type={type}
      value={draft}
    />
  )
}

export default EditableCell
