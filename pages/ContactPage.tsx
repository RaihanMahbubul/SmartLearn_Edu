
import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-gray-800/50 p-8 rounded-xl shadow-lg border border-gray-700">
      <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
        Contact Us
      </h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="text-gray-300">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Get in Touch</h2>
          <p className="mb-4">
            Have a question, feedback, or need support? We'd love to hear from you. Fill out the form or use the contact details below.
          </p>
          <div className="space-y-4">
            <p><strong>Address:</strong> 123 Learning Lane, Knowledge City, 45678</p>
            <p><strong>Email:</strong> support@smartlearn.com</p>
            <p><strong>Phone:</strong> (123) 456-7890</p>
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
            <input type="text" id="name" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white p-2" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
            <input type="email" id="email" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white p-2" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
            <textarea id="message" rows={4} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white p-2"></textarea>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
