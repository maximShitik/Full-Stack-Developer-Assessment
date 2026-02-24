function ItemCard({ key ,item, onClick }) {

    return (<button className="fl-card" onClick={onClick} type="button">
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