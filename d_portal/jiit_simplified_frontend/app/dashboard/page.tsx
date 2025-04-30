'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaUpload, FaSpinner, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import { authApi, papersApi } from '../api/apiClient';

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface UploadFormData {
  subjectCode: string;
  title: string;
  year: number;
  term: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<UploadFormData>({
    subjectCode: '',
    title: '',
    year: 2025,
    term: 'T1',
  });
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    async function checkAuth() {
      try {
        const userData = await authApi.getCurrentUser();
        if (mounted) {
          setUser(userData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          if (retryCount < maxRetries) {
            retryCount++;
            // Retry after a short delay
            setTimeout(checkAuth, 1000);
          } else {
            setLoading(false);
            router.replace('/login');
          }
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null; // useEffect will handle the redirect
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Extract subject code and year from filename if possible
      const filenameParts = file.name.split('_');
      if (filenameParts.length >= 2) {
        const possibleSubjectCode = filenameParts[0].toUpperCase();
        // Check if it looks like a subject code (2-3 letters followed by 3 digits)
        if (/^[A-Z]{2,3}\d{3}$/.test(possibleSubjectCode)) {
          setFormData(prev => ({ ...prev, subjectCode: possibleSubjectCode }));
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload');
      return;
    }
    
    if (!formData.subjectCode) {
      setErrorMessage('Subject code is required');
      return;
    }
    
    setUploadStatus('loading');
    setErrorMessage('');
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('subjectCode', formData.subjectCode);
      uploadFormData.append('year', formData.year.toString());
      uploadFormData.append('term', formData.term);
      uploadFormData.append('title', formData.title);
      
      await papersApi.uploadPaper(uploadFormData);
      
      setUploadStatus('success');
      // Reset form after successful upload
      setSelectedFile(null);
      setFormData({
        subjectCode: '',
        title: '',
        year: 2025,
        term: 'T1',
      });
      
      // Reset file input
      const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setUploadStatus('error');
      setErrorMessage(error.message || 'Failed to upload file. Please try again.');
    }
  };

  // Years array for dropdown
  const years = Array.from({ length: 6 }, (_, i) => 2025 - i);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">JIIT Papers</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <button
                onClick={async () => {
                  try {
                    await authApi.logout();
                    router.push('/login');
                  } catch (error) {
                    console.error('Logout error:', error);
                  }
                }}
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Logout
              </button>
              <div className="text-gray-600 bg-gray-100 p-2 rounded-full">
                <FaUser size={20} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-lg">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-lg">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-lg capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">Upload Question Paper</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File upload area */}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaUpload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                  </div>
                  <input
                    id="fileUpload"
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              
              {selectedFile && (
                <p className="text-sm text-green-600 flex items-center">
                  <FaCheck className="mr-1" /> Selected file: {selectedFile.name}
                </p>
              )}
              
              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="subjectCode" className="block text-sm font-medium text-gray-700">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    id="subjectCode"
                    name="subjectCode"
                    value={formData.subjectCode}
                    onChange={handleInputChange}
                    placeholder="e.g. CS101"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Paper Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Introduction to Programming"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                    Year *
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="term" className="block text-sm font-medium text-gray-700">
                    Term *
                  </label>
                  <select
                    id="term"
                    name="term"
                    value={formData.term}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="T1">T1</option>
                    <option value="T2">T2</option>
                    <option value="T3">T3</option>
                  </select>
                </div>
              </div>
              
              {errorMessage && (
                <div className="text-red-500 text-sm flex items-center">
                  <FaExclamationCircle className="mr-1" /> {errorMessage}
                </div>
              )}
              
              <button
                type="submit"
                disabled={uploadStatus === 'loading'}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploadStatus === 'loading' ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Uploading...
                  </>
                ) : uploadStatus === 'success' ? (
                  <>
                    <FaCheck className="mr-2" />
                    Uploaded Successfully
                  </>
                ) : (
                  'Upload Paper'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 