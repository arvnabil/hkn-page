import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import BottomNav from '../Components/BottomNav';
import defaultSite from '../data/site.json';

export default function AppLayout({ children, title, site = defaultSite }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
      <Navbar site={site} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer site={site} />
      <BottomNav site={site} />
    </div>
  );
}
