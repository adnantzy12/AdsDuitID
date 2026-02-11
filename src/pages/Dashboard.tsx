import { useEffect, useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Play, 
  Users, 
  Copy, 
  CheckCircle,
  LogOut,
  ArrowRight,
  DollarSign,
  Gift,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Withdrawal, Referral } from '@/types';

// Simple Link component using hash navigation
function Link({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={`#${to}`} className={className}>
      {children}
    </a>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      window.location.hash = '/login';
      return;
    }

    // Load withdrawals
    const allWithdrawals = JSON.parse(localStorage.getItem('adsduit_withdrawals') || '[]');
    const userWithdrawals = allWithdrawals.filter((w: Withdrawal) => w.userId === user.id);
    setWithdrawals(userWithdrawals);

    // Load referrals
    const allReferrals = JSON.parse(localStorage.getItem('adsduit_referrals') || '[]');
    const userReferrals = allReferrals.filter((r: Referral) => r.referrerId === user.id);
    setReferrals(userReferrals);
  }, [user]);

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(`${window.location.origin}/#/register?ref=${user.referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.hash = '/';
  };

  if (!user) return null;

  const stats = [
    {
      title: 'Saldo Saat Ini',
      value: `Rp${user.balance.toLocaleString('id-ID')}`,
      icon: Wallet,
      color: 'bg-blue-500',
      link: '/withdraw',
      linkText: 'Tarik Dana',
    },
    {
      title: 'Total Penghasilan',
      value: `Rp${user.totalEarned.toLocaleString('id-ID')}`,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Iklan Ditonton',
      value: user.adsWatched.toString(),
      icon: Play,
      color: 'bg-purple-500',
      link: '/tasks',
      linkText: 'Lihat Tugas',
    },
    {
      title: 'Total Referral',
      value: user.referrals.toString(),
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img src="/logo.png" alt="AdsDuitID" className="h-10 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-[#0070a0] font-medium">Dashboard</Link>
              <Link to="/tasks" className="text-gray-600 hover:text-[#0070a0] font-medium transition-colors">Tugas</Link>
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
                <Link to="/dashboard" className="text-[#0070a0] font-medium">Dashboard</Link>
                <Link to="/tasks" className="text-gray-600 font-medium">Tugas</Link>
                <Link to="/withdraw" className="text-gray-600 font-medium">Penarikan</Link>
                <button onClick={handleLogout} className="text-red-500 font-medium text-left">Keluar</button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0070a0] to-[#1b9cca] rounded-2xl p-6 mb-8 text-white">
          <h1 className="text-2xl font-bold mb-2">Selamat Datang, {user.name}!</h1>
          <p className="text-blue-100">Lanjutkan penghasilan Anda hari ini</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 mb-3">{stat.title}</div>
              {stat.link && (
                <Link 
                  to={stat.link}
                  className="inline-flex items-center text-sm text-[#0070a0] font-medium hover:text-[#004968] transition-colors"
                >
                  {stat.linkText}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Referral Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Referral Code */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Gift className="w-5 h-5 text-[#0070a0]" />
                <h2 className="text-xl font-bold text-gray-900">Kode Referral Anda</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Bagikan kode referral Anda dan dapatkan Rp50 untuk setiap teman yang mendaftar 
                dan menyelesaikan 1x iklan, plus bonus 20% dari penghasilan mereka!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-gray-100 rounded-xl px-4 py-3 font-mono text-lg text-gray-700">
                  {user.referralCode}
                </div>
                <button
                  onClick={copyReferralCode}
                  className="flex items-center justify-center space-x-2 bg-[#0070a0] text-white px-6 py-3 rounded-xl hover:bg-[#004968] transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  to="/tasks"
                  className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Kerjakan Tugas</div>
                    <div className="text-sm text-gray-500">Dapatkan Rp35-50 per tugas</div>
                  </div>
                </Link>
                <Link 
                  to="/withdraw"
                  className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Tarik Dana</div>
                    <div className="text-sm text-gray-500">Min. Rp100 ke DANA</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Withdrawals */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Riwayat Penarikan</h2>
              {withdrawals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Belum ada penarikan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {withdrawals.slice(0, 5).map((withdrawal) => (
                    <div 
                      key={withdrawal.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">
                          Rp{withdrawal.amount.toLocaleString('id-ID')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(withdrawal.requestedAt).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        withdrawal.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {withdrawal.status === 'pending' ? 'Menunggu' :
                         withdrawal.status === 'approved' ? 'Berhasil' : 'Ditolak'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profil Anda</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Nama</div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Nomor DANA</div>
                  <div className="font-medium text-gray-900">{user.danaNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Nama DANA</div>
                  <div className="font-medium text-gray-900">{user.danaName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-900">{user.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Bergabung</div>
                  <div className="font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('id-ID')}
                  </div>
                </div>
              </div>
            </div>

            {/* Referrals List */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Referral Anda</h2>
              {referrals.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Belum ada referral</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {referrals.map((referral) => (
                    <div 
                      key={referral.id}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-xl"
                    >
                      <div className="font-medium text-gray-900">{referral.referredName}</div>
                      <div className="text-green-600 font-semibold">+Rp{referral.bonus}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Google Ad */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <p className="text-xs text-gray-400 text-center mb-2">Iklan</p>
              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500">Google AdSense</p>
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
          </div>
        </div>
      </main>
    </div>
  );
}
