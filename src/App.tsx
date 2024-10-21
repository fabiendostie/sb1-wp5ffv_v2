import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FileManager from './components/FileManager';
import Search from './components/Search';
import StorageConnections from './components/StorageConnections';
import DuplicatesDetection from './components/DuplicatesDetection';
import Security from './components/Security';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'files' | 'search' | 'storage' | 'duplicates' | 'security'>('dashboard');

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onNavigate={setCurrentView} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'files' && <FileManager />}
        {currentView === 'search' && <Search />}
        {currentView === 'storage' && <StorageConnections />}
        {currentView === 'duplicates' && <DuplicatesDetection />}
        {currentView === 'security' && <Security />}
      </main>
    </div>
  );
}

export default App;