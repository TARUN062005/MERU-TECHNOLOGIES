import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { GoogleLogin } from '@react-oauth/google';
import { Zap } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginUser, googleLogin, user } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || "/dashboard";

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await loginUser(email, password);
        } catch (error) {
            // Error managed in context
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
        } catch (error) {
            console.error("Google login failed", error);
        }
    };

    return (
        <div className="auth-container">
            {/* Left side info panel for large screens */}
            <div className="auth-hero">
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'white', textDecoration: 'none', marginBottom: '4rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={20} color="white" />
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>FinDash</span>
                </Link>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>Welcome back to FinDash.</h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '400px', lineHeight: 1.6 }}>
                    Sign in to manage your professional invoices and track your revenue growth.
                </p>
            </div>

            {/* Right side form */}
            <div className="auth-form-wrapper">
                <Card className="auth-card">
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Sign In</h2>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Enter your details to access your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-20">
                            <InputField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-25">
                            <InputField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <Button variant="primary" type="submit" style={{ width: '100%', padding: '0.8rem', fontSize: '1.05rem', borderRadius: '8px' }} disabled={loading}>
                            {loading ? 'Logging in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="auth-divider">
                        <span>OR</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => console.log('Login Failed')}
                            size="large"
                            text="signin_with"
                            width="250"
                        />
                    </div>

                    <div className="text-center mt-20 text-small" style={{ color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>Create an account</Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
