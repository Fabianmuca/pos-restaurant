/**
 * ReceiptPrint — Fatura standarte POS 80mm
 * Hap dritare printimi me layout të optimizuar për printer termik.
 */

const ReceiptPrint = ({ order, onClose }) => {
  if (!order) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString('sq-AL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('sq-AL', {
    hour: '2-digit', minute: '2-digit',
  });

  const receiptNumber =
    `${now.getFullYear()}` +
    `${String(now.getMonth() + 1).padStart(2, '0')}` +
    `${String(now.getDate()).padStart(2, '0')}` +
    `-${(order._id?.slice(-6) || '000000').toUpperCase()}`;

  const subtotal = order.items.reduce(
    (sum, item) => sum + (item.menuItem?.price || 0) * item.quantity,
    0
  );
  const totalPrice = order.totalPrice ?? subtotal;
  const vatAmount  = (totalPrice * 0.2) / 1.2;

  const handlePrint = () => {
    const printContents = document.getElementById('receipt-inner').innerHTML;
    const win = window.open('', '_blank', 'width=340,height=700,scrollbars=yes');
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Fatura BarPOS — ${receiptNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;}
    body{
      font-family:'IBM Plex Mono','Courier New',monospace;
      font-size:11px;
      color:#000;
      background:#fff;
      width:80mm;
      margin:0 auto;
      padding:4mm 3mm;
    }
    .rc{text-align:center;}
    .bold{font-weight:700;}
    .lg{font-size:16px;}
    .sm{font-size:9px;}
    .xs{font-size:8px;}
    hr.solid{border:none;border-top:1px solid #000;margin:5px 0;}
    hr.dash {border:none;border-top:1px dashed #555;margin:5px 0;}
    .row{display:flex;justify-content:space-between;margin:2px 0;font-size:10px;}
    .col-name{flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:110px;}
    .col-qty{width:24px;text-align:center;}
    .col-up{width:40px;text-align:right;}
    .col-tot{width:58px;text-align:right;font-weight:700;}
    .total-row{display:flex;justify-content:space-between;font-size:14px;font-weight:700;margin:4px 0;}
    .footer{text-align:center;font-size:9px;color:#555;margin-top:6px;line-height:1.6;}
    .barcode{text-align:center;letter-spacing:4px;font-size:7px;margin:5px 0;font-family:monospace;}
    @media print{body{width:80mm;} @page{margin:0;size:80mm auto;}}
  </style>
</head>
<body>${printContents}</body>
</html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  return (
    <div className="receipt-overlay" onClick={onClose}>
      <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>

        {/* ── Preview ── */}
        <div className="receipt-preview-wrap">
          <div className="receipt-paper">
            <div id="receipt-inner">

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: 2 }}>&#127863; BarPOS</div>
                <div style={{ fontSize: 10, marginTop: 3 }}>Rruga Ali Demi, Tiranë</div>
                <div style={{ fontSize: 10 }}>Tel: +355 69 412 3870</div>
                <div style={{ fontSize: 10 }}>info@barpos.al  |  www.barpos.al</div>
                <div style={{ fontSize: 10, marginTop: 3 }}>NIPT: AL-2026-BPOS-001</div>
              </div>

              <hr className="receipt-solid" />

              {/* Info porosia */}
              <div style={{ fontSize: 10, marginBottom: 4 }}>
                {[
                  ['Fatura Nr:',  receiptNumber],
                  ['Data:',       dateStr],
                  ['Ora:',        timeStr],
                  ['Tavolina:',   `#${order.table?.number ?? '—'}`],
                  ['Kamarieri:',  order.waiter?.name ?? '—'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span>{k}</span>
                    <strong style={{ maxWidth: 150, textAlign: 'right', wordBreak: 'break-all' }}>{v}</strong>
                  </div>
                ))}
              </div>

              <hr className="receipt-dash" />

              {/* Header kolonave */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 9, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4,
              }}>
                <span style={{ flex: 1 }}>Artikulli</span>
                <span style={{ width: 24, textAlign: 'center' }}>Sas</span>
                <span style={{ width: 40, textAlign: 'right' }}>Çmim</span>
                <span style={{ width: 58, textAlign: 'right' }}>Total</span>
              </div>

              <hr className="receipt-dash" />

              {/* Artikujt */}
              {order.items.map((item, idx) => {
                const price     = item.menuItem?.price ?? 0;
                const lineTotal = price * item.quantity;
                return (
                  <div key={idx} style={{ marginBottom: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                      <span style={{
                        flex: 1, overflow: 'hidden', whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis', maxWidth: 110,
                      }}>
                        {item.menuItem?.name ?? 'Artikull'}
                      </span>
                      <span style={{ width: 24, textAlign: 'center' }}>{item.quantity}</span>
                      <span style={{ width: 40, textAlign: 'right' }}>{price.toFixed(0)}</span>
                      <span style={{ width: 58, textAlign: 'right', fontWeight: 700 }}>
                        {lineTotal.toFixed(2)} L
                      </span>
                    </div>
                    {item.note && (
                      <div style={{ fontSize: 9, color: '#666', paddingLeft: 6 }}>
                        ↳ {item.note}
                      </div>
                    )}
                  </div>
                );
              })}

              <hr className="receipt-solid" />

              {/* Totalet */}
              <div style={{ fontSize: 10, marginBottom: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span>Nëntotal:</span>
                  <span>{subtotal.toFixed(2)} L</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span>TVSH 20% (e përfshirë):</span>
                  <span>{vatAmount.toFixed(2)} L</span>
                </div>
              </div>

              <hr className="receipt-dash" />

              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 14, fontWeight: 700, margin: '4px 0',
              }}>
                <span>TOTAL:</span>
                <span>{totalPrice.toFixed(2)} L</span>
              </div>

              {order.paymentMethod && (
                <div style={{ fontSize: 10, marginTop: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Metoda e pagesës:</span>
                    <span>{order.paymentMethod === 'cash' ? 'Cash' : 'Kartë Bankare'}</span>
                  </div>
                </div>
              )}

              <hr className="receipt-dash" />

              {/* Barcode simulim */}
              <div style={{ textAlign: 'center', marginTop: 6 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: 3 }}>
                  ||| || ||| | || ||| || ||
                </div>
                <div style={{ fontSize: 9, marginTop: 2 }}>{receiptNumber}</div>
              </div>

              <hr className="receipt-dash" />

              {/* Footer */}
              <div style={{ textAlign: 'center', fontSize: 9, color: '#555', marginTop: 6, lineHeight: 1.7 }}>
                <div style={{ fontWeight: 700, color: '#000' }}>Faleminderit për vizitën tuaj!</div>
                <div>Ruajeni faturën për ankesa brenda 24 orësh.</div>
                <div style={{ marginTop: 4, fontSize: 8 }}>
                  BarPOS — Sistemi POS për Bare &amp; Restorante
                </div>
              </div>

            </div>{/* /receipt-inner */}
          </div>
        </div>

        {/* ── Butonat ── */}
        <div className="receipt-actions">
          <button className="btn-secondary" onClick={onClose}>
            ✕ Mbyll
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            🖨️ Printo Faturën
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReceiptPrint;
