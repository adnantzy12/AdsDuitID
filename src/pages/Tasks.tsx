import { useEffect, useState, useRef } from 'react';
import { Play, CheckCircle, LogOut, ArrowLeft, RefreshCw, Menu, X, DollarSign, Clock, Lock, Unlock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function Link({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  return <a href={`#${to}`} className={className}>{children}</a>;
}

interface CaptchaTask { id: string; question: string; answer: string; reward: number; }

const generateCaptcha = (): CaptchaTask => {
  const ops = ['+', '-'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  const n1 = Math.floor(Math.random() * 20) + 1;
  const n2 = Math.floor(Math.random() * 10) + 1;
  const ans = op === '+' ? n1 + n2 : n1 - n2;
  return { id: Date.now().toString(), question: `${n1} ${op} ${n2} = ?`, answer: ans.toString(), reward: Math.floor(Math.random() * 16) + 35 };
};

export default function Tasks() {
  const { user, logout, updateBalance } = useAuth();
  const [captcha, setCaptcha] = useState<CaptchaTask>(generateCaptcha());
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [currentReward, setCurrentReward] = useState(0);
  const [adTimer, setAdTimer] = useState(15);
  const [watchingAd, setWatchingAd] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const adIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { if (!user) window.location.hash = '/login'; }, [user]);
  useEffect(() => () => { if (adIntervalRef.current) clearInterval(adIntervalRef.current); }, []);

  const handleCaptchaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer === captcha.answer) {
      setCurrentStep(2);
      setCurrentReward(captcha.reward);
      setMessage({ type: 'success', text: `CAPTCHA benar! Lanjutkan untuk menonton iklan dan dapatkan Rp${captcha.reward}` });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Jawaban salah, coba lagi!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const startWatchingAd = () => {
    setWatchingAd(true);
    setAdTimer(15);
    adIntervalRef.current = setInterval(() => {
      setAdTimer((prev) => {
        if (prev <= 1) {
          if (adIntervalRef.current) clearInterval(adIntervalRef.current);
          setWatchingAd(false);
          setCurrentStep(3);
          updateBalance(currentReward);
          setMessage({ type: 'success', text: `Selamat! Anda mendapatkan Rp${currentReward}` });
          setTimeout(() => { setMessage(null); resetTask(); }, 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTask = () => {
    setCurrentStep(1);
    setUserAnswer('');
    setCaptcha(generateCaptcha());
    setCurrentReward(0);
  };

  const handleLogout = () => { logout(); window.location.hash = '/'; };
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900"><ArrowLeft className="w-6 h-6" /></Link>
              <Link to="/dashboard" className="flex items-center space-x-2"><img src="/logo.png" alt="AdsDuitID" className="h-8 w-auto" /></Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-600 hover:text-[#0070a0] font-medium">Dashboard</Link>
              <Link to="/tasks" className="text-[#0070a0] font-medium">Tugas</Link>
              <Link to="/withdraw" className="text-gray-600 hover:text-[#0070a0] font-medium">Penarikan</Link>
              <button onClick={handleLogout} className="flex items-center space-x-1 text-red-500 hover:text-red-600 font-medium"><LogOut className="w-4 h-4" /><span>Keluar</span></button>
            </div>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tugas Harian</h1>
          <p className="text-gray-600 mt-2">Selesaikan CAPTCHA, lalu tonton iklan untuk mendapatkan penghasilan</p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-[#0070a0]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? 'bg-[#0070a0] text-white' : 'bg-gray-200'}`}>1</div>
              <span className="font-medium hidden sm:block">CAPTCHA</span>
            </div>
            <div className={`w-12 h-1 ${currentStep >= 2 ? 'bg-[#0070a0]' : 'bg-gray-200'}`} />
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-[#0070a0]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? 'bg-[#0070a0] text-white' : 'bg-gray-200'}`}>2</div>
              <span className="font-medium hidden sm:block">Iklan</span>
            </div>
            <div className={`w-12 h-1 ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-200'}`} />
            <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-green-500' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}><CheckCircle className="w-5 h-5" /></div>
              <span className="font-medium hidden sm:block">Selesai</span>
            </div>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center space-x-2 ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            <CheckCircle className="w-5 h-5 flex-shrink-0" /><span>{message.text}</span>
          </div>
        )}

        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center"><Lock className="w-7 h-7 text-white" /></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Verifikasi CAPTCHA</h2>
                <p className="text-sm text-gray-500">Jawab dengan benar untuk melanjutkan</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 mb-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#0070a0] mb-2">{captcha.question}</div>
              </div>
            </div>
            <form onSubmit={handleCaptchaSubmit}>
              <input type="text" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Jawaban Anda" className="w-full px-4 py-4 text-lg text-center border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0070a0] focus:border-transparent transition-all mb-4" required />
              <button type="submit" className="w-full btn-primary flex items-center justify-center space-x-2 py-4"><CheckCircle className="w-5 h-5" /><span>Verifikasi & Lanjutkan</span></button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-500">Reward: Rp{captcha.reward} (setelah nonton iklan)</div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center"><Unlock className="w-7 h-7 text-white" /></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tonton Iklan</h2>
                <p className="text-sm text-gray-500">CAPTCHA benar! Tonton iklan untuk klaim reward</p>
              </div>
            </div>
            {!watchingAd ? (
              <div className="space-y-6">
                <div className="bg-gray-100 rounded-xl p-6 text-center min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                  <p className="text-sm text-gray-500 mb-4">Iklan Google AdSense</p>
                  <div className="w-full bg-white rounded-lg p-4">
                    <ins className="adsbygoogle" style={{ display: 'block', width: '100%', minHeight: '150px' }} data-ad-client="ca-pub-9697754978669232" data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2"><DollarSign className="w-5 h-5 text-green-600" /><span className="font-semibold text-gray-900">Reward: Rp{currentReward}</span></div>
                    <div className="flex items-center space-x-2 text-gray-500"><Clock className="w-4 h-4" /><span className="text-sm">15 detik</span></div>
                  </div>
                </div>
                <button onClick={startWatchingAd} className="w-full btn-primary flex items-center justify-center space-x-2 py-4"><Play className="w-5 h-5" /><span>Tonton Iklan & Dapatkan Rp{currentReward}</span></button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="44" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle cx="48" cy="48" r="44" stroke="#0070a0" strokeWidth="8" fill="none" strokeDasharray={`${(adTimer / 15) * 276} 276`} className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center"><span className="text-3xl font-bold text-[#0070a0]">{adTimer}</span></div>
                </div>
                <p className="text-lg text-gray-700 font-medium">Sedang menonton iklan...</p>
                <p className="text-sm text-gray-500 mt-2">Mohon tunggu sampai timer selesai</p>
                <div className="mt-6 bg-gray-100 rounded-xl p-4 animate-pulse"><div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2" /><div className="h-4 bg-gray-300 rounded w-1/2 mx-auto" /></div>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-green-500" /></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tugas Selesai!</h2>
            <p className="text-gray-600 mb-4">Anda berhasil mendapatkan <span className="font-bold text-green-600">Rp{currentReward}</span></p>
            <p className="text-sm text-gray-500 mb-6">Saldo telah ditambahkan ke akun Anda</p>
            <button onClick={resetTask} className="w-full btn-primary flex items-center justify-center space-x-2"><RefreshCw className="w-5 h-5" /><span>Kerjakan Tugas Lagi</span></button>
          </div>
        )}

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Cara Kerja Tugas</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#0070a0] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <p className="text-gray-700"><span className="font-semibold">CAPTCHA:</span> Jawab pertanyaan matematika dengan benar</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#0070a0] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <p className="text-gray-700"><span className="font-semibold">Iklan:</span> Tonton iklan selama 15 detik</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <p className="text-gray-700"><span className="font-semibold">Reward:</span> Dapatkan Rp35-50 per tugas selesai</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
