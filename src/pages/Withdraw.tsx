import { useEffect, useState } from 'react';
import { 
  Wallet, 
  LogOut, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Clock,
  Menu,
  X,
  History
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Withdrawal } from '@/types';

// Simple Link component using hash navigation
function Link({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={`#${to}`} className={className}>
      {children}
    </a>
  );
}

export default function Withdraw() {
  const { user, logout } = useAuth();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      window.location.hash = '/login';
      return;
    }

    // Load withdrawals
    const allWithdrawals = JSON.parse(localStorage.getItem('adsduit_withdrawals') || '[]');
    const userWithdrawals = allWithdrawals.filter((w: Withdrawal) => w.userId === user.id);
    setWithdrawals(userWithdrawals.sort((a: Withdrawal, b: Withdrawal) => 
      new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    ));
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const withdrawAmount = parseInt(amount);

    if (!withdrawAmount || withdrawAmount < 100) {
      setError('Minimal penarikan adalah Rp100');
      return;
    }

    if (!user || withdrawAmount > user.balance) {
      setError('Saldo tidak mencukupi');
      return;
    }

    // Create withdrawal request
    const newWithdrawal: Withdrawal = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      danaNumber: user.danaNumber,
      danaName: user.danaName,
      amount: withdrawAmount,
      status: 'pending',
      requestedAt: new Date(),
    };

    // Save withdrawal
    const allWithdrawals = JSON.parse(localStorage.getItem('adsduit_withdrawals') || '[]');
    allWithdrawals.push(newWithdrawal);
    localStorage.setItem('adsduit_withdrawals', JSON.stringify(allWithdrawals));

    // Update user balance
    const users = JSON.parse(localStorage.getItem('adsduit_users') || '[]');
    const userIndex = users.findIndex((u: typeof user) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].balance -= withdrawAmount;
      localStorage.setItem('adsduit_users', JSON.stringify(users));
      localStorage.setItem('adsduit_user', JSON.stringify(users[userIndex]));
    }

    setSuccess(true);
    setAmount('');
    setWithdrawals([newWithdrawal, ...withdrawals]);

    // Refresh page to update balance
    setTimeout(() => {
      window.location.reload();
    }, 2000);
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
              <Link to="/tasks" className="text-gray-600 hover:text-[#0070a0] font-medium transition-colors">Tugas</Link>
              <Link to="/withdraw" className="text-[#0070a0] font-medium">Penarikan</Link>
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
                <Link to="/tasks" className="text-gray-600 font-medium">Tugas</Link>
                <Link to="/withdraw" className="text-[#0070a0] font-medium">Penarikan</Link>
                <button onClick={handleLogout} className="text-red-500 font-medium text-left">Keluar</button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Penarikan Dana</h1>
          <p className="text-gray-600 mt-2">Tarik penghasilan Anda ke akun DANA</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-[#0070a0] to-[#1b9cca] rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1">Saldo Tersedia</p>
              <p className="text-4xl font-bold">Rp{user.balance.toLocaleString('id-ID')}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Withdrawal Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Form Penarikan</h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Permintaan penarikan berhasil diajukan!</span>
              </div>
            )}

            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Informasi Rekening</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nomor DANA:</span>
                  <span className="font-medium">{user.danaNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nama DANA:</span>
                  <span className="font-medium">{user.danaName}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Penarikan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0070a0] focus:border-transparent transition-all"
                    placeholder="Minimal Rp100"
                    min="100"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Minimal penarikan: Rp100</p>
              </div>

              <button
                type="submit"
                disabled={user.balance < 100}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>Ajukan Penarikan</span>
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </form>

            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-start space-x-2">
                <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-semibold mb-1">Proses Penarikan</p>
                  <p>Penarikan akan diproses oleh admin dalam 1-3 hari kerja. Anda akan menerima notifikasi saat dana masuk ke akun DANA Anda.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal History */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <History className="w-5 h-5 text-[#0070a0]" />
              <h2 className="text-xl font-bold text-gray-900">Riwayat Penarikan</h2>
            </div>

            {withdrawals.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Belum ada riwayat penarikan</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {withdrawals.map((withdrawal) => (
                  <div 
                    key={withdrawal.id}
                    className="p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">
                        Rp{withdrawal.amount.toLocaleString('id-ID')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        withdrawal.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {withdrawal.status === 'pending' ? 'Menunggu' :
                         withdrawal.status === 'approved' ? 'Berhasil' : 'Ditolak'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(withdrawal.requestedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Google Ad */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-4">
          <p className="text-xs text-gray-400 text-center mb-2">Iklan</p>
          <div className="bg-gray-100 rounded-xl p-4 text-center">
            <ins 
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-9697754978669232"
              data-ad-slot="1234567890"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
