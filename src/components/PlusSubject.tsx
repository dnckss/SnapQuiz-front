import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface PlusSubjectProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (subject: { name: string; pdfUrl: string }) => void;
}

const AddSubjectModal: React.FC<PlusSubjectProps> = ({ isOpen, onClose, onAdd }) => {
  const [subjectName, setSubjectName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please upload a PDF file');
      return;
    }
    if (subjectName && selectedFile) {
      const pdfUrl = URL.createObjectURL(selectedFile);
      onAdd({ name: subjectName, pdfUrl });
      setSubjectName('');
      setSelectedFile(null);
      onClose();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#1a1f36]">Add New Subject</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Name
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A6FFF]"
              placeholder="Enter subject name"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload PDF
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-8 h-8 text-[#4A6FFF] mb-2" />
                <span className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : 'Click to upload PDF'}
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#4A6FFF] text-white rounded-xl font-medium hover:bg-[#3258d8] transition-colors"
          >
            Add Subject
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal;