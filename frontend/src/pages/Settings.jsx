import React, { useState } from 'react';
import Card from '../components/common/Card';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { User, Building, Bell, Shield, Key, Loader } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { addNotification } = useNotification();
    const { user, verifyEmail, resendVerification, changePassword } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    // Resend email limit
    const [resendCooldown, setResendCooldown] = useState(0);
    const [loadingResend, setLoadingResend] = useState(false);

    // Password change states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loadingPassword, setLoadingPassword] = useState(false);

    const handleVerifyMock = async () => {
        // In reality, user clicks a link in their email which visits an endpoint or includes a token in URL.
        const token = window.prompt("Enter the verification token from your console/network:");
        if (token) {
            try {
                await verifyEmail(token);
            } catch (error) {
                // error handled in context
            }
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        addNotification('Settings saved successfully!', 'success');
    };

    const handleResendVerification = async () => {
        if (resendCooldown > 0 || loadingResend) return;
        setLoadingResend(true);
        try {
            await resendVerification();
            setResendCooldown(120); // 2 minutes
            const interval = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            // Error managed in context
        } finally {
            setLoadingResend(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return addNotification('New passwords do not match', 'error');
        }
        setLoadingPassword(true);
        try {
            await changePassword(currentPassword, newPassword);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            // Error handled in context
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="mt-20 fade-in" style={{ paddingBottom: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 className="section-title text-large mb-20 m-0">Settings</h1>

            <div className="grid-layout" style={{ gridTemplateColumns: '250px 1fr' }}>
                <Card className="p-0 border-0 shadow-0" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
                    <div className="sidebar-nav" style={{ padding: '0' }}>
                        <div
                            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setActiveTab('profile')}
                        >
                            <User size={18} />
                            <span>My Profile</span>
                        </div>
                        <div
                            className={`nav-item ${activeTab === 'business' ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setActiveTab('business')}
                        >
                            <Building size={18} />
                            <span>Business Info</span>
                        </div>
                        <div
                            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setActiveTab('notifications')}
                        >
                            <Bell size={18} />
                            <span>Notifications</span>
                        </div>
                        <div
                            className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setActiveTab('security')}
                        >
                            <Shield size={18} />
                            <span>Security</span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <form onSubmit={handleSave}>
                        {activeTab === 'profile' && (
                            <div className="settings-section">
                                <h2 className="section-title text-large" style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>Profile Settings</h2>
                                <div className="flex-align-center gap-15" style={{ marginBottom: '30px' }}>
                                    <div className="user-avatar shadow-sm" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', color: '#fff', fontSize: '28px', fontWeight: 'bold', borderRadius: '50%', overflow: 'hidden' }}>
                                        {user?.avatarUrl ? (
                                            <img src={user.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                                        ) : (
                                            user?.name ? user.name.charAt(0).toUpperCase() : <User size={40} />
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <Button variant="outline" type="button" style={{ width: 'fit-content' }}>Change Avatar</Button>
                                        {!user?.isVerified ? (
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                                <Button
                                                    variant="secondary"
                                                    type="button"
                                                    onClick={handleVerifyMock}
                                                    style={{ borderColor: 'var(--warning-color)', color: 'var(--warning-color)', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
                                                >
                                                    Enter Token
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    type="button"
                                                    disabled={resendCooldown > 0 || loadingResend}
                                                    onClick={handleResendVerification}
                                                    style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}
                                                >
                                                    {loadingResend ? <Loader size={16} className="spin" /> : null}
                                                    {resendCooldown > 0 ? `Resend Verification (${resendCooldown}s)` : 'Resend Verification Mail'}
                                                </Button>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--success-color)', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '12px', width: 'fit-content' }}>
                                                Verified Account
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="grid-2 mb-20 gap-20">
                                    <InputField label="First Name" defaultValue={user?.name?.split(' ')[0] || ''} />
                                    <InputField label="Last Name" defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''} />
                                </div>
                                <div className="mb-20">
                                    <InputField label="Email Address" type="email" defaultValue={user?.email || ''} readOnly style={{ backgroundColor: 'var(--bg-lite)' }} />
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Email address cannot be changed directly.</div>
                                </div>
                                <div className="mb-20">
                                    <InputField label="Phone Number" defaultValue="+1 (555) 123-4567" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'business' && (
                            <div>
                                <h2 className="section-title mb-20">Business Information</h2>
                                <div className="mb-15">
                                    <InputField label="Company Name" defaultValue="FinDash Inc." />
                                </div>
                                <div className="mb-15">
                                    <InputField label="Business Registration Number" defaultValue="123456789" />
                                </div>
                                <div className="input-group">
                                    <label>Business Address</label>
                                    <textarea className="input-field" rows="3" defaultValue="123 SaaS Street\nSan Francisco, CA 94105"></textarea>
                                </div>
                                <div className="grid-2 mt-15 mb-15">
                                    <InputField label="Tax ID / VAT" defaultValue="US987654321" />
                                    <InputField label="Default Currency" defaultValue="USD" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div>
                                <h2 className="section-title mb-20">Notification Preferences</h2>
                                <div className="mb-15 flex-between pb-10 border-bottom">
                                    <div>
                                        <div className="text-strong">Email Notifications</div>
                                        <div className="text-muted text-small">Receive emails when invoices are paid.</div>
                                    </div>
                                    <input type="checkbox" className="custom-checkbox" defaultChecked />
                                </div>
                                <div className="mb-15 flex-between pb-10 border-bottom">
                                    <div>
                                        <div className="text-strong">Payment Reminders</div>
                                        <div className="text-muted text-small">Automatically send clients reminders.</div>
                                    </div>
                                    <input type="checkbox" className="custom-checkbox" defaultChecked />
                                </div>
                                <div className="mb-15 flex-between pb-10 border-bottom">
                                    <div>
                                        <div className="text-strong">Weekly Summary</div>
                                        <div className="text-muted text-small">Get a weekly report of your revenue.</div>
                                    </div>
                                    <input type="checkbox" className="custom-checkbox" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div>
                                <h2 className="section-title text-large" style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>Security</h2>
                                {user?.googleId && !user?.password ? (
                                    <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                        <p className="text-muted m-0" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500 }}>
                                            <Shield size={20} color="var(--primary-color)" />
                                            You are logged in with Google. Password management is handled by your Google account.
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid var(--border-color)' }}>
                                        <h3 className="section-title text-medium mb-20">Change Password</h3>
                                        <div className="mb-20">
                                            <InputField label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                        </div>
                                        <div className="grid-2 gap-20 mb-20">
                                            <InputField label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                            <InputField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                        </div>
                                        <Button variant="primary" type="button" onClick={handleChangePassword} disabled={loadingPassword}>
                                            {loadingPassword ? 'Changing...' : 'Update Password'}
                                        </Button>
                                    </div>
                                )}

                                <div className="mt-30">
                                    <h3 className="section-title text-medium mb-15">Advanced Security</h3>
                                    <Button variant="secondary" type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                        <Key size={16} /> Enable Two-Factor Authentication
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="mt-20 pt-20 border-top flex-end">
                            <Button type="submit" variant="primary">Save Changes</Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
