import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../services/orderApi';
import { useCreatePaymentMutation } from '../services/paymentApi';
import OrderItemRow from '../components/OrderItemRow';
import ReceiptPrint from '../components/ReceiptPrint';

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate    = useNavigate();

  const { data: order, isLoading, isError } = useGetOrderByIdQuery(orderId);
  const [createPayment, { isLoading: isPaying }] = useCreatePaymentMutation();

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState(false);
  const [showReceipt,   setShowReceipt]   = useState(false);

  // Ndërtojmë objektin e porosisë me metodën e pagesës për faturën
  const orderWithMethod = order
    ? { ...order, paymentMethod }
    : null;

  const handlePayment = async () => {
    if (!order) return;
    if (order.status === 'paid') {
      setError('Kjo porosi është paguar tashmë.');
      return;
    }
    setError('');
    try {
      await createPayment({
        order:  orderId,
        method: paymentMethod,
        amount: order.totalPrice,
      }).unwrap();
      setSuccess(true);
    } catch (err) {
      setError(err?.data?.message || 'Gabim gjatë pagesës.');
    }
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <span className="spinner spinner-lg"></span>
          <p>Duke ngarkuar porosinë...</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (isError || !order) {
    return (
      <div className="page-container">
        <div className="alert alert-error">Porosia nuk u gjet.</div>
        <button className="btn-secondary" onClick={() => navigate('/tables')}>
          ← Kthehu te Tavolinat
        </button>
      </div>
    );
  }

  /* ── Sukses pagesë ── */
  if (success) {
    return (
      <div className="page-container">
        <div className="payment-success">
          <div className="success-icon">✅</div>
          <h2 className="success-title">Pagesa u Krye!</h2>
          <p className="success-desc">
            Tavolina #{order.table?.number} u lirua me sukses.
          </p>
          <div className="success-details">
            <div className="success-detail-row">
              <span>Shuma e paguar:</span>
              <strong>{order.totalPrice.toFixed(2)} L</strong>
            </div>
            <div className="success-detail-row">
              <span>Metoda:</span>
              <strong>{paymentMethod === 'cash' ? '💵 Cash' : '💳 Kartë'}</strong>
            </div>
          </div>

          {/* Printo faturën pas pagesës */}
          <button
            className="btn-receipt"
            style={{ marginTop: 24, width: '100%' }}
            onClick={() => setShowReceipt(true)}
          >
            🧾 Printo Faturën
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate('/tables')}
            style={{ marginTop: 12, width: '100%' }}
          >
            🪑 Kthehu te Tavolinat
          </button>
        </div>

        {/* Modal faturë */}
        {showReceipt && (
          <ReceiptPrint
            order={orderWithMethod}
            onClose={() => setShowReceipt(false)}
          />
        )}
      </div>
    );
  }

  /* ── Forma e pagesës ── */
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Kthehu
          </button>
          <h1 className="page-title">Pagesa</h1>
          <p className="page-subtitle">Tavolina #{order.table?.number}</p>
        </div>
        {/* Printo faturën edhe para pagesës */}
        <button
          className="btn-receipt"
          onClick={() => setShowReceipt(true)}
        >
          🧾 Printo Faturën
        </button>
      </div>

      {order.status === 'paid' && (
        <div className="alert alert-success">
          ✅ Kjo porosi është paguar tashmë.
        </div>
      )}

      <div className="payment-layout">
        {/* ── Detajet e porosisë ── */}
        <div className="payment-summary-panel">
          <h2 className="panel-title">Detajet e Porosisë</h2>

          <div className="payment-info-row">
            <span>Kamarieri:</span>
            <strong>{order.waiter?.name}</strong>
          </div>
          <div className="payment-info-row">
            <span>Statusi:</span>
            <span className={`order-status-badge status-${order.status}`}>
              {{ pending: 'Në pritje', preparing: 'Duke u përgatitur', ready: 'Gati', paid: 'Paguar' }[order.status]}
            </span>
          </div>

          <div className="order-items-list" style={{ marginTop: 16 }}>
            {order.items.map((item, idx) => (
              <OrderItemRow key={idx} item={item} readonly={true} />
            ))}
          </div>

          <div className="order-total-bar">
            <span className="total-label">Total:</span>
            <span className="total-amount">{order.totalPrice.toFixed(2)} L</span>
          </div>
        </div>

        {/* ── Metoda & konfirmim ── */}
        {order.status !== 'paid' && (
          <div className="payment-action-panel">
            <h2 className="panel-title">Metoda e Pagesës</h2>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="payment-methods">
              <div
                className={`payment-method-card ${paymentMethod === 'cash' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <span className="payment-method-icon">💵</span>
                <span className="payment-method-label">Cash</span>
              </div>
              <div
                className={`payment-method-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <span className="payment-method-icon">💳</span>
                <span className="payment-method-label">Kartë</span>
              </div>
            </div>

            <div className="payment-total-display">
              <span className="payment-total-label">Shuma për t'u paguar</span>
              <span className="payment-total-amount">{order.totalPrice.toFixed(2)} L</span>
            </div>

            <button
              className="btn-primary btn-full btn-pay"
              onClick={handlePayment}
              disabled={isPaying}
            >
              {isPaying ? (
                <span className="btn-loading">
                  <span className="spinner"></span> Duke procesuar...
                </span>
              ) : (
                `✅ Konfirmo Pagesën — ${order.totalPrice.toFixed(2)} L`
              )}
            </button>
          </div>
        )}
      </div>

      {/* Modal faturë */}
      {showReceipt && (
        <ReceiptPrint
          order={orderWithMethod}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default PaymentPage;
