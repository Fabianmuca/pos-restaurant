import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../services/authApi';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'waiter',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Ju lutem plotësoni të gjitha fushat.');
      return;
    }
    if (form.password.length < 6) {
      setError('Fjalëkalimi duhet të ketë të paktën 6 karaktere.');
      return;
    }
    try {
      await registerUser(form).unwrap();
      setSuccess(`Stafi "${form.name}" u regjistrua me sukses si ${form.role}!`);
      setForm({ name: '', email: '', password: '', role: 'waiter' });
    } catch (err) {
      setError(err?.data?.message || 'Gabim gjatë regjistrimit.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Regjistro Staf të Ri</h1>
        <p className="page-subtitle">Krijoni llogari për kamarierët dhe arketarët</p>
      </div>

      <div className="form-card" style={{ maxWidth: 480 }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Emri i plotë</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Emri Mbiemri"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="email@shembull.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Fjalëkalimi</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Minimum 6 karaktere"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Roli</label>
            <select
              name="role"
              className="form-input form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option value="waiter">Kamarier</option>
              <option value="cashier">Arketar</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/tables')}
            >
              Anulo
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-loading">
                  <span className="spinner"></span> Duke regjistruar...
                </span>
              ) : (
                'Regjistro Stafin'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
