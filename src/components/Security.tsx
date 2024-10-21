import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, FileText, AlertTriangle, Folder, HardDrive, File, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface FileSystemItem {
  id: string;
  name: string;
  type: 'drive' | 'folder' | 'file';
  path: string;
  children?: FileSystemItem[];
}

const mockFileSystem: FileSystemItem[] = [
  {
    id: 'drive-c',
    name: 'C:',
    type: 'drive',
    path: 'C:',
    children: [
      {
        id: 'documents',
        name: 'Documents',
        type: 'folder',
        path: 'C:/Documents',
        children: [
          { id: 'doc1', name: 'document1.pdf', type: 'file', path: 'C:/Documents/document1.pdf' },
          { id: 'doc2', name: 'document2.docx', type: 'file', path: 'C:/Documents/document2.docx' },
        ],
      },
      {
        id: 'pictures',
        name: 'Pictures',
        type: 'folder',
        path: 'C:/Pictures',
        children: [
          { id: 'pic1', name: 'image1.jpg', type: 'file', path: 'C:/Pictures/image1.jpg' },
          { id: 'pic2', name: 'image2.png', type: 'file', path: 'C:/Pictures/image2.png' },
        ],
      },
    ],
  },
];

const Security: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<FileSystemItem>(mockFileSystem[0]);
  const [encryptionPassword, setEncryptionPassword] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleItemSelect = (item: FileSystemItem) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item.id)) {
        newSet.delete(item.id);
      } else {
        newSet.add(item.id);
      }
      return newSet;
    });
  };

  const handleFolderClick = (folder: FileSystemItem) => {
    setCurrentFolder(folder);
  };

  const handleBackClick = () => {
    const parentPath = currentFolder.path.split('/').slice(0, -1).join('/');
    const parentFolder = findFolderByPath(mockFileSystem[0], parentPath);
    if (parentFolder) {
      setCurrentFolder(parentFolder);
    }
  };

  const findFolderByPath = (root: FileSystemItem, path: string): FileSystemItem | null => {
    if (root.path === path) return root;
    if (root.children) {
      for (const child of root.children) {
        const found = findFolderByPath(child, path);
        if (found) return found;
      }
    }
    return null;
  };

  const handleEncryptFiles = async () => {
    if (selectedItems.size === 0) {
      toast.error('Please select files or folders to encrypt');
      return;
    }

    if (!encryptionPassword) {
      toast.error('Please enter an encryption password');
      return;
    }

    setIsEncrypting(true);
    // Simulating encryption process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsEncrypting(false);
    toast.success(`${selectedItems.size} item(s) encrypted successfully`);
    setSelectedItems(new Set());
    setShowFileBrowser(false);
  };

  const mockAccessLogs = [
    { id: 1, action: 'File Access', file: 'confidential.pdf', user: 'john@example.com', timestamp: '2023-03-20 14:30:00' },
    { id: 2, action: 'Failed Login Attempt', user: 'unknown@example.com', timestamp: '2023-03-19 10:15:00' },
    { id: 3, action: 'Password Changed', user: 'admin@example.com', timestamp: '2023-03-18 09:00:00' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-semibold mb-6">Security Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Password Protection</h2>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Set Application Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            onClick={() => toast.success('Password updated successfully')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <Lock size={20} className="inline-block mr-2" />
            Update Password
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">File Encryption</h2>
          <div className="mb-4">
            <label htmlFor="encryptionPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Encryption Password
            </label>
            <input
              type="password"
              id="encryptionPassword"
              value={encryptionPassword}
              onChange={(e) => setEncryptionPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter encryption password"
            />
          </div>
          <button
            onClick={() => setShowFileBrowser(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mb-4"
          >
            <Folder size={20} className="inline-block mr-2" />
            Select Files to Encrypt
          </button>
          <p className="text-sm text-gray-600">
            Files will be encrypted using AES-256-GCM with PBKDF2 key derivation, following industry standards.
            Encrypted files can be decrypted using standard tools that support this encryption method.
          </p>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Access Logs</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">File</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {mockAccessLogs.map((log) => (
              <tr key={log.id} className="border-b">
                <td className="px-4 py-2">
                  {log.action === 'File Access' && <FileText size={16} className="inline-block mr-2" />}
                  {log.action === 'Failed Login Attempt' && <AlertTriangle size={16} className="inline-block mr-2" />}
                  {log.action === 'Password Changed' && <Lock size={16} className="inline-block mr-2" />}
                  {log.action}
                </td>
                <td className="px-4 py-2">{log.file || '-'}</td>
                <td className="px-4 py-2">{log.user}</td>
                <td className="px-4 py-2">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showFileBrowser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-3/4 h-3/4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select Files to Encrypt</h2>
              <button onClick={() => setShowFileBrowser(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="flex items-center mb-4">
              <button
                onClick={handleBackClick}
                disabled={currentFolder.path === 'C:'}
                className="mr-2 px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Back
              </button>
              <span className="text-gray-600">{currentFolder.path}</span>
            </div>
            <div className="flex-grow overflow-y-auto border rounded-md p-2">
              {currentFolder.children?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center py-2 px-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => item.type === 'folder' ? handleFolderClick(item) : handleItemSelect(item)}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => handleItemSelect(item)}
                    onClick={(e) => e.stopPropagation()}
                    className="mr-2"
                  />
                  {item.type === 'drive' && <HardDrive size={20} className="mr-2" />}
                  {item.type === 'folder' && <Folder size={20} className="mr-2" />}
                  {item.type === 'file' && <File size={20} className="mr-2" />}
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleEncryptFiles}
                disabled={isEncrypting || selectedItems.size === 0}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                <Shield size={20} className="inline-block mr-2" />
                {isEncrypting ? 'Encrypting...' : 'Encrypt Selected Files'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Security;