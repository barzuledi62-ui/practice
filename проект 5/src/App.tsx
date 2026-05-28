import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  User as UserIcon, 
  Trash2, 
  Plus, 
  Minus, 
  X, 
  Check, 
  Sparkles, 
  PlusCircle, 
  ClipboardList, 
  HelpCircle, 
  Info,
  Package,
  Clock,
  MapPin,
  Phone,
  Mail,
  Search,
  Tag
} from 'lucide-react';
import { User, Perfume, CartItem, Order } from './types';
import { PERFUMES } from './data';
import AuthModal from './components/AuthModal';

export default function App() {
  // Стейты авторизации
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Стейты каталога
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Корзина
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Заказы
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCabinetOpen, setIsCabinetOpen] = useState(false);

  // Модальные окна
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAddPerfumeOpen, setIsAddPerfumeOpen] = useState(false);

  // Новый парфюм
  const [newPerfumeName, setNewPerfumeName] = useState('');
  const [newPerfumeBrand, setNewPerfumeBrand] = useState('');
  const [newPerfumePrice, setNewPerfumePrice] = useState('');
  const [newPerfumeCategory, setNewPerfumeCategory] = useState<'floral' | 'woody' | 'citrus' | 'fresh' | 'oriental'>('floral');
  const [newPerfumeVolume, setNewPerfumeVolume] = useState('100ml');
  const [newPerfumeDescription, setNewPerfumeDescription] = useState('');
  const [newPerfumeImage, setNewPerfumeImage] = useState('');

  // Уведомление
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Доставка
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  // Загрузка данных
  useEffect(() => {
    const savedUser = localStorage.getItem('aroma_current_user');
    if (savedUser) {
      const userObj = JSON.parse(savedUser) as User;
      setCurrentUser(userObj);
      setShippingName(userObj.name);
      setShippingPhone(userObj.phone || '');
      setShippingAddress(userObj.address || '');
    }

    const savedPerfumes = localStorage.getItem('aroma_perfumes_list');
    if (savedPerfumes) {
      setPerfumes(JSON.parse(savedPerfumes));
    } else {
      setPerfumes(PERFUMES);
      localStorage.setItem('aroma_perfumes_list', JSON.stringify(PERFUMES));
    }

    const savedOrders = localStorage.getItem('aroma_orders_list');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const initialOrders: Order[] = [
        {
          id: 'ORD-5819',
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              perfume: PERFUMES[0],
              quantity: 2
            }
          ],
          total: 4800,
          status: 'delivered',
          shippingName: 'Alex Luxe',
          shippingPhone: '+380 99 123 4567',
          shippingAddress: 'Kyiv, Khreshchatyk St 12, apt 44',
          paymentMethod: 'Upon Delivery'
        }
      ];
      setOrders(initialOrders);
      localStorage.setItem('aroma_orders_list', JSON.stringify(initialOrders));
    }

    const savedCart = localStorage.getItem('aroma_temp_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Сохранение корзины
  useEffect(() => {
    localStorage.setItem('aroma_temp_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Поля доставки
  useEffect(() => {
    if (currentUser) {
      setShippingName(currentUser.name);
      setShippingPhone(currentUser.phone || '');
      setShippingAddress(currentUser.address || '');
    } else {
      setShippingName('');
      setShippingPhone('');
      setShippingAddress('');
    }
  }, [currentUser]);

  // Уведомления
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Авторизация
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('aroma_current_user');
    setCurrentUser(null);
    setIsCabinetOpen(false);
    showToast('You have successfully logged out.');
  };

  // Корзина
  const handleAddToCart = (perfume: Perfume) => {
    const existing = cartItems.find(item => item.perfume.id === perfume.id);
    if (existing) {
      setCartItems(cartItems.map(item => 
          item.perfume.id === perfume.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
      ));
    } else {
      setCartItems([...cartItems, { perfume, quantity: 1 }]);
    }
    showToast(`"${perfume.name}" added to cart!`);
  };

  const updateQuantity = (id: string, change: number) => {
    const updated = cartItems.map(item => {
      if (item.perfume.id === id) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];
    setCartItems(updated);
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.perfume.id !== id));
    showToast('Item removed from cart.');
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.perfume.price * item.quantity), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Заказ
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      showToast('Your cart is empty.');
      return;
    }
    if (!shippingName || !shippingPhone || !shippingAddress) {
      showToast('Please fill in all contact details for shipping.');
      return;
    }

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      items: [...cartItems],
      total: cartTotal,
      status: 'processing',
      shippingName,
      shippingPhone,
      shippingAddress,
      paymentMethod: 'Cash on Delivery'
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('aroma_orders_list', JSON.stringify(updatedOrders));

    if (currentUser) {
      const storedUsers = localStorage.getItem('aroma_users');
      if (storedUsers) {
        const usersList: User[] = JSON.parse(storedUsers);
        const updatedUsers = usersList.map(u => {
          if (u.id === currentUser.id) {
            const newTotal = u.totalSpent + cartTotal;
            let status = u.loyaltyStatus;
            if (newTotal > 15000) status = 'Platinum';
            else if (newTotal > 8000) status = 'Gold';
            else if (newTotal > 3000) status = 'Silver';

            const updatedUser: User = {
              ...u,
              totalSpent: newTotal,
              loyaltyStatus: status
            };
            localStorage.setItem('aroma_current_user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
            return updatedUser;
          }
          return u;
        });
        localStorage.setItem('aroma_users', JSON.stringify(updatedUsers));
      }
    }

    setCartItems([]);
    setIsCartOpen(false);
    showToast(`Order ${newOrder.id} successfully placed!`);

    setTimeout(() => {
      setIsCabinetOpen(true);
    }, 1000);
  };

  // Добавление аромата
  const handleAddPerfume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerfumeName || !newPerfumeBrand || !newPerfumePrice) {
      showToast('Пожалуйста, заполните обязательные поля');
      return;
    }

    const defaultImg = 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600';
    const newPerfumeItem: Perfume = {
      id: `custom-${Date.now()}`,
      name: newPerfumeName,
      brand: newPerfumeBrand,
      price: parseFloat(newPerfumePrice),
      image: newPerfumeImage.trim() || defaultImg,
      category: newPerfumeCategory,
      rating: 5.0,
      volume: newPerfumeVolume,
      description: newPerfumeDescription || 'Драгоценный авторский аромат, сотворенный по индивидуальному заказу в Aroma Atelier.',
      notes: {
        top: 'Особые ноты',
        heart: 'Благородный аккорд',
        base: 'Шлейфовый секрет'
      }
    };

    const updatedList = [newPerfumeItem, ...perfumes];
    setPerfumes(updatedList);
    localStorage.setItem('aroma_perfumes_list', JSON.stringify(updatedList));

    setNewPerfumeName('');
    setNewPerfumeBrand('');
    setNewPerfumePrice('');
    setNewPerfumeCategory('floral');
    setNewPerfumeVolume('100ml');
    setNewPerfumeDescription('');
    setNewPerfumeImage('');

    setIsAddPerfumeOpen(false);
    showToast(`Аромат "${newPerfumeItem.name}" успешно добавлен в бутик!`);
  };

  // Поиск и фильтрация
  const filteredPerfumes = perfumes.filter(item => {
    const matchesCategory = filteredCategory === 'all' || item.category === filteredCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const clientOrders = orders.filter(ord => {
    if (currentUser) {
      return ord.shippingName.toLowerCase() === currentUser.name.toLowerCase() || 
             ord.shippingPhone === currentUser.phone;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* --- TOAST ALERTS --- */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[2000] bg-slate-900 border border-[#d8edf1] text-white font-semibold py-3 px-6 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#d8edf1] animate-pulse" />
            <span className="text-sm tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Шапка */}
      <header className="header" id="header-section">
        <div className="logo cursor-pointer" id="header-logo" onClick={() => { setFilteredCategory('all'); setSearchQuery(''); }}>
        </div>

        <nav className="links">
          <a href="#about" onClick={(e) => { e.preventDefault(); setIsAboutOpen(true); }}>about</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }}>contact</a>
          <a href="https://instagram.com/Borzoyfn" target="_blank" rel="noreferrer">instagram</a>
          
          <a 
            href="#cart" 
            onClick={(e) => { e.preventDefault(); setIsCartOpen(true); }}
            className="relative font-semibold text-black hover:opacity-80 flex items-center gap-1.5 transition-colors"
            id="nav-cart-btn"
          >
            <ShoppingBag className="w-5 h-5 inline" />
            <span>cart</span>
            {cartCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-[12px] h-5 w-5 rounded-full flex items-center justify-center font-bold tracking-tighter shadow-sm animate-bounce">
                {cartCount}
              </span>
            )}
          </a>

          {currentUser && (
            <a
              href="#cabinet"
              onClick={(e) => { e.preventDefault(); setIsCabinetOpen(true); }}
              className="text-black font-bold border-b border-dashed border-black hover:opacity-80 transition-colors"
              id="nav-cabinet-link"
            >
              Cabinet ({currentUser.loyaltyStatus})
            </a>
          )}
        </nav>

        {/* Кнопка входа */}
        {currentUser ? (
          <div className="flex items-center gap-3">
            <button 
              id="header-profile-btn"
              className="login" 
              style={{ margin: '10px 10px' }}
              onClick={() => setIsCabinetOpen(true)}
            >
              {currentUser.name.split(' ')[0]}
            </button>
            <button 
              id="header-logout-btn"
              className="px-3 py-1.5 text-xs text-red-700 bg-red-100 hover:bg-red-200 border border-red-300 rounded font-semibold transition-colors uppercase tracking-wider"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            id="header-login-btn"
            className="login" 
            onClick={() => setIsAuthOpen(true)}
          >
            login
          </button>
        )}
      </header>

      <main>
        {/* Бокова панель */}
        <aside className="sidebar">
          <nav className="info">
            <a href="#about" onClick={(e) => { e.preventDefault(); setIsAboutOpen(true); }}>about</a>
            <a href="#help" onClick={(e) => { e.preventDefault(); setIsHelpOpen(true); }}>help</a>
          </nav>

          {currentUser && (
            <div className="mx-4 mt-auto mb-20 p-3 rounded-lg bg-black/30 border border-white/10 text-white text-xs">
              <p className="font-semibold text-[10px] text-[#d8edf1] uppercase tracking-widest mb-1">Your Loyalty</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">{currentUser.loyaltyStatus}</span>
                <span className="text-[10px] text-slate-300">Spent: {currentUser.totalSpent} UAH</span>
              </div>
              <div className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-[#d8edf1]" 
                  style={{ width: `${Math.min(100, (currentUser.totalSpent / 15000) * 100)}%` }} 
                />
              </div>
            </div>
          )}
        </aside>

        {/* Контен область */}
        <section className="content flex-1 pr-6 pb-12">
          
          <div className="ml-[250px] mr-4 mb-6 mt-2 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
            
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                id="catalog-search-bar"
                type="text"
                placeholder="Search exquisite fragrances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 text-white placeholder-slate-400 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#d8edf1] border border-white/10 transition-all font-light"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Фильтри */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'floral', label: 'Floral' },
                { key: 'woody', label: 'Woody' },
                { key: 'citrus', label: 'Citrus' },
                { key: 'fresh', label: 'Fresh' },
                { key: 'oriental', label: 'Oriental' }
              ].map((category) => (
                <button
                  id={`cat-pill-${category.key}`}
                  key={category.key}
                  onClick={() => setFilteredCategory(category.key)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all border ${
                    filteredCategory === category.key
                      ? 'bg-[#d8edf1] text-black border-[#d8edf1]'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Каталог */}
          <div className="container" id="perfume-grid-container">
            {filteredPerfumes.length === 0 ? (
              <div className="w-full text-center py-20 text-white/50">
                <p className="text-xl">No fragrances found matching these criteria.</p>
                <button 
                  className="mt-4 px-4 py-2 bg-[#d8edf1] text-black rounded font-bold hover:bg-[#b0dfe5] transition-colors"
                  onClick={() => { setFilteredCategory('all'); setSearchQuery(''); }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredPerfumes.map((perfume) => (
                <div className="card shadow-2xl relative group" key={perfume.id}>
                  
                  <span className="absolute top-3 left-3 bg-black/70 text-[#d8edf1] text-[9px] uppercase tracking-widest font-mono px-1.5 py-0.5 rounded border border-white/10 z-10">
                    {perfume.volume}
                  </span>

                  <img 
                    src={perfume.image} 
                    alt={perfume.name} 
                    referrerPolicy="no-referrer"
                    className="transition-transform duration-500 hover:scale-105"
                  />
                  
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#555] block mb-1">
                    {perfume.brand}
                  </span>

                  <h3 className="line-clamp-1">{perfume.name}</h3>
                  <p className="font-bold">{perfume.price} UAH</p>
                  
                  <span className="text-[11px] text-slate-500 italic block mb-3 line-clamp-2 max-w-[180px] leading-snug">
                    {perfume.description}
                  </span>

                  {/* Кнопка купить */}
                  <button 
                    id={`buy-button-${perfume.id}`}
                    onClick={() => handleAddToCart(perfume)}
                    className="buy uppercase"
                  >
                    Buy
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Подвал */}
      <footer className="footer" id="footer-section">
        <div className="footer-left">
          <h2>Good night</h2>
        </div>
        <div className="footer-center">
          <nav className="footer-links">
            <a href="#about" onClick={(e) => { e.preventDefault(); setIsAboutOpen(true); }}>about</a>
            <a href="#help" onClick={(e) => { e.preventDefault(); setIsHelpOpen(true); }}>help</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); showToast("You can direct message us on Instagram or call 0-800-AROMA (276-62)."); }}>contact</a>
          </nav>
        </div>
        <div className="footer-right">
          <p>B/E 2026</p>
        </div>
      </footer>

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />

      {/* Корзина */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[1500] flex justify-end">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs custom-modal-overlay"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-full max-w-md bg-[darkblue] text-white flex flex-col h-full shadow-2xl z-10 border-l border-white/10"
              id="cart-drawer-container"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/10">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#d8edf1]" />
                  <h2 className="text-xl font-extrabold tracking-tight text-white">Your Cart</h2>
                </div>
                <button 
                  id="close-cart-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-300">
                    <ShoppingBag className="w-16 h-16 text-slate-400 mb-4 animate-bounce" />
                    <p className="text-lg font-semibold">Your cart is empty</p>
                    <p className="text-xs text-slate-400 mt-1">Add luxury fragrances from our gallery to place an order</p>
                    <button 
                      className="mt-6 px-5 py-2.5 bg-[#d8edf1] hover:bg-[#b0dfe5] text-black rounded-lg text-sm font-bold transition-transform active:scale-95"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Shop Now
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div 
                      key={item.perfume.id} 
                      className="flex gap-4 p-3 bg-black/20 rounded-xl border border-white/10 shadow-xs relative"
                      id={`cart-item-${item.perfume.id}`}
                    >
                      <img 
                        src={item.perfume.image} 
                        alt={item.perfume.name} 
                        className="w-16 h-20 object-cover rounded-lg bg-black/30 border border-white/10"
                      />

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">{item.perfume.brand}</p>
                          <h4 className="font-bold text-sm text-white line-clamp-1">{item.perfume.name}</h4>
                          <p className="text-xs text-[#d8edf1] font-bold mt-0.5">{item.perfume.price} UAH</p>
                        </div>

                        <div className="flex items-center gap-3 mt-1">
                          <button
                            id={`qty-minus-${item.perfume.id}`}
                            onClick={() => updateQuantity(item.perfume.id, -1)}
                            className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                          <button
                            id={`qty-plus-${item.perfume.id}`}
                            onClick={() => updateQuantity(item.perfume.id, 1)}
                            className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <button
                        id={`remove-item-${item.perfume.id}`}
                        onClick={() => removeItem(item.perfume.id)}
                        className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-400 rounded-full hover:bg-white/10 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t border-white/10 bg-black/15 p-6 space-y-4">
                  
                  <div className="flex justify-between items-center text-white">
                    <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">Total payment:</span>
                    <span className="text-xl font-extrabold text-[#d8edf1]">{cartTotal} UAH</span>
                  </div>

                  <form onSubmit={handleCheckout} className="space-y-3 pt-3 border-t border-white/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-2">Shipping Information (Nova Poshta):</p>
                    
                    <div>
                      <input
                        id="checkout-name-input"
                        type="text"
                        placeholder="Recipient Name *"
                        required
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#d8edf1] text-white"
                      />
                    </div>

                    <div>
                      <input
                        id="checkout-phone-input"
                        type="tel"
                        placeholder="Recipient Phone *"
                        required
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value)}
                        className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#d8edf1] text-white"
                      />
                    </div>

                    <div>
                      <input
                        id="checkout-address-input"
                        type="text"
                        placeholder="Delivery Address (City, Nova Poshta Office) *"
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#d8edf1] text-white"
                      />
                    </div>

                    {!currentUser ? (
                      <div className="p-2 border border-amber-500/20 bg-amber-500/10 text-amber-200 rounded-lg text-[10px] text-center">
                        You are placing an order as a **Guest**. 
                        <button 
                          type="button"
                          className="font-bold underline ml-1 text-white hover:text-amber-100"
                          onClick={() => { setIsCartOpen(false); setIsAuthOpen(true); }}
                        >
                          Sign in to earn loyalty status tier and track orders.
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 border border-[#d8edf1]/25 bg-[#d8edf1]/15 text-white rounded-lg text-[10px] text-center">
                        With this purchase you will build your loyal tier **{currentUser.loyaltyStatus}**!
                      </div>
                    )}

                    <button
                      id="checkout-confirm-btn"
                      type="submit"
                      className="w-full bg-[#d8edf1] hover:bg-[#b0dfe5] text-black font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-98 text-xs uppercase tracking-wider"
                    >
                      Place Order
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Личный кабинет */}
      <AnimatePresence>
        {isCabinetOpen && currentUser && (
          <div className="fixed inset-0 z-[1600] flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCabinetOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xs custom-modal-overlay"
            />

            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[darkblue] border border-white/20 rounded-2xl overflow-hidden text-white shadow-2xl z-10 p-6 max-h-[90vh] flex flex-col"
              id="cabinet-modal-container"
            >
              <div className="absolute top-0 left-0 right-[#d8edf1] h-1 bg-[#d8edf1]" />

              <button 
                id="close-cabinet-btn"
                onClick={() => setIsCabinetOpen(false)}
                className="absolute top-6 right-6 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                <ClipboardList className="w-6 h-6 text-[#d8edf1]" />
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Customer Personal Cabinet</h2>
                  <p className="text-xs text-slate-300">Manage your Aroma Atelier account and your past orders history</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                    <div className="h-16 w-16 rounded-full bg-white/10 border border-[#d8edf1]/40 flex items-center justify-center font-extrabold text-2xl text-[#d8edf1] mb-2">
                      {currentUser.name[0]}
                    </div>
                    <span className="font-bold text-center">{currentUser.name}</span>
                    <span className="text-[10px] px-2 py-0.5 mt-1.5 bg-white/15 text-[#d8edf1] border border-white/10 rounded-full font-semibold uppercase tracking-widest">
                      {currentUser.loyaltyStatus} VIP
                    </span>
                  </div>

                  <div className="col-span-2 space-y-2 text-xs">
                    <p className="text-[10px] font-bold text-[#d8edf1] uppercase tracking-widest">Delivery & Contact Settings</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-300 block mb-0.5">Email Address:</span>
                        <span className="font-mono text-slate-200">{currentUser.email}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-300 block mb-0.5">Mobile Number:</span>
                        <span className="font-mono text-slate-200">{currentUser.phone || "not specified"}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-[10px] text-slate-300 block mb-0.5">Nova Poshta Delivery Address:</span>
                        <span className="text-slate-200">{currentUser.address || "not specified"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/10 pb-1">
                    <Package className="w-4 h-4 text-[#d8edf1]" />
                    <span>Your Orders History ({clientOrders.length})</span>
                  </h3>

                  {clientOrders.length === 0 ? (
                    <div className="bg-white/5 py-8 rounded-xl text-center text-slate-400 text-xs">
                      <Clock className="w-10 h-10 text-slate-500 mx-auto mb-2 animate-pulse" />
                      <p className="font-medium text-slate-300">You do not have any orders registered yet.</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">Place an order from your cart to see historical track records and updates.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {clientOrders.map((ord) => (
                        <div 
                          key={ord.id} 
                          className="bg-black/20 border border-white/10 hover:border-[#d8edf1]/20 rounded-xl p-4 text-xs space-y-2.5 transition-all"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-[#d8edf1] bg-[#d8edf1]/10 px-2.5 py-1 rounded text-xs select-all">
                                #{ord.id}
                              </span>
                              <span className="text-slate-300 text-[10px] font-light">
                                {new Date(ord.date).toLocaleDateString('en-US')} at {new Date(ord.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              ord.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              ord.status === 'shipped' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              ord.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                              'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            }`}>
                              {ord.status === 'delivered' ? 'Delivered' :
                               ord.status === 'shipped' ? 'Shipped via Nova Poshta' :
                               ord.status === 'cancelled' ? 'Cancelled' :
                               'Processing by Aroma Atelier'}
                            </span>
                          </div>

                          <ul className="space-y-1 pl-1">
                            {ord.items.map((item, idx) => (
                              <li key={idx} className="flex justify-between text-slate-200">
                                <span>
                                  • {item.perfume.name} <span className="text-slate-400 text-[10px] font-mono">({item.perfume.brand})</span> x{item.quantity}
                                </span>
                                <span className="text-slate-300">{item.perfume.price * item.quantity} UAH</span>
                              </li>
                            ))}
                          </ul>

                          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px]">
                            <div className="text-slate-300 font-light max-w-sm line-clamp-1">
                              Waybill for: <strong className="text-slate-200">{ord.shippingName}</strong>, {ord.shippingAddress}
                            </div>
                            <div className="font-extrabold text-white text-sm">
                              Payment sum: <span className="text-[#d8edf1]">{ord.total} UAH</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center bg-black/20 -mx-6 -mb-6 p-6">
                <span className="text-[10px] text-slate-400">Aroma Atelier Loyalty Program 2026. Spend &gt;3000 UAH for 3% reward, &gt;8000 UAH for 7% reward.</span>
                <button
                  id="cabinet-close-bottom-btn"
                  onClick={() => setIsCabinetOpen(false)}
                  className="px-4 py-2 bg-[#d8edf1] hover:bg-[#b0dfe5] text-black font-bold rounded-lg text-xs tracking-wider uppercase transition-colors"
                >
                  Close Cabinet
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================== */}
      {/* --- ADD NEW PERFUME MODAL (CLIENT ADMIN ACTION) --- */}
      <AnimatePresence>
        {isAddPerfumeOpen && (
          <div className="fixed inset-0 z-[1650] flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddPerfumeOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xs custom-modal-overlay"
            />

            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-lg bg-[darkblue] border border-white/20 rounded-2xl p-6 text-white shadow-2xl z-10"
              id="add-perfume-modal"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#d8edf1]" />

              <button 
                id="close-add-perfume-btn"
                onClick={() => setIsAddPerfumeOpen(false)}
                className="absolute top-6 right-6 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                <PlusCircle className="w-6 h-6 text-[#d8edf1] animate-pulse" />
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Добавить свой парфюм</h2>
                  <p className="text-xs text-slate-300">Внесите авторский аромат прямо на витрину My Logo</p>
                </div>
              </div>

              <form onSubmit={handleAddPerfume} className="space-y-4 text-xs font-semibold">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 uppercase tracking-widest mb-1">Название аромата *</label>
                    <input
                      id="input_perf_name"
                      type="text"
                      required
                      placeholder="Например: Royal Amber"
                      value={newPerfumeName}
                      onChange={(e) => setNewPerfumeName(e.target.value)}
                      className="w-full bg-black/30 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d8edf1]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 uppercase tracking-widest mb-1">Парфюмерный бренд *</label>
                    <input
                      id="input_perf_brand"
                      type="text"
                      required
                      placeholder="Например: Maison Luxury"
                      value={newPerfumeBrand}
                      onChange={(e) => setNewPerfumeBrand(e.target.value)}
                      className="w-full bg-black/30 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d8edf1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 uppercase tracking-widest mb-1">Цена (UAH) *</label>
                    <input
                      id="input_perf_price"
                      type="number"
                      required
                      min="1"
                      placeholder="2000"
                      value={newPerfumePrice}
                      onChange={(e) => setNewPerfumePrice(e.target.value)}
                      className="w-full bg-black/30 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d8edf1]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 uppercase tracking-widest mb-1">Категория *</label>
                    <select
                      id="input_perf_cat"
                      value={newPerfumeCategory}
                      onChange={(e) => setNewPerfumeCategory(e.target.value as any)}
                      className="w-full bg-black/30 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#d8edf1]"
                    >
                      <option value="floral" className="bg-[darkblue] text-[#d8edf1]">Цветочные</option>
                      <option value="woody" className="bg-[darkblue] text-[#d8edf1]">Древесные</option>
                      <option value="citrus" className="bg-[darkblue] text-[#d8edf1]">Цитрусовые</option>
                      <option value="fresh" className="bg-[darkblue] text-[#d8edf1]">Свежие</option>
                      <option value="oriental" className="bg-[darkblue] text-[#d8edf1]">Восточные</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 uppercase tracking-widest mb-1">Объем флакона</label>
                    <input
                      id="input_perf_vol"
                      type="text"
                      placeholder="100ml"
                      value={newPerfumeVolume}
                      onChange={(e) => setNewPerfumeVolume(e.target.value)}
                      className="w-full bg-black/30 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d8edf1]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 uppercase tracking-widest mb-1">Ссылка на фото парфюма</label>
                  <input
                    id="input_perf_img"
                    type="url"
                    placeholder="https://images.unsplash.com/your-image"
                    value={newPerfumeImage}
                    onChange={(e) => setNewPerfumeImage(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d8edf1]"
                  />
                  <span className="text-[10px] text-slate-400 tracking-wide font-light block mt-1">Оставьте пустым для использования стандартного роскошного изображения флакона.</span>
                </div>

                <div>
                  <label className="block text-slate-300 uppercase tracking-widest mb-1">Описание нот и аромата</label>
                  <textarea
                    id="input_perf_desc"
                    placeholder="Опишите верхние, средние и базовые ноты, стойкость и шлейф..."
                    rows={3}
                    value={newPerfumeDescription}
                    onChange={(e) => setNewPerfumeDescription(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d8edf1] text-xs font-normal"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddPerfumeOpen(false)}
                    className="px-4 py-2 hover:bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300"
                  >
                    Отмена
                  </button>
                  <button
                    id="submit-perfume-btn"
                    type="submit"
                    className="px-5 py-2 bg-[#d8edf1] hover:bg-[#b0dfe5] text-black font-bold rounded-lg text-xs"
                  >
                    Внедрить на витрину
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* О нас */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-[1600] flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xs custom-modal-overlay"
            />

            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-md bg-[darkblue] border border-white/20 rounded-2xl p-6 text-white shadow-2xl z-10"
              id="about-modal"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#d8edf1]" />
              
              <button 
                id="close-about-btn"
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-6 right-6 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <Info className="w-6 h-6 text-[#d8edf1]" />
                <h2 className="text-xl font-bold tracking-tight">About Aroma Atelier</h2>
              </div>

              <div className="space-y-3 text-xs leading-relaxed font-light text-slate-300">
                <p>
                  Welcome to <strong>Aroma Atelier</strong> — a premium boutique of selective and bespoke perfumery, founded in 2026. 
                </p>
                <p>
                  Each fragrance in our collection is an exquisite work of art, curated by elite perfumers of Grasse and Milan on bases of rare organic oils, precious grey amber, Sicilian citrus essences, and freshly cut May roses. 
                </p>
                <p>
                  We pride ourselves on offering more than just scents — we provide sensory keys to your brightest memories, underscoring your noble style and personal brand. Experience an unforgettable sillage.
                </p>
              </div>

              <button
                type="button"
                className="w-full mt-6 py-2.5 bg-[#d8edf1] hover:bg-[#b0dfe5] text-black font-bold rounded-lg text-xs"
                onClick={() => setIsAboutOpen(false)}
              >
                Back to Boutique
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Помощь */}
      <AnimatePresence>
        {isHelpOpen && (
          <div className="fixed inset-0 z-[1600] flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHelpOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xs custom-modal-overlay"
            />

            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-md bg-[darkblue] border border-white/20 rounded-2xl p-6 text-white shadow-2xl z-10"
              id="help-modal"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#d8edf1]" />
              
              <button 
                id="close-help-btn"
                onClick={() => setIsHelpOpen(false)}
                className="absolute top-6 right-6 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <HelpCircle className="w-6 h-6 text-[#d8edf1]" />
                <h2 className="text-xl font-bold tracking-tight">Shopping Guide</h2>
              </div>

              <div className="space-y-4 text-xs font-light text-slate-300">
                <div>
                  <h4 className="font-bold text-[#d8edf1] uppercase tracking-widest text-[10px] mb-1">Cart & Purchase:</h4>
                  <p>Simply click the <strong>"Buy"</strong> button on any fragrance card. Access your <strong>"cart"</strong> from the top and right navigation bars to review items, adjust volumes, fill in shipping info, and finalize your order seamlessly.</p>
                </div>

                <div>
                  <h4 className="font-bold text-[#d8edf1] uppercase tracking-widest text-[10px] mb-1">Personal Account:</h4>
                  <p>Click the <strong>"login"</strong> button in the header to enter your account (or use quick automated Demo sign-in). This lets you track deliveries live and build your cumulative VIP prestige tier rewards.</p>
                </div>
              </div>

              <button
                type="button"
                className="w-full mt-6 py-2.5 bg-[#d8edf1] hover:bg-[#b0dfe5] text-black font-bold rounded-lg text-xs"
                onClick={() => setIsHelpOpen(false)}
              >
                I Understand
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Контакты */}
      <AnimatePresence>
        {isContactOpen && (
          <div className="fixed inset-0 z-[1601] flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xs custom-modal-overlay"
            />

            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-md bg-[darkblue] border border-white/20 rounded-2xl p-6 text-white shadow-2xl z-10"
              id="contact-modal"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#d8edf1]" />
              
              <button 
                id="close-contact-btn"
                onClick={() => setIsContactOpen(false)}
                className="absolute top-6 right-6 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <h2 className="text-xl font-bold tracking-tight">Contact</h2>
              </div>

              <div className="space-y-4 text-xs font-light text-slate-300 py-6 text-center border border-dashed border-white/10 rounded-xl bg-black/20">
                <p className="px-4 text-slate-400">
                  This contact window is ready. You can easily insert any forms, links, maps, or contact information later.
                </p>
              </div>

              <button
                type="button"
                className="w-full mt-6 py-2.5 bg-[#d8edf1] hover:bg-[#b0dfe5] text-black font-bold rounded-lg text-xs"
                onClick={() => setIsContactOpen(false)}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
