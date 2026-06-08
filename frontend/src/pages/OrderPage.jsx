import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetTableByIdQuery } from '../services/tableApi';
import { useGetMenuItemsQuery } from '../services/menuApi';
import {
  useGetOrderByTableQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
} from '../services/orderApi';
import OrderItemRow from '../components/OrderItemRow';
import MenuItemCard from '../components/MenuItemCard';
import ReceiptPrint from '../components/ReceiptPrint';

const OrderPage = () => {
  const { tableId } = useParams();
  const navigate    = useNavigate();
  const { user }    = useSelector((state) => state.auth);

  // Të gjithë rolet mund të paguajnë
  const canPay = user?.role === 'admin' || user?.role === 'cashier' || user?.role === 'waiter';

  const { data: table,         isLoading: tableLoading }  = useGetTableByIdQuery(tableId);
  const { data: menuItems = [], isLoading: menuLoading }   = useGetMenuItemsQuery();
  const {
    data: existingOrder,
    isLoading: orderLoading,
    refetch: refetchOrder,
  } = useGetOrderByTableQuery(tableId, { pollingInterval: 3000 });

  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const [localItems,    setLocalItems]    = useState([]);
  const [menuCategory,  setMenuCategory]  = useState('all');
  const [menuSearch,    setMenuSearch]    = useState('');
  const [submitError,   setSubmitError]   = useState('');
  const [successMsg,    setSuccessMsg]    = useState('');
  const [showReceipt,   setShowReceipt]   = useState(false);

  useEffect(() => {
    if (existingOrder && existingOrder.items) {
      setLocalItems(
        existingOrder.items.map((item) => ({
          menuItem: item.menuItem,
          quantity: item.quantity,
          note:     item.note || '',
        }))
      );
    } else if (!orderLoading) {
      setLocalItems([]);
    }
  }, [existingOrder, orderLoading]);

  const addItemToOrder = (menuItem) => {
    setLocalItems((prev) => {
      const existing = prev.find((i) => i.menuItem._id === menuItem._id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem._id === menuItem._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem, quantity: 1, note: '' }];
    });
  };

  const handleQuantityChange = (item, newQty) => {
    if (newQty < 1) return;
    setLocalItems((prev) =>
      prev.map((i) =>
        i.menuItem._id === item.menuItem._id ? { ...i, quantity: newQty } : i
      )
    );
  };

  const handleNoteChange = (item, note) => {
    setLocalItems((prev) =>
      prev.map((i) =>
        i.menuItem._id === item.menuItem._id ? { ...i, note } : i
      )
    );
  };

  const handleRemoveItem = (item) => {
    setLocalItems((prev) =>
      prev.filter((i) => i.menuItem._id !== item.menuItem._id)
    );
  };

  const calculateTotal = () =>
    localItems
      .reduce((sum, item) => sum + (item.menuItem?.price || 0) * item.quantity, 0)
      .toFixed(2);

  const handleSubmitOrder = async () => {
    if (localItems.length === 0) {
      setSubmitError('Shto të paktën një artikull.');
      return;
    }
    setSubmitError('');

    const payload = {
      items: localItems.map((i) => ({
        menuItem: i.menuItem._id,
        quantity: i.quantity,
        note:     i.note,
      })),
    };

    try {
      if (existingOrder) {
        await updateOrder({ id: existingOrder._id, ...payload }).unwrap();
        setSuccessMsg('Porosia u përditësua me sukses!');
      } else {
        await createOrder({ table: tableId, ...payload }).unwrap();
        setSuccessMsg('Porosia u krijua me sukses!');
      }
      refetchOrder();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setSubmitError(err?.data?.message || 'Gabim gjatë ruajtjes së porosisë.');
    }
  };

  const handleGoToPayment = () => {
    if (existingOrder) navigate(`/payment/${existingOrder._id}`);
  };

  const filteredMenu = menuItems.filter((item) => {
    const matchCat    = menuCategory === 'all' || item.category === menuCategory;
    const matchSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase());
    return matchCat && matchSearch && item.isAvailable;
  });

  const isLoading = tableLoading || menuLoading || orderLoading;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <button className="btn-back" onClick={() => navigate('/tables')}>
            ← Kthehu
          </button>
          <h1 className="page-title">
            {tableLoading ? 'Duke ngarkuar...' : `Tavolina #${table?.number}`}
          </h1>
          {table && (
            <p className="page-subtitle">
              Kapaciteti: {table.capacity} · Statusi: {table.status}
            </p>
          )}
        </div>
        {existingOrder && canPay && (
          <button className="btn-payment" onClick={handleGoToPayment}>
            💳 Paguaj Porosinë
          </button>
        )}
      </div>

      {isLoading && (
        <div className="loading-state">
          <span className="spinner spinner-lg"></span>
          <p>Duke ngarkuar...</p>
        </div>
      )}

      {!isLoading && (
        <div className="order-layout">
          {/* ── Paneli i porosisë ── */}
          <div className="order-panel">
            <div className="panel-header">
              <h2 className="panel-title">
                {existingOrder ? 'Porosia Aktive' : 'Porosi e Re'}
              </h2>
              {existingOrder && (
                <span className={`order-status-badge status-${existingOrder.status}`}>
                  {{ pending: 'Në pritje', preparing: 'Duke u pergatitur', ready: 'Gati', paid: 'Paguar' }[existingOrder.status]}
                </span>
              )}
            </div>

            {submitError && <div className="alert alert-error">{submitError}</div>}
            {successMsg  && <div className="alert alert-success">{successMsg}</div>}

            {localItems.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🍽️</span>
                <p>Nuk ka artikuj. Zgjidh nga menuja.</p>
              </div>
            ) : (
              <div className="order-items-list">
                {localItems.map((item, idx) => (
                  <OrderItemRow
                    key={item.menuItem._id || idx}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onNoteChange={handleNoteChange}
                    onRemove={handleRemoveItem}
                    readonly={false}
                  />
                ))}
              </div>
            )}

            <div className="order-total-bar">
              <span className="total-label">Total:</span>
              <span className="total-amount">{calculateTotal()} L</span>
            </div>

            {/* Dërgo / Përditëso */}
            <button
              className="btn-primary btn-full"
              onClick={handleSubmitOrder}
              disabled={isCreating || isUpdating || localItems.length === 0}
            >
              {isCreating || isUpdating ? (
                <span className="btn-loading">
                  <span className="spinner"></span> Duke ruajtur...
                </span>
              ) : existingOrder ? (
                '💾 Përditëso Porosinë'
              ) : (
                '✅ Dërgo Porosinë'
              )}
            </button>

            {/* Printo Faturën — i disponueshëm për të gjithë nëse ekziston porosia */}
            {existingOrder && (
              <button
                className="btn-receipt btn-full"
                style={{ marginTop: 10 }}
                onClick={() => setShowReceipt(true)}
              >
                🧾 Printo Faturën
              </button>
            )}

            {/* Paguaj */}
            {existingOrder && canPay && (
              <button
                className="btn-payment btn-full"
                style={{ marginTop: 10 }}
                onClick={handleGoToPayment}
              >
                💳 Paguaj Porosinë — {existingOrder.totalPrice?.toFixed(2)} L
              </button>
            )}
          </div>

          {/* ── Browser menuje ── */}
          <div className="menu-browser-panel">
            <div className="panel-header">
              <h2 className="panel-title">Menuja</h2>
            </div>

            <div className="menu-controls">
              <input
                type="text"
                className="form-input search-input"
                placeholder="🔍 Kërko artikull..."
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
              />
              <div className="filter-tabs">
                {[
                  { key: 'all',     label: 'Të gjitha' },
                  { key: 'food',    label: '🍽️ Ushqim' },
                  { key: 'drink',   label: '🍹 Pije' },
                  { key: 'dessert', label: '🍰 Ëmbëlsirë' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={`filter-tab ${menuCategory === tab.key ? 'active' : ''}`}
                    onClick={() => setMenuCategory(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="menu-browser-grid">
              {filteredMenu.length === 0 && (
                <div className="empty-state">
                  <p>Nuk ka artikuj.</p>
                </div>
              )}
              {filteredMenu.map((item) => (
                <MenuItemCard
                  key={item._id}
                  item={item}
                  showAddButton={true}
                  onAdd={addItemToOrder}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Faturë ── */}
      {showReceipt && existingOrder && (
        <ReceiptPrint
          order={existingOrder}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default OrderPage;
