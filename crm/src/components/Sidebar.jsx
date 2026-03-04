import logo from "../assets/topotours-logo.png";

export default function Sidebar({ menu, active, onSelect, onLogout, isOpen, onClose }) {
    return (
        <aside className={`sidebar${isOpen ? " open" : ""}`}>
            <div className="sidebar-top">
                <div className="sidebar-logo">
                    <img src={logo} alt="Topotours" className="brand-logo-image" />
                    <div className="sidebar-brand-wrap">
                        <span className="sidebar-brand">Topotours</span>
                        <span className="sidebar-crm">CRM Admin</span>
                    </div>
                    <button className="sidebar-close" onClick={onClose} aria-label="Cerrar menú">
                        ✕
                    </button>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menu.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-btn${active === item.id ? " active" : ""}`}
                        onClick={() => {
                            onSelect(item.id);
                            onClose?.();
                        }}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <button
                    className="logout-btn"
                    onClick={() => {
                        onLogout();
                        onClose?.();
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}
