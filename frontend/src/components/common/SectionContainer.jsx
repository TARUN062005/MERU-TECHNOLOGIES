import React from 'react';
import Card from './Card';

const SectionContainer = ({ title, children, className = '' }) => {
    return (
        <section className={`section-container ${className} mb-20`}>
            {title && <h3 className="section-title mb-10">{title}</h3>}
            <Card>
                {children}
            </Card>
        </section>
    );
};

export default SectionContainer;
