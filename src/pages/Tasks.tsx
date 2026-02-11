import { useEffect, useState, useRef } from 'react';
import { 
  Play, 
  CheckCircle, 
  LogOut, 
  ArrowLeft,
  RefreshCw,
  Eye,
  Menu,
  X,
  DollarSign,
  Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Simple Link component using hash navigation
function Link({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={`#${to}`} className={className}>
      {children}
    </a>
  );
}

interface CaptchaTask {
  id: string;
  question: string;
  answer: string;
  reward: number;
}

const generateCaptcha = (): CaptchaTask => {
  const operations = ['+', '-'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  const num1 = Math.floor(Math.random() * 20) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  
  let answer: number;
  if (operation === '+') {
    answer = num1 + num2;
  } else {
    answer = num1 - num2;
  }
  
  return {
    id: Date.now().toString(),
    question: `${num1} ${operation} ${num2} = ?`,
    answer: answer.toString(),
    reward: Math.floor(Math.random() * 16) + 35, // 35-50
  };
};

export default function Tasks() {
  const { user, logout, updateBalance } = useAuth();
  const [captcha, setCaptcha] = useState<CaptchaTask>(generateCaptcha());
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [adWatched, setAdWatched] = useState(false);
  const [adTimer, setAdTimer] = useState(0);
  const [watchingAd, setWatchingAd] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const adIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user) {
      window.location.hash = '/login';
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (adIntervalRef.current) {
        clearInterval(adIntervalRef.current);
      }
    };
  }, []);

  const handleCaptchaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userAnswer === captcha.answer) {
      updateBalance(captcha.reward);
      setMessage({ type: 'success', text: `Benar! Anda mendapatkan Rp${captcha.reward}` });
      setCaptcha(generateCaptcha());
      setUserAnswer('');
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Jawaban salah, coba lagi!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const startWatchingAd = () => {
    setWatchingAd(true);
    setAdTimer(15); // 15 seconds ad
    
    adIntervalRef.current = setInterval(() => {
      setAdTimer((prev) => {
        if (prev <= 1) {
          if (adIntervalRef.current) clearInterval(adIntervalRef.current);
          setWatchingAd(false);
          setAdWatched(true);
          const reward = Math.floor(Math.random() * 16) + 35;
          updateBalance(reward);
          setMessage({ type: 'success', text: `Iklan selesai! Anda mendapatkan Rp${reward}` });
          setTimeout(() => {
            setAdWatched(false);
            setMessage(null);
          }, 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    window.location.hash = '/';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <Link to="/dashboard" className="flex items-center space-x-2">
                <img src="/logo.png" alt="AdsDuitID" className="h-8 w-auto" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-600 hover:text-[#0070a0] font-medium transition-colors">Dashboard</Link>
              <Link to="/tasks" className="text-[#0070a0] font-medium">Tugas</Link>
              <Link to="/withdraw" className="text-gray-600 hover:text-[#0070a0] font-medium transition-colors">Penarikan</Link>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
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
            <div className="md:hidden pb-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4 mt-4">
                <Link to="/dashboard" className="text-gray-600 font-medium">Dashboard</Link>
                <Link to="/tasks" className="text-[#0070a0] font-medium">Tugas</Link>
                <Link to="/withdraw" className="text-gray-600 font-medium">Penarikan</Link>
                <button onClick={handleLogout} className="text-red-500 font-medium text-left">Keluar</button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tugas Harian</h1>
          <p className="text-gray-600 mt-2">Selesaikan tugas untuk mendapatkan penghasilan</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* CAPTCHA Task */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tugas CAPTCHA</h2>
                <p className="text-sm text-gray-500">Jawab pertanyaan matematika</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#0070a0] mb-2">
                  {captcha.question}
                </div>
                <div className="text-sm text-gray-500">
                  Reward: Rp{captcha.reward}
                </div>
              </div>
            </div>

            <form onSubmit={handleCaptchaSubmit}>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Jawaban Anda"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0070a0] focus:border-transparent transition-all mb-4"
                required
              />
              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Kirim Jawaban</span>
              </button>
            </form>
          </div>

          {/* Watch Ad Task */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tonton Iklan</h2>
                <p className="text-sm text-gray-500">Tonton iklan dari Google AdSense</p>
              </div>
            </div>

            {!watchingAd && !adWatched ? (
              <div className="space-y-4">
                {/* Google Ad Display */}
                <div className="bg-gray-100 rounded-xl p-4 text-center min-h-[200px] flex flex-col items-center justify-center">
                  <p className="text-sm text-gray-500 mb-4">Iklan Google AdSense</p>
                  <ins 
                    className="adsbygoogle"
                    style={{ display: 'block', width: '100%', minHeight: '150px' }}
                    data-ad-client="ca-pub-9697754978669232"
                    data-ad-slot="1234567890"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Reward: Rp35-50</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Durasi: 15 detik</span>
                  </span>
                </div>

                <button
                  onClick={startWatchingAd}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>Tonton Iklan</span>
                </button>
              </div>
            ) : watchingAd ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#0070a0"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(adTimer / 15) * 226} 226`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#0070a0]">{adTimer}</span>
                  </div>
                </div>
                <p className="text-gray-600">Sedang menonton iklan...</p>
                <p className="text-sm text-gray-500 mt-2">Mohon tunggu sebentar</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-green-600 font-semibold">Iklan selesai!</p>
                <button
                  onClick={() => setAdWatched(false)}
                  className="mt-4 text-[#0070a0] hover:text-[#004968] font-medium"
                >
                  Tonton Lagi
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Tips Menghasilkan Lebih Banyak</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Selesaikan tugas CAPTCHA setiap hari</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Tonton iklan secara rutin untuk penghasilan tambahan</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Undang teman untuk mendapatkan bonus referral Rp50 + 20%</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
