import React, { useState, useEffect } from 'react';
import { X, Phone, ShieldCheck, CheckCircle2, User, KeyRound, RefreshCw, ArrowRight } from 'lucide-react';
import { UserProfile as UserProfileType } from '../types';
import { sendOTP, verifyOTP, logoutUser } from '../services/userService';
import { UserProfile } from './UserProfile';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfileType | null;
  onUserLogin: (user: UserProfileType) => void;
  onUserLogout: () => void;
  initialPhone?: string;
  onSuccessAction?: () => void;
  onOpenWishlist?: () => void;
  onOpenHistory?: () => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserLogin,
  onUserLogout,
  initialPhone = '',
  onSuccessAction,
  onOpenWishlist,
  onOpenHistory,
}) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneInput, setPhoneInput] = useState<string>(initialPhone || '');
  const [nameInput, setNameInput] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [activeOTPCode, setActiveOTPCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setPhoneInput(currentUser.phone);
      setNameInput(currentUser.name || '');
      setStep('profile');
    } else {
      setStep('phone');
      setPhoneInput(initialPhone || '');
      setOtpInput('');
      setActiveOTPCode(null);
    }
    setErrorMsg('');
    setSuccessMsg('');
  }, [currentUser, isOpen, initialPhone]);

  if (!isOpen) return null;

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
      setSuccessMsg(`OTP sent successfully to +91 ${clean}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otpInput || otpInput.trim().length < 4) {
      setErrorMsg('Please enter the verification code.');
      return;
    }

    try {
      setIsSubmitting(true);
      const verifiedUser = verifyOTP(phoneInput, otpInput, nameInput);
      onUserLogin(verifiedUser);
      setSuccessMsg('Phone verified successfully! Account logged in.');
      if (onSuccessAction) {
        onSuccessAction();
      } else {
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid OTP code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    onUserLogout();
    setStep('phone');
    setPhoneInput('');
    setOtpInput('');
    setNameInput('');
    setSuccessMsg('Logged out successfully.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {currentUser ? 'My Account & Profile' : 'User Verification'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {currentUser ? 'Dedicated account & saved preferences' : 'Login via Mobile & OTP'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600 dark:text-red-400">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: ENTER PHONE & NAME */}
        {step === 'phone' && (
          <form onSubmit={handleSendOTP} className="mt-5 space-y-4">
            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Verify your phone number to access your persistent <span className="font-bold text-rose-600 dark:text-rose-400">Wishlist</span> and <span className="font-bold text-amber-600 dark:text-amber-400">Browsing History</span> across visits.
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Full Name (Optional)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Mobile Number *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-500">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-3 py-2.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || phoneInput.length < 10}
              className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Get Verification OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="mt-5 space-y-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-1">
              <div className="font-extrabold text-amber-800 dark:text-amber-300 flex items-center justify-between">
                <span>OTP Verification Code</span>
                {activeOTPCode && (
                  <span className="bg-amber-600 text-white px-2 py-0.5 rounded-md font-mono text-[11px] tracking-widest font-black">
                    Code: {activeOTPCode}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-200/80">
                Enter code <span className="font-mono font-bold text-amber-900 dark:text-amber-100">{activeOTPCode || '123456'}</span> or test code <span className="font-mono font-bold">123456</span> to complete login for <span className="font-bold">+91 {phoneInput}</span>.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Enter 6-Digit OTP *
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-base font-mono font-extrabold tracking-widest text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                Change Phone Number
              </button>

              <button
                type="button"
                onClick={() => {
                  const res = sendOTP(phoneInput, nameInput);
                  setActiveOTPCode(res.otpCode);
                  setSuccessMsg('Resent OTP successfully!');
                }}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Resend OTP
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !otpInput}
              className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify & Login Dedicated Account</span>
            </button>
          </form>
        )}

        {/* STEP 3: LOGGED IN USER PROFILE */}
        {step === 'profile' && currentUser && (
          <div className="mt-4">
            <UserProfile
              currentUser={currentUser}
              onUpdateUser={onUserLogin}
              onLogout={handleLogout}
              onClose={onClose}
              onOpenWishlist={() => {
                onClose();
                if (onOpenWishlist) onOpenWishlist();
              }}
              onOpenHistory={() => {
                onClose();
                if (onOpenHistory) onOpenHistory();
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
};
