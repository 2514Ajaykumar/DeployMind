import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getHealth } from '../api/api';

const Layout = ({ children }) => {
  const location = useLocation();
  const [health, setHealth] = useState('checking');

  useEffect(() => {
    getHealth().then(() => setHealth('connected')).catch(() => setHealth('disconnected'));
  }, []);

  const navClass = (path) => 
    `px-3 py-2 text-sm font-medium transition-colors ${
      location.pathname === path 
        ? 'text-black border-b-2 border-black' 
        : 'text-gray-500 hover:text-black'
    }`;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center mr-8">
                <span className="text-xl font-bold text-black tracking-tight">DeployMind</span>
                <span className="ml-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-gray-200 px-2 py-0.5 rounded-full">AI DevOps Pipeline Agent</span>
              </div>
              <nav className="flex space-x-6 h-full items-center">
                <Link to="/" className={navClass('/')}>Overview</Link>
                <Link to="/deployments" className={navClass('/deployments')}>Deployments</Link>
                <Link to="/incidents" className={navClass('/incidents')}>Incidents</Link>
                <Link to="/evaluation" className={navClass('/evaluation')}>Evaluation</Link>
              </nav>
            </div>
            <div className="flex items-center">
              <div className="flex items-center text-xs font-medium text-gray-500 border border-gray-200 px-3 py-1 rounded-full bg-white">
                <span className="mr-2">System</span>
                <span className={`w-2 h-2 rounded-full ${health === 'connected' ? 'bg-green-500' : health === 'disconnected' ? 'bg-red-500' : 'bg-gray-400'}`}></span>
                <span className="ml-1 capitalize">{health}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
