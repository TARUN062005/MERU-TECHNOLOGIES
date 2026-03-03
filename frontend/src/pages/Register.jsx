import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
    const navigate = useNavigate();
    const { registerUser, googleLogin, user } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerUser(name, email, password);
            navigate('/login');
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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
            <Card style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h1 className="section-title text-large text-center mb-20">Create an Account</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-15">
                        <InputField label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="mb-15">
                        <InputField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-20">
                        <InputField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <Button variant="primary" type="submit" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Registering...' : 'Sign Up'}
                    </Button>
                </form>

                <div className="text-center mt-20 mb-20 text-muted">
                    <span>OR</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log('Login Failed')}
                    />
                </div>

                <div className="text-center mt-15 text-small">
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Sign In</Link>
                </div>
            </Card>
        </div>
    );
};

export default Register;
