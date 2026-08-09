import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Phone, ShieldCheck, CheckCircle2, Heart, Clock, LogOut, Save, Sparkles, Building2, Globe } from 'lucide-react';
import { UserProfile as UserProfileType } from '../types';
import { saveUserProfile, logoutUser } from '../services/userService';

interface UserProfileProps {
  currentUser: UserProfileType;
  onUpdateUser: (updated: UserProfileType) => void;
  onLogout: () => void;
  onClose?: () => void;
  onOpenWishlist?: () => void;
  onOpenHistory?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  currentUser,
  onUpdateUser,
  onLogout,
  onClose,
  onOpenWishlist,
  onOpenHistory,
}) => {
  const [name, setName] = useState<string>(currentUser.name || '');
  const [email, setEmail] = useState<string>(currentUser.email || '');
  const [address, setAddress] = useState<string>(currentUser.address || '');
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    setName(currentUser.name || '');
    setEmail(currentUser.email || '');
    setAddress(currentUser.address || '');
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      setIsSaving(true);
      const updated: UserProfileType = {
        ...currentUser,
        name: name.trim() || `User ${currentUser.phone.slice(-4)}`,
        email: email.trim(),
        address: address.trim(),
      };

      const saved = saveUserProfile(updated);
      onUpdateUser(saved);
      setSuccessMsg('Your profile details and shipping address have been saved successfully!');
      
      setTimeout(() => {
        setSuccessMsg('');
      }, 4000);
    } catch (err: any) {
      setErrorMsg('Failed to update profile information. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Overview Card */}
      <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-extrabold text-lg shadow-md shrink-0">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {currentUser.name || 'Registered Account'}
              </h3>
              <span className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                Verified Mobile
              </span>
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
              <span>+91 {currentUser.phone}</span>
              <span>•</span>
              <span className="text-[11px]">Member since {new Date(currentUser.verifiedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            logoutUser();
            onLogout();
          }}
          className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/40 transition-colors flex items-center gap-1.5 cursor-pointer self-end sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Quick Activity Stats */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onOpenWishlist}
          className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-left hover:border-rose-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
              Saved Wishlist
            </span>
            <Heart className="w-4 h-4 text-rose-600 fill-rose-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {currentUser.wishlistProductIds?.length || 0} Items
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenHistory}
          className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Browsing History
            </span>
            <Clock className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {currentUser.recentlyViewedProductIds?.length || 0} Viewed
          </div>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600 dark:text-red-400 animate-fade-in">
          {errorMsg}
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <User className="w-4 h-4 text-amber-600" />
            <span>Personal & Contact Information</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Mobile Number (Verified)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={`+91 ${currentUser.phone}`}
                  disabled
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address Section */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Default Shipping & Delivery Address</span>
          </h4>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Address Lines (Street, Area, Flat/Building No., City, Pincode)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Flat 402, Sunrise Heights, M.G. Road, Near Metro Station, Bangalore - 560001"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Form Controls */}
        <div className="pt-3 flex items-center justify-end gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50 transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Address</span>
          </button>
        </div>
      </form>
    </div>
  );
};
