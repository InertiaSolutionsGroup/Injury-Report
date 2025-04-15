import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-light font-sans">
      {/* Header */}
      <header className="bg-primary text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-4">
              {/* Use Kids R Kids logo from public folder */}
              <img src="/header-logo-v2.png" alt="Kids R Kids Logo" className="h-10 w-auto bg-white p-1 rounded shadow" />
              <h1 className="text-2xl font-heading tracking-widest uppercase font-bold">Kids R Kids Injury Reporting</h1>
            </div>
            <nav className="flex space-x-8 text-base font-bold uppercase">
              <Link
                to="/teacher"
                className={`px-3 py-2 rounded transition-colors duration-150 ${location.pathname.includes('/teacher') ? 'bg-gold text-dark shadow' : 'hover:bg-secondary hover:text-white'}`}
              >
                Teacher
              </Link>
              <Link
                to="/front-desk"
                className={`px-3 py-2 rounded transition-colors duration-150 ${location.pathname.includes('/front-desk') ? 'bg-gold text-dark shadow' : 'hover:bg-secondary hover:text-white'}`}
              >
                Front Desk
              </Link>
            </nav>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      {/* Footer */}
      <footer className="bg-primary text-white border-t border-gold py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-center text-sm font-body">&copy; {new Date().getFullYear()} Kids R Kids Injury Reporting MVP</p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <a href="https://www.facebook.com/kidsrkidscorporate" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg className="h-6 w-6 text-gold hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33V21.877C18.343 21.128 22 16.991 22 12"/></svg>
            </a>
            <a href="https://www.instagram.com/kidsrkidscorporate/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg className="h-6 w-6 text-gold hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.75A5 5 0 1 1 7 11.25a5 5 0 0 1 5-5zm0 1.5a3.5 3.5 0 1 0 3.5 3.5a3.5 3.5 0 0 0-3.5-3.5zm5.25.75a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0z"/></svg>
            </a>
            <a href="https://www.youtube.com/kidsrkidscorporate" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg className="h-6 w-6 text-gold hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M21.8 8.001a2.749 2.749 0 0 0-1.933-1.94C18.127 6 12 6 12 6s-6.127 0-7.867.061A2.749 2.749 0 0 0 2.2 8.001C2 9.74 2 12 2 12s0 2.26.2 3.999a2.749 2.749 0 0 0 1.933 1.94C5.873 18 12 18 12 18s6.127 0 7.867-.061a2.749 2.749 0 0 0 1.933-1.94C22 14.26 22 12 22 12s0-2.26-.2-3.999zM10 15.5v-7l6 3.5l-6 3.5z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
