const MenuItemCard = ({ item, onAdd, onEdit, onDelete, isAdmin, showAddButton }) => {
  const categoryConfig = {
    food: { label: 'Ushqim', icon: '🍽️', color: '#e67e22' },
    drink: { label: 'Pije', icon: '🍹', color: '#3498db' },
    dessert: { label: 'Ëmbëlsirë', icon: '🍰', color: '#9b59b6' },
  };

  const cat = categoryConfig[item.category] || { label: item.category, icon: '🍴', color: '#95a5a6' };

  return (
    <div className={`menu-item-card ${!item.isAvailable ? 'unavailable' : ''}`}>
      <div className="menu-item-header">
        <span className="menu-item-icon" style={{ color: cat.color }}>
          {cat.icon}
        </span>
        <span
          className="menu-item-category"
          style={{ backgroundColor: cat.color + '22', color: cat.color }}
        >
          {cat.label}
        </span>
        {!item.isAvailable && (
          <span className="unavailable-badge">Jo disponueshëm</span>
        )}
      </div>

      <div className="menu-item-body">
        <h3 className="menu-item-name">{item.name}</h3>
        {item.description && (
          <p className="menu-item-description">{item.description}</p>
        )}
        <div className="menu-item-price">
          {item.price.toFixed(2)} <span className="currency">L</span>
        </div>
      </div>

      <div className="menu-item-footer">
        {showAddButton && item.isAvailable && (
          <button
            className="btn-add-item"
            onClick={() => onAdd && onAdd(item)}
          >
            + Shto
          </button>
        )}

        {isAdmin && (
          <div className="menu-item-admin-actions">
            <button
              className="btn-icon btn-edit"
              onClick={() => onEdit && onEdit(item)}
              title="Ndrysho"
            >
              ✏️
            </button>
            <button
              className="btn-icon btn-delete"
              onClick={() => onDelete && onDelete(item._id)}
              title="Fshi"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
