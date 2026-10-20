
import { useEffect, useState } from 'react';
import './App.css';
import Auth from './Auth';
import products from './data/products';

function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Барлығы');

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('marketshop-cart')) || [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    localStorage.setItem('marketshop-cart', JSON.stringify(cart));
  }, [cart]);

  const categories = [
    'Барлығы',
    'Электроника',
    'Аксессуарлар',
    'Компьютерлер',
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === 'Барлығы' || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat('ru-RU').format(price) + ' ₸';

  function addToCart(product) {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });

    setMessage(`${product.name} себетке қосылды`);
  }

  function changeQuantity(id, amount) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  }

  function submitOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
      setMessage('Себет бос. Алдымен тауар қосыңыз.');
      setOrderOpen(false);
      return;
    }

    setCart([]);
    setOrderOpen(false);
    setCartOpen(false);
    setCustomer({ name: '', phone: '', address: '' });

    setMessage(
      `Рақмет, ${customer.name}! Тапсырысыңыз қабылданды.`
    );
  }

  return (
    <div className="app">
      <header className="header">
        <a className="logo" href="#">
          market<span>shop</span>
        </a>

        <input
          className="search"
          type="search"
          placeholder="Тауарларды іздеу..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <button
          className="cart-button"
          onClick={() => {
            setCartOpen(true);
            setMessage('');
          }}
        >
          🛒 Себет ({cartCount})
        </button>

        <Auth />
      </header>

      {message && (
        <div className="toast" role="status">
          {message}
          <button onClick={() => setMessage('')} aria-label="Жабу">
            ×
          </button>
        </div>
      )}

      <main className="main">
        <section className="hero">
          <p className="hero-label">ОНЛАЙН-ДҮКЕН</p>
          <h1>
            Өзіңе керекті
            <br />
            тауарды тап
          </h1>
          <p className="hero-description">
            Тауарларды ізде, салыстыр және себетке қос.
          </p>
        </section>

        <section className="catalog">
          <h2>Танымал тауарлар</h2>

          <div className="categories">
            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? 'category-button active'
                    : 'category-button'
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <p className="results-count">
            Табылған тауар саны: {filteredProducts.length}
          </p>

          <div className="products">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">{product.emoji}</div>
                <p className="product-category">{product.category}</p>
                <h3>{product.name}</h3>
                <p className="product-description">
                  {product.description}
                </p>
                <p className="product-price">
                  {formatPrice(product.price)}
                </p>

                <button
                  className="add-button"
                  onClick={() => addToCart(product)}
                >
                  Себетке қосу
                </button>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="empty-message">
              Бұл сұраныс бойынша тауар табылмады.
            </p>
          )}
        </section>

        {cartOpen && (
          <section className="cart-panel">
            <div className="cart-heading">
              <h2>Сіздің себетіңіз ({cartCount})</h2>
              <button
                className="close-button"
                onClick={() => setCartOpen(false)}
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="empty-message">
                Себет әзірге бос. Каталогтан тауар қосыңыз.
              </p>
            ) : (
              <>
                {cart.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <div className="cart-item-emoji">
                      {item.emoji}
                    </div>

                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p>{formatPrice(item.price)}</p>

                      <div className="quantity-controls">
                        <button
                          onClick={() => changeQuantity(item.id, -1)}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => changeQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <strong>
                        {formatPrice(item.price * item.quantity)}
                      </strong>
                      <button
                        className="remove-button"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Өшіру
                      </button>
                    </div>
                  </article>
                ))}

                <div className="cart-total">
                  <span>Жалпы сома:</span>
                  <strong>{formatPrice(cartTotal)}</strong>
                </div>

                <button
                  className="checkout-button"
                  onClick={() => {
                    setOrderOpen(true);
                    setCartOpen(false);
                    setMessage('');
                  }}
                >
                  Тапсырысты рәсімдеу
                </button>
              </>
            )}
          </section>
        )}

        {orderOpen && (
          <div className="modal-overlay">
            <section
              className="order-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="order-title"
            >
              <div className="cart-heading">
                <h2 id="order-title">Тапсырысты рәсімдеу</h2>
                <button
                  className="close-button"
                  type="button"
                  onClick={() => setOrderOpen(false)}
                >
                  ×
                </button>
              </div>

              <p className="order-total">
                Төлем сомасы: <strong>{formatPrice(cartTotal)}</strong>
              </p>

              <form onSubmit={submitOrder} className="order-form">
                <label htmlFor="customer-name">Аты-жөніңіз</label>
                <input
                  id="customer-name"
                  type="text"
                  placeholder="Мысалы, Әмір Жұмабек"
                  value={customer.name}
                  onChange={(event) =>
                    setCustomer({
                      ...customer,
                      name: event.target.value,
                    })
                  }
                  required
                  minLength={2}
                />

                <label htmlFor="customer-phone">Телефон нөмірі</label>
                <input
                  id="customer-phone"
                  type="tel"
                  placeholder="+7 700 000 00 00"
                  value={customer.phone}
                  onChange={(event) =>
                    setCustomer({
                      ...customer,
                      phone: event.target.value,
                    })
                  }
                  required
                  pattern="[+]?[0-9 ()-]{10,20}"
                  title="Телефон нөмірін дұрыс енгізіңіз"
                />

                <label htmlFor="customer-address">Жеткізу мекенжайы</label>
                <textarea
                  id="customer-address"
                  placeholder="Қала, көше, үй нөмірі"
                  value={customer.address}
                  onChange={(event) =>
                    setCustomer({
                      ...customer,
                      address: event.target.value,
                    })
                  }
                  required
                  minLength={5}
                  rows={3}
                />

                <button className="checkout-button" type="submit">
                  Тапсырысты растау
                </button>
              </form>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
