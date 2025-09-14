import React, { useState, useEffect } from 'react';
import { Car, MapPin, Phone, User, Clock, Star, CreditCard, Menu, X, Shield } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

// Utility function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: { ...defaultOptions.headers, ...options.headers },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Something went wrong');
  }

  return response.json();
};

// Authentication Context
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Login Component
const LoginPage = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      onLogin(response.user, response.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Car className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome to Udrive</h1>
          <p className="text-gray-600 mt-2">Your reliable ride partner</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Signup Component
const SignupPage = ({ onLogin, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'rider'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      onLogin(response.user, response.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Car className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Join Udrive</h1>
          <p className="text-gray-600 mt-2">Start your journey with us</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="10-digit mobile number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="rider">Rider</option>
              <option value="driver">Driver</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// OTP Verification Component
const OTPVerification = ({ phone, onVerified }) => {
  const [otp, setOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const sendOTP = async () => {
    setIsLoading(true);
    setError('');
    try {
      await apiCall('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    setIsLoading(true);
    setError('');
    try {
      await apiCall('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });
      onVerified();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Verify Phone Number</h2>
        <p className="text-gray-600 mt-2">We'll send an OTP to {phone}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {!otpSent ? (
        <button
          onClick={sendOTP}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send OTP'}
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="6-digit OTP"
              maxLength={6}
            />
          </div>
          <button
            onClick={verifyOTP}
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}
    </div>
  );
};

// Rider Dashboard
const RiderDashboard = () => {
  const { user } = React.useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('book');
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Booking form state
  const [bookingData, setBookingData] = useState({
    pickupLocation: { address: '', latitude: '', longitude: '' },
    dropoffLocation: { address: '', latitude: '', longitude: '' },
    vehicleType: 'sedan'
  });
  const [fareEstimate, setFareEstimate] = useState(null);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchRideHistory();
    }
  }, [activeTab]);

  const fetchRideHistory = async () => {
    try {
      const response = await apiCall('/rides/history');
      setRides(response.rides);
    } catch (err) {
      console.error('Failed to fetch ride history:', err);
    }
  };

  const handleBookRide = async () => {
    if (!bookingData.pickupLocation.address || !bookingData.dropoffLocation.address) {
      alert('Please enter both pickup and dropoff locations');
      return;
    }

    // For demo, using mock coordinates
    const pickupCoords = { latitude: 28.6139, longitude: 77.2090 };
    const dropoffCoords = { latitude: 28.7041, longitude: 77.1025 };

    setIsLoading(true);
    try {
      const response = await apiCall('/rides/request', {
        method: 'POST',
        body: JSON.stringify({
          pickupLocation: {
            ...pickupCoords,
            address: bookingData.pickupLocation.address
          },
          dropoffLocation: {
            ...dropoffCoords,
            address: bookingData.dropoffLocation.address
          },
          vehicleType: bookingData.vehicleType
        }),
      });
      
      alert('Ride booked successfully!');
      setFareEstimate(response.ride.fare);
      setBookingData({
        pickupLocation: { address: '', latitude: '', longitude: '' },
        dropoffLocation: { address: '', latitude: '', longitude: '' },
        vehicleType: 'sedan'
      });
    } catch (err) {
      alert('Failed to book ride: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const vehicleTypes = [
    { id: 'hatchback', name: 'Hatchback', price: '₹10/km', icon: '🚗' },
    { id: 'sedan', name: 'Sedan', price: '₹12/km', icon: '🚙' },
    { id: 'suv', name: 'SUV', price: '₹15/km', icon: '🚐' },
    { id: 'premium', name: 'Premium', price: '₹20/km', icon: '🏎️' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h1>
            <p className="text-gray-600">Where would you like to go today?</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {user.isPhoneVerified ? 'Verified' : 'Unverified'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('book')}
            className={`px-6 py-4 font-medium ${activeTab === 'book' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Book Ride
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-4 font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Ride History
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'book' && (
            <div className="space-y-6">
              {/* Location inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    value={bookingData.pickupLocation.address}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      pickupLocation: { ...bookingData.pickupLocation, address: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter pickup location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Navigation className="w-4 h-4 inline mr-1" />
                    Dropoff Location
                  </label>
                  <input
                    type="text"
                    value={bookingData.dropoffLocation.address}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      dropoffLocation: { ...bookingData.dropoffLocation, address: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter destination"
                  />
                </div>
              </div>

              {/* Vehicle selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Choose Vehicle</label>
                <div className="grid grid-cols-2 gap-4">
                  {vehicleTypes.map(vehicle => (
                    <button
                      key={vehicle.id}
                      onClick={() => setBookingData({ ...bookingData, vehicleType: vehicle.id })}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        bookingData.vehicleType === vehicle.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{vehicle.name}</div>
                          <div className="text-sm text-gray-600">{vehicle.price}</div>
                        </div>
                        <div className="text-2xl">{vehicle.icon}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fare estimate */}
              {fareEstimate && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-800 mb-2">Fare Estimate</h3>
                  <div className="text-sm text-green-700 space-y-1">
                    <div>Base Fare: ₹{fareEstimate.baseFare}</div>
                    <div>Distance Fare: ₹{fareEstimate.distanceFare}</div>
                    <div>Time Fare: ₹{fareEstimate.timeFare}</div>
                    <div className="font-medium text-lg">Total: ₹{fareEstimate.totalFare}</div>
                  </div>
                </div>
              )}

              {/* Book button */}
              <button
                onClick={handleBookRide}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-lg font-medium"
              >
                {isLoading ? 'Booking...' : 'Book Ride'}
              </button>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {rides.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No rides found</p>
                </div>
              ) : (
                rides.map(ride => (
                  <div key={ride.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {ride.pickupLocation.address} → {ride.dropoffLocation.address}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {new Date(ride.createdAt).toLocaleDateString()} • {ride.vehicleType}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{ride.totalFare}</div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          ride.status === 'completed' ? 'bg-green-100 text-green-800' :
                          ride.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ride.status}
                        </div>
                      </div>
                    </div>
                    {ride.driver && (
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-1" />
                        Driver: {ride.driver.name}
                        {ride.driverRating && (
                          <div className="ml-2 flex items-center">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="ml-1">{ride.driverRating}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Driver Dashboard
const DriverDashboard = () => {
  const { user } = React.useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('available');
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'available') {
      fetchAvailableRides();
    } else if (activeTab === 'history') {
      fetchRideHistory();
    }
  }, [activeTab]);

  const fetchAvailableRides = async () => {
    try {
      const response = await apiCall('/rides/available');
      setRides(response.rides);
    } catch (err) {
      console.error('Failed to fetch available rides:', err);
    }
  };

  const fetchRideHistory = async () => {
    try {
      const response = await apiCall('/rides/history');
      setRides(response.rides);
    } catch (err) {
      console.error('Failed to fetch ride history:', err);
    }
  };

  const acceptRide = async (rideId) => {
    setIsLoading(true);
    try {
      await apiCall(`/rides/${rideId}/accept`, { method: 'POST' });
      alert('Ride accepted successfully!');
      fetchAvailableRides();
    } catch (err) {
      alert('Failed to accept ride: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startRide = async (rideId) => {
    try {
      await apiCall(`/rides/${rideId}/start`, { method: 'POST' });
      alert('Ride started!');
      fetchRideHistory();
    } catch (err) {
      alert('Failed to start ride: ' + err.message);
    }
  };

  const completeRide = async (rideId) => {
    try {
      await apiCall(`/rides/${rideId}/complete`, { method: 'POST' });
      alert('Ride completed!');
      fetchRideHistory();
    } catch (err) {
      alert('Failed to complete ride: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Driver Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>
          <div className="text-right">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              Online
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-4 font-medium ${activeTab === 'available' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Available Rides
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-4 font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            My Rides
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'available' && (
            <div className="space-y-4">
              {rides.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No available rides at the moment</p>
                </div>
              ) : (
                rides.map(ride => (
                  <div key={ride.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 mb-2">
                          {ride.pickupLocation.address} → {ride.dropoffLocation.address}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Distance: {ride.distance.toFixed(1)} km • Duration: {ride.duration} mins</div>
                          <div>Vehicle: {ride.vehicleType}</div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            Rider: {ride.rider.name} • {ride.rider.phone}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-green-600 mb-2">₹{ride.totalFare}</div>
                        <button
                          onClick={() => acceptRide(ride.id)}
                          disabled={isLoading}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {isLoading ? 'Accepting...' : 'Accept Ride'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {rides.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No rides completed yet</p>
                </div>
              ) : (
                rides.map(ride => (
                  <div key={ride.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {ride.pickupLocation.address} → {ride.dropoffLocation.address}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {new Date(ride.createdAt).toLocaleDateString()} • {ride.vehicleType}
                        </div>
                        {ride.rider && (
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <User className="w-4 h-4 mr-1" />
                            Rider: {ride.rider.name}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{ride.totalFare}</div>
                        <div className={`text-xs px-2 py-1 rounded mt-1 ${
                          ride.status === 'completed' ? 'bg-green-100 text-green-800' :
                          ride.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                          ride.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ride.status.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action buttons based on ride status */}
                    {ride.status === 'accepted' && (
                      <button
                        onClick={() => startRide(ride.id)}
                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Start Ride
                      </button>
                    )}
                    
                    {ride.status === 'in_progress' && (
                      <button
                        onClick={() => completeRide(ride.id)}
                        className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Complete Ride
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Navigation Component
const Navigation = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Car className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">Udrive</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user.name}</span>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {user.role}
            </div>
            <button
              onClick={onLogout}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="space-y-2">
              <div className="text-gray-700">Welcome, {user.name}</div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm inline-block">
                {user.role}
              </div>
              <button
                onClick={onLogout}
                className="block w-full text-left text-red-600 hover:text-red-700 font-medium py-2"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Profile Component
const ProfilePage = () => {
  const { user } = React.useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    vehicleInfo: {
      make: '',
      model: '',
      year: '',
      licensePlate: '',
      color: '',
      vehicleType: 'sedan'
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await apiCall('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="font-medium text-gray-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="text-gray-900">{user.name}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="text-gray-900">{user.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="text-gray-900">{user.phone}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="text-gray-900 capitalize">{user.role}</div>
              </div>
            </div>
          </div>

          {/* Driver Vehicle Info */}
          {user.role === 'driver' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-4">Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.vehicleInfo.make}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        vehicleInfo: { ...profileData.vehicleInfo, make: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Toyota"
                    />
                  ) : (
                    <div className="text-gray-900">{profileData.vehicleInfo.make || 'Not set'}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.vehicleInfo.model}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        vehicleInfo: { ...profileData.vehicleInfo, model: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Camry"
                    />
                  ) : (
                    <div className="text-gray-900">{profileData.vehicleInfo.model || 'Not set'}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.vehicleInfo.licensePlate}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        vehicleInfo: { ...profileData.vehicleInfo, licensePlate: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., DL01AB1234"
                    />
                  ) : (
                    <div className="text-gray-900">{profileData.vehicleInfo.licensePlate || 'Not set'}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.vehicleInfo.color}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        vehicleInfo: { ...profileData.vehicleInfo, color: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., White"
                    />
                  ) : (
                    <div className="text-gray-900">{profileData.vehicleInfo.color || 'Not set'}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="pt-4 border-t">
              <button
                onClick={handleUpdateProfile}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const UdriveApp = () => {
  const [currentView, setCurrentView] = useState('login');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const handleLogin = (userData, token) => {
    if (!userData.isPhoneVerified) {
      setPendingUser({ userData, token });
      setShowOTPVerification(true);
    } else {
      const { login } = React.useContext(AuthContext);
      login(userData, token);
      setCurrentView('dashboard');
    }
  };

  const handleOTPVerified = () => {
    if (pendingUser) {
      const { login } = React.useContext(AuthContext);
      login(pendingUser.userData, pendingUser.token);
      setShowOTPVerification(false);
      setPendingUser(null);
      setCurrentView('dashboard');
    }
  };

  const { user, logout, isLoading } = React.useContext(AuthContext);

  useEffect(() => {
    if (user && !isLoading) {
      setCurrentView('dashboard');
    } else if (!user && !isLoading) {
      setCurrentView('login');
    }
  }, [user, isLoading]);

  const handleLogout = () => {
    logout();
    setCurrentView('login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Car className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-bounce" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showOTPVerification && pendingUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <OTPVerification 
          phone={pendingUser.userData.phone} 
          onVerified={handleOTPVerified} 
        />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {currentView === 'login' && (
          <LoginPage 
            onLogin={handleLogin}
            onSwitchToSignup={() => setCurrentView('signup')}
          />
        )}
        {currentView === 'signup' && (
          <SignupPage 
            onLogin={handleLogin}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation user={user} onLogout={handleLogout} />
      
      <main className="py-6">
        {currentView === 'dashboard' && (
          <>
            {user.role === 'rider' ? (
              <RiderDashboard />
            ) : (
              <DriverDashboard />
            )}
          </>
        )}
        
        {currentView === 'profile' && (
          <ProfilePage />
        )}
      </main>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex-1 py-3 px-4 text-center ${
              currentView === 'dashboard' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Car className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentView('profile')}
            className={`flex-1 py-3 px-4 text-center ${
              currentView === 'profile' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <User className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Root App with Context Provider
const App = () => {
  return (
    <AuthProvider>
      <UdriveApp />
    </AuthProvider>
  );
};

export default App;
