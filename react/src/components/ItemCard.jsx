function ItemCard({ item, onClick, tabIndex = -1, refCallback, role }) {
    return (  <button
    className="fl-card"
    onClick={onClick}
    type="button"
    tabIndex={tabIndex}
    ref={refCallback}
    role={role}
  >
        <div className="fl-title">{item.id}. {item.title}</div>

        <span
            className={`fl-badge ${item.status === "active"
                    ? "fl-active"
                    : item.status === "pending"
                        ? "fl-pending"
                        : "fl-archived"
                }`}
        >
            {item.status}
        </span>

        <div className="fl-meta">
            {item.category} • {new Date(item.createdAt).toLocaleDateString()}
        </div>
    </button>);
}

export default ItemCard