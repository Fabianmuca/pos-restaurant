import { useGetPaymentsQuery } from '../services/paymentApi';

const PaymentsPage = () => {
  const { data: payments = [], isLoading, isError } = useGetPaymentsQuery();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('sq-AL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const cashTotal = payments.filter((p) => p.method === 'cash').reduce((s, p) => s + p.amount, 0);
  const cardTotal = payments.filter((p) => p.method === 'card').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pagesat</h1>
          <p className="page-subtitle">{payments.length} pagesa gjithsej</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <div>
            <div className="stat-value">{totalRevenue.toFixed(2)} L</div>
            <div className="stat-label">Të ardhura totale</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💵</span>
          <div>
            <div className="stat-value">{cashTotal.toFixed(2)} L</div>
            <div className="stat-label">Cash</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💳</span>
          <div>
            <div className="stat-value">{cardTotal.toFixed(2)} L</div>
            <div className="stat-label">Kartë</div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="loading-state">
          <span className="spinner spinner-lg"></span>
          <p>Duke ngarkuar pagesat...</p>
        </div>
      )}

      {isError && (
        <div className="alert alert-error">Gabim gjatë ngarkimit të pagesave.</div>
      )}

      {!isLoading && !isError && payments.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">💳</span>
          <p>Nuk ka pagesa të regjistruara.</p>
        </div>
      )}

      {!isLoading && payments.length > 0 && (
        <div className="payments-table-wrapper">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tavolina</th>
                <th>Artikujt</th>
                <th>Metoda</th>
                <th>Shuma</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="payment-date">
                    {formatDate(payment.paidAt)}
                  </td>
                  <td>
                    <span className="table-badge">
                      #{payment.order?.table?.number || '—'}
                    </span>
                  </td>
                  <td className="payment-items">
                    {payment.order?.items?.map((item, idx) => (
                      <span key={idx} className="payment-item-tag">
                        {item.menuItem?.name} ×{item.quantity}
                      </span>
                    ))}
                  </td>
                  <td>
                    <span
                      className={`method-badge method-${payment.method}`}
                    >
                      {payment.method === 'cash' ? '💵 Cash' : '💳 Kartë'}
                    </span>
                  </td>
                  <td className="payment-amount">
                    <strong>{payment.amount.toFixed(2)} L</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
