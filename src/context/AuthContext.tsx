import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType, RegisterData } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin credentials
const ADMIN_DANA = '083832175672';
const ADMIN_PASS = 'admin123';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('adsduit_user');
    const savedAdmin = localStorage.getItem('adsduit_admin');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    if (savedAdmin) {
      setIsAdmin(true);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (danaNumber: string, password: string): Promise<boolean> => {
    // Check admin login
    if (danaNumber === ADMIN_DANA && password === ADMIN_PASS) {
      setIsAdmin(true);
      setIsAuthenticated(true);
      localStorage.setItem('adsduit_admin', 'true');
      return true;
    }

    // Check user login
    const users = JSON.parse(localStorage.getItem('adsduit_users') || '[]');
    const foundUser = users.find((u: User) => u.danaNumber === danaNumber);
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('adsduit_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('adsduit_users') || '[]');
    
    // Check if user already exists
    if (users.find((u: User) => u.danaNumber === data.danaNumber)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      danaNumber: data.danaNumber,
      danaName: data.danaName,
      email: data.email,
      balance: 0,
      totalEarned: 0,
      adsWatched: 0,
      referrals: 0,
      referralCode: `ADS${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      referredBy: data.referralCode,
      createdAt: new Date(),
    };

    // Handle referral bonus
    if (data.referralCode) {
      const referrer = users.find((u: User) => u.referralCode === data.referralCode);
      if (referrer) {
        referrer.balance += 50;
        referrer.referrals += 1;
        newUser.balance += 50; // New user also gets bonus
        
        // Save referral record
        const referrals = JSON.parse(localStorage.getItem('adsduit_referrals') || '[]');
        referrals.push({
          id: Date.now().toString(),
          referrerId: referrer.id,
          referredId: newUser.id,
          referredName: newUser.name,
          bonus: 50,
          createdAt: new Date(),
        });
        localStorage.setItem('adsduit_referrals', JSON.stringify(referrals));
      }
    }

    users.push(newUser);
    localStorage.setItem('adsduit_users', JSON.stringify(users));
    localStorage.setItem('adsduit_user', JSON.stringify(newUser));
    
    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('adsduit_user');
    localStorage.removeItem('adsduit_admin');
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        balance: user.balance + amount,
        totalEarned: user.totalEarned + amount,
        adsWatched: user.adsWatched + 1
      };
      setUser(updatedUser);
      localStorage.setItem('adsduit_user', JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('adsduit_users') || '[]');
      const index = users.findIndex((u: User) => u.id === user.id);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('adsduit_users', JSON.stringify(users));
      }

      // Check if user was referred and give 20% bonus to referrer
      if (user.referredBy) {
        const referrer = users.find((u: User) => u.referralCode === user.referredBy);
        if (referrer) {
          const bonusAmount = Math.floor(amount * 0.2);
          referrer.balance += bonusAmount;
          const referrerIndex = users.findIndex((u: User) => u.id === referrer.id);
          users[referrerIndex] = referrer;
          localStorage.setItem('adsduit_users', JSON.stringify(users));
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAdmin, 
      login, 
      register, 
      logout, 
      updateBalance 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
