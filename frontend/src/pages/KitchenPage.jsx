import { useGetOrdersQuery, useUpdateOrderMutation } from '../services/orderApi';

const STATUS_CONFIG = {
  pending: {
    label: 'Në pritje',
    next: 'preparing',
    nextLabel: '👨‍🍳 Fillo Përgatitjen',
    className: 'status-pending',
    color: '#e67e22',
  },
  preparing: {
    label: 'Duke u përgatitur',
    next: 'ready',
    nextLabel: '✅ Shëno si Gati',
    className: 'status-preparing',
    color: '#3498db',
  },
  ready: {
    label: 'Gati',
    next: null,
    nextLabel: null,
    className: 'status-ready',
    color: '#2ecc71',
  },
};

const KitchenPage = () => {
  const { data: orders = [], isLoading, isError, refetch } = useGetOrdersQuery(
    { status: 'pending' },
    { pollingInterval: 15000 }
  );

  const { data: preparingOrders = [] } = useGetOrdersQuery(
    { status: 'preparing' },
    { pollingInterval: 15000 }
  );

  const { data: readyOrders = [] } = useGetOrdersQuery(
    { status: 'ready' },
    { pollingInterval: 15000 }
  );

  const [updateOrder] = useUpdateOrderMutation();

  const allActiveOrders = [...orders, ...preparingOrders, ...readyOrders].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const handleStatusChange = async (order, newStatus) => {
    try {
      await updateOrder({ id: order._id, status: newStatus }).unwrap();
      refetch();
    } catch (err) {
      alert(err?.data?.message || 'Gabim gjatë përditësimit të statusit.');
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' });
  };

  const getElapsed = (dateStr) => {
    const elapsed = Math.floor((Date.now() - new Date(dateStr)) / 60000);
    if (elapsed < 1) return '< 1 min';
    return `${elapsed} min`;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kuzhina</h1>
          <p className="page-subtitle">
            {allActiveOrders.length} porosi aktive ·{' '}
            <button className="btn-link" onClick={() => refetch()}>
              🔄 Rifresko
            </button>
          </p>
        </div>
        <div className="kitchen-legend">
          <span className="legend-item" style={{ color: '#e67e22' }}>
            🟠 Në pritje: {orders.length}
          </span>
          <span className="legend-item" style={{ color: '#3498db' }}>
            🔵 Në përgatitje: {preparingOrders.length}
          </span>
          <span className="legend-item" style={{ color: '#2ecc71' }}>
            🟢 Gati: {readyOrders.length}
          </span>
        </div>
      </div>

      {isLoading && (
        <div className="loading-state">
          <span className="spinner spinner-lg"></span>
          <p>Duke ngarkuar porositë...</p>
        </div>
      )}

      {isError && (
        <div className="alert alert-error">Gabim gjatë ngarkimit të porosive.</div>
      )}

      {!isLoading && allActiveOrders.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">👨‍🍳</span>
          <h2>Nuk ka porosi aktive</h2>
          <p>Të gjitha porositë janë trajtuar ose nuk ka porosi ende.</p>
        </div>
      )}

      <div className="kitchen-grid">
        {allActiveOrders.map((order) => {
          const config = STATUS_CONFIG[order.status];
          return (
            <div
              key={order._id}
              className={`kitchen-card ${config?.className}`}
              style={{ borderTopColor: config?.color }}
            >
              <div className="kitchen-card-header">
                <div className="kitchen-table-info">
                  <span className="kitchen-table-number">
                    🪑 Tavolina #{order.table?.number}
                  </span>
                  <span className="kitchen-waiter">
                    👤 {order.waiter?.name}
                  </span>
                </div>
                <div className="kitchen-time-info">
                  <span className="kitchen-time">{formatTime(order.createdAt)}</span>
                  <span
                    className="kitchen-elapsed"
                    style={{
                      color:
                        getElapsed(order.createdAt).includes('min') &&
                        parseInt(getElapsed(order.createdAt)) > 20
                          ? '#e74c3c'
                          : '#95a5a6',
                    }}
                  >
                    {getElapsed(order.createdAt)} më parë
                  </span>
                </div>
              </div>

              <div
                className={`kitchen-status-badge ${config?.className}`}
                style={{ backgroundColor: config?.color + '22', color: config?.color }}
              >
                {config?.label}
              </div>

              <div className="kitchen-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="kitchen-item">
                    <div className="kitchen-item-main">
                      <span className="kitchen-item-qty">×{item.quantity}</span>
                      <span className="kitchen-item-name">
                        {item.menuItem?.name || 'Artikull'}
                      </span>
                    </div>
                    {item.note && (
                      <div className="kitchen-item-note">📝 {item.note}</div>
                    )}
                  </div>
                ))}
              </div>

              {config?.next && (
                <button
                  className="btn-kitchen-action"
                  style={{ backgroundColor: config?.color }}
                  onClick={() => handleStatusChange(order, config.next)}
                >
                  {config?.nextLabel}
                </button>
              )}

              {order.status === 'ready' && (
                <div className="kitchen-ready-indicator">
                  ✅ Gati për shërbim
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KitchenPage;
