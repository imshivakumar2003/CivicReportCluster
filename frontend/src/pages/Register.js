import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import { Spinner, Alert } from '../components/UI';
import {
  User, Mail, Lock, ShieldCheck, ArrowRight, Key,
  Phone, MapPin, IdCard, MapPinHouse, Loader2, LocateFixed
} from 'lucide-react';

const STATES = ['Karnataka']; // can be extended

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line: '',
      city: '',
      district: '',
      state: 'Karnataka',
      pincode: '',
    },
    nationalId: '',
    password: '',
    confirmPassword: '',
    adminKey: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [fetchingPincode, setFetchingPincode] = useState(false);
  const [locating, setLocating] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const fetchDistrictFromPincode = async (pincode) => {
    if (pincode.length !== 6) return;
    setFetchingPincode(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data[0].Status === 'Success') {
        const office = data[0].PostOffice[0];
        setForm(prev => ({
          ...prev,
          address: {
            ...prev.address,
            district: office.District,
            city: office.Block || office.Taluk || office.Name, // best effort for taluk
            state: office.State,
          },
        }));
      } else {
        setError('Invalid PIN code. Please enter a valid Indian PIN code.');
      }
    } catch (err) {
      setError('Failed to fetch location from PIN code.');
    } finally {
      setFetchingPincode(false);
    }
  };

  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setForm(prev => ({
      ...prev,
      address: { ...prev.address, pincode: val },
    }));
    if (val.length === 6) {
      fetchDistrictFromPincode(val);
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await res.json();
          if (data.address) {
            const adr = data.address;
            setForm(prev => ({
              ...prev,
              address: {
                ...prev.address,
                line: adr.road || adr.neighbourhood || adr.suburb || '',
                city: adr.city || adr.town || adr.village || adr.county || '',
                district: adr.county || adr.state_district || '',
                state: adr.state || 'Karnataka',
                pincode: adr.postcode || prev.address.pincode,
              },
            }));
          }
        } catch (err) {
          setError('Failed to reverse geocode location.');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setError('Location access denied. Please enable location services.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const validate = () => {
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!/^\d{10,15}$/.test(form.phone.trim())) {
      setError('Please enter a valid phone number (10-15 digits)');
      return false;
    }
    if (form.nationalId.trim().length < 5) {
      setError('National ID must be at least 5 characters');
      return false;
    }
    if (!form.address.line || !form.address.city || !form.address.district || !form.address.pincode) {
      setError('Please fill all address fields');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const submissionData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        nationalId: form.nationalId,
        password: form.password,
        role: showAdminKey && form.adminKey ? 'admin' : 'user',
        adminKey: form.adminKey,
      };

      const { data } = await authAPI.register(submissionData);
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[480px] z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform duration-300">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">CivicPulse</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900">Create account</h1>
          <p className="text-slate-500 mt-2">Start making a difference in your community today.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100 transition-all">
          {error && <Alert type="error" message={error} className="mb-6" onClose={() => setError('')} />}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 9876543210"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700">Address</h3>
                <button
                  type="button"
                  onClick={handleGeolocation}
                  disabled={locating}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 disabled:opacity-50"
                >
                  {locating ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <LocateFixed size={14} />
                  )}
                  Use current location
                </button>
              </div>

              {/* Address Line */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <MapPinHouse size={18} />
                </div>
                <input
                  type="text"
                  name="address.line"
                  placeholder="House/Street/Locality"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                  value={form.address.line}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PIN Code + District */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    name="address.pincode"
                    placeholder="PIN Code"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                    value={form.address.pincode}
                    onChange={handlePincodeChange}
                    required
                  />
                  {fetchingPincode && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 size={16} className="animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    name="address.district"
                    placeholder="District"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                    value={form.address.district}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Taluk / City */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <MapPin size={18} />
                </div>
                <input
                  type="text"
                  name="address.city"
                  placeholder="Taluk / City"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                  value={form.address.city}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* State (default Karnataka) */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <MapPin size={18} />
                </div>
                <select
                  name="address.state"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all appearance-none"
                  value={form.address.state}
                  onChange={handleChange}
                >
                  {STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* National ID */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">National ID Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <IdCard size={18} />
                </div>
                <input
                  type="text"
                  name="nationalId"
                  placeholder="Enter your national ID"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                  value={form.nationalId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Admin Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdminKey(!showAdminKey)}
                className={`flex items-center gap-2 text-xs font-bold transition-colors ${showAdminKey ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Key size={14} />
                {showAdminKey ? 'Cancel Admin Registration' : 'Register as an Authority?'}
              </button>
              {showAdminKey && (
                <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <input
                    type="password"
                    name="adminKey"
                    placeholder="Enter official admin key"
                    className="w-full px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-blue-900 placeholder:text-blue-300 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    value={form.adminKey}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-bold hover:underline underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;