import React, { useState } from 'react';
import { Folder, File, ChevronRight, Download, Trash2, Share2 } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified?: string;
}

const mockFiles: FileItem[] = [
  { id: '1', name: 'Documents', type: 'folder' },
  { id: '2', name: 'Images', type: 'folder' },
  { id: '3', name: 'report.pdf', type: 'file', size: 1024000, modified: '2023-03-15' },
  { id: '4', name: 'presentation.pptx', type: 'file', size: 2048000, modified: '2023-03-14' },
  { id: '5', name: 'budget.xlsx', type: 'file', size: 512000, modified: '2023-03-13' },
];

const FileManager: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath([...currentPath, file.name]);
    } else {
      setSelectedFile(selectedFile === file.id ? null : file.id);
    }
  };

  const handleBackClick = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const formatSize = (size: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let index = 0;
    let formattedSize = size;

    while (formattedSize >= 1024 && index < units.length - 1) {
      formattedSize /= 1024;
      index++;
    }

    return `${formattedSize.toFixed(2)} ${units[index]}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">File Manager</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <button
            onClick={handleBackClick}
            disabled={currentPath.length === 0}
            className="mr-2 px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Back
          </button>
          <span className="text-gray-600">
            / {currentPath.join(' / ')}
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Size</th>
              <th className="text-left py-2">Modified</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockFiles.map((file) => (
              <tr
                key={file.id}
                className={`border-b hover:bg-gray-50 cursor-pointer ${
                  selectedFile === file.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleFileClick(file)}
              >
                <td className="py-2 flex items-center">
                  {file.type === 'folder' ? (
                    <Folder className="mr-2" size={20} />
                  ) : (
                    <File className="mr-2" size={20} />
                  )}
                  {file.name}
                </td>
                <td className="py-2">{file.size ? formatSize(file.size) : '-'}</td>
                <td className="py-2">{file.modified || '-'}</td>
                <td className="py-2">
                  <div className="flex space-x-2">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Download size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Trash2 size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Share2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileManager;