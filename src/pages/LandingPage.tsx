import { useEffect, useRef, useState } from 'react';
import { 
  CheckCircle, 
  Zap, 
  Shield, 
  Users, 
  Play, 
  DollarSign,
  TrendingUp,
  Award,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

// Simple Link component using hash navigation
function Link({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={`#${to}`} className={className}>
      {children}
    </a>
  );
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: CheckCircle,
      title: 'Tugas Mudah',
      description: 'Selesaikan CAPTCHA sederhana dan tonton iklan untuk mendapatkan penghasilan.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Zap,
      title: 'Bayaran Cepat',
      description: 'Penarikan langsung ke akun DANA Anda dengan proses manual yang terpercaya.',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Shield,
      title: 'Aman Terpercaya',
      description: 'Platform yang aman dengan sistem verifikasi dan pembayaran terjamin.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Users,
      title: 'Program Referral',
      description: 'Dapatkan Rp50.000 untuk setiap teman yang mendaftar dan menyelesaikan 1x iklan, plus bonus 20% dari penghasilan mereka.',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const steps = [
    {
      image: '/step1-register.jpg',
      title: 'Daftar Akun',
      description: 'Buat akun gratis dengan nomor DANA Anda. Proses pendaftaran cepat dan mudah.',
    },
    {
      image: '/step2-tasks.jpg',
      title: 'Selesaikan Tugas',
      description: 'Kerjakan CAPTCHA dan tonton iklan dari Google AdSense untuk mengumpulkan poin.',
    },
    {
      image: '/step3-payment.jpg',
      title: 'Dapatkan Bayaran',
      description: 'Tarik penghasilan Anda ke akun DANA dengan minimal penarikan hanya Rp100.',
    },
  ];

  const testimonials = [
    {
      name: 'Budi Santoso',
      role: 'Mahasiswa',
      content: 'Sangat mudah digunakan! Saya bisa menghasilkan uang sambil bersantai di rumah.',
      avatar: 'B',
    },
    {
      name: 'Ani Wijaya',
      role: 'Ibu Rumah Tangga',
      content: 'Penghasilan tambahan yang luar biasa! Sudah beberapa kali tarik ke DANA.',
      avatar: 'A',
    },
    {
      name: 'Dedi Kurniawan',
      role: 'Freelancer',
      content: 'Program referralnya sangat menguntungkan. Teman-teman saya pada ikutan!',
      avatar: 'D',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-lg py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="AdsDuitID" className="h-10 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#beranda" className="text-gray-700 hover:text-[#0070a0] transition-colors font-medium">Beranda</a>
              <a href="#cara-kerja" className="text-gray-700 hover:text-[#0070a0] transition-colors font-medium">Cara Kerja</a>
              <a href="#fitur" className="text-gray-700 hover:text-[#0070a0] transition-colors font-medium">Fitur</a>
              <a href="#testimoni" className="text-gray-700 hover:text-[#0070a0] transition-colors font-medium">Testimoni</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-[#0070a0] font-medium hover:text-[#004968] transition-colors">
                Masuk
              </Link>
              <Link to="/register" className="btn-primary">
                Daftar Gratis
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4 mt-4">
                <a href="#beranda" className="text-gray-700 font-medium">Beranda</a>
                <a href="#cara-kerja" className="text-gray-700 font-medium">Cara Kerja</a>
                <a href="#fitur" className="text-gray-700 font-medium">Fitur</a>
                <a href="#testimoni" className="text-gray-700 font-medium">Testimoni</a>
                <Link to="/login" className="text-[#0070a0] font-medium">Masuk</Link>
                <Link to="/register" className="btn-primary text-center">Daftar Gratis</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="beranda" 
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #e6f7ff 0%, #ffffff 50%, #f0f9ff 100%)',
        }}
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/50 to-cyan-100/50 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-blue-100">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-700">1,000+ pengguna aktif</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Dapatkan{' '}
                <span className="text-gradient">Penghasilan Tambahan</span>{' '}
                dengan Mudah!
              </h1>

              <p className="text-lg text-gray-600 max-w-xl">
                Selesaikan tugas sederhana, tonton iklan, dan undang teman untuk mulai 
                menghasilkan uang hari ini. Minimal penarikan hanya Rp100!
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn-primary text-center flex items-center justify-center space-x-2">
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a 
                  href="#cara-kerja" 
                  className="btn-secondary text-center flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Lihat Cara Kerja</span>
                </a>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0070a0]">Rp35-50</div>
                  <div className="text-sm text-gray-500">per iklan</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0070a0]">Rp100</div>
                  <div className="text-sm text-gray-500">min. tarik</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0070a0]">Rp50</div>
                  <div className="text-sm text-gray-500">per referral</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative animate-float">
                <img 
                  src="/hero-illustration.jpg" 
                  alt="Hero Illustration" 
                  className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl"
                />
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 animate-pulse-glow">
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3">
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
                <div className="absolute top-1/2 -right-8 bg-white rounded-xl shadow-lg p-3">
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih <span className="text-gradient">AdsDuitID</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Platform penghasilan online terpercaya dengan berbagai keunggulan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg card-hover border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="cara-kerja" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Cara <span className="text-gradient">Kerja</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tiga langkah mudah untuk mulai menghasilkan uang
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 mb-6">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-64 object-contain rounded-2xl"
                  />
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Calculator Section */}
      <section className="py-20 bg-gradient-to-br from-[#0070a0] to-[#004968]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Kalkulator Penghasilan
              </h2>
              <p className="text-lg text-blue-100 mb-8">
                Hitung berapa banyak yang bisa Anda hasilkan dengan AdsDuitID
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Play className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Tonton Iklan</div>
                    <div className="text-blue-200 text-sm">Rp35-50 per iklan</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Undang Teman</div>
                    <div className="text-blue-200 text-sm">Rp50 + 20% bonus</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Selesaikan CAPTCHA</div>
                    <div className="text-blue-200 text-sm">Rp35-50 per tugas</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <EarningsCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimoni" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata <span className="text-gradient">Mereka</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Testimoni dari pengguna yang sudah merasakan manfaat AdsDuitID
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg card-hover border border-gray-100"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary text-white flex items-center justify-center text-xl font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
                <div className="flex space-x-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Award key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Siap Mulai <span className="text-gradient">Menghasilkan</span>?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Daftar gratis sekarang dan dapatkan bonus Rp50 untuk setiap teman yang Anda undang!
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2">
            <span>Daftar Gratis Sekarang</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <img src="/logo.png" alt="AdsDuitID" className="h-12 w-auto mb-4" />
              <p className="text-gray-400 max-w-sm">
                Platform penghasilan online terpercaya di Indonesia. 
                Dapatkan uang dengan mudah dari tugas sederhana dan iklan.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Menu</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#beranda" className="hover:text-white transition-colors">Beranda</a></li>
                <li><a href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a></li>
                <li><a href="#fitur" className="hover:text-white transition-colors">Fitur</a></li>
                <li><a href="#testimoni" className="hover:text-white transition-colors">Testimoni</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Akun</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white transition-colors">Masuk</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Daftar</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AdsDuitID. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Earnings Calculator Component
