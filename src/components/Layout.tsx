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
        {/* Powered by Inertia Solutions Group 
         * 
         * LOGO SIZE ADJUSTMENT INSTRUCTIONS:
         * 1. To adjust logo size, modify the h-10 class on the img element below
         *    - Increase the number for a larger logo (h-12, h-14, etc.)
         *    - Decrease the number for a smaller logo (h-8, h-6, etc.)
         *    - Tailwind uses a 4px scale, so h-10 = 40px, h-12 = 48px
         * 
         * 2. To adjust text size, modify the text-base class on the span element
         *    - Options from smallest to largest: text-xs, text-sm, text-base, text-lg, text-xl
         * 
         * 3. To adjust spacing between text and logo, modify the space-x-3 class
         *    - Increase the number for more space (space-x-4, space-x-5)
         *    - Decrease the number for less space (space-x-2, space-x-1)
         */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="flex items-center space-x-3">
            <span className="text-base text-gray-200">Powered by</span>
            <a 
              href="https://inertiasolutionsgroup.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:opacity-80 transition-opacity"
              aria-label="Inertia Solutions Group"
            >
              <img 
                src="/inertia_logo_web.png" 
                alt="Inertia Solutions Group" 
                className="h-10 w-auto" /* Logo size: h-10 = 40px height, width scales proportionally */
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
