import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import JSZip from 'jszip';

const app = express();
const port = 3001;

app.use(express.json());

// Mock file system
const mockFileSystem = {
  '/Documents': {
    'report.pdf': Buffer.from('Mock PDF content'),
    'presentation.pptx': Buffer.from('Mock PPTX content'),
  },
  '/Downloads': {
    'report_copy.pdf': Buffer.from('Mock PDF content'),
  },
  '/Pictures': {
    'vacation.jpg': Buffer.from('Mock JPG content'),
    'beach.jpg': Buffer.from('Mock JPG content'),
  },
  '/Backups': {
    'vacation_backup.jpg': Buffer.from('Mock JPG content'),
  },
};

// Helper function to get file from mock file system
const getFile = (filePath) => {
  const parts = filePath.split('/').filter(Boolean);
  let current = mockFileSystem;
  for (const part of parts) {
    if (current[part] === undefined) {
      return null;
    }
    current = current[part];
  }
  return current;
};

// Delete files
app.post('/api/delete-files', async (req, res) => {
  const { files } = req.body;
  const deletedFiles = [];
  const errors = [];

  for (const file of files) {
    try {
      const fileContent = getFile(file);
      if (fileContent) {
        // In a real system, you would delete the file here
        console.log(`Deleting file: ${file}`);
        deletedFiles.push(file);
      } else {
        errors.push(`File not found: ${file}`);
      }
    } catch (error) {
      errors.push(`Error deleting file ${file}: ${error.message}`);
    }
  }

  res.json({ deletedFiles, errors });
});

// Move files
app.post('/api/move-files', async (req, res) => {
  const { files, destination } = req.body;
  const movedFiles = [];
  const errors = [];

  for (const file of files) {
    try {
      const fileContent = getFile(file);
      if (fileContent) {
        // In a real system, you would move the file here
        console.log(`Moving file: ${file} to ${destination}`);
        movedFiles.push({ from: file, to: path.join(destination, path.basename(file)) });
      } else {
        errors.push(`File not found: ${file}`);
      }
    } catch (error) {
      errors.push(`Error moving file ${file}: ${error.message}`);
    }
  }

  res.json({ movedFiles, errors });
});

// Archive files
app.post('/api/archive-files', async (req, res) => {
  const { files, archiveName } = req.body;
  const zip = new JSZip();
  const errors = [];

  for (const file of files) {
    try {
      const fileContent = getFile(file);
      if (fileContent) {
        zip.file(path.basename(file), fileContent);
      } else {
        errors.push(`File not found: ${file}`);
      }
    } catch (error) {
      errors.push(`Error archiving file ${file}: ${error.message}`);
    }
  }

  try {
    const archiveContent = await zip.generateAsync({ type: 'nodebuffer' });
    // In a real system, you would save the archive here
    console.log(`Creating archive: ${archiveName}`);
    res.json({ archiveName, errors });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create archive', errors: [...errors, error.message] });
  }
});

// Undo last action
const actionHistory = [];

app.post('/api/undo', (req, res) => {
  if (actionHistory.length === 0) {
    return res.status(400).json({ error: 'No actions to undo' });
  }

  const lastAction = actionHistory.pop();
  // In a real system, you would implement the actual undo logic here
  console.log(`Undoing action: ${JSON.stringify(lastAction)}`);

  res.json({ message: 'Undo successful', undoneAction: lastAction });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});