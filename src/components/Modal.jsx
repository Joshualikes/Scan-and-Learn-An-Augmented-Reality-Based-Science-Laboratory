export default function Modal({ title, children, onClose, wide }) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`modal-card ${wide ? 'wide' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-head">
          <h3>{title}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
