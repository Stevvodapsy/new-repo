import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from './icons/HeroIcons.jsx';

const DwelloLogo = () => (
    <Link to="/" className="flex items-center gap-2">
        <div className="bg-white p-2 rounded-lg">
            <HomeIcon className="w-6 h-6 text-primary" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">Dwello</span>
    </Link>
);


const Footer = () => {
  const footerLinks = {
    'For Tenants': ['Search Properties', 'Apartments for Rent', 'Houses for Rent'],
    'For Landlords': ['List a Property', 'Landlord Dashboard', 'Pricing'],
    'Company': ['About Us', 'Contact', 'Careers', 'Terms of Service'],
  };

  return (
    <footer className="bg-neutral-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <DwelloLogo />
            <p className="text-neutral-300">Your trusted partner in finding the perfect rental property.</p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold tracking-wider uppercase text-neutral-200">{title}</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-neutral-300 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-neutral-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-neutral-400 text-sm">&copy; {new Date().getFullYear()} Dwello. All rights reserved.</p>
           <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                 <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
               <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                   <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.927 8.164c.254.172.42.438.42.748v2.176c0 .31-.166.576-.42.748l-4.49 3.01c-.48.32-1.12.001-1.12-.58V8.735c0-.58.64-.9 1.12-.58l4.49 2.99z" clipRule="evenodd" /></svg>
               </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;