function EarningsCalculator() {
  const [adsPerDay, setAdsPerDay] = useState(10);
  const [referrals, setReferrals] = useState(5);

  const dailyEarnings = adsPerDay * 42.5; // Average Rp42.5 per ad
  const referralBonus = referrals * 50;
  const monthlyEarnings = (dailyEarnings * 30) + referralBonus;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Hitung Penghasilan Anda</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Iklan per hari: {adsPerDay}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={adsPerDay}
            onChange={(e) => setAdsPerDay(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0070a0]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jumlah Referral: {referrals}
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={referrals}
            onChange={(e) => setReferrals(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0070a0]"
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
        <div className="text-sm text-gray-600 mb-1">Estimasi Penghasilan Bulanan</div>
        <div className="text-4xl font-bold text-gradient">
          Rp{monthlyEarnings.toLocaleString('id-ID')}
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Rp{dailyEarnings.toLocaleString('id-ID')} / hari dari iklan
        </div>
        {referralBonus > 0 && (
          <div className="text-sm text-green-600 mt-1">
            + Rp{referralBonus.toLocaleString('id-ID')} dari referral
          </div>
        )}
      </div>

      <Link to="/register" className="btn-primary w-full text-center block">
        Mulai Menghasilkan
      </Link>
    </div>
  );
}
