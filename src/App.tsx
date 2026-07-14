import React, { useState, useEffect } from 'react';
import {
  Menu as MenuIcon,
  Phone,
  MapPin,
  Clock,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  X,
  Utensils,
  Check,
  Truck,
  Tag,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Award,
  ArrowRight,
  Info,
  ChevronRight
} from 'lucide-react';
import { MENU_ITEMS, MEATS, STYLES, GALLERY_IMAGES } from './data';
import { getDemoBySlug, type DemoConfig, type LeadRestaurantDemoConfig } from './data/demos';
import LeadRestaurantDemo from './LeadRestaurantDemo';
import { MenuItem, CartItem, CustomizationOptions, Order } from './types';

const getCurrentSlug = () => window.location.pathname.replace(/^\/+|\/+$/g, '');

function PreviewHome() {
  return (
    <main className="min-h-screen bg-[#fcf9f4] text-[#1c1c19] flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-4">
        <p className="text-xs font-black tracking-[0.18em] uppercase text-[#9e0027]">Joren Studio</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Preview</h1>
        <p className="text-gray-600 font-medium">Private demo links are shared directly with each client.</p>
      </div>
    </main>
  );
}

function DemoNotFound() {
  return (
    <main className="min-h-screen bg-[#fcf9f4] text-[#1c1c19] flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-4">
        <p className="text-xs font-black tracking-[0.18em] uppercase text-[#9e0027]">404</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Demo not found</h1>
        <p className="text-gray-600 font-medium">Check the preview link and try again.</p>
      </div>
    </main>
  );
}

export default function App() {
  const slug = getCurrentSlug();

  if (!slug) {
    return <PreviewHome />;
  }

  const demo = getDemoBySlug(slug);

  if (!demo || demo.type !== 'restaurant') {
    return <DemoNotFound />;
  }

  if ('template' in demo && demo.template === 'lead-restaurant') {
    return <LeadRestaurantDemo demo={demo as LeadRestaurantDemoConfig} />;
  }

  return <RestaurantDemo demo={demo} />;
}

function RestaurantDemo({ demo }: { demo: DemoConfig }) {
const phoneHref = `tel:${demo.phone.replace(/\D/g, '')}`;
const cartStorageKey = `${demo.slug}_cart`;
const ordersStorageKey = `${demo.slug}_orders`;

// Navigation / UI states
  const [activeTab, setActiveTab] = useState<'all' | 'tacos' | 'burritos' | 'mains' | 'drinks'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Customization Options states
  const [selectedMeat, setSelectedMeat] = useState<string>('asada');
  const [selectedStyle, setSelectedStyle] = useState<string>('street');
  const [extras, setExtras] = useState({
    guacamole: false,
    sourCream: false,
    extraCheese: false,
    grilledJalapeno: false,
  });
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Order / Cart states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [serviceType, setServiceType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Active / History Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [showOrderTracker, setShowOrderTracker] = useState(false);

  // Gallery active index state
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Load cart and orders from LocalStorage on mount
  useEffect(() => {
const savedCart = localStorage.getItem(cartStorageKey);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }

const savedOrders = localStorage.getItem(ordersStorageKey);
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders) as Order[];
        setOrders(parsedOrders);
        // Find the most recent order that isn't fully completed yet to display in tracker
        const ongoing = parsedOrders.find(o => o.status !== 'completed');
        if (ongoing) {
          setActiveOrder(ongoing);
          setShowOrderTracker(true);
        }
      } catch (e) {
        console.error('Failed to parse orders');
      }
    }
}, [cartStorageKey, ordersStorageKey]);

  // Save cart to LocalStorage
  useEffect(() => {
localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}, [cart, cartStorageKey]);

  // Save orders to LocalStorage
  useEffect(() => {
localStorage.setItem(ordersStorageKey, JSON.stringify(orders));
}, [orders, ordersStorageKey]);

  // Simulate Order Progress
  useEffect(() => {
    if (!activeOrder) return;

    const interval = setInterval(() => {
      setOrders(prevOrders => {
        const updated = prevOrders.map(o => {
          if (o.id === activeOrder.id) {
            let nextStatus = o.status;
            if (o.status === 'received') nextStatus = 'preparing';
            else if (o.status === 'preparing') nextStatus = 'cooking';
            else if (o.status === 'cooking') nextStatus = 'ready';
            else if (o.status === 'ready') nextStatus = 'completed';

            const updatedOrder = { ...o, status: nextStatus };
            if (updatedOrder.id === activeOrder.id) {
              // Update active order state as well
              setTimeout(() => setActiveOrder(updatedOrder), 0);
            }
            return updatedOrder;
          }
          return o;
        });
        return updated;
      });
    }, 15000); // Progress every 15 seconds

    return () => clearInterval(interval);
  }, [activeOrder?.id]);

  // Handle speed up cooking (for fun)
  const speedUpCooking = () => {
    if (!activeOrder) return;
    setOrders(prevOrders => {
      const updated = prevOrders.map(o => {
        if (o.id === activeOrder.id) {
          let nextStatus = o.status;
          if (o.status === 'received') nextStatus = 'preparing';
          else if (o.status === 'preparing') nextStatus = 'cooking';
          else if (o.status === 'cooking') nextStatus = 'ready';
          else if (o.status === 'ready') nextStatus = 'completed';

          const updatedOrder = { ...o, status: nextStatus };
          setTimeout(() => setActiveOrder(updatedOrder), 0);
          return updatedOrder;
        }
        return o;
      });
      return updated;
    });
  };

  // Open customizer for item
  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    // Reset options
    setSelectedMeat('asada');
    setSelectedStyle('street');
    setExtras({
      guacamole: false,
      sourCream: false,
      extraCheese: false,
      grilledJalapeno: false,
    });
    setSpecialInstructions('');
    setQuantity(1);
  };

  // Calculate customized item single price
  const calculateSinglePrice = (item: MenuItem) => {
    if (!item.customizable) return item.price;
    let extraCost = 0;
    if (extras.guacamole) extraCost += 1.50;
    if (extras.sourCream) extraCost += 0.75;
    if (extras.extraCheese) extraCost += 1.00;
    if (extras.grilledJalapeno) extraCost += 0.50;
    return item.price + extraCost;
  };

  // Add customized item to cart
  const handleAddToOrder = () => {
    if (!selectedItem) return;

    const singlePrice = calculateSinglePrice(selectedItem);
    const itemTotalPrice = singlePrice * quantity;

    const customOptions: CustomizationOptions = {
      selectedMeat: selectedItem.customizable ? selectedMeat : undefined,
      selectedStyle: selectedItem.customizable ? selectedStyle : undefined,
      extras: selectedItem.customizable ? { ...extras } : { guacamole: false, sourCream: false, extraCheese: false, grilledJalapeno: false },
      specialInstructions: selectedItem.customizable ? specialInstructions : '',
    };

    // Create a unique cart item ID based on item selection and options
    const optionsHash = selectedItem.customizable
      ? `${selectedMeat}-${selectedStyle}-${Object.entries(extras).filter(([_, val]) => val).map(([key]) => key).join(',')}-${specialInstructions}`
      : 'standard';
    const cartItemId = `${selectedItem.id}-${optionsHash}`;

    // Check if duplicate already in cart
    const existingIndex = cart.findIndex(c => c.id === cartItemId);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      updatedCart[existingIndex].totalPrice += itemTotalPrice;
      setCart(updatedCart);
    } else {
      const newCartItem: CartItem = {
        id: cartItemId,
        menuItem: selectedItem,
        customization: customOptions,
        quantity,
        totalPrice: itemTotalPrice,
      };
      setCart([...cart, newCartItem]);
    }

    setSelectedItem(null);
    setIsCartOpen(true);
  };

  // Update cart item quantity
  const updateCartQuantity = (cartItemId: string, change: number) => {
    const updated = cart.map(item => {
      if (item.id === cartItemId) {
        const newQty = item.quantity + change;
        if (newQty <= 0) return null;
        
        // recalculate single item cost with its customizations
        let extraCost = 0;
        if (item.customization.extras.guacamole) extraCost += 1.50;
        if (item.customization.extras.sourCream) extraCost += 0.75;
        if (item.customization.extras.extraCheese) extraCost += 1.00;
        if (item.customization.extras.grilledJalapeno) extraCost += 0.50;
        
        const singlePrice = item.menuItem.price + extraCost;
        return {
          ...item,
          quantity: newQty,
          totalPrice: singlePrice * newQty
        };
      }
      return item;
    }).filter(Boolean) as CartItem[];
    setCart(updated);
  };

  // Apply Coupon / Promo Code
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'SALSA20') {
      setAppliedDiscount({ code: 'SALSA20', percent: 20 });
    } else if (code === 'TULSA') {
      setAppliedDiscount({ code: 'TULSA', percent: 10 });
    } else if (code === 'TACOFRESH') {
      setAppliedDiscount({ code: 'TACOFRESH', percent: 15 });
    } else {
      setPromoError('Invalid promo code. Try "SALSA20" (20% off) or "TULSA" (10% off).');
    }
    setPromoCode('');
  };

  // Remove Promo Code
  const removePromo = () => {
    setAppliedDiscount(null);
  };

  // Calculate Cart Summary
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const discountAmount = appliedDiscount ? (cartSubtotal * appliedDiscount.percent) / 100 : 0;
  const taxRate = 0.085; // 8.5%
  const calculatedTax = (cartSubtotal - discountAmount) * taxRate;
  const deliveryFee = serviceType === 'delivery' ? 3.99 : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + calculatedTax + deliveryFee);

  // Handle Checkout submission
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please fill out your name and phone number.');
      return;
    }
    if (serviceType === 'delivery' && !deliveryAddress.trim()) {
      alert('Please provide a delivery address.');
      return;
    }

    const newOrder: Order = {
      id: `ORDER-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      subtotal: cartSubtotal,
      tax: calculatedTax,
      deliveryFee,
      discount: discountAmount,
      total: cartTotal,
      status: 'received',
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      serviceType,
      address: serviceType === 'delivery' ? deliveryAddress.trim() : undefined,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    setActiveOrder(newOrder);
    setCart([]); // clear cart
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setShowOrderTracker(true);

    // Reset customer details
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryAddress('');
  };

  // Reorder a past order
  const handleReorder = (order: Order) => {
    setCart(order.items);
    setIsCartOpen(true);
  };

  // Filter and Search menu items
  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCategory = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fcf9f4] text-[#1c1c19] font-sans selection:bg-[#9e0027] selection:text-white pb-16 md:pb-0 overflow-x-hidden">
      
      {/* HEADER / TOP APP BAR */}
      <header className="bg-[#fcf9f4]/95 backdrop-blur-md border-b border-[#e5e2dd] sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-[#ffdad9] text-[#9e0027] hidden sm:block">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
<span className="text-xl md:text-2xl font-extrabold text-[#9e0027] tracking-tight">{demo.name}</span>
              <span className="text-xs block text-gray-500 font-medium -mt-1">Real Street Tacos, Made Fresh</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Call Button */}
            <a 
              className="bg-[#9e0027] text-white text-xs md:text-sm font-bold px-4 py-2.5 rounded-full hover:bg-[#A31830] transition-colors flex items-center gap-2 shadow-sm"
href={phoneHref}
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call Now</span>
            </a>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-white border border-[#e5e2dd] p-2.5 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-sm text-gray-800"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-[#9e0027]" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#006e0a] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
              {cart.length > 0 && (
                <span className="text-xs font-bold text-[#1c1c19] hidden md:inline ml-1">
                  ${cartTotal.toFixed(2)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ACTIVE ORDER TRACKER TOP BAR (IF ACTIVE) */}
        {showOrderTracker && activeOrder && (
          <div className="bg-[#E9F8E9] border-b border-[#69fd5d]/30 py-3 px-4 text-sm font-medium text-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex w-2.5 h-2.5 rounded-full bg-[#006e0a] animate-ping" />
                <span>
                  Active order <strong className="text-[#006e0a]">{activeOrder.id}</strong>: 
                  Status is <strong className="capitalize">{activeOrder.status === 'ready' ? (activeOrder.serviceType === 'pickup' ? 'Ready for Pickup!' : 'Out for Delivery!') : activeOrder.status}...</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowOrderTracker(true)} 
                  className="text-xs text-[#9e0027] font-bold underline hover:text-[#A31830]"
                >
                  View order details
                </button>
                <button 
                  onClick={() => setShowOrderTracker(false)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HERO SECTION */}
        <section className="relative pt-10 pb-16 px-4 md:px-8 bg-[#fcf9f4] overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Left */}
            <div className="space-y-6 lg:max-w-xl">
              <div className="inline-flex items-center gap-2 bg-[#ffdad9] text-[#9e0027] text-xs font-bold px-3.5 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
 <span>REAL FOOD TRUCK MENU / CALL AHEAD WELCOME</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
                {demo.heroTitle.split(', ')[0]}, <br />
                <span className="text-[#9e0027] underline decoration-[#ffe16d] decoration-4 underline-offset-4">{demo.heroTitle.split(', ')[1] ?? 'Made Fresh Daily'}</span>
              </h1>
              
              <p className="text-lg text-gray-700 font-medium leading-relaxed">
                Fresh tacos, burritos, quesadillas, Jarritos, and loaded plates served from the {demo.name} truck. Call ahead, pick up hot, and bring extra napkins.</p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="#menu" 
                  className="bg-[#9e0027] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#9e0027]/10 hover:bg-[#A31830] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  View Menu
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="#visit" 
                  className="border-2 border-[#006e0a] text-[#006e0a] px-8 py-4 rounded-full font-bold hover:bg-[#006e0a] hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  Find Us
                </a>
              </div>

              {/* Service tags */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#e5e2dd]">
                <div className="text-center md:text-left">
                  <span className="block text-xl font-bold text-[#9e0027]">Fresh</span>
                  <span className="text-xs font-medium text-gray-500">Made to order</span>
                </div>
                <div className="text-center md:text-left border-x border-[#e5e2dd] px-2">
                  <span className="block text-xl font-bold text-[#006e0a]">{demo.city}</span>
                  <span className="text-xs font-medium text-gray-500">Local Food Truck</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="block text-xl font-bold text-[#705d00]">House Salsa</span>
                  <span className="text-xs font-medium text-gray-500">Red and green</span>
                </div>
              </div>
            </div>

            {/* Hero Right: Asymmetric Collage */}
            <div className="relative grid grid-cols-6 grid-rows-6 gap-4 h-[400px] sm:h-[480px] md:h-[520px]">
              {/* Taco main close up */}
              <div className="col-span-4 row-span-3 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform duration-500 relative group">
                <img 
                  alt="Three street tacos" 
                  className="w-full h-full object-cover" 
                  src="/images/street-tacos.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-bold">Steak, Cilantro, Onion & Fresh Limes</span>
                </div>
              </div>

              {/* Soda bottle collage */}
              <div className="col-span-2 row-span-2 col-start-5 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-500">
                <img 
                  alt="Jarritos sodas" 
                  className="w-full h-full object-cover" 
                  src="/images/jarritos.jpg"
                />
              </div>

              {/* Burrito sliced collage */}
              <div className="col-span-3 row-span-3 col-start-4 row-start-3 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-500">
                <img 
                  alt="Sliced burrito" 
                  className="w-full h-full object-cover" 
                  src="/images/burrito-plate.jpg"
                />
              </div>

              {/* Food truck collage */}
              <div className="col-span-3 row-span-3 row-start-4 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-500">
                <img 
                  alt={`${demo.name} food truck`}
                  className="w-full h-full object-cover" 
                  src="/images/food-truck.jpg"
                />
              </div>
            </div>

          </div>
        </section>

        {/* POPULAR RIGHT NOW */}
        <section className="py-16 px-4 md:px-8 bg-[#f5f3ee] border-y border-[#e5e2dd]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-3">
              <div>
                <span className="text-xs font-bold text-[#9e0027] tracking-wider uppercase">Local Favorites</span>
                <h2 className="text-3xl font-extrabold text-[#1c1c19] mt-1">Popular Right Now</h2>
                <div className="h-1.5 w-20 bg-[#9e0027] mt-3 rounded-full" />
              </div>
              <p className="text-sm text-gray-500 max-w-sm">
                These are the most customized and ordered plates from the truck this week. Click on any item to build your own!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  id: 'street-taco',
                  name: 'Street Tacos',
                  sub: 'Corn tortilla / any meat',
                  price: 2.50,
                  img: '/images/street-tacos.jpg'
                },
                {
                  id: 'regular-burrito',
                  name: 'Burritos',
                  sub: 'Flour tortilla / rice / beans',
                  price: 9.50,
                  img: '/images/burrito-plate.jpg'
                },
                {
                  id: 'quesadilla',
                  name: 'Quesadillas',
                  sub: 'Toasted Flour • Melted Cheese',
                  price: 8.50,
                  img: '/images/quesadilla.jpg'
                },
                {
                  id: 'jarritos',
                  name: 'Jarritos Soda',
                  sub: 'Fruit Soda • Glass Bottle',
                  price: 2.75,
                  img: '/images/jarritos.jpg'
                },
                {
                  id: 'loaded-plates',
                  name: 'Loaded Plates',
                  sub: 'Rice • Beans • Any Meat',
                  price: 12.50,
                  img: '/images/loaded-plate.png'
                }
              ].map(pop => {
                const menuItem = MENU_ITEMS.find(m => m.id === pop.id);
                return (
                  <div 
                    key={pop.id}
                    onClick={() => menuItem && handleItemClick(menuItem)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border border-[#e5e2dd] group"
                  >
                    <div className="h-44 overflow-hidden relative">
                      <img 
                        alt={pop.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        src={pop.img}
                      />
                      <div className="absolute top-3 right-3 bg-[#ffe16d] text-[#221b00] font-black text-sm px-2.5 py-1 rounded-lg shadow-sm border border-black/5">
                        ${pop.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#1c1c19] text-base group-hover:text-[#9e0027] transition-colors">{pop.name}</h3>
                      <p className="text-xs font-semibold text-gray-500 mt-0.5">{pop.sub}</p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006e0a] mt-3">
                        <Plus className="w-3 h-3" /> Customize & Order
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* INTERACTIVE MENU SECTION */}
        <section className="py-20 bg-[#1A1A1A] text-white relative" id="menu">
          
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#ffe16d] tracking-widest uppercase">STREET-SIDE TASTE</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#9e0027] mt-1">Our Menu</h2>
              <p className="text-[#fcf9f4] opacity-80 mt-2 font-medium">Fresh Ingredients, Authentic Recipes</p>
              <div className="h-1 w-24 bg-[#9e0027] mx-auto mt-4 rounded-full" />
            </div>

            {/* Menu Filters / Search */}
            <div className="mb-10 space-y-4">
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'tacos', label: 'Street Tacos' },
                  { id: 'burritos', label: 'Gourmet Burritos' },
                  { id: 'mains', label: 'Authentic Mains' },
                  { id: 'drinks', label: 'Mexican Drinks' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#9e0027] text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/15'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search bar */}
              <div className="max-w-md mx-auto">
<input
 id="menu-search"
 name="menu-search"
type="text"
placeholder="Search our delicious items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 text-white placeholder-gray-400 text-sm px-5 py-3 rounded-full border border-white/10 focus:outline-none focus:border-[#ffe16d] focus:bg-white/15 transition-all text-center"
                />
              </div>
            </div>

            {/* Menu Grid / List */}
            <div className="space-y-8">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">No items found matching your search.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveTab('all'); }} 
                    className="mt-3 text-[#ffe16d] text-xs font-bold underline"
                  >
                    Clear Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {filteredItems.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative bg-neutral-800">
                        <img 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          src={item.image}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-2">
                          <h3 className="font-bold text-base text-white group-hover:text-[#ffe16d] transition-colors truncate">
                            {item.name}
                          </h3>
                          <span className="text-[#ffe16d] font-extrabold text-sm whitespace-nowrap">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="mt-2.5 flex items-center gap-2">
                          {item.customizable && (
                            <span className="text-[10px] font-bold bg-[#006e0a] text-white px-2 py-0.5 rounded">
                              Customize Option
                            </span>
                          )}
                          <span className="text-[10px] font-semibold text-gray-400 group-hover:text-white transition-colors">
                            + Add to Order
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Meats Banner */}
            <div className="mt-16 p-6 border-2 border-dashed border-[#9e0027]/40 rounded-2xl bg-white/5 text-center">
              <p className="text-[#ffe16d] text-xs font-bold tracking-widest uppercase mb-1">PROTEIN SELECTIONS</p>
              <p className="text-lg font-bold text-white mb-2">Available Traditional Meats</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-medium text-gray-200">
                {MEATS.map((meat, idx) => (
                  <span key={meat.id} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9e0027]" />
                    <span className="font-bold">{meat.name}</span>
                    <span className="text-gray-400 text-[10px] font-normal">({meat.tag})</span>
                  </span>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* FIND US / VISIT TRUCK */}
        <section className="py-20 px-4 md:px-8 bg-[#fcf9f4]" id="visit">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Find Us Left */}
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#006e0a] rounded-full opacity-5 z-0" />
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-[#e5e2dd] aspect-video">
                <img 
                  alt={`${demo.name} food truck outside`}
                  className="w-full h-full object-cover" 
                  src="/images/food-truck.jpg"
                />
              </div>
            </div>

            {/* Find Us Right */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#9e0027] tracking-wider uppercase">VISIT OUR TRUCK</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1c1c19] mt-1">Find Us In {demo.city}</h2>
                <p className="text-gray-600 font-medium mt-2">
                  We serve hot street tacos from the black {demo.name} truck. Look for the menu board by the window.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                
                <div className="flex gap-3">
                  <div className="p-2.5 rounded-xl bg-[#ffdad9] text-[#9e0027] h-fit">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Current Spot</h4>
                    <p className="text-sm text-gray-600 mt-1">{demo.city} (and surrounding events)</p>
                    <span className="text-[11px] font-bold text-[#006e0a] flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006e0a] animate-pulse" />
                      Parked at Peoria Ave
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2.5 rounded-xl bg-[#ffdad9] text-[#9e0027] h-fit">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Truck Hours</h4>
                    <p className="text-sm text-gray-600 mt-1">Mon - Sat: 11:00 AM - 9:00 PM</p>
                    <p className="text-sm text-gray-400 mt-0.5 font-semibold">Sunday: Closed</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2.5 rounded-xl bg-[#ffdad9] text-[#9e0027] h-fit">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Call Ahead / Catering</h4>
                    <p className="text-sm text-gray-600 mt-1">{demo.phone}</p>
                    <p className="text-xs text-[#006e0a] font-bold mt-0.5">Skip the line by ordering online!</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2.5 rounded-xl bg-[#ffdad9] text-[#9e0027] h-fit">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Established 2021</h4>
                    <p className="text-sm text-gray-600 mt-1">Serving authentic flavors daily with pure passion.</p>
                  </div>
                </div>

              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.google.com/maps/search/California+Street+Tacos+Tulsa+OK"
                  className="bg-[#9e0027] text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-[#A31830] transition-colors flex items-center gap-2 text-sm"
                >
                  Get Directions
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* RECENT OR PAST ORDERS HISTORY SECTION (LOCAL STORAGE) */}
        {orders.length > 0 && (
          <section className="py-16 px-4 md:px-8 bg-[#f5f3ee] border-t border-[#e5e2dd]">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="text-[#9e0027] w-5 h-5" />
                <h3 className="text-2xl font-extrabold text-[#1c1c19]">Your Orders History</h3>
              </div>

              <div className="space-y-4">
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="bg-white rounded-xl p-5 border border-[#e5e2dd] shadow-sm flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#9e0027]">{order.id}</span>
                        <span className="text-xs text-gray-400 font-semibold">{order.createdAt}</span>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          order.status === 'completed' ? 'bg-[#E9F8E9] text-[#006e0a]' :
                          order.status === 'ready' ? 'bg-[#ffe16d] text-[#221b00] animate-pulse' :
                          'bg-red-50 text-[#9e0027]'
                        }`}>
                          {order.status === 'ready' ? (order.serviceType === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery') : order.status}
                        </span>
                      </div>
                      
                      {/* item summaries */}
                      <div className="text-xs text-gray-600 font-medium">
                        {order.items.map((it, idx) => (
                          <span key={idx} className="inline-block mr-2 bg-gray-100 px-2 py-1 rounded">
                            {it.quantity}x {it.menuItem.name} 
                            {it.customization.selectedMeat && ` (${it.customization.selectedMeat})`}
                          </span>
                        ))}
                      </div>

                      {order.address && (
                        <p className="text-xs text-gray-500">
                          <strong>Delivery Address:</strong> {order.address}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-dashed border-[#e5e2dd]">
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block font-medium">Total Paid</span>
                        <span className="text-base font-extrabold text-[#1c1c19]">${order.total.toFixed(2)}</span>
                      </div>
                      <div className="flex gap-2">
                        {order.status !== 'completed' && (
                          <button
                            onClick={() => {
                              setActiveOrder(order);
                              setShowOrderTracker(true);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-xs font-bold bg-[#ffe16d] text-[#221b00] px-4 py-2 rounded-full border border-black/5"
                          >
                            Track Live
                          </button>
                        )}
                        <button
                          onClick={() => handleReorder(order)}
                          className="text-xs font-bold border-2 border-[#006e0a] text-[#006e0a] hover:bg-[#006e0a] hover:text-white px-4 py-2 rounded-full transition-all"
                        >
                          Order Again
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* GALLERIES / FRESH FROM THE GRILL */}
        <section className="py-16 bg-[#fcf9f4] border-t border-[#e5e2dd] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="text-xs font-bold text-[#9e0027] tracking-wider uppercase">PHOTO FEED</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1c1c19] mt-1">Fresh From The Grill</h2>
              <div className="h-1 w-16 bg-[#9e0027] mt-2 rounded-full" />
            </div>

            {/* Scrolling Gallery Container */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
              {GALLERY_IMAGES.map((imgUrl, index) => (
                <div 
                  key={index} 
                  className="min-w-[280px] sm:min-w-[320px] h-60 rounded-2xl overflow-hidden shadow-md shrink-0 snap-center border border-[#e5e2dd] hover:scale-[1.02] transition-transform duration-300 relative group"
                >
                  <img 
                    alt={`${demo.name} gallery ${index + 1}`}
                    className="w-full h-full object-cover" 
                    src={imgUrl}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-[#9e0027] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      #CaliTacosTulsa
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] text-gray-300 py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center text-center">
          
          <span className="text-2xl font-extrabold text-[#9e0027] tracking-tight">{demo.name}</span>
          <p className="text-xs text-[#ffe16d] font-bold tracking-wider uppercase mt-1">Tulsa&apos;s Authentic Taco Truck</p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 my-8 text-sm font-semibold">
            <a href="#menu" className="hover:text-[#ffe16d] transition-colors">Order Online</a>
            <a href="#visit" className="hover:text-[#ffe16d] transition-colors">Our Location</a>
            <a href={phoneHref} className="hover:text-[#ffe16d] transition-colors">Call {demo.phone}</a>
          </div>

          <p className="text-xs text-gray-500 max-w-sm leading-relaxed mb-6">
            Proudly serving {demo.city} the absolute most authentic street taco experience since 2021. Handmade recipes, real ingredients, and real salsa heat.
          </p>

          <div className="w-full max-w-lg border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <span>© 2026 {demo.name}. All rights reserved.</span>
            <div className="flex gap-4 font-semibold">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:underline">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#fcf9f4] border-t border-[#e5e2dd] flex justify-around items-center py-2 md:hidden z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <a 
          href="#menu" 
          onClick={() => setActiveTab('all')}
          className="flex flex-col items-center justify-center text-gray-600 hover:text-[#9e0027] py-1 px-3"
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Menu</span>
        </a>
        
        <a 
          href="#visit" 
          className="flex flex-col items-center justify-center text-gray-600 hover:text-[#9e0027] py-1 px-3"
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Location</span>
        </a>

        <button 
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center text-gray-600 hover:text-[#9e0027] py-1 px-3 relative"
        >
          <ShoppingBag className="w-5 h-5 text-[#9e0027]" />
          {cart.length > 0 && (
            <span className="absolute top-0.5 right-2 bg-[#006e0a] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#fcf9f4]">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
          <span className="text-[10px] font-bold mt-1">Cart</span>
        </button>

        {activeOrder && (
          <button 
            onClick={() => {
              setShowOrderTracker(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center text-[#006e0a] py-1 px-3"
          >
            <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-[10px] font-bold mt-1">Tracker</span>
          </button>
        )}
      </nav>

      {/* MODAL 1: CUSTOMIZER DRAWER / MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#fcf9f4] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-[#e5e2dd] max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="relative h-44 shrink-0 bg-neutral-900">
              <img 
                alt={selectedItem.name} 
                className="w-full h-full object-cover" 
                src={selectedItem.image}
              />
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 p-1.5 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-5">
                <div>
                  <h3 className="text-xl font-extrabold text-white">{selectedItem.name}</h3>
                  <p className="text-xs text-gray-300 line-clamp-1 mt-0.5">{selectedItem.description}</p>
                </div>
              </div>
            </div>

            {/* Customization Options Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {selectedItem.customizable ? (
                <>
                  {/* Select Protein */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#9e0027]">Choose Protein</span>
                      <span className="text-xs text-gray-400 font-semibold">Required</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {MEATS.map(meat => (
                        <button
                          key={meat.id}
                          onClick={() => setSelectedMeat(meat.id)}
                          className={`flex justify-between items-center p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                            selectedMeat === meat.id
                              ? 'border-[#006e0a] bg-[#E9F8E9] text-gray-800 ring-1 ring-[#006e0a]'
                              : 'border-[#e5e2dd] bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div>
                            <p className="font-extrabold capitalize">{meat.id}</p>
                            <p className="text-[10px] text-gray-400 font-normal mt-0.5">{meat.tag}</p>
                          </div>
                          {selectedMeat === meat.id && <Check className="w-4 h-4 text-[#006e0a] shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Style */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#9e0027]">Choose Tortilla / Style</span>
                      <span className="text-xs text-gray-400 font-semibold">Required</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {STYLES.map(style => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={`flex justify-between items-center p-3.5 rounded-xl border text-xs font-bold transition-all text-left ${
                            selectedStyle === style.id
                              ? 'border-[#006e0a] bg-[#E9F8E9] text-gray-800 ring-1 ring-[#006e0a]'
                              : 'border-[#e5e2dd] bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div>
                            <p className="font-extrabold">{style.name}</p>
                            <p className="text-[10px] text-gray-400 font-normal mt-0.5 leading-relaxed">{style.description}</p>
                          </div>
                          {selectedStyle === style.id && <Check className="w-4 h-4 text-[#006e0a] shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add Extras */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#9e0027] block">Add Toppings / Extras</span>
                    <div className="space-y-2">
                      {[
                        { key: 'guacamole', name: 'Fresh Guacamole', price: 1.50 },
                        { key: 'sourCream', name: 'Sour Cream (Crema)', price: 0.75 },
                        { key: 'extraCheese', name: 'Extra Monterrey Cheese', price: 1.00 },
                        { key: 'grilledJalapeno', name: 'Grilled Jalapeño (on side)', price: 0.50 }
                      ].map(extra => (
                        <button
                          key={extra.key}
                          onClick={() => setExtras(prev => ({ ...prev, [extra.key]: !prev[extra.key as keyof typeof prev] }))}
                          className={`flex justify-between items-center w-full p-3.5 rounded-xl border text-xs font-bold transition-all text-left ${
                            extras[extra.key as keyof typeof extras]
                              ? 'border-[#006e0a] bg-[#E9F8E9] text-gray-800'
                              : 'border-[#e5e2dd] bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="font-bold">{extra.name}</span>
                          <span className="flex items-center gap-2">
                            <span className="text-[#006e0a] font-black">+${extra.price.toFixed(2)}</span>
                            <span className={`w-5 h-5 rounded flex items-center justify-center border ${
                              extras[extra.key as keyof typeof extras]
                                ? 'bg-[#006e0a] border-[#006e0a] text-white'
                                : 'border-[#e5e2dd] bg-white'
                            }`}>
                              {extras[extra.key as keyof typeof extras] && <Check className="w-3.5 h-3.5" />}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#9e0027] block">Special Instructions</span>
                    <textarea
                      placeholder="E.g. No cilantro, extra onions, salsa on the side..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full bg-white border border-[#e5e2dd] rounded-xl p-3 text-xs focus:outline-none focus:border-[#9e0027] placeholder-gray-400 resize-none h-20"
                    />
                  </div>
                </>
              ) : (
                <div className="py-6 text-center text-gray-500 text-xs">
                  <p>This item does not have additional options and will be prepared in our traditional kitchen style.</p>
                </div>
              )}

              {/* Quantity selector */}
              <div className="flex items-center justify-between py-4 border-t border-[#e5e2dd]">
                <span className="text-sm font-extrabold text-gray-800">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1.5 rounded-full border border-[#e5e2dd] hover:bg-gray-100 text-gray-700"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-extrabold w-6 text-center text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-1.5 rounded-full border border-[#e5e2dd] hover:bg-gray-100 text-gray-700"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Footer Add button */}
            <div className="p-6 bg-[#f5f3ee] border-t border-[#e5e2dd] flex justify-between items-center gap-4 shrink-0">
              <div>
                <span className="text-xs text-gray-400 block font-semibold">Total Price</span>
                <span className="text-xl font-extrabold text-[#1c1c19]">
                  ${(calculateSinglePrice(selectedItem) * quantity).toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleAddToOrder}
                className="bg-[#9e0027] text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:bg-[#A31830] transition-colors text-sm flex items-center gap-2"
              >
                Add to Order
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: SHOPPING CART DRAWER / SIDEBAR */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-[#fcf9f4] w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            
            {/* Cart Header */}
            <div className="p-6 border-b border-[#e5e2dd] flex justify-between items-center bg-[#fcf9f4] shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-[#9e0027] w-5 h-5" />
                <h3 className="text-lg font-extrabold text-[#1c1c19]">Your Cart</h3>
                <span className="bg-[#ffdad9] text-[#9e0027] text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart items list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-24 space-y-4">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-medium text-gray-500">Your cart is currently empty.</p>
                  <button
                    onClick={() => { setIsCartOpen(false); }}
                    className="text-xs font-bold bg-[#9e0027] text-white px-5 py-2.5 rounded-full hover:bg-[#A31830]"
                  >
                    Start Adding Delicious Food
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-white border border-[#e5e2dd] shadow-sm relative">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
                          <img alt={item.menuItem.name} className="w-full h-full object-cover" src={item.menuItem.image} />
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <h4 className="font-bold text-sm text-gray-900 truncate">{item.menuItem.name}</h4>
                          
                          {/* customizations description */}
                          {item.menuItem.customizable && (
                            <div className="text-[10px] text-gray-500 mt-0.5 space-y-0.5 font-medium leading-relaxed capitalize">
                              <p>Meat: <span className="font-semibold text-gray-700">{item.customization.selectedMeat}</span></p>
                              <p>Style: <span className="font-semibold text-gray-700">{item.customization.selectedStyle === 'street' ? 'Street Style' : 'Flour Style'}</span></p>
                              
                              {/* extras list */}
                              {Object.entries(item.customization.extras).some(([_, val]) => val) && (
                                <p>Extras: <span className="font-semibold text-[#006e0a]">{
                                  Object.entries(item.customization.extras)
                                    .filter(([_, val]) => val)
                                    .map(([key]) => key === 'grilledJalapeno' ? 'Jalapeño' : key === 'sourCream' ? 'Sour Cream' : key === 'extraCheese' ? 'Extra Cheese' : key)
                                    .join(', ')
                                }</span></p>
                              )}

                              {item.customization.specialInstructions && (
                                <p className="italic text-gray-400 mt-1">&ldquo;{item.customization.specialInstructions}&rdquo;</p>
                              )}
                            </div>
                          )}

                          {/* price and qty adjustments */}
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-[#9e0027] font-extrabold text-sm">${item.totalPrice.toFixed(2)}</span>
                            
                            <div className="flex items-center gap-2 bg-gray-50 border border-[#e5e2dd] px-2 py-1 rounded-full">
                              <button 
                                onClick={() => updateCartQuantity(item.id, -1)}
                                className="text-gray-500 hover:text-gray-800 p-0.5"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-gray-800 w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item.id, 1)}
                                className="text-gray-500 hover:text-gray-800 p-0.5"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* delete button */}
                        <button
                          onClick={() => updateCartQuantity(item.id, -item.quantity)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-600 p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Promo code area */}
                  <div className="pt-4 border-t border-[#e5e2dd]">
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="PROMO CODE (e.g. SALSA20)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="w-full bg-white border border-[#e5e2dd] rounded-full text-xs px-4 py-2.5 focus:outline-none focus:border-[#9e0027] placeholder-gray-400 font-bold"
                        />
                        <Tag className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-3" />
                      </div>
                      <button
                        type="submit"
                        className="bg-[#006e0a] hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-full"
                      >
                        Apply
                      </button>
                    </form>
                    {appliedDiscount && (
                      <div className="mt-2.5 bg-[#E9F8E9] border border-[#69fd5d]/40 rounded-xl px-3 py-1.5 flex justify-between items-center text-xs text-gray-800 font-medium">
                        <span className="flex items-center gap-1">
                          <Check className="w-4 h-4 text-[#006e0a]" /> Code <strong>{appliedDiscount.code}</strong> applied! ({appliedDiscount.percent}% off)
                        </span>
                        <button onClick={removePromo} className="text-gray-400 hover:text-gray-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {promoError && (
                      <p className="text-red-600 text-[10px] font-bold mt-1.5 ml-2">{promoError}</p>
                    )}
                  </div>

                  {/* Service type selection */}
                  <div className="pt-4 border-t border-[#e5e2dd]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#9e0027] block mb-2">Order Options</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setServiceType('pickup')}
                        className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          serviceType === 'pickup'
                            ? 'border-[#006e0a] bg-[#E9F8E9] text-gray-800 font-extrabold'
                            : 'border-[#e5e2dd] bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Utensils className="w-4 h-4" /> Pickup at Truck (Free)
                      </button>
                      <button
                        onClick={() => setServiceType('delivery')}
                        className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          serviceType === 'delivery'
                            ? 'border-[#006e0a] bg-[#E9F8E9] text-gray-800 font-extrabold'
                            : 'border-[#e5e2dd] bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Truck className="w-4 h-4" /> Local Delivery ($3.99)
                      </button>
                    </div>

                    {serviceType === 'delivery' && (
                      <div className="mt-3">
                        <input
                          type="text"
                          placeholder="Enter delivery address in Tulsa, OK..."
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full bg-white border border-[#e5e2dd] rounded-xl text-xs p-3 focus:outline-none focus:border-[#9e0027] placeholder-gray-400"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-[#f5f3ee] border-t border-[#e5e2dd] space-y-4 shrink-0">
                <div className="space-y-1.5 text-xs text-gray-600 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-bold">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-[#006e0a]">
                      <span>Discount ({appliedDiscount.percent}%)</span>
                      <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {serviceType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="text-gray-900 font-bold">${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (8.5%)</span>
                    <span className="text-gray-900 font-bold">${calculatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-gray-950 pt-2 border-t border-[#e5e2dd]">
                    <span>Total Amount</span>
                    <span className="text-[#9e0027] font-black">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-[#9e0027] hover:bg-[#A31830] text-white py-3.5 rounded-full font-bold shadow-md text-sm flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL 3: CHECKOUT MODAL (NAME / PHONE / SUBMIT) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fcf9f4] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-[#e5e2dd] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#e5e2dd] flex justify-between items-center bg-[#fcf9f4]">
              <h3 className="text-lg font-extrabold text-gray-900">Complete Your Order</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Juan Martinez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white border border-[#e5e2dd] rounded-xl text-sm p-3 focus:outline-none focus:border-[#9e0027]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="E.g. 918-555-0199"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white border border-[#e5e2dd] rounded-xl text-sm p-3 focus:outline-none focus:border-[#9e0027]"
                />
              </div>

              {serviceType === 'delivery' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Delivery Address (Tulsa Only)</label>
                  <textarea
                    required
                    placeholder="Provide full street address, apartment #, gate code..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-white border border-[#e5e2dd] rounded-xl text-sm p-3 focus:outline-none focus:border-[#9e0027] h-20 resize-none"
                  />
                </div>
              )}

              <div className="bg-[#f5f3ee] p-4 rounded-xl space-y-1 text-xs text-gray-600">
                <p><strong>Order Summary:</strong> {serviceType === 'pickup' ? 'Truck Pickup' : 'Local Delivery'}</p>
                <p><strong>Final Amount due:</strong> <span className="font-extrabold text-[#9e0027]">${cartTotal.toFixed(2)}</span> (Paid on arrival)</p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#006e0a] hover:bg-emerald-800 text-white font-bold py-3.5 rounded-full shadow-md text-sm transition-all"
              >
                Place Order (${cartTotal.toFixed(2)})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: LIVE ORDER COOKING TRACKER */}
      {showOrderTracker && activeOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fcf9f4] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-[#e5e2dd] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-6 border-b border-[#e5e2dd] flex justify-between items-center bg-[#ffe16d]">
              <div>
                <span className="text-[10px] font-black uppercase text-gray-800 tracking-wider">ORDER STATUS</span>
                <h3 className="text-lg font-extrabold text-[#221b00] mt-0.5">Live Cooking Tracker</h3>
              </div>
              <button 
                onClick={() => setShowOrderTracker(false)}
                className="text-gray-700 hover:text-gray-900 bg-white/40 hover:bg-white/60 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Order Info Bar */}
              <div className="bg-[#f5f3ee] rounded-xl p-4 border border-[#e5e2dd] flex justify-between items-center text-xs">
                <div>
                  <p className="text-gray-400 font-semibold">Order ID</p>
                  <p className="font-extrabold text-[#9e0027] text-sm mt-0.5">{activeOrder.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 font-semibold">Type</p>
                  <p className="font-extrabold capitalize text-gray-800 text-sm mt-0.5">{activeOrder.serviceType}</p>
                </div>
              </div>

              {/* Steps visual list */}
              <div className="space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e5e2dd] before:-z-0">
                {[
                  { key: 'received', title: 'Order Received', desc: 'Salsa & Street chefs received your order and are confirming ingredients.' },
                  { key: 'preparing', title: 'Prep Ingredients', desc: 'Chopping fresh cilantro, dicing onions, and heating fresh tortillas.' },
                  { key: 'cooking', title: 'On the Grill', desc: 'Sizzling your choice of proteins and melting delicious Monterey Jack cheese!' },
                  { key: 'ready', title: activeOrder.serviceType === 'pickup' ? 'Ready for Pickup!' : 'Out for Delivery!', desc: activeOrder.serviceType === 'pickup' ? 'Your food is steaming hot and waiting at the Peoria Ave food truck window.' : 'Our hot food truck driver is bringing it straight to your doorstep.' },
                  { key: 'completed', title: 'Completed', desc: 'Authentic street tacos enjoyed! Provecho!' }
                ].map((step, idx) => {
                  const statuses = ['received', 'preparing', 'cooking', 'ready', 'completed'];
                  const activeIdx = statuses.indexOf(activeOrder.status);
                  const stepIdx = statuses.indexOf(step.key);

                  const isDone = stepIdx < activeIdx;
                  const isCurrent = stepIdx === activeIdx;

                  return (
                    <div key={step.key} className="flex gap-4 items-start relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                        isDone ? 'bg-[#006e0a] text-white border-2 border-[#006e0a]' :
                        isCurrent ? 'bg-[#ffe16d] text-[#221b00] border-4 border-[#ffdad9] animate-bounce scale-110' :
                        'bg-white text-gray-400 border-2 border-[#e5e2dd]'
                      }`}>
                        {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className={`text-sm font-extrabold ${isCurrent ? 'text-gray-950 font-black' : isDone ? 'text-gray-700' : 'text-gray-400'}`}>
                          {step.title}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-[#e5e2dd] flex flex-col gap-2.5">
                {activeOrder.status !== 'completed' && (
                  <div className="flex gap-2.5">
                    <button
                      onClick={speedUpCooking}
                      className="flex-1 bg-[#006e0a] text-white py-3 rounded-full text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} /> Speed Up Cooking (Chef&apos;s Special)
                    </button>
                    <button
                      onClick={() => {
                        const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
                        if (confirmCancel) {
                          setOrders(orders.filter(o => o.id !== activeOrder.id));
                          setActiveOrder(null);
                          setShowOrderTracker(false);
                        }
                      }}
                      className="border border-[#9e0027] text-[#9e0027] px-4 py-3 rounded-full text-xs font-bold hover:bg-red-50"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => setShowOrderTracker(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-full text-xs font-bold transition-all text-center"
                >
                  Close & Continue Browsing
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
