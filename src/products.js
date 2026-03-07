const PRODUCTS = [
  // ── Headphones ──────────────────────────────────────────────
  { id: 1,  name: "Sony WH-1000XM5",         category: "Headphones",  brand: "Sony",       price: 349,  rating: 4.8, stock: 23, image: "🎧", color: "Black",    features: ["Noise Cancelling", "30hr Battery", "Bluetooth 5.2", "Foldable"] },
  { id: 2,  name: "Apple AirPods Pro 2",      category: "Headphones",  brand: "Apple",      price: 249,  rating: 4.9, stock: 0,  image: "🎧", color: "White",    features: ["Active Noise Cancellation", "Adaptive Audio", "H2 Chip", "USB-C"] },
  { id: 3,  name: "Bose QuietComfort 45",     category: "Headphones",  brand: "Bose",       price: 279,  rating: 4.7, stock: 11, image: "🎧", color: "White",    features: ["QuietComfort", "24hr Battery", "Aware Mode", "Foldable"] },
  { id: 4,  name: "Sennheiser Momentum 4",    category: "Headphones",  brand: "Sennheiser", price: 349,  rating: 4.7, stock: 8,  image: "🎧", color: "Black",    features: ["60hr Battery", "ANC", "Bluetooth 5.2", "Foldable"] },
  { id: 5,  name: "Jabra Evolve2 85",         category: "Headphones",  brand: "Jabra",      price: 449,  rating: 4.6, stock: 5,  image: "🎧", color: "Black",    features: ["ANC", "37hr Battery", "Dual Bluetooth", "Busy Light"] },

  // ── Smartphones ─────────────────────────────────────────────
  { id: 6,  name: "iPhone 16 Pro Max",        category: "Smartphones", brand: "Apple",      price: 1199, rating: 4.8, stock: 8,  image: "📱", color: "Titanium", features: ["A18 Pro Chip", "48MP Camera", "Titanium Build", "USB-C"] },
  { id: 7,  name: "Samsung Galaxy S25 Ultra", category: "Smartphones", brand: "Samsung",    price: 1299, rating: 4.7, stock: 15, image: "📱", color: "Titanium", features: ["200MP Camera", "S Pen", "AI Features", "5000mAh"] },
  { id: 8,  name: "Google Pixel 9 Pro",       category: "Smartphones", brand: "Google",     price: 999,  rating: 4.6, stock: 20, image: "📱", color: "Hazel",    features: ["Tensor G4", "50MP Camera", "7yr Updates", "AI Features"] },
  { id: 9,  name: "OnePlus 13",               category: "Smartphones", brand: "OnePlus",    price: 899,  rating: 4.5, stock: 14, image: "📱", color: "Black",    features: ["Snapdragon 8 Elite", "50MP Hasselblad", "100W Charging", "5G"] },
  { id: 10, name: "Samsung Galaxy Z Fold 6",  category: "Smartphones", brand: "Samsung",    price: 1799, rating: 4.6, stock: 6,  image: "📱", color: "Silver",   features: ["Foldable", "S Pen", "Dual Screen", "50MP Camera"] },
  { id: 11, name: "iPhone 16",                category: "Smartphones", brand: "Apple",      price: 799,  rating: 4.7, stock: 22, image: "📱", color: "Pink",     features: ["A18 Chip", "48MP Camera", "Dynamic Island", "USB-C"] },

  // ── Laptops ─────────────────────────────────────────────────
  { id: 12, name: "MacBook Pro M4",           category: "Laptops",     brand: "Apple",      price: 1999, rating: 4.9, stock: 5,  image: "💻", color: "Space Black",  features: ["M4 Chip", "18hr Battery", "Liquid Retina XDR", "16GB RAM"] },
  { id: 13, name: "MacBook Air M3",           category: "Laptops",     brand: "Apple",      price: 1299, rating: 4.8, stock: 10, image: "💻", color: "Midnight",     features: ["M3 Chip", "18hr Battery", "15\" Display", "8GB RAM"] },
  { id: 14, name: "Dell XPS 15",              category: "Laptops",     brand: "Dell",       price: 1699, rating: 4.6, stock: 12, image: "💻", color: "Platinum",     features: ["Intel Core Ultra 7", "OLED Display", "RTX 4060", "32GB RAM"] },
  { id: 15, name: "ASUS ROG Zephyrus G16",    category: "Laptops",     brand: "ASUS",       price: 1849, rating: 4.7, stock: 7,  image: "💻", color: "Eclipse Gray", features: ["RTX 4080", "QHD 240Hz", "AMD Ryzen 9", "32GB RAM"] },
  { id: 16, name: "Microsoft Surface Pro 11", category: "Laptops",     brand: "Microsoft",  price: 1499, rating: 4.5, stock: 9,  image: "💻", color: "Platinum",     features: ["Snapdragon X Elite", "OLED Touch", "2-in-1", "15hr Battery"] },
  { id: 17, name: "Lenovo ThinkPad X1 Carbon",category: "Laptops",     brand: "Lenovo",     price: 1599, rating: 4.6, stock: 8,  image: "💻", color: "Black",        features: ["Intel Core Ultra 7", "14\" IPS", "Military Grade", "16GB RAM"] },

  // ── TVs ──────────────────────────────────────────────────────
  { id: 18, name: "LG C4 OLED 65\"",          category: "TVs",         brand: "LG",         price: 1799, rating: 4.8, stock: 7,  image: "📺", color: "Black",    features: ["4K OLED", "120Hz", "G-Sync", "Dolby Vision"] },
  { id: 19, name: "Sony Bravia XR A95L",      category: "TVs",         brand: "Sony",       price: 2499, rating: 4.7, stock: 3,  image: "📺", color: "Black",    features: ["QD-OLED", "Cognitive XR", "120Hz", "4K HDR"] },
  { id: 20, name: "Samsung QN90D Neo QLED",   category: "TVs",         brand: "Samsung",    price: 1599, rating: 4.6, stock: 9,  image: "📺", color: "Black",    features: ["Neo QLED", "144Hz", "4K", "Dolby Atmos"] },
  { id: 21, name: "LG G4 OLED 55\"",          category: "TVs",         brand: "LG",         price: 1499, rating: 4.8, stock: 5,  image: "📺", color: "Black",    features: ["4K OLED evo", "144Hz", "a11 AI Processor", "Dolby Vision"] },
  { id: 22, name: "TCL QM891G 85\"",          category: "TVs",         brand: "TCL",        price: 2299, rating: 4.5, stock: 4,  image: "📺", color: "Black",    features: ["Mini LED", "4K 144Hz", "Google TV", "Dolby Vision IQ"] },

  // ── Home & Appliances ────────────────────────────────────────
  { id: 23, name: "Dyson V15 Detect",         category: "Home",        brand: "Dyson",      price: 749,  rating: 4.7, stock: 19, image: "🧹", color: "Yellow",   features: ["Laser Detection", "HEPA Filter", "60min Battery", "LCD Screen"] },
  { id: 24, name: "Nespresso Vertuo Next",    category: "Home",        brand: "Nespresso",  price: 179,  rating: 4.5, stock: 34, image: "☕", color: "Chrome",   features: ["Centrifusion Tech", "6 Cup Sizes", "Bluetooth", "WiFi"] },
  { id: 25, name: "Instant Pot Duo 7-in-1",   category: "Home",        brand: "Instant",    price: 89,   rating: 4.6, stock: 41, image: "🍲", color: "Silver",   features: ["7-in-1 Cooker", "6 Qt", "14 Smart Programs", "Dishwasher Safe"] },
  { id: 26, name: "Dyson Purifier Hot+Cool",  category: "Home",        brand: "Dyson",      price: 649,  rating: 4.6, stock: 12, image: "🌀", color: "White",    features: ["Air Purifier", "Heater & Fan", "HEPA Filter", "Auto Mode"] },
  { id: 27, name: "iRobot Roomba j9+",        category: "Home",        brand: "iRobot",     price: 899,  rating: 4.5, stock: 8,  image: "🤖", color: "Graphite", features: ["Auto Empty", "Smart Mapping", "Obstacle Avoid", "WiFi"] },
  { id: 28, name: "KitchenAid Stand Mixer",   category: "Home",        brand: "KitchenAid", price: 449,  rating: 4.8, stock: 16, image: "🥣", color: "Red",      features: ["5 Qt Bowl", "10 Speeds", "59 Attachments", "Tilt-Head"] },

  // ── Cameras ──────────────────────────────────────────────────
  { id: 29, name: "Sony A7 IV",               category: "Cameras",     brand: "Sony",       price: 2499, rating: 4.9, stock: 4,  image: "📷", color: "Black",    features: ["33MP Full Frame", "4K 60fps", "Real-time Tracking", "5-axis IBIS"] },
  { id: 30, name: "Canon EOS R6 Mark II",     category: "Cameras",     brand: "Canon",      price: 2299, rating: 4.8, stock: 6,  image: "📷", color: "Black",    features: ["24MP", "40fps Burst", "6K RAW", "Dual Card Slots"] },
  { id: 31, name: "Fujifilm X-T5",            category: "Cameras",     brand: "Fujifilm",   price: 1699, rating: 4.8, stock: 9,  image: "📷", color: "Black",    features: ["40MP APS-C", "Film Simulations", "7-stop IBIS", "6.2K Video"] },
  { id: 32, name: "GoPro Hero 13 Black",      category: "Cameras",     brand: "GoPro",      price: 399,  rating: 4.7, stock: 25, image: "📷", color: "Black",    features: ["5.3K Video", "Waterproof", "HyperSmooth 6.0", "HDR"] },
  { id: 33, name: "DJI Osmo Pocket 3",        category: "Cameras",     brand: "DJI",        price: 519,  rating: 4.8, stock: 14, image: "🎬", color: "Gray",     features: ["4K 120fps", "3-axis Gimbal", "1\" CMOS", "Pocket Size"] },

  // ── Gaming ───────────────────────────────────────────────────
  { id: 34, name: "PlayStation 5 Slim",       category: "Gaming",      brand: "Sony",       price: 449,  rating: 4.8, stock: 2,  image: "🎮", color: "White",    features: ["4K Gaming", "120fps", "Ray Tracing", "SSD Storage"] },
  { id: 35, name: "Xbox Series X",            category: "Gaming",      brand: "Microsoft",  price: 499,  rating: 4.7, stock: 10, image: "🎮", color: "Black",    features: ["4K 120fps", "1TB SSD", "Game Pass", "Quick Resume"] },
  { id: 36, name: "Nintendo Switch OLED",     category: "Gaming",      brand: "Nintendo",   price: 349,  rating: 4.7, stock: 18, image: "🎮", color: "White",    features: ["7\" OLED", "Portable", "Dock Included", "64GB Storage"] },
  { id: 37, name: "Steam Deck OLED",          category: "Gaming",      brand: "Valve",      price: 549,  rating: 4.8, stock: 11, image: "🎮", color: "Black",    features: ["OLED Display", "PC Gaming", "7.4\" Screen", "AMD APU"] },
  { id: 38, name: "Razer DeathAdder V3 Pro",  category: "Gaming",      brand: "Razer",      price: 149,  rating: 4.7, stock: 30, image: "🖱️", color: "Black",    features: ["30K DPI", "Wireless", "90hr Battery", "Optical Switches"] },
  { id: 39, name: "Sony PS5 DualSense Edge",  category: "Gaming",      brand: "Sony",       price: 199,  rating: 4.6, stock: 15, image: "🎮", color: "White",    features: ["Haptic Feedback", "Adaptive Triggers", "Swappable Parts", "USB-C"] },

  // ── Wearables ────────────────────────────────────────────────
  { id: 40, name: "Apple Watch Ultra 2",      category: "Wearables",   brand: "Apple",      price: 799,  rating: 4.8, stock: 7,  image: "⌚", color: "Titanium", features: ["49mm Titanium", "60hr Battery", "Depth Gauge", "Precision GPS"] },
  { id: 41, name: "Samsung Galaxy Watch 7",   category: "Wearables",   brand: "Samsung",    price: 299,  rating: 4.6, stock: 13, image: "⌚", color: "Green",    features: ["Advanced Health", "BioActive Sensor", "Sleep Coaching", "5ATM"] },
  { id: 42, name: "Garmin Fenix 8",           category: "Wearables",   brand: "Garmin",     price: 899,  rating: 4.7, stock: 6,  image: "⌚", color: "Carbon",   features: ["Multi-Sport GPS", "16 Day Battery", "Dive Computer", "Music"] },
  { id: 43, name: "Fitbit Charge 6",          category: "Wearables",   brand: "Fitbit",     price: 159,  rating: 4.4, stock: 24, image: "⌚", color: "Black",    features: ["Heart Rate", "GPS", "7 Day Battery", "Google Maps"] },

  // ── Audio ────────────────────────────────────────────────────
  { id: 44, name: "Sonos Era 300",            category: "Audio",       brand: "Sonos",      price: 449,  rating: 4.8, stock: 9,  image: "🔊", color: "Black",    features: ["Spatial Audio", "Dolby Atmos", "WiFi 6", "Voice Control"] },
  { id: 45, name: "Apple HomePod 2nd Gen",    category: "Audio",       brand: "Apple",      price: 299,  rating: 4.7, stock: 12, image: "🔊", color: "Midnight", features: ["Spatial Audio", "S7 Chip", "Room Sensing", "Siri"] },
  { id: 46, name: "JBL Flip 7",              category: "Audio",       brand: "JBL",        price: 149,  rating: 4.6, stock: 28, image: "🔊", color: "Blue",     features: ["IP67 Waterproof", "14hr Battery", "Portable", "Bluetooth 5.3"] },
  { id: 47, name: "Bose SoundLink Max",       category: "Audio",       brand: "Bose",       price: 399,  rating: 4.7, stock: 10, image: "🔊", color: "Black",    features: ["20hr Battery", "IP67", "360° Sound", "USB-C"] },
];

export default PRODUCTS;