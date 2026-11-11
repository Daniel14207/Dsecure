import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from './data/products';
import { Product, CartItem, ActiveSection } from './types/product';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PacksShowcaseSection } from './components/PacksShowcaseSection';
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
import { AdminPortal } from './components/AdminPortal';
import { FloatingWidgets } from './components/FloatingWidgets';
import { Footer } from './components/Footer';
import { ArrowRight, ShoppingCart, ShieldCheck } from 'lucide-react';

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

  // Subcategory filters for main catalog sections
  const [cameraSubCat, setCameraSubCat] = useState('Tous');
  const [alarmSubCat, setAlarmSubCat] = useState('Tous');
  const [packSubCat, setPackSubCat] = useState('Tous');
  const [dvrNvrSubCat, setDvrNvrSubCat] = useState('Tous');
  const [accessorySubCat, setAccessorySubCat] = useState('Tous');
  const [hddSubCat, setHddSubCat] = useState('Tous');
  const [networkSubCat, setNetworkSubCat] = useState('Tous');
  const [monitorSubCat, setMonitorSubCat] = useState('Tous');

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
  const handleOpenQuoteForService = (serviceName?: string) => {
    setInitialQuoteService(serviceName || 'Étude et devis gratuit');
    setIsQuoteOpen(true);
  };

  // Filtered dataset slices for all 8 categories requested in Priority 3
  const cameraProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.topSection === 'cameras');
  }, []);

  const alarmProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.topSection === 'alarms');
  }, []);

  const packProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.topSection === 'packs');
  }, []);

  const dvrNvrProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.topSection === 'dvr_nvr');
  }, []);

  const accessoryProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.topSection === 'accessories');
  }, []);

  const hddProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.topSection === 'hdd');
  }, []);

  const networkProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.topSection === 'network');
  }, []);

  const monitorProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.topSection === 'monitors');
  }, []);

  // Related products for detail modal
  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return PRODUCTS.filter(
      (p) =>
        p.id !== selectedProduct.id &&
        (p.category === selectedProduct.category || p.topSection === selectedProduct.topSection)
    ).slice(0, 4);
  }, [selectedProduct]);

  // Featured "NOS PRODUITS PAR PIÈCE" for the homepage matching design reference
  const productsParPiece = useMemo(() => {
    // Select curated real products with original photos matching the reference layout
    const selectedIds = [
      'surveillance-analog-2', // DS-2CE16D0T-EXIPF
      'surveillance-analog-23', // DS-2CE76K0T-LPFS
      'surveillance-ip-1-0-3', // DS-2CD1021G0-I
      'surveillance-ip-1-0-4', // DS-2CD1321G0-I
      'alarms-wireless-intrusion-alarm-11', // DS-PDMC-EG2-WB
      'alarms-wireless-intrusion-alarm-22', // DS-PM1-O1L-WB
    ];
    const found = selectedIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined);

    if (found.length < 6) {
      const additional = PRODUCTS.filter((p) => p.image !== null && !found.some((f) => f.id === p.id)).slice(0, 6 - found.length);
      return [...found, ...additional];
    }
    return found;
  }, []);

  // Navigate handler that scrolls to top
  const handleNavigate = (section: ActiveSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-[#D71920] selection:text-white">
      {/* Header with light styling and true logo */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        {/* VIEW: HOME */}
        {activeSection === 'home' && (
          <div>
            {/* Hero Section matching design reference */}
            <Hero
              onNavigate={handleNavigate}
              onOpenQuote={() => handleOpenQuoteForService()}
            />

            {/* SECTION: NOS PRODUITS PAR PIÈCE matching design-reference.png */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-200">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-2xl sm:text-3xl font-black text-[#080808] tracking-tight uppercase">
                  NOS PRODUITS <span className="text-[#D71920]">PAR PIÈCE</span>
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 font-medium">
                  Vente par pièce disponible sans installation
                </p>
              </div>

              {/* Grid of 6 product cards matching design reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {productsParPiece.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onSelect={setSelectedProduct}
                    onDirectOrder={handleDirectOrder}
                  />
                ))}
              </div>

              <div className="mt-10 text-center">
                <button
                  onClick={() => handleNavigate('cameras')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  <span>Voir tout le catalogue de caméras ({cameraProducts.length} modèles)</span>
                  <ArrowRight className="w-4 h-4 text-[#D71920]" />
                </button>
              </div>
            </section>

            {/* SECTION: NOS PACKS VIDÉOSURVEILLANCE matching design-reference.png */}
            <PacksShowcaseSection onOpenQuote={handleOpenQuoteForService} />

            {/* SECTION: NOS SERVICES matching design-reference.png */}
            <ServicesSection onSelectServiceForQuote={handleOpenQuoteForService} />

            {/* SECTION: AVIS CLIENTS matching design-reference.png */}
            <TestimonialsSection />

            {/* SECTION: CONTACT matching design reference */}
            <ContactSection />
          </div>
        )}

        {/* VIEW: 1. CAMÉRAS DE SURVEILLANCE */}
        {activeSection === 'cameras' && (
          <CatalogSection
            title="Caméras de Surveillance Hikvision"
            subtitle="Caméras IP Haute Définition AcuSense, ColorVu 24/7 vision nocturne couleur, caméras analogiques Turbo HD, PTZ motorisées et caméras solaires 4G autonomes."
            products={cameraProducts}
            subCategories={[
              'Tous',
              'Caméras IP',
              'Caméras analogiques',
              'Caméras PTZ motorisées',
              'Caméras solaires 4G',
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

        {/* VIEW: 2. SYSTÈMES D'ALARME */}
        {activeSection === 'alarms' && (
          <CatalogSection
            title="Systèmes d'Alarme Anti-Intrusion"
            subtitle="Protection sans fil et filaire Hikvision AX PRO : centrales d'alarme, détecteurs PIRCAM avec levée de doute photo, claviers tactiles, sirènes extérieures 110dB et badges RFID."
            products={alarmProducts}
            subCategories={[
              'Tous',
              "Systèmes d alarme sans fil AX PRO",
              "Systèmes d alarme filaires",
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

        {/* VIEW: 3. KITS VIDÉOSURVEILLANCE */}
        {activeSection === 'packs' && (
          <div className="bg-white">
            <PacksShowcaseSection onOpenQuote={handleOpenQuoteForService} />
            <div className="border-t border-zinc-200">
              <CatalogSection
                title="Tous les Kits et Packs Vidéosurveillance"
                subtitle="Kits complets pré-configurés avec enregistreur, caméras haute définition, câbles et alimentations."
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
            </div>
          </div>
        )}

        {/* VIEW: 4. DVR ET NVR */}
        {activeSection === 'dvr_nvr' && (
          <CatalogSection
            title="Enregistreurs DVR et NVR Hikvision"
            subtitle="Enregistreurs numériques 4, 8, 16 et 32 canaux : NVR 4K AcuSense avec intelligence artificielle et DVR Turbo HD Hybride eSSD."
            products={dvrNvrProducts}
            subCategories={[
              'Tous',
              'Enregistreurs NVR (Réseau IP)',
              'Enregistreurs DVR (Turbo HD)',
            ]}
            activeSubCategory={dvrNvrSubCat}
            onSelectSubCategory={setDvrNvrSubCat}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            onDirectOrder={handleDirectOrder}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {/* VIEW: 5. ACCESSOIRES ET CÂBLAGE */}
        {activeSection === 'accessories' && (
          <CatalogSection
            title="Accessoires, Câblage & Fixations"
            subtitle="Connectique de sécurité professionnelle : boîtiers de jonction étanches, baluns vidéo, câbles réseau Cat5e/Cat6, connecteurs BNC et blocs d'alimentation stabilisés."
            products={accessoryProducts}
            subCategories={[
              'Tous',
              'Accessoires de fixation & Câblage',
              'Transmission vidéo & Baluns',
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

        {/* VIEW: 6. DISQUES DURS */}
        {activeSection === 'hdd' && (
          <CatalogSection
            title="Disques Durs Spécial Vidéosurveillance"
            subtitle="Disques durs Seagate SkyHawk et Western Digital Purple certifiés pour enregistrement continu 24h/24 7j/7 : capacités 1TB, 2TB, 4TB, 6TB, 8TB et 10TB."
            products={hddProducts}
            subCategories={['Tous', 'Disques durs de surveillance']}
            activeSubCategory={hddSubCat}
            onSelectSubCategory={setHddSubCat}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            onDirectOrder={handleDirectOrder}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {/* VIEW: 7. RÉSEAU ET CONNECTIVITÉ */}
        {activeSection === 'network' && (
          <CatalogSection
            title="Réseau, Switchs PoE & Connectivité"
            subtitle="Infrastructures réseau sécurisées pour caméras IP : Switchs PoE longue portée 300m, routeurs Wi-Fi 6, points d'accès plafonniers et baies murales 19 pouces."
            products={networkProducts}
            subCategories={[
              'Tous',
              'Switchs PoE réseau',
              'Baies & coffrets muraux',
              'Routeurs Wi-Fi 6',
              'Points d accès & Routeurs AC',
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

        {/* VIEW: 8. MONITEURS */}
        {activeSection === 'monitors' && (
          <CatalogSection
            title="Moniteurs Professionnels de Vidéosurveillance"
            subtitle="Écrans LED industriels Hikvision conçus pour affichage permanent 24/7 : diagonales 19 pouces, 21.5 pouces, 24 pouces, 27 pouces, 32 pouces et 43 pouces 4K UHD."
            products={monitorProducts}
            subCategories={['Tous', 'Moniteurs de surveillance']}
            activeSubCategory={monitorSubCat}
            onSelectSubCategory={setMonitorSubCat}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            onDirectOrder={handleDirectOrder}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {/* VIEW: SERVICES */}
        {activeSection === 'services' && (
          <ServicesSection onSelectServiceForQuote={handleOpenQuoteForService} />
        )}

        {/* VIEW: À PROPOS */}
        {activeSection === 'about' && <AboutSection />}

        {/* VIEW: AVIS CLIENTS */}
        {activeSection === 'testimonials' && <TestimonialsSection />}

        {/* VIEW: CONTACT */}
        {activeSection === 'contact' && <ContactSection />}

        {/* VIEW: GESTIONNAIRE / PORTAIL ADMINISTRATEUR PRIVÉ */}
        {activeSection === 'admin' && (
          <AdminPortal onBackToPublicSite={() => handleNavigate('home')} />
        )}
      </main>

      {/* Floating Action Buttons & Chat En Ligne Widget */}
      <FloatingWidgets onOpenLiveChat={() => handleOpenQuoteForService()} />

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

      {/* Footer matching design reference with discreet owner login gate */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
