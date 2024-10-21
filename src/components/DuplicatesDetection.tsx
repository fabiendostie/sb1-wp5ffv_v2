import React, { useState } from 'react';
import { Copy, Trash2, Eye, FileText, Calendar, Clock, HardDrive, Archive, FolderPlus, RotateCcw } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface DuplicateFile {
  id: string;
  name: string;
  path: string;
  size: number;
  lastModified: string;
}

interface DuplicateGroup {
  id: string;
  files: DuplicateFile[];
}

const mockDuplicateGroups: DuplicateGroup[] = [
  {
    id: '1',
    files: [
      { id: '1a', name: 'document.pdf', path: '/Documents/document.pdf', size: 1024000, lastModified: '2023-03-15' },
      { id: '1b', name: 'document_copy.pdf', path: '/Downloads/document_copy.pdf', size: 1024000, lastModified: '2023-03-14' },
    ],
  },
  {
    id: '2',
    files: [
      { id: '2a', name: 'image.jpg', path: '/Pictures/image.jpg', size: 2048000, lastModified: '2023-03-13' },
      { id: '2b', name: 'image_backup.jpg', path: '/Backups/image_backup.jpg', size: 2048000, lastModified: '2023-03-12' },
      { id: '2c', name: 'image_copy.jpg', path: '/Downloads/image_copy.jpg', size: 2048000, lastModified: '2023-03-11' },
    ],
  },
];

const DuplicatesDetection: React.FC = () => {
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>(mockDuplicateGroups);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [deleteStrategy, setDeleteStrategy] = useState<'newest' | 'oldest' | 'manual'>('manual');
  const [duplicateAction, setDuplicateAction] = useState<'delete' | 'move' | 'archive'>('delete');
  const [customFolderName, setCustomFolderName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastAction, setLastAction] = useState<{ type: string; files: string[] } | null>(null);

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

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const applyDeleteStrategy = (group: DuplicateGroup) => {
    switch (deleteStrategy) {
      case 'newest':
        return [group.files.reduce((prev, current) => (new Date(current.lastModified) > new Date(prev.lastModified) ? current : prev)).id];
      case 'oldest':
        return [group.files.reduce((prev, current) => (new Date(current.lastModified) < new Date(prev.lastModified) ? current : prev)).id];
      case 'manual':
        return Array.from(selectedFiles).filter((id) => group.files.some((file) => file.id === id));
      default:
        return [];
    }
  };

  const handleDuplicateAction = async () => {
    if (deleteStrategy === 'manual' && selectedFiles.size === 0) {
      toast.error('Please select files or choose a different strategy');
      return;
    }

    const filesToHandle = duplicateGroups.flatMap((group) => {
      const filesToKeep = applyDeleteStrategy(group);
      return group.files.filter((file) => !filesToKeep.includes(file.id)).map((file) => file.path);
    });

    if (filesToHandle.length === 0) {
      toast.error('No files to process');
      return;
    }

    const confirmAction = window.confirm(`Are you sure you want to ${duplicateAction} ${filesToHandle.length} file(s)?`);
    if (!confirmAction) return;

    setIsLoading(true);
    try {
      let response;
      switch (duplicateAction) {
        case 'delete':
          response = await axios.post('/api/delete-files', { files: filesToHandle });
          break;
        case 'move':
          response = await axios.post('/api/move-files', { files: filesToHandle, destination: customFolderName });
          break;
        case 'archive':
          response = await axios.post('/api/archive-files', { files: filesToHandle, archiveName: 'duplicates.zip' });
          break;
      }

      if (response.data.errors && response.data.errors.length > 0) {
        toast.error(`Some errors occurred: ${response.data.errors.join(', ')}`);
      } else {
        toast.success(`Successfully ${duplicateAction}d ${filesToHandle.length} file(s)`);
        setLastAction({ type: duplicateAction, files: filesToHandle });
        
        // Update the UI to reflect the changes
        setDuplicateGroups((prevGroups) =>
          prevGroups
            .map((group) => ({
              ...group,
              files: group.files.filter((file) => !filesToHandle.includes(file.path)),
            }))
            .filter((group) => group.files.length > 1)
        );
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setSelectedFiles(new Set());
    }
  };

  const handleUndo = async () => {
    if (!lastAction) {
      toast.error('No action to undo');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/undo', lastAction);
      toast.success('Undo successful');
      setLastAction(null);
      // In a real application, you would update the UI here based on the undo operation
    } catch (error) {
      toast.error(`Error undoing action: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-semibold mb-6">Duplicate Files</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detected Duplicates</h2>
          <div className="flex items-center space-x-4">
            <select
              value={deleteStrategy}
              onChange={(e) => setDeleteStrategy(e.target.value as 'newest' | 'oldest' | 'manual')}
              className="border rounded px-2 py-1"
            >
              <option value="manual">Manual Selection</option>
              <option value="newest">Keep Newest</option>
              <option value="oldest">Keep Oldest</option>
            </select>
            <select
              value={duplicateAction}
              onChange={(e) => setDuplicateAction(e.target.value as 'delete' | 'move' | 'archive')}
              className="border rounded px-2 py-1"
            >
              <option value="delete">Delete</option>
              <option value="move">Move</option>
              <option value="archive">Archive</option>
            </select>
            {duplicateAction === 'move' && (
              <input
                type="text"
                value={customFolderName}
                onChange={(e) => setCustomFolderName(e.target.value)}
                placeholder="Custom folder name"
                className="border rounded px-2 py-1"
              />
            )}
            <button
              onClick={handleDuplicateAction}
              disabled={isLoading || (deleteStrategy === 'manual' && selectedFiles.size === 0)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  {duplicateAction === 'delete' && <Trash2 size={20} className="inline-block mr-2" />}
                  {duplicateAction === 'move' && <FolderPlus size={20} className="inline-block mr-2" />}
                  {duplicateAction === 'archive' && <Archive size={20} className="inline-block mr-2" />}
                  {duplicateAction === 'delete' ? 'Delete' : duplicateAction === 'move' ? 'Move' : 'Archive'} Selected
                </>
              )}
            </button>
            <button
              onClick={handleUndo}
              disabled={isLoading || !lastAction}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={20} className="inline-block mr-2" />
              Undo
            </button>
          </div>
        </div>
        {duplicateGroups.map((group) => (
          <div key={group.id} className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Duplicate Group</h3>
            <ul className="space-y-2">
              {group.files.map((file) => (
                <li key={file.id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.id)}
                      onChange={() => handleFileSelect(file.id)}
                      className="mr-3"
                    />
                    <FileText size={20} className="mr-2" />
                    <span>{file.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600"><Calendar size={16} className="inline-block mr-1" />{file.lastModified}</span>
                    <span className="text-gray-600"><Clock size={16} className="inline-block mr-1" />{formatSize(file.size)}</span>
                    <span className="text-gray-600"><HardDrive size={16} className="inline-block mr-1" />{file.path}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DuplicatesDetection;