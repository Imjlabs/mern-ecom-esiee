// ContactPage.jsx
import React from 'react';
import ContactForm from './ContactForm';

const ContactPage = () => {
    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
            <ContactForm />
        </div>
    );
};

export default ContactPage;
