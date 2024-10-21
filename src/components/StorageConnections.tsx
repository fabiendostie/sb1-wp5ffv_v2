import React, { useState } from 'react';
import { HardDrive, Cloud, Database, Plus } from 'lucide-react';

interface StorageConnection {
  id: string;
  name: string;
  type: 'local' | 'cloud' | 'nas';
  status: 'connected' | 'disconnected';
}

const initialConnections: StorageConnection[] = [
  { id: '1', name: 'Local Drive', type: 'local', status: 'connected' },
  { id: '2', name: 'Google Drive', type: 'cloud', status: 'connected' },
  { id: '3', name: 'Dropbox', type: 'cloud', status: 'disconnected' },
  { id: '4', name: 'NAS Server', type: 'nas', status: 'connected' },
];

const StorageConnections: React.FC = () => {
  const [connections, setConnections] = useState<StorageConnection[]>(initialConnections);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newConnectionName, setNewConnectionName] = useState('');
  const [newConnectionType, setNewConnectionType] = useState<'local' | 'cloud' | 'nas'>('local');

  const handleAddConnection = () => {
    if (newConnectionName) {
      const newConnection: StorageConnection = {
        id: Date.now().toString(),
        name: newConnectionName,
        type: newConnectionType,
        status: 'connected',
      };
      setConnections([...connections, newConnection]);
      setNewConnectionName('');
      setNewConnectionType('local');
      setShowAddModal(false);
    }
  };

  const handleToggleConnection = (id: string) => {
    setConnections(connections.map(conn =>
      conn.id === id ? { ...conn, status: conn.status === 'connected' ? 'disconnected' : 'connected' } : conn
    ));
  };

  const getIconForType = (type: 'local' | 'cloud' | 'nas') => {
    switch (type) {
      case 'local':
        return <HardDrive size={24} />;
      case 'cloud':
        return <Cloud size={24} />;
      case 'nas':
        return <Database size={24} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Storage Connections</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Connected Storage</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={20} className="inline-block mr-2" />
            Add Connection
          </button>
        </div>
        <ul className="space-y-4">
          {connections.map((connection) => (
            <li key={connection.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                {getIconForType(connection.type)}
                <span className="ml-4 font-semibold">{connection.name}</span>
              </div>
              <div>
                <span className={`mr-4 ${connection.status === 'connected' ? 'text-green-500' : 'text-red-500'}`}>
                  {connection.status === 'connected' ? 'Connected' : 'Disconnected'}
                </span>
                <button
                  onClick={() => handleToggleConnection(connection.id)}
                  className={`px-3 py-1 rounded ${
                    connection.status === 'connected'
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {connection.status === 'connected' ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Connection</h2>
            <input
              type="text"
              value={newConnectionName}
              onChange={(e) => setNewConnectionName(e.target.value)}
              placeholder="Connection Name"
              className="w-full px-3 py-2 border rounded mb-4"
            />
            <select
              value={newConnectionType}
              onChange={(e) => setNewConnectionType(e.target.value as 'local' | 'cloud' | 'nas')}
              className="w-full px-3 py-2 border rounded mb-4"
            >
              <option value="local">Local Storage</option>
              <option value="cloud">Cloud Storage</option>
              <option value="nas">NAS</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddConnection}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageConnections;