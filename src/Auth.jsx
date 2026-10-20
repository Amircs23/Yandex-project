
import { useState } from 'react';
import './Auth.css';

function Auth() {
  const [mode, setMode] = useState('login');
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('marketshop-user')) || null;
    } catch {
      return null;
    }
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function updateField(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    setError('');
    setSuccess('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    let users = [];

    try {
      users = JSON.parse(localStorage.getItem('marketshop-users')) || [];
    } catch {
      users = [];
    }

    if (mode === 'register') {
      if (form.name.trim().length < 2) {
        setError('Аты-жөніңіз кемінде 2 таңбадан тұруы керек.');
        return;
      }

      if (users.some((item) => item.email === email)) {
        setError('Бұл email бұрын тіркелген.');
        return;
      }

      const newUser = {
        name: form.name.trim(),
        email,
        password,
      };

      users.push(newUser);
      localStorage.setItem('marketshop-users', JSON.stringify(users));

      const loggedInUser = {
        name: newUser.name,
        email: newUser.email,
      };

      localStorage.setItem(
        'marketshop-user',
        JSON.stringify(loggedInUser)
      );

      setUser(loggedInUser);
      setForm({ name: '', email: '', password: '' });
      setSuccess('Тіркелу сәтті аяқталды!');
      setIsOpen(false);
      return;
    }

    const foundUser = users.find(
      (item) => item.email === email && item.password === password
    );

    if (!foundUser) {
      setError('Email немесе пароль қате.');
      return;
    }

    const loggedInUser = {
      name: foundUser.name,
      email: foundUser.email,
    };

    localStorage.setItem(
      'marketshop-user',
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);
    setForm({ name: '', email: '', password: '' });
    setIsOpen(false);
  }

  function logout() {
    localStorage.removeItem('marketshop-user');
    setUser(null);
    setSuccess('Аккаунттан шықтыңыз.');
    setIsOpen(false);
  }

  return (
    <div className="auth">
      {user ? (
        <div className="auth-user">
          <span className="auth-greeting">
            Сәлем, {user.name}!
          </span>
          <button className="auth-button" onClick={logout}>
            Шығу
          </button>
        </div>
      ) : (
        <button
          className="auth-button"
          onClick={() => {
            setMode('login');
            setError('');
            setSuccess('');
            setIsOpen(true);
          }}
        >
          Кіру
        </button>
      )}

      {success && !isOpen && (
        <p className="auth-success" role="status">
          {success}
        </p>
      )}

      {isOpen && (
        <div className="auth-overlay">
          <section
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <button
              className="auth-close"
              onClick={() => setIsOpen(false)}
              aria-label="Жабу"
            >
              ×
            </button>

            <h2 id="auth-title">
              {mode === 'login' ? 'Аккаунтқа кіру' : 'Тіркелу'}
            </h2>

            <p className="auth-subtitle">
              {mode === 'login'
                ? 'Дүкенді пайдалану үшін аккаунтыңызға кіріңіз.'
                : 'Жаңа аккаунт жасау үшін мәліметтерді енгізіңіз.'}
            </p>

            <div className="auth-tabs">
              <button
                className={mode === 'login' ? 'selected' : ''}
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
              >
                Кіру
              </button>

              <button
                className={mode === 'register' ? 'selected' : ''}
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
              >
                Тіркелу
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <>
                  <label htmlFor="auth-name">Аты-жөні</label>
                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    placeholder="Аты-жөніңіз"
                    value={form.name}
                    onChange={updateField}
                    minLength={2}
                    required
                  />
                </>
              )}

              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                name="email"
                type="email"
                placeholder="example@mail.com"
                value={form.email}
                onChange={updateField}
                required
              />

              <label htmlFor="auth-password">Пароль</label>
              <input
                id="auth-password"
                name="password"
                type="password"
                placeholder="Кемінде 6 таңба"
                value={form.password}
                onChange={updateField}
                minLength={6}
                required
              />

              {error && (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              )}

              <button className="auth-submit" type="submit">
                {mode === 'login' ? 'Кіру' : 'Аккаунт жасау'}
              </button>
            </form>

            <p className="auth-switch">
              {mode === 'login'
                ? 'Аккаунтыңыз жоқ па?'
                : 'Аккаунтыңыз бар ма?'}{' '}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError('');
                }}
              >
                {mode === 'login' ? 'Тіркелу' : 'Кіру'}
              </button>
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

export default Auth;
