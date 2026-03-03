import React from 'react';
import Card from './Card';

const SectionContainer = ({ title, children, className = '' }) => {
    return (
        <section className={`section-container ${className}`}>
            {title && <h3 className="section-title">{title}</h3>}
            <Card>
                {children}
            </Card>
        </section>
    );
};

export default SectionContainer;
