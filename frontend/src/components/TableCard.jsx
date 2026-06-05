const TableCard = ({ table, onClick, onEdit, onDelete, onReserve, onCancelReservation, isAdmin, isWaiter }) => {
  const statusConfig = {
    free: { label: 'Lirë', className: 'status-free', icon: '✅' },
    occupied: { label: 'Zënë', className: 'status-occupied', icon: '🔴' },
    reserved: { label: 'Rezervuar', className: 'status-reserved', icon: '🟡' },
  };

  const config = statusConfig[table.status] || statusConfig.free;
  const isReserved = table.status === 'reserved';
  const canReserve = (isAdmin || isWaiter) && table.status === 'free';

  return (
    <div
      className={`table-card ${config.className} ${isReserved ? 'table-card-reserved' : ''}`}
      onClick={() => !isReserved && onClick && onClick(table)}
      style={{ cursor: isReserved ? 'not-allowed' : 'pointer' }}
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

      {isReserved && (
        <div className="reserved-label">🔖 Rezervuar</div>
      )}

      <div
        className="table-card-actions"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Reserve button for free tables */}
        {canReserve && (
          <button
            className="btn-icon btn-reserve-icon"
            onClick={() => onReserve && onReserve(table)}
            title="Rezervo"
          >
            🔖
          </button>
        )}

        {/* Cancel reservation */}
        {isReserved && (isAdmin || isWaiter) && (
          <button
            className="btn-icon btn-cancel-reserve"
            onClick={() => onCancelReservation && onCancelReservation(table)}
            title="Anulo rezervimin"
          >
            ❌
          </button>
        )}

        {/* Admin edit/delete */}
        {isAdmin && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default TableCard;
