import { useState } from 'react';
import {
  useGetMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} from '../services/menuApi';
import MenuItemCard from '../components/MenuItemCard';

const INITIAL_FORM = {
  name: '',
  category: 'food',
  price: '',
  description: '',
  isAvailable: true,
};

const MenuPage = () => {
  const { data: menuItems = [], isLoading, isError } = useGetMenuItemsQuery();
  const [createMenuItem, { isLoading: isCreating }] = useCreateMenuItemMutation();
  const [updateMenuItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const openCreate = () => {
    setEditingItem(null);
    setForm(INITIAL_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || '',
      isAvailable: item.isAvailable,
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setForm(INITIAL_FORM);
    setFormError('');
  };

  const handleFormChange = (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      setFormError('Emri dhe çmimi janë të detyrueshëm.');
      return;
    }
    if (isNaN(form.price) || Number(form.price) < 0) {
      setFormError('Çmimi duhet të jetë një numër pozitiv.');
      return;
    }
    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      description: form.description.trim(),
      isAvailable: form.isAvailable,
    };
    try {
      if (editingItem) {
        await updateMenuItem({ id: editingItem._id, ...payload }).unwrap();
      } else {
        await createMenuItem(payload).unwrap();
      }
      closeModal();
    } catch (err) {
      setFormError(err?.data?.message || 'Gabim gjatë ruajtjes.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Jeni të sigurt që doni të fshini këtë artikull?')) {
      try {
        await deleteMenuItem(id).unwrap();
      } catch (err) {
        alert(err?.data?.message || 'Gabim gjatë fshirjes.');
      }
    }
  };

  const filtered =
    filterCategory === 'all'
      ? menuItems
      : menuItems.filter((i) => i.category === filterCategory);

  const counts = {
    all: menuItems.length,
    food: menuItems.filter((i) => i.category === 'food').length,
    drink: menuItems.filter((i) => i.category === 'drink').length,
    dessert: menuItems.filter((i) => i.category === 'dessert').length,
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Menuja</h1>
          <p className="page-subtitle">{menuItems.length} artikuj gjithsej</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          + Shto Artikull
        </button>
      </div>

      <div className="filter-tabs">
        {[
          { key: 'all', label: `Të gjitha (${counts.all})` },
          { key: 'food', label: `🍽️ Ushqim (${counts.food})` },
          { key: 'drink', label: `🍹 Pije (${counts.drink})` },
          { key: 'dessert', label: `🍰 Ëmbëlsirë (${counts.dessert})` },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`filter-tab ${filterCategory === tab.key ? 'active' : ''}`}
            onClick={() => setFilterCategory(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="loading-state">
          <span className="spinner spinner-lg"></span>
          <p>Duke ngarkuar menunë...</p>
        </div>
      )}

      {isError && (
        <div className="alert alert-error">Gabim gjatë ngarkimit të menusë.</div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p>Nuk ka artikuj në meny.</p>
          <button className="btn-primary" onClick={openCreate}>
            Shto artikullin e parë
          </button>
        </div>
      )}

      <div className="menu-grid">
        {filtered.map((item) => (
          <MenuItemCard
            key={item._id}
            item={item}
            isAdmin={true}
            onEdit={openEdit}
            onDelete={handleDelete}
            showAddButton={false}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingItem ? 'Ndrysho Artikullin' : 'Shto Artikull të Ri'}
              </h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Emri</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="p.sh. Spaghetti Carbonara"
                  value={form.name}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Kategoria</label>
                  <select
                    name="category"
                    className="form-input form-select"
                    value={form.category}
                    onChange={handleFormChange}
                  >
                    <option value="food">🍽️ Ushqim</option>
                    <option value="drink">🍹 Pije</option>
                    <option value="dessert">🍰 Ëmbëlsirë</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Çmimi (L)</label>
                  <input
                    type="number"
                    name="price"
                    className="form-input"
                    placeholder="p.sh. 850"
                    value={form.price}
                    onChange={handleFormChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Përshkrimi (optional)</label>
                <textarea
                  name="description"
                  className="form-input form-textarea"
                  placeholder="Përshkrim i shkurtër..."
                  value={form.description}
                  onChange={handleFormChange}
                  rows={2}
                />
              </div>

              <div className="form-group form-checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={form.isAvailable}
                    onChange={handleFormChange}
                  />
                  <span>Disponueshëm</span>
                </label>
              </div>

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
                  ) : editingItem ? (
                    'Ruaj Ndryshimet'
                  ) : (
                    'Krijo Artikullin'
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

export default MenuPage;
