import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useGetTablesQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
} from '../services/tableApi';
import TableCard from '../components/TableCard';

const INITIAL_FORM = { number: '', capacity: '', status: 'free' };

const TablesPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  const isWaiter = user?.role === 'waiter';

  // Auto-refresh every 10 seconds
  const { data: tables = [], isLoading, isError } = useGetTablesQuery(undefined, {
    pollingInterval: 3000,
  });
  const [createTable, { isLoading: isCreating }] = useCreateTableMutation();
  const [updateTable, { isLoading: isUpdating }] = useUpdateTableMutation();
  const [deleteTable] = useDeleteTableMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Reserve modal
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reservingTable, setReservingTable] = useState(null);
  const [reserveName, setReserveName] = useState('');
  const [reserveError, setReserveError] = useState('');

  const openCreate = () => {
    setEditingTable(null);
    setForm(INITIAL_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (table) => {
    setEditingTable(table);
    setForm({ number: table.number, capacity: table.capacity, status: table.status });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTable(null);
    setForm(INITIAL_FORM);
    setFormError('');
  };

  const openReserve = (table) => {
    setReservingTable(table);
    setReserveName('');
    setReserveError('');
    setShowReserveModal(true);
  };

  const closeReserve = () => {
    setShowReserveModal(false);
    setReservingTable(null);
    setReserveName('');
    setReserveError('');
  };

  const handleReserve = async (e) => {
    e.preventDefault();
    if (!reserveName.trim()) {
      setReserveError('Ju lutem shkruani emrin e klientit.');
      return;
    }
    try {
      await updateTable({ id: reservingTable._id, status: 'reserved' }).unwrap();
      closeReserve();
    } catch (err) {
      setReserveError(err?.data?.message || 'Gabim gjatë rezervimit.');
    }
  };

  const handleCancelReservation = async (table) => {
    if (window.confirm(`Anulo rezervimin e Tavolinës #${table.number}?`)) {
      try {
        await updateTable({ id: table._id, status: 'free' }).unwrap();
      } catch (err) {
        alert(err?.data?.message || 'Gabim.');
      }
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.number || !form.capacity) {
      setFormError('Numri dhe kapaciteti janë të detyrueshëm.');
      return;
    }
    const payload = {
      number: Number(form.number),
      capacity: Number(form.capacity),
      status: form.status,
    };
    try {
      if (editingTable) {
        await updateTable({ id: editingTable._id, ...payload }).unwrap();
      } else {
        await createTable(payload).unwrap();
      }
      closeModal();
    } catch (err) {
      setFormError(err?.data?.message || 'Gabim gjatë ruajtjes.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Jeni të sigurt që doni të fshini këtë tavolinë?')) {
      try {
        await deleteTable(id).unwrap();
      } catch (err) {
        alert(err?.data?.message || 'Gabim gjatë fshirjes.');
      }
    }
  };

  const handleTableClick = (table) => {
    if (table.status === 'reserved') return;
    navigate(`/orders/${table._id}`);
  };

  const filtered = filterStatus === 'all'
    ? tables
    : tables.filter((t) => t.status === filterStatus);

  const counts = {
    all: tables.length,
    free: tables.filter((t) => t.status === 'free').length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    reserved: tables.filter((t) => t.status === 'reserved').length,
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tavolinat</h1>
          <p className="page-subtitle">
            {counts.free} lirë · {counts.occupied} zënë · {counts.reserved} rezervuar
            <span className="auto-refresh-badge">🔄 auto-refresh 10s</span>
          </p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={openCreate}>
            + Shto Tavolinë
          </button>
        )}
      </div>

      <div className="filter-tabs">
        {[
          { key: 'all', label: `Të gjitha (${counts.all})` },
          { key: 'free', label: `Lirë (${counts.free})` },
          { key: 'occupied', label: `Zënë (${counts.occupied})` },
          { key: 'reserved', label: `Rezervuar (${counts.reserved})` },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`filter-tab ${filterStatus === tab.key ? 'active' : ''}`}
            onClick={() => setFilterStatus(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="loading-state">
          <span className="spinner spinner-lg"></span>
          <p>Duke ngarkuar tavolinat...</p>
        </div>
      )}

      {isError && (
        <div className="alert alert-error">Gabim gjatë ngarkimit të tavolinave.</div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🪑</span>
          <p>Nuk ka tavolina për të shfaqur.</p>
          {isAdmin && (
            <button className="btn-primary" onClick={openCreate}>
              Shto tavolinën e parë
            </button>
          )}
        </div>
      )}

      <div className="tables-grid">
        {filtered.map((table) => (
          <TableCard
            key={table._id}
            table={table}
            onClick={handleTableClick}
            onEdit={openEdit}
            onDelete={handleDelete}
            onReserve={openReserve}
            onCancelReservation={handleCancelReservation}
            isAdmin={isAdmin}
            isWaiter={isWaiter}
          />
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingTable ? 'Ndrysho Tavolinën' : 'Shto Tavolinë të Re'}
              </h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Numri i tavolinës</label>
                <input
                  type="number"
                  name="number"
                  className="form-input"
                  placeholder="p.sh. 1"
                  value={form.number}
                  onChange={handleFormChange}
                  min="1"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kapaciteti (vende)</label>
                <input
                  type="number"
                  name="capacity"
                  className="form-input"
                  placeholder="p.sh. 4"
                  value={form.capacity}
                  onChange={handleFormChange}
                  min="1"
                />
              </div>

              {editingTable && (
                <div className="form-group">
                  <label className="form-label">Statusi</label>
                  <select
                    name="status"
                    className="form-input form-select"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    <option value="free">Lirë</option>
                    <option value="occupied">Zënë</option>
                    <option value="reserved">Rezervuar</option>
                  </select>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Anulo
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating ? (
                    <span className="btn-loading">
                      <span className="spinner"></span> Duke ruajtur...
                    </span>
                  ) : (
                    editingTable ? 'Ruaj Ndryshimet' : 'Krijo Tavolinën'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reserve Modal */}
      {showReserveModal && (
        <div className="modal-overlay" onClick={closeReserve}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                🔖 Rezervo Tavolinën #{reservingTable?.number}
              </h2>
              <button className="modal-close" onClick={closeReserve}>✕</button>
            </div>

            {reserveError && <div className="alert alert-error">{reserveError}</div>}

            <form onSubmit={handleReserve}>
              <div className="form-group">
                <label className="form-label">Emri i klientit</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="p.sh. Artan Hoxha"
                  value={reserveName}
                  onChange={(e) => setReserveName(e.target.value)}
                  autoFocus
                />
              </div>

              <p className="reserve-info">
                Tavolina do të shënohet si <strong>e rezervuar</strong> dhe nuk do të jetë e aksesueshme nga kamarierët.
              </p>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeReserve}>
                  Anulo
                </button>
                <button type="submit" className="btn-reserve" disabled={isUpdating}>
                  {isUpdating ? (
                    <span className="btn-loading"><span className="spinner"></span> Duke rezervuar...</span>
                  ) : (
                    '🔖 Konfirmo Rezervimin'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablesPage;
