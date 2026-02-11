import { useEffect, useState } from 'react';
import { 
  LogOut, 
  CheckCircle, 
  XCircle,
  Users,
  DollarSign,
  TrendingUp,
  RefreshCw,
  ArrowLeft,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Withdrawal, User } from '@/types';

// Simple Link component using hash navigation
function Link({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={`#${to}`} className={className}>
      {children}
    </a>
  );
}

export default function Admin() {
  const { isAdmin, logout } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'withdrawals' | 'users'>('withdrawals');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      window.location.hash = '/login';
      return;
    }

    loadData();
  }, [isAdmin]);

  const loadData = () => {
    const allWithdrawals = JSON.parse(localStorage.getItem('adsduit_withdrawals') || '[]');
    const allUsers = JSON.parse(localStorage.getItem('adsduit_users') || '[]');
    
    setWithdrawals(allWithdrawals.sort((a: Withdrawal, b: Withdrawal) => 
      new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    ));
    setUsers(allUsers);
  };

  const handleApprove = (withdrawalId: string) => {
    const allWithdrawals = JSON.parse(localStorage.getItem('adsduit_withdrawals') || '[]');
    const index = allWithdrawals.findIndex((w: Withdrawal) => w.id === withdrawalId);
    
    if (index !== -1) {
      allWithdrawals[index].status = 'approved';
      allWithdrawals[index].processedAt = new Date();
      localStorage.setItem('adsduit_withdrawals', JSON.stringify(allWithdrawals));
      loadData();
    }
  };

  const handleReject = (withdrawalId: string) => {
    const allWithdrawals = JSON.parse(localStorage.getItem('adsduit_withdrawals') || '[]');
    const users = JSON.parse(localStorage.getItem('adsduit_users') || '[]');
    const index = allWithdrawals.findIndex((w: Withdrawal) => w.id === withdrawalId);
    
    if (index !== -1) {
      const withdrawal = allWithdrawals[index];
      withdrawal.status = 'rejected';
      withdrawal.processedAt = new Date();
      
      // Return balance to user
      const userIndex = users.findIndex((u: User) => u.id === withdrawal.userId);
      if (userIndex !== -1) {
        users[userIndex].balance += withdrawal.amount;
        localStorage.setItem('adsduit_users', JSON.stringify(users));
      }
      
      localStorage.setItem('adsduit_withdrawals', JSON.stringify(allWithdrawals));
      loadData();
    }
  };

  const handleLogout = () => {
    logout();
    window.location.hash = '/';
  };

  const filteredWithdrawals = withdrawals.filter(w => {
    if (filter !== 'all' && w.status !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        w.userName.toLowerCase().includes(query) ||
        w.danaNumber.includes(query) ||
        w.danaName.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const stats = {
    totalUsers: users.length,
    totalWithdrawals: withdrawals.length,
    pendingWithdrawals: withdrawals.filter(w => w.status === 'pending').length,
    totalPaid: withdrawals
      .filter(w => w.status === 'approved')
      .reduce((sum, w) => sum + w.amount, 0),
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-[#0070a0] to-[#004968] shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-white hover:text-blue-100">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <span className="text-white font-bold text-xl">Admin Panel</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 text-white hover:text-blue-100 font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">Kelola penarikan dan pengguna</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
            <div className="text-sm text-gray-500">Total Pengguna</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalWithdrawals}</div>
            <div className="text-sm text-gray-500">Total Penarikan</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingWithdrawals}</div>
            <div className="text-sm text-gray-500">Menunggu</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              Rp{stats.totalPaid.toLocaleString('id-ID')}
            </div>
            <div className="text-sm text-gray-500">Total Dibayar</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'withdrawals'
                ? 'bg-[#0070a0] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Penarikan
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-[#0070a0] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Pengguna
          </button>
        </div>

        {activeTab === 'withdrawals' ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0070a0] focus:border-transparent"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu</option>
                    <option value="approved">Berhasil</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari pengguna..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0070a0] focus:border-transparent w-full sm:w-64"
                  />
                </div>
              </div>
            </div>

            {/* Withdrawals Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Pengguna</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Jumlah</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">DANA</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredWithdrawals.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Tidak ada data penarikan
                      </td>
                    </tr>
                  ) : (
                    filteredWithdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{withdrawal.userName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">
                            Rp{withdrawal.amount.toLocaleString('id-ID')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium">{withdrawal.danaName}</div>
                            <div className="text-gray-500">{withdrawal.danaNumber}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {new Date(withdrawal.requestedAt).toLocaleDateString('id-ID')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            withdrawal.status === 'approved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {withdrawal.status === 'pending' ? 'Menunggu' :
                             withdrawal.status === 'approved' ? 'Berhasil' : 'Ditolak'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {withdrawal.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApprove(withdrawal.id)}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                title="Setujui"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleReject(withdrawal.id)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                title="Tolak"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">DANA</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Saldo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Referral</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Tidak ada data pengguna
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium">{user.danaName}</div>
                            <div className="text-gray-500">{user.danaNumber}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">
                            Rp{user.balance.toLocaleString('id-ID')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-green-600">
                            Rp{user.totalEarned.toLocaleString('id-ID')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            <div>{user.referrals} orang</div>
                            <div className="text-xs text-gray-400">{user.referralCode}</div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
