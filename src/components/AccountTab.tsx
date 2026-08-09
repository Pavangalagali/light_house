import React, { useState } from 'react';
import { User, Phone, ShieldCheck, CheckCircle2, KeyRound, RefreshCw, ArrowRight, Sparkles, MapPin, Mail, LogIn } from 'lucide-react';
import { UserProfile as UserProfileType } from '../types';
import { UserProfile } from './UserProfile';
import { sendOTP, verifyOTP } from '../services/userService';

interface AccountTabProps {
  currentUser: UserProfileType | null;
  onUserLogin: (user: UserProfileType) => void;
  onUserLogout: () => void;
  onOpenWishlist: () => void;
  onOpenHistory: () => void;
  onBackToCatalog: () => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  currentUser,
  onUserLogin,
  onUserLogout,
  onOpenWishlist,
  onOpenHistory,
  onBackToCatalog,
}) => {
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [activeOTPCode, setActiveOTPCode] = useState<string | null>(null);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const clean = phoneInput.trim().replace(/\D/g, '');
    if (clean.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = sendOTP(clean, nameInput);
      setActiveOTPCode(res.otpCode);
      setStep('otp');
      setSuccessMsg(`Verification code sent to +91 ${clean}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otpInput || otpInput.trim().length < 4) {
      setErrorMsg('Please enter the 4-digit verification code.');
      return;
    }

    try {
      setIsSubmitting(true);
      const verifiedUser = verifyOTP(phoneInput, otpInput, nameInput);
      onUserLogin(verifiedUser);
      setSuccessMsg('Phone verified successfully! You are now logged in.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5 mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <User className="w-3.5 h-3.5" />
              <span>User Account & Details Tab</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {currentUser ? 'My Account & Delivery Profile' : 'Sign In or Register Account'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentUser 
                ? 'Manage your personal details, default shipping address, saved wishlist, and browsing history.' 
                : 'Enter your 10-digit Indian mobile number to log in or register via OTP verification.'}
            </p>
          </div>

          <button
            onClick={onBackToCatalog}
            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer self-start sm:self-center"
          >
            &larr; Back to Catalog
          </button>
        </div>

        {/* LOGGED IN VIEW */}
        {currentUser ? (
          <UserProfile
            currentUser={currentUser}
            onUpdateUser={onUserLogin}
            onLogout={onUserLogout}
            onOpenWishlist={onOpenWishlist}
            onOpenHistory={onOpenHistory}
          />
        ) : (
          /* NOT LOGGED IN - INLINE OTP FORM */
          <div className="max-w-lg mx-auto py-4 space-y-6">
            <div className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl border border-amber-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-amber-600 shrink-0" />
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white text-sm">Instant Mobile Verification</div>
                <div>No passwords required. Log in with a 1-click OTP to save your shipping address and wishlist items.</div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600 dark:text-red-400">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {step === 'phone' ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mobile Number <span className="text-amber-600">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-xs font-bold text-slate-500 font-mono">
                      +91
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="98765 43210"
                      required
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-amber-600 hover:bg-amber-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Send OTP Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 font-mono flex items-center justify-between">
                  <span>Demo OTP Code: <strong className="text-amber-600 font-extrabold">{activeOTPCode}</strong></span>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-[11px] underline font-sans text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    Change Number
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Enter Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter code"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP & Access Profile</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
