import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import { Search, Book, MessageCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const HelpCenter = () => {
    const { addNotification } = useNotification();
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            question: "How do I create a new invoice?",
            answer: "Navigate to the Invoices tab on the left sidebar and click the 'Create Invoice' button in the top right corner. Fill out the customer details, line items, and issue dates, then save."
        },
        {
            question: "Can I accept online payments?",
            answer: "Currently, FinDash supports manual payment tracking. You can record a payment by opening an invoice and clicking 'Add Payment' in the Payments section."
        },
        {
            question: "How do I change my default currency?",
            answer: "Go to Settings > Business Info and update your Default Currency field. FinDash supports USD, EUR, GBP, INR, JPY, and AUD."
        },
        {
            question: "Can I recover an archived invoice?",
            answer: "Yes, archived invoices can be viewed by filtering for 'All' or 'Archived' (if enabled) in the invoice list. Inside the invoice detail page, simply click 'Restore'."
        }
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleSupportSubmit = (e) => {
        e.preventDefault();
        addNotification('Support ticket submitted successfully. We will get back to you soon!', 'success');
        e.target.reset();
    };

    return (
        <div className="mt-20">
            <h1 className="section-title text-large mb-20 m-0">Help Center</h1>

            <Card className="text-center p-40 mb-20 bg-color" style={{ background: 'var(--primary-color)', color: '#fff' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>How can we help you?</h2>
                <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search articles, tutorials, FAQs..."
                        style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '99px', border: 'none', outline: 'none', fontSize: '1rem' }}
                    />
                </div>
            </Card>

            <div className="grid-layout mb-20" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <Card className="text-center p-40" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <Book size={32} className="text-primary mb-10 mx-auto" style={{ margin: '0 auto' }} />
                    <h3 className="text-strong mb-10">Knowledge Base</h3>
                    <p className="text-muted text-small">Browse our detailed articles and how-to guides.</p>
                </Card>
                <Card className="text-center p-40" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <FileText size={32} className="text-success mb-10 mx-auto" style={{ margin: '0 auto' }} />
                    <h3 className="text-strong mb-10">API Documentation</h3>
                    <p className="text-muted text-small">Integrate FinDash directly with your applications.</p>
                </Card>
                <Card className="text-center p-40" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <MessageCircle size={32} className="text-warning mb-10 mx-auto" style={{ margin: '0 auto' }} />
                    <h3 className="text-strong mb-10">Community Forum</h3>
                    <p className="text-muted text-small">Connect with other FinDash users and share tips.</p>
                </Card>
            </div>

            <div className="grid-layout" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <Card>
                    <h2 className="section-title mb-20">Frequently Asked Questions</h2>
                    <div>
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="mb-10 border-bottom pb-10">
                                <div
                                    className="flex-between"
                                    style={{ cursor: 'pointer', padding: '0.5rem 0' }}
                                    onClick={() => toggleFaq(idx)}
                                >
                                    <div className="text-strong">{faq.question}</div>
                                    {openFaq === idx ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
                                </div>
                                {openFaq === idx && (
                                    <div className="text-muted text-small mt-10" style={{ lineHeight: 1.6 }}>
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h2 className="section-title mb-20">Contact Support</h2>
                    <form onSubmit={handleSupportSubmit}>
                        <div className="mb-15">
                            <InputField label="Subject" required />
                        </div>
                        <div className="input-group mb-15">
                            <label>Message</label>
                            <textarea className="input-field" rows="5" required placeholder="Describe your issue in detail..."></textarea>
                        </div>
                        <div className="flex-end">
                            <Button type="submit" variant="primary">Send Message</Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default HelpCenter;
