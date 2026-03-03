import React, { useState } from 'react';
import Card from '../components/common/Card';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { User, Building, Bell, Shield, Key } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const Settings = () => {
    const { addNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('profile');

    const handleSave = (e) => {
        e.preventDefault();
        addNotification('Settings saved successfully!', 'success');
    };

    return (
        <div className="mt-20">
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
                            <div>
                                <h2 className="section-title mb-20">Profile Settings</h2>
                                <div className="flex-align-center mb-20 gap-10">
                                    <div className="user-avatar" style={{ width: '64px', height: '64px' }}>
                                        <User size={32} />
                                    </div>
                                    <Button variant="secondary" type="button">Change Avatar</Button>
                                </div>
                                <div className="grid-2 mb-15">
                                    <InputField label="First Name" defaultValue="John" />
                                    <InputField label="Last Name" defaultValue="Doe" />
                                </div>
                                <div className="mb-15">
                                    <InputField label="Email Address" type="email" defaultValue="john.doe@example.com" />
                                </div>
                                <div className="mb-15">
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
                                <h2 className="section-title mb-20">Security Context</h2>
                                <div className="mb-15">
                                    <InputField label="Current Password" type="password" />
                                </div>
                                <div className="grid-2 mb-15">
                                    <InputField label="New Password" type="password" />
                                    <InputField label="Confirm Password" type="password" />
                                </div>
                                <Button variant="secondary" type="button" className="mt-10"><Key size={16} className="mr-10" /> Enable Two-Factor Authentication</Button>
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
