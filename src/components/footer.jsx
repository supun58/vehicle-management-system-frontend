import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-700 py-8" style={{ backgroundColor: '#800000' }}>
            <div className="max-w-7xl mx-auto flex justify-between px-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
                    {/* Contact Details */}
                    <div className="text-white flex flex-col mx-16">
                        <h2 className="text-lg font-bold mb-4" style={{ color: '#de9e28' }}>Contact Us</h2>
                        <p className="text-sm">University of Ruhuna</p>
                        <p className="text-sm">Wellamadama, Matara</p>
                        <p className="text-sm">Sri Lanka</p>
                        <p className="text-sm">Phone: +123 456 7890</p>
                        <p className="text-sm">Fax: +123 456 7891</p>
                    </div>

                    {/* Map */}
                    <div className="text-white flex flex-col mx-16">
                        <h2 className="text-lg font-bold mb-4" style={{ color: '#de9e28' }}>Location</h2>
                        <iframe
                            title="University Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3968.409982478508!2d80.5761344!3d5.938092099999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae1391b4a29e707%3A0xd54277175e326bc2!2sUniversity%20of%20Ruhuna!5e0!3m2!1sen!2slk!4v1735563990679!5m2!1sen!2slk"
                            width="100%"
                            height="150"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>

                    {/* About Us */}
                    <div className="text-white flex flex-col mx-16">
                        <h2 className="text-lg font-bold mb-4" style={{ color: '#de9e28' }}>About Us</h2>
                        <p className="text-sm">
                            The University of Ruhuna is a leading institution dedicated to academic excellence and innovation. Our mission is to foster knowledge, creativity, and integrity in our students and faculty.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-white flex flex-col mx-20">
                        <h2 className="text-lg font-bold mb-4" style={{ color: '#de9e28' }}>Quick Links</h2>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/" className="hover:underline">Login</a></li>
                            <li><a href="/visitor" className="hover:underline">Visitor</a></li>
                            <li><a href="/about-us" className="hover:underline">About Us</a></li>
                            <li><a href="#" className="hover:underline">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="text-center text-gray-300 mt-8">
                <p className="text-sm">&copy; DCS@UOR. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
