'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Upload, FileText, Image, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

interface DragDropZoneProps {
  onFilesAccepted: (files: File[]) => void;
  onTextInput: (text: string) => void;
  isProcessing?: boolean;
  maxFiles?: number;
  maxSizeBytes?: number;
}

const DragDropZone: React.FC<DragDropZoneProps> = ({
  onFilesAccepted,
  onTextInput,
  isProcessing = false,
  maxFiles = 5,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [textInput, setTextInput] = useState('');
  const [, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      // Handle rejected files
      console.log('Rejected files:', rejectedFiles);
      return;
    }

    const filesWithPreview = acceptedFiles.map((file) => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));

    setUploadedFiles((prev) => [...prev, ...filesWithPreview]);
    onFilesAccepted(acceptedFiles);
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'text/markdown': ['.md'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles,
    maxSize: maxSizeBytes,
    disabled: isProcessing,
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => {
      const updatedFiles = prev.filter((file) => file.id !== fileId);
      const fileToRemove = prev.find((file) => file.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updatedFiles;
    });
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onTextInput(textInput.trim());
      setTextInput('');
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-6 w-6" />;
    }
    return <FileText className="h-6 w-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Drag & Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragActive && !isDragReject
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
            : isDragReject
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isDragActive ? 'gradient-blue animate-pulse' : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            <Upload className={`h-8 w-8 ${isDragActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {isDragActive ? 'Drop your files here!' : 'Drag & drop your study notes'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isDragReject
                ? 'Some files are not supported'
                : `Support for PDF, TXT, MD, DOC files up to ${formatFileSize(maxSizeBytes)}`
              }
            </p>
            
            <Button
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              disabled={isProcessing}
            >
              Choose Files
            </Button>
          </div>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 rounded-xl flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
              <p className="text-gray-600 dark:text-gray-400">Processing files...</p>
              {uploadProgress > 0 && (
                <Progress value={uploadProgress} className="w-64" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="flex-shrink-0">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      {getFileIcon(file)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="text-gray-500 hover:text-red-500"
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Text Input Alternative */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
            Or paste your text directly
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Paste your study notes here..."
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
          disabled={isProcessing}
        />
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {textInput.length} characters
          </p>
          <Button
            onClick={handleTextSubmit}
            disabled={!textInput.trim() || isProcessing}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Process Text
          </Button>
        </div>
      </div>

      {/* Error/Warning Messages */}
      {isDragReject && (
        <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-700 dark:text-red-400">
            Please upload only supported file types (PDF, TXT, MD, DOC) under {formatFileSize(maxSizeBytes)}.
          </p>
        </div>
      )}
    </div>
  );
};

export default DragDropZone;
