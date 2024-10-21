import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { HardDrive, Cloud, Database, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const storageData = [
    { name: 'Local', value: 400, color: '#0088FE' },
    { name: 'Cloud', value: 300, color: '#00C49F' },
    { name: 'NAS', value: 200, color: '#FFBB28' },
    { name: 'External', value: 100, color: '#FF8042' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Storage Usage</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={storageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {storageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4">
            {storageData.map((entry, index) => (
              <div key={index} className="flex items-center mt-2">
                <div className="w-4 h-4 mr-2" style={{ backgroundColor: entry.color }}></div>
                <span>{entry.name}: {entry.value} GB</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <HardDrive className="mr-2" size={20} />
              <span>Total Files: 10,234</span>
            </div>
            <div className="flex items-center">
              <Cloud className="mr-2" size={20} />
              <span>Cloud Storage: 300 GB</span>
            </div>
            <div className="flex items-center">
              <Database className="mr-2" size={20} />
              <span>Duplicates Found: 156</span>
            </div>
            <div className="flex items-center">
              <ExternalLink className="mr-2" size={20} />
              <span>Last Backup: 2 hours ago</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-2">
            <li>File "Project_Report.docx" uploaded</li>
            <li>Folder "Vacation Photos" shared with John</li>
            <li>3 duplicate files removed</li>
            <li>Backup completed successfully</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">AI Suggestions</h2>
          <ul className="space-y-2">
            <li>Organize "Downloads" folder</li>
            <li>Review and delete old backups</li>
            <li>Update sharing permissions for "Work" folder</li>
            <li>Enable two-factor authentication</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;