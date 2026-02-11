export interface User {
  id: string;
  name: string;
  danaNumber: string;
  danaName: string;
  email: string;
  balance: number;
  totalEarned: number;
  adsWatched: number;
  referrals: number;
  referralCode: string;
  referredBy?: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  type: 'captcha' | 'ad';
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  createdAt: Date;
}

export interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  danaNumber: string;
  danaName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  processedAt?: Date;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  referredName: string;
  bonus: number;
  createdAt: Date;
}

export interface AdWatch {
  id: string;
  userId: string;
  adType: string;
  reward: number;
  watchedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (danaNumber: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateBalance: (amount: number) => void;
}

export interface RegisterData {
  name: string;
  danaNumber: string;
  danaName: string;
  email: string;
  password: string;
  referralCode?: string;
}
