import { useState, useRef, useEffect, useCallback } from "react";
import PRODUCTS from "./products";
import "./App.css";

// ── System Prompt ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are ARIA — a luxury AI shopping concierge for a premium floral-themed marketplace. You are elegant, warm, and precise.

PRODUCT CATALOG:
${JSON.stringify(PRODUCTS, null, 2)}

YOUR CAPABILITIES:
1. RECOMMENDATIONS — Suggest products by need, budget, or preference
2. COMPARISONS — Compare products side-by-side clearly
3. STOCK CHECKS — Check availability (stock: 0 = out of stock, suggest alternatives)
4. PRICE FILTERING — Filter by budget
5. CATEGORY BROWSING — Headphones, Smartphones, Laptops, TVs, Home, Cameras, Gaming

RESPONSE RULES:
- Be concise and elegant — never verbose
- Always mention price and stock status when recommending
- Format: **Product Name** — $price | ⭐rating | In Stock or Out of Stock
- If out of stock, always suggest an alternative
- End with a gentle follow-up question
- Never invent products outside the catalog
- Keep replies under 200 words unless doing a detailed comparison`;

const SUGGESTIONS = [
  "Best headphones under $300",
  "Compare iPhone 16 vs Galaxy S25",
  "Show me all gaming products",
  "What's in stock under $500?",
  "Best laptop for video editing",
  "Top rated Sony products",
];

const CATEGORIES = ["All", "Headphones", "Smartphones", "Laptops", "TVs", "Home", "Cameras", "Gaming"];
const BRANDS = ["All", "Apple", "Sony", "Samsung", "Dell", "ASUS", "LG", "Google", "Bose", "Dyson", "Nintendo", "Microsoft"];

// ── Demo users ────────────────────────────────────────────────
const DEMO_USERS = [
  { email: "demo@aria.com", password: "aria123", name: "Demo User", avatar: null },
];

// ── Components ────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="typing-wrap">
      <div className="avatar-sm">🌸</div>
      <div className="typing-bubble">
        <span /><span /><span />
      </div>
    </div>
  );
}

function StockBadge({ stock }) {
  return stock > 0
    ? <span className="badge in-stock">{stock} in stock</span>
    : <span className="badge out-stock">Out of stock</span>;
}

function ProductCard({ product, onAddToCart, onWishlist, isWishlisted, onOpenDetail }) {
  return (
    <div className="product-card" onClick={() => onOpenDetail(product)}>
      <div className="product-emoji">{product.image}</div>
      <div className="product-body">
        <div className="product-name">{product.name}</div>
        <div className="product-brand">{product.brand} · {product.category}</div>
        <div className="product-row">
          <span className="product-price">${product.price.toLocaleString()}</span>
          <span className="product-rating">⭐ {product.rating}</span>
          <StockBadge stock={product.stock} />
        </div>
        <div className="product-tags">
          {product.features.slice(0, 3).map((f, i) => (
            <span key={i} className="tag">{f}</span>
          ))}
        </div>
      </div>
      <div className="product-actions" onClick={e => e.stopPropagation()}>
        {product.stock > 0 && (
          <button className="add-btn" onClick={() => onAddToCart(product)}>+ Cart</button>
        )}
        <button
          className={`heart-btn ${isWishlisted ? "wishlisted" : ""}`}
          onClick={() => onWishlist(product)}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
      </div>
    </div>
  );
}

function ChatMessage({ msg, onAddToCart, onWishlist, wishlist, onOpenDetail }) {
  const isUser = msg.role === "user";
  return (
    <div className={`msg-row ${isUser ? "msg-user" : "msg-assistant"}`}>
      {!isUser && <div className="avatar">🌸</div>}
      <div className="msg-content">
        <div className={`bubble ${isUser ? "bubble-user" : "bubble-bot"}`}>
          {msg.text}
        </div>
        {msg.products?.length > 0 && (
          <div className="product-list">
            {msg.products.map((p) => (
              <ProductCard
                key={p.id} product={p}
                onAddToCart={onAddToCart}
                onWishlist={onWishlist}
                isWishlisted={wishlist.some(w => w.id === p.id)}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductDetailModal({ product, onClose, onAddToCart, onWishlist, isWishlisted }) {
  if (!product) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-emoji">{product.image}</div>
        <div className="modal-name">{product.name}</div>
        <div className="modal-brand">{product.brand} · {product.category}</div>
        <div className="modal-price">${product.price.toLocaleString()}</div>

        <div className="modal-section-title">Details</div>
        <div className="modal-row"><span>Rating</span><span>⭐ {product.rating} / 5.0</span></div>
        <div className="modal-row"><span>Availability</span><span>{product.stock > 0 ? `✅ ${product.stock} in stock` : "❌ Out of stock"}</span></div>
        <div className="modal-row"><span>Brand</span><span>{product.brand}</span></div>
        <div className="modal-row"><span>Category</span><span>{product.category}</span></div>
        <div className="modal-row"><span>Color</span><span>{product.color || "—"}</span></div>

        <div className="modal-section-title">Features</div>
        <div className="modal-features">
          {product.features.map((f, i) => (
            <span key={i} className="modal-feature">{f}</span>
          ))}
        </div>

        <div className="modal-actions">
          {product.stock > 0 && (
            <button className="modal-add-btn" onClick={() => { onAddToCart(product); onClose(); }}>
              Add to Cart
            </button>
          )}
          <button
            className={`modal-wish-btn ${isWishlisted ? "wishlisted" : ""}`}
            onClick={() => onWishlist(product)}
          >
            {isWishlisted ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartPanel({ cart, onClose, onRemove, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return (
    <div className="cart-panel">
      <div className="cart-header">
        <span>🛒 Your Cart</span>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      {cart.length === 0 ? (
        <div className="cart-empty">Your cart is empty</div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <span className="cart-emoji">{item.image}</span>
                <div className="cart-info">
                  <div className="cart-name">{item.name}</div>
                  <div className="cart-price">${item.price.toLocaleString()} × {item.qty}</div>
                </div>
                <button className="remove-btn" onClick={() => onRemove(item.id)}>✕</button>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <div className="cart-total">Total: <strong>${total.toLocaleString()}</strong></div>
            <button className="checkout-btn" onClick={onCheckout}>Checkout →</button>
          </div>
        </>
      )}
    </div>
  );
}

function WishlistPanel({ wishlist, onClose, onRemove, onAddToCart }) {
  return (
    <div className="wishlist-panel">
      <div className="cart-header">
        <span>♥ Wishlist</span>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      {wishlist.length === 0 ? (
        <div className="cart-empty">No saved items yet</div>
      ) : (
        <div className="cart-items">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-item">
              <span className="cart-emoji">{item.image}</span>
              <div className="cart-info">
                <div className="cart-name">{item.name}</div>
                <div className="cart-price">${item.price.toLocaleString()}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {item.stock > 0 && (
                  <button className="add-btn" style={{ fontSize: 11, padding: "4px 8px" }}
                    onClick={() => onAddToCart(item)}>+ Cart</button>
                )}
                <button className="remove-btn" onClick={() => onRemove(item.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersPanel({ orders, onClose }) {
  return (
    <div className="orders-panel">
      <div className="cart-header">
        <span>📋 Order History</span>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      {orders.length === 0 ? (
        <div className="cart-empty">No orders yet</div>
      ) : (
        <div className="cart-items">
          {orders.map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-id">Order #{order.id}</div>
              <div className="order-date">{order.date}</div>
              <div className="order-products">
                {order.items.map(i => i.name).join(", ")}
              </div>
              <div className="order-total">${order.total.toLocaleString()}</div>
              <span className="order-status">✓ Delivered</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSidebar({ filters, setFilters, onClear }) {
  return (
    <div className="sidebar">
      <div className="sidebar-title">🌸 Filters</div>

      <div className="filter-section">
        <span className="filter-label">Category</span>
        <div className="filter-options">
          {CATEGORIES.map(cat => (
            <label key={cat} className={`filter-option ${filters.category === cat ? "active" : ""}`}>
              <input type="radio" name="category" checked={filters.category === cat}
                onChange={() => setFilters(f => ({ ...f, category: cat }))} />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <span className="filter-label">Brand</span>
        <div className="filter-options">
          {BRANDS.map(brand => (
            <label key={brand} className={`filter-option ${filters.brand === brand ? "active" : ""}`}>
              <input type="radio" name="brand" checked={filters.brand === brand}
                onChange={() => setFilters(f => ({ ...f, brand: brand }))} />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <span className="filter-label">Price Range</span>
        <div className="price-range">
          <div className="price-inputs">
            <input className="price-input" type="number" placeholder="Min $"
              value={filters.minPrice}
              onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
            <input className="price-input" type="number" placeholder="Max $"
              value={filters.maxPrice}
              onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <label className={`filter-option ${filters.inStockOnly ? "active" : ""}`}>
          <input type="checkbox" checked={filters.inStockOnly}
            onChange={e => setFilters(f => ({ ...f, inStockOnly: e.target.checked }))} />
          In Stock Only
        </label>
      </div>

      <button className="filter-clear" onClick={onClear}>✕ Clear Filters</button>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const fileRef = useRef(null);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (isRegister) {
      if (!name) { setError("Please enter your name."); return; }
      onLogin({ email, name, avatar });
    } else {
      const user = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (!user) { setError("Invalid email or password. Try demo@aria.com / aria123"); return; }
      onLogin({ ...user, avatar: avatar || user.avatar });
    }
  };

  return (
    <div className="login-page">
      <div className="petal petal-1" />
      <div className="petal petal-2" />
      <div className="login-card">
        <div className="login-logo">
          <div className="login-icon">🌸</div>
          <div className="login-title">ARIA</div>
          <div className="login-sub">Luxury Shopping Concierge</div>
        </div>

        <div className="avatar-upload" onClick={() => fileRef.current.click()}>
          <div className="avatar-preview">
            {avatar ? <img src={avatar} alt="avatar" /> : "👤"}
          </div>
          <span className="avatar-label">Upload Photo (optional)</span>
          <input ref={fileRef} type="file" accept="image/*"
            style={{ display: "none" }} onChange={handleAvatar} />
        </div>

        <div className="login-form">
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" placeholder="Your name"
                value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@email.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button className="login-btn" onClick={handleSubmit}>
            {isRegister ? "Create Account →" : "Sign In →"}
          </button>
        </div>
        <div className="login-hint">
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => { setIsRegister(!isRegister); setError(""); }}>
            {isRegister ? "Sign In" : "Register"}
          </span>
        </div>
        {!isRegister && (
          <div className="login-hint">Demo: demo@aria.com / aria123</div>
        )}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([{
    role: "assistant",
    text: "Welcome to ARIA 🌸\n\nI'm your personal luxury shopping concierge. I can help you discover products, compare features, check availability, and find exactly what you're looking for.\n\nHow may I assist you today?",
    products: [],
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: "All", brand: "All", minPrice: "", maxPrice: "", inStockOnly: false
  });
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.find(i => i.id === product.id);
      return exists ? prev.filter(i => i.id !== product.id) : [...prev, product];
    });
  }, []);

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order = {
      id: Date.now().toString().slice(-6),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      items: [...cart],
      total,
    };
    setOrders(prev => [order, ...prev]);
    setCart([]);
    setCartOpen(false);
    alert(`✅ Order #${order.id} placed successfully! Total: $${total.toLocaleString()}`);
  }, [cart]);

  const clearFilters = () => setFilters({ category: "All", brand: "All", minPrice: "", maxPrice: "", inStockOnly: false });

  const detectProducts = (text) => {
    return PRODUCTS.filter(p =>
      text.toLowerCase().includes(p.name.toLowerCase()) ||
      text.toLowerCase().includes(p.name.split(" ").slice(0, 2).join(" ").toLowerCase())
    ).slice(0, 4);
  };

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");
    setError("");
    const userMsg = { role: "user", text: userText, products: [] };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.text }));
      const res = await fetch("https://aria-gemini-production.up.railway.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, message: userText, systemPrompt: SYSTEM_PROMPT }),
      });
      const data = await res.json();
      if (data.error) { setError("⚠️ " + data.error); setLoading(false); return; }
      const replyText = data.text || "I couldn't process that. Please try again.";
      const mentionedProducts = detectProducts(replyText);
      setMessages(prev => [...prev, { role: "assistant", text: replyText, products: mentionedProducts }]);
    } catch (err) {
      setError("⚠️ Could not reach the server. Make sure it's running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (!user) return <LoginPage onLogin={setUser} />;

  return (
    <div className="app">
      <div className="petal petal-1" />
      <div className="petal petal-2" />
      <div className="petal petal-3" />

      {/* Header */}
      <header className="header">
        <div className="hd-left">
          <div className="logo-orb">🌸</div>
          <div>
            <div className="logo-name">ARIA</div>
            <div className="logo-sub">Luxury Concierge · Powered by Groq</div>
          </div>
        </div>
        <div className="hd-right">
          <span className="online-dot"><span />ONLINE</span>
          <button className="wishlist-btn" onClick={() => { setWishlistOpen(o => !o); setCartOpen(false); setOrdersOpen(false); }}>
            {wishlist.length > 0 ? "♥" : "♡"}
          </button>
          <button className="cart-btn" onClick={() => { setCartOpen(o => !o); setWishlistOpen(false); setOrdersOpen(false); }}>
            🛒{cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
          <button className="logout-btn" onClick={() => { setOrdersOpen(o => !o); setCartOpen(false); setWishlistOpen(false); }}>
            📋 Orders
          </button>
          <div className="user-avatar" title={user.name}>
            {user.avatar ? <img src={user.avatar} alt="avatar" /> : "👤"}
          </div>
          <button className="logout-btn" onClick={() => setUser(null)}>Sign Out</button>
        </div>
      </header>

      {/* Panels */}
      {cartOpen && <CartPanel cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onCheckout={handleCheckout} />}
      {wishlistOpen && <WishlistPanel wishlist={wishlist} onClose={() => setWishlistOpen(false)} onRemove={toggleWishlist} onAddToCart={addToCart} />}
      {ordersOpen && <OrdersPanel orders={orders} onClose={() => setOrdersOpen(false)} />}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onWishlist={toggleWishlist}
          isWishlisted={wishlist.some(w => w.id === selectedProduct.id)}
        />
      )}

      {/* Main Layout */}
      <div className="main-layout">
        <FilterSidebar filters={filters} setFilters={setFilters} onClear={clearFilters} />

        <main className="chat">
          {messages.length === 1 && (
            <div className="suggestions fade-in">
              <div className="sug-label">🌸 Try asking</div>
              <div className="sug-grid">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} className="sug-btn" onClick={() => sendMessage(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage key={i} msg={msg} onAddToCart={addToCart}
              onWishlist={toggleWishlist} wishlist={wishlist}
              onOpenDetail={setSelectedProduct} />
          ))}

          {loading && <TypingDots />}
          {error && <div className="error-msg">{error}</div>}
          <div ref={bottomRef} />
        </main>
      </div>

      {/* Input */}
      <footer className="input-footer">
        <div className="input-wrap">
          <div className="input-box">
            <textarea rows={1} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about products, compare features, check stock..." />
          </div>
          <button
            className={`send-btn ${input.trim() && !loading ? "send-active" : ""}`}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
          >➤</button>
        </div>
        <div className="footer-note">
          ARIA · Floral Luxury Edition · Powered by Groq AI
        </div>
      </footer>
    </div>
  );
}