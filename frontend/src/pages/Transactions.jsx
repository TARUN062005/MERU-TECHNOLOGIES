import React from 'react';
import Card from '../components/common/Card';
import { Construction } from 'lucide-react';

const Transactions = () => {
    return (
        <div className="mt-20">
            <h1 className="section-title text-large m-0 mb-20">Transactions</h1>
            <Card className="flex-align-center" style={{ flexDirection: 'column', padding: '4rem', textAlign: 'center', gap: '1rem', minHeight: '60vh', justifyContent: 'center' }}>
                <Construction size={48} className="text-muted" />
                <h2 className="text-large text-strong">Not Ready Yet</h2>
                <div className="text-muted">The transactions feature is currently under active development. Please check back later!</div>
            </Card>
        </div>
    );
};

export default Transactions;
