import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from './data/products';
import { Product, CartItem, ActiveSection } from './types/product';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CatalogSection } from './components/CatalogSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { QuoteModal } from './components/QuoteModal';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { DataQualityModal } from './components/DataQualityModal';
import { Footer } from './components/Footer';
import { Shield, ArrowRight, Eye, Bell, CheckCircle2, Phone, PackageCheck } from 'lucide-react';
import { getDirectWhatsAppUrl } from './utils/whatsapp';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dsecure_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [singleOrderProduct, setSingleOrderProduct] = useState<{ product: Product; quantity: number } | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [initialQuoteService, setInitialQuoteService] = useState('Étude et devis gratuit');
  const [isQAOpen, setIsQAOpen] = useState(false);

  // Subcategory filters for each main section
  const [cameraSubCat, setCameraSubCat] = useState('Tous');
  const [alarmSubCat, setAlarmSubCat] = useState('Tous');
  const [packSubCat, setPackSubCat] = useState('Tous');
  const [accessorySubCat, setAccessorySubCat] = useState('Tous');
  const [networkSubCat, setNetworkSubCat] = useState('Tous');

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dsecure_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [cart]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Direct single-product order
  const handleDirectOrder = (product: Product, quantity: number) => {
    setSingleOrderProduct({ product, quantity });
    setIsCheckoutOpen(true);
  };

  // Proceed from Cart to Checkout
  const handleProceedToCartCheckout = () => {
    setSingleOrderProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Quotation trigger
  const handleOpenQuoteForService = (serviceName: string) => {
    setInitialQuoteService(serviceName);
    setIsQuoteOpen(true);
  };

  // Filtered dataset slices
  const cameraProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.topSection === 'cameras');
  }, []);

  const alarmProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.topSection === 'alarms');
  }, []);

  const packProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.topSection === 'packs');
  }, []);

  const accessoryProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.topSection === 'accessories');
  }, []);

  const networkProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.topSection === 'network');
  }, []);

  // Related products for modal
  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return PRODUCTS.filter(
      (p) =>
        p.id !== selectedProduct.id &&
        (p.category === selectedProduct.category || p.sourceSheet === selectedProduct.sourceSheet)
    ).slice(0, 4);
  }, [selectedProduct]);

  // Featured highlights for homepage
  const featuredCameras = useMemo(() => {
    return cameraProducts.filter((p) => p.image !== null).slice(0, 4);
  }, [cameraProducts]);

  const featuredAlarms = useMemo(() => {
    return alarmProducts.filter((p) => p.image !== null).slice(0, 4);
  }, [alarmProducts]);

  const featuredKits = useMemo(() => {
    return packProducts.slice(0, 3);
  }, [packProducts]);

  // Navigate handler that scrolls to top
  const handleNavigate = (section: ActiveSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 flex flex-col font-sans">
      {/* Header with Top Bar Contract */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenQA={() => setIsQAOpen(true)}
      />

      <main className="flex-1">
        {/* VIEW: HOME */}
        {activeSection === 'home' && (
          <div>
            {/* Hero Section */}
            <Hero
              onNavigate={handleNavigate}
              onOpenQuote={() => setIsQuoteOpen(true)}
            />

            {/* Featured Cameras Section */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D71920] uppercase tracking-wider mb-2">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Haute Définition & Vision Nocturne</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Caméras de Surveillance Populaires
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Sélection officielle Hikvision IP ColorVu, AcuSense et Caméras solaires autonomes 4G.
                  </p>
                </div>

                <button
                  onClick={() => handleNavigate('cameras')}
                  className="text-xs font-bold text-[#D71920] hover:text-red-400 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                >
                  <span>Voir toutes les caméras ({cameraProducts.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featuredCameras.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onSelect={setSelectedProduct}
                    onDirectOrder={handleDirectOrder}
                  />
                ))}
              </div>
            </section>

            {/* Turnkey Packs Banner Highlight */}
            <section className="py-16 bg-zinc-950 border-b border-zinc-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D71920] uppercase tracking-wider mb-2">
                      <PackageCheck className="w-3.5 h-3.5" />
                      <span>Solutions Clé en Main</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Packs Vidéosurveillance Complets
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                      Kits complets prêts à poser : Enregistreur DVR/NVR, caméras, câbles coaxiaux/réseau et alimentation.
                    </p>
                  </div>

                  <button
                    onClick={() => handleNavigate('packs')}
                    className="text-xs font-bold text-[#D71920] hover:text-red-400 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Découvrir tous les packs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredKits.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onSelect={setSelectedProduct}
                      onDirectOrder={handleDirectOrder}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Alarms Section */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D71920] uppercase tracking-wider mb-2">
                    <Bell className="w-3.5 h-3.5" />
                    <span>Protection Anti-Intrusion Sans Fil</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Systèmes d'Alarme Hikvision AX PRO
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Centrales sans fil 64 zones, détecteurs photo PIRCAM, sirènes extérieures 110dB et badges RFID.
                  </p>
                </div>

                <button
                  onClick={() => handleNavigate('alarms')}
                  className="text-xs font-bold text-[#D71920] hover:text-red-400 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                >
                  <span>Voir tous les systèmes d'alarme ({alarmProducts.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featuredAlarms.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onSelect={setSelectedProduct}
                    onDirectOrder={handleDirectOrder}
                  />
                ))}
              </div>
            </section>

            {/* Services Teaser */}
            <ServicesSection onSelectServiceForQuote={handleOpenQuoteForService} />

            {/* Testimonials */}
            <TestimonialsSection />

            {/* Contact & Map Banner */}
            <ContactSection />
          </div>
        )}

        {/* VIEW: CAMÉRAS DE SURVEILLANCE */}
        {activeSection === 'cameras' && (
          <CatalogSection
            title="Caméras de Surveillance & Enregistreurs"
            subtitle="Gamme complète Hikvision originale : Caméras analogiques Turbo HD, Caméras IP AcuSense / ColorVu, Caméras PTZ motorisées, caméras solaires 4G et enregistreurs NVR/DVR."
            products={cameraProducts}
            subCategories={[
              'Tous',
              'Caméras IP',
              'Caméras analogiques',
              'Caméras PTZ',
              'Caméras solaires',
              'Enregistreurs vidéo',
            ]}
            activeSubCategory={cameraSubCat}
            onSelectSubCategory={setCameraSubCat}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            onDirectOrder={handleDirectOrder}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {/* VIEW: SYSTÈMES D'ALARME */}
        {activeSection === 'alarms' && (
          <CatalogSection
            title="Systèmes d'Alarme Anti-Intrusion"
            subtitle="Protection périmétrique et intérieure : Centrales sans fil AX PRO 433MHz, détecteurs PIRCAM avec levée de doute photo, claviers, sirènes et systèmes filaires AX HYBRID PRO."
            products={alarmProducts}
            subCategories={[
              'Tous',
              "Systèmes d'alarme sans fil",
              "Systèmes d'alarme filaires",
            ]}
            activeSubCategory={alarmSubCat}
            onSelectSubCategory={setAlarmSubCat}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            onDirectOrder={handleDirectOrder}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {/* VIEW: PACKS VIDÉOSURVEILLANCE */}
        {activeSection === 'packs' && (
          <CatalogSection
            title="Packs & Kits Vidéosurveillance Prêts à Poser"
            subtitle="Kits complets certifiés Hikvision incluant enregistreur DVR/NVR, caméras de sécurité haute définition, câbles pré-équipés 18m et alimentations dédiées."
            products={packProducts}
            subCategories={['Tous', 'Kits vidéosurveillance']}
            activeSubCategory={packSubCat}
            onSelectSubCategory={setPackSubCat}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            onDirectOrder={handleDirectOrder}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {/* VIEW: ACCESSOIRES */}
        {activeSection === 'accessories' && (
          <CatalogSection
            title="Accessoires, Baies & Stockage"
            subtitle="Disques durs de surveillance Seagate SkyHawk 1TB à 10TB, baies et coffrets muraux 6U/9U, onduleurs UPS 1000VA-3000VA, câbles réseau Cat5e/Cat6 et baluns vidéo."
            products={accessoryProducts}
            subCategories={[
              'Tous',
              'Disques durs',
              'Baies et alimentation',
              'Accessoires et câblage',
              'Moniteurs',
            ]}
            activeSubCategory={accessorySubCat}
            onSelectSubCategory={setAccessorySubCat}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            onDirectOrder={handleDirectOrder}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {/* VIEW: CONTRÔLE D'ACCÈS & RÉSEAU */}
        {activeSection === 'network' && (
          <CatalogSection
            title="Switchs PoE, Réseau & Connectivité"
            subtitle="Infrastructures réseau professionnelles pour vidéosurveillance : Switchs PoE 4/8/16/24 ports longue portée 300m, routeurs Wi-Fi 6, points d'accès plafonniers et ponts sans fil 5GHz."
            products={networkProducts}
            subCategories={[
              'Tous',
              'Switch réseau',
              'Réseau et connectivité',
            ]}
            activeSubCategory={networkSubCat}
            onSelectSubCategory={setNetworkSubCat}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            onDirectOrder={handleDirectOrder}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {/* VIEW: NOS SERVICES */}
        {activeSection === 'services' && (
          <ServicesSection onSelectServiceForQuote={handleOpenQuoteForService} />
        )}

        {/* VIEW: À PROPOS */}
        {activeSection === 'about' && <AboutSection />}

        {/* VIEW: AVIS CLIENTS */}
        {activeSection === 'testimonials' && <TestimonialsSection />}

        {/* VIEW: CONTACT */}
        {activeSection === 'contact' && <ContactSection />}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectOrder={handleDirectOrder}
        relatedProducts={relatedProducts}
        onSelectProduct={setSelectedProduct}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCartCheckout}
      />

      {/* Checkout WhatsApp Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setSingleOrderProduct(null);
        }}
        cartItems={cart}
        singleProduct={singleOrderProduct}
        onOrderSuccess={() => {
          if (!singleOrderProduct) {
            setCart([]);
          }
        }}
      />

      {/* Quotation Request Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        initialService={initialQuoteService}
      />

      {/* Excel Data Quality Audit Modal */}
      <DataQualityModal
        isOpen={isQAOpen}
        onClose={() => setIsQAOpen(false)}
        products={PRODUCTS}
        onSelectProduct={setSelectedProduct}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onOpenQA={() => setIsQAOpen(true)} />
    </div>
  );
}
