import { useState } from 'react';

const OrderItemRow = ({ item, onQuantityChange, onNoteChange, onRemove, readonly }) => {
  const [showNote, setShowNote] = useState(!!item.note);

  const menuItem = item.menuItem;
  const subtotal = menuItem ? (menuItem.price * item.quantity).toFixed(2) : '0.00';

  return (
    <div className="order-item-row">
      <div className="order-item-info">
        <span className="order-item-name">
          {menuItem ? menuItem.name : 'Artikull i panjohur'}
        </span>
        <span className="order-item-price">
          {menuItem ? menuItem.price.toFixed(2) : '0.00'} L × {item.quantity}
        </span>
      </div>

      <div className="order-item-controls">
        {!readonly && (
          <div className="quantity-controls">
            <button
              className="qty-btn"
              onClick={() => onQuantityChange && onQuantityChange(item, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span className="qty-value">{item.quantity}</span>
            <button
              className="qty-btn"
              onClick={() => onQuantityChange && onQuantityChange(item, item.quantity + 1)}
            >
              +
            </button>
          </div>
        )}

        {readonly && <span className="qty-readonly">×{item.quantity}</span>}

        <span className="order-item-subtotal">{subtotal} L</span>

        {!readonly && (
          <button
            className="btn-remove-item"
            onClick={() => onRemove && onRemove(item)}
            title="Hiq"
          >
            ✕
          </button>
        )}
      </div>

      {!readonly && (
        <div className="order-item-note-section">
          <button
            className="btn-note-toggle"
            onClick={() => setShowNote(!showNote)}
          >
            {showNote ? '− Fshih shënimin' : '+ Shto shënim'}
          </button>
          {showNote && (
            <input
              type="text"
              className="note-input"
              placeholder="Shënim për kuzhinën..."
              value={item.note || ''}
              onChange={(e) => onNoteChange && onNoteChange(item, e.target.value)}
            />
          )}
        </div>
      )}

      {readonly && item.note && (
        <div className="order-item-note-readonly">
          <span className="note-label">📝</span> {item.note}
        </div>
      )}
    </div>
  );
};

export default OrderItemRow;
