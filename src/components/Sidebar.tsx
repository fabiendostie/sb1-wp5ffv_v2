import React from 'react';
import { FileText, HardDrive, Cloud, Search, Copy, Shield, Share2, BarChart2 } from 'lucide-react';

interface SidebarProps {
  onNavigate: (view: 'dashboard' | 'files' | 'search' | 'storage' | 'duplicates' | 'security') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <h2 className="text-2xl font-semibold text-center">Digital Declutter</h2>
      <nav>
        <a
          href="#"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          onClick={() => onNavigate('dashboard')}
        >
          <BarChart2 className="inline-block mr-2" size={20} /> Dashboard
        </a>
        <a
          href="#"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          onClick={() => onNavigate('files')}
        >
          <FileText className="inline-block mr-2" size={20} /> Files
        </a>
        <a
          href="#"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          onClick={() => onNavigate('search')}
        >
          <Search className="inline-block mr-2" size={20} /> Search
        </a>
        <a
          href="#"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          onClick={() => onNavigate('storage')}
        >
          <HardDrive className="inline-block mr-2" size={20} /> Storage
        </a>
        <a
          href="#"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          onClick={() => onNavigate('duplicates')}
        >
          <Copy className="inline-block mr-2" size={20} /> Duplicates
        </a>
        <a
          href="#"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          onClick={() => onNavigate('security')}
        >
          <Shield className="inline-block mr-2" size={20} /> Security
        </a>
        <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          <Share2 className="inline-block mr-2" size={20} /> Share
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;