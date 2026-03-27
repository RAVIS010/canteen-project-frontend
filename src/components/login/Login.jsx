import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { Mail, Lock, Eye, EyeOff, UtensilsCrossed } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [datetime, setDatetime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDatetime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            const { role, token, name, canteenName } = response;

            toast.success('Login successful:');
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('name', name);
            if (response.sessionId) localStorage.setItem('sessionId', response.sessionId);
            if (canteenName) localStorage.setItem('canteenName', canteenName);
            if (response.assignedCanteens) {
                localStorage.setItem('assignedCanteens', JSON.stringify(response.assignedCanteens));
            }

            const userRole = role.toLowerCase();

            if (userRole === 'admin') {
                navigate('/admin-dashboard');
            } else if (userRole === 'mess' || userRole.startsWith('cps-manager-') || userRole.startsWith('cps-staff-')) {
                const assignedCanteens = response.assignedCanteens || [];
                const firstAssigned = assignedCanteens[0];
                if (firstAssigned) {
                    navigate('/mess-dashboard', { state: { selectedUnit: firstAssigned } });
                } else {
                    navigate('/mess-dashboard');
                }
            } else if (userRole === 'user' || userRole === 'canteen' || userRole === 'canteen-manager') {
                navigate('/user-dashboard');
            } else {
                navigate('/admin-dashboard');
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            toast.error(error.response?.data?.error || 'Login failed. Please check your credentials.');
        }
    };

    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="logo-section">
                    {/* Logo icon — always visible at the top */}
                    <div className="logo-icon">
                        <UtensilsCrossed size={32} color="black" />
                    </div>
                    {/* Mobile CMS Title — shown only on mobile, below icon */}
                    <div className="mobile-cms-title">
                        <h2 className="hero-title">CANTEEN</h2>
                        <h2 className="hero-title outline">MANAGEMENT</h2>
                        <h2 className="hero-title">SYSTEM</h2>
                    </div>
                    <div className="datetime-display">
                        <div className="time">{formatTime(datetime)}</div>
                        <div className="date">{formatDate(datetime)}</div>
                    </div>
                </div>

                <div className="form-section">
                    {/* Form header removed as per request */}

                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="input-group">
                            <label>Email ID</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    placeholder="admin@cms.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="off"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-footer">
                            <a href="#forgot" className="forgot-link">Forgot Password?</a>
                        </div>

                        <button type="submit" className="login-button">
                            LOGIN
                        </button>
                    </form>
                </div>
            </div>

            <div className="login-right">
                <div className="overlay"></div>
                <div className="hero-content">
                    <h2 className="hero-title">CANTEEN</h2>
                    <h2 className="hero-title outline">MANAGEMENT</h2>
                    <h2 className="hero-title">SYSTEM</h2>
                </div>
            </div>
        </div>
    );
};

export default Login;
