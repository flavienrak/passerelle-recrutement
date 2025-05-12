import React, { useRef, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import Button from './Button';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelected,
  accept = '.pdf,.docx',
  maxSize = 5, // 5MB default
  label = 'Déposer votre fichier ici ou cliquer pour parcourir',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    
    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    const acceptedTypes = accept.split(',').map(type => 
      type.trim().replace('.', '').toLowerCase()
    );
    
    if (!acceptedTypes.includes(fileType || '')) {
      setError(`Format de fichier non accepté. Veuillez utiliser: ${accept}`);
      return;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Fichier trop volumineux. Maximum: ${maxSize}MB`);
      return;
    }
    
    setSelectedFile(file);
    onFileSelected(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
            dragActive
              ? 'border-[#FF6B00] bg-[#FF6B00]/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-base text-gray-300">{label}</p>
          <p className="text-sm text-gray-500 mt-1">
            Formats acceptés: {accept} (Max {maxSize}MB)
          </p>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <File className="h-8 w-8 text-[#FF6B00] mr-3" />
            <div>
              <p className="text-white font-medium truncate max-w-[200px] md:max-w-xs">
                {selectedFile.name}
              </p>
              <p className="text-gray-400 text-sm">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
            className="ml-2"
          >
            <X size={16} />
          </Button>
        </div>
      )}
      
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleChange}
      />
      
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;