export default function Modal({ title, onClose, wide, children }) {
    return (
        <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={`modal-box${wide ? " modal-wide" : ""}`}>
                <div className="modal-head">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}
