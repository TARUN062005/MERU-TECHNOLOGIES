import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="page-center">
            <Card className="text-center p-40">
                <h1 className="mb-10 section-title">FinDash Invoice Dashboard</h1>
                <p className="text-muted mb-20">Create and manage your professional SaaS invoices natively.</p>
                <Button onClick={() => navigate('/create')}>Create New Invoice</Button>
            </Card>
        </div>
    );
};

export default Home;
