import React from 'react';
import Card from '../components/ui/Card';

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      <Card className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-400 mb-4">
              Have questions? We'd love to hear from you.
            </p>
            <p><strong>Email:</strong> info@codeitech.com</p>
            <p><strong>Phone:</strong> +91 9876543210</p>
            <p><strong>Address:</strong> 123 Tech Street, Innovation City</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="input-field" />
              <input type="email" placeholder="Your Email" className="input-field" />
              <textarea placeholder="Your Message" className="input-field h-32"></textarea>
              <button className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded w-full">
                Send
              </button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Contact;