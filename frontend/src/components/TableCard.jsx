const TableCard = ({ table, onClick, onEdit, onDelete, isAdmin }) => {
  const statusConfig = {
    free: { label: 'Lirë', className: 'status-free', icon: '✅' },
    occupied: { label: 'Zënë', className: 'status-occupied', icon: '🔴' },
    reserved: { label: 'Rezervuar', className: 'status-reserved', icon: '🟡' },
  };

  const config = statusConfig[table.status] || statusConfig.free;

  return (
    <div
      className={`table-card ${config.className}`}
      onClick={() => onClick && onClick(table)}
    >
      <div className="table-card-header">
        <span className="table-number">#{table.number}</span>
        <span className="table-status-icon">{config.icon}</span>
      </div>

      <div className="table-card-body">
        <div className="table-capacity">
          <span className="capacity-icon">👥</span>
          <span>{table.capacity} vende</span>
        </div>
        <div className={`table-status-badge ${config.className}`}>
          {config.label}
        </div>
      </div>

      {isAdmin && (
        <div
          className="table-card-actions"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="btn-icon btn-edit"
            onClick={() => onEdit && onEdit(table)}
            title="Ndrysho"
          >
            ✏️
          </button>
          <button
            className="btn-icon btn-delete"
            onClick={() => onDelete && onDelete(table._id)}
            title="Fshi"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default TableCard;
