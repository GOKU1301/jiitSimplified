'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaGraduationCap, FaBook, FaUpload, FaExternalLinkAlt } from 'react-icons/fa';
import { papersApi } from './api/apiClient';

interface Paper {
  paper_id: number;
  subject_id: string;
  title: string;
  year: number;
  term: string;
  file_url: string;
  signed_url: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [fromYear, setFromYear] = useState(2018);
  const [toYear, setToYear] = useState(2024);
  const [selectedTerms, setSelectedTerms] = useState<string[]>(['T1', 'T2', 'T3']);
  const [searchResults, setSearchResults] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTermToggle = (term: string) => {
    if (selectedTerms.includes(term)) {
      // Remove term if already selected
      setSelectedTerms(selectedTerms.filter(t => t !== term));
    } else {
      // Add term if not selected
      setSelectedTerms([...selectedTerms, term]);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one term is selected
    if (selectedTerms.length === 0) {
      setErrorMessage('Please select at least one term');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const papers = await papersApi.searchPapers({
        query: searchQuery,
        fromYear,
        toYear,
        terms: selectedTerms,
      });
      
      setSearchResults(papers);
    } catch (error) {
      console.error('Error searching papers:', error);
      setErrorMessage('Failed to search papers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold tracking-wider">
                <span className="text-white">JIIT</span>
                <span className="text-yellow-300">Papers</span>
              </h1>
            </div>
            <div>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Search */}
      <div className="relative h-[700px]">
        {/* College Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/JIIT-Noida.webp"
            alt="JIIT Noida Campus"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
            priority
            className="brightness-110 contrast-105 saturate-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-blue-800/40 to-blue-900/60"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex flex-col justify-center items-center h-full text-center pt-32">
            <h2 className="text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
              JIIT
              <span className="block text-yellow-300">Simplified</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto drop-shadow">
              Access past exam papers from all branches and prepare smarter!
            </p>
            
            <form onSubmit={handleSearch} className="max-w-3xl w-full mx-auto">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl">
                {/* Subject code search */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter subject code or name..."
                    className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>

                {/* Filter options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Year range */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">From Year</label>
                    <select 
                      value={fromYear}
                      onChange={(e) => setFromYear(parseInt(e.target.value))}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      {Array.from({ length: 10 }, (_, i) => 2015 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">To Year</label>
                    <select 
                      value={toYear}
                      onChange={(e) => setToYear(parseInt(e.target.value))}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      {Array.from({ length: 10 }, (_, i) => 2015 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Term selection */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Terms</label>
                    <div className="flex space-x-2">
                      {['T1', 'T2', 'T3'].map(term => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleTermToggle(term)}
                          className={`px-3 py-2 rounded-lg border ${
                            selectedTerms.includes(term)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300'
                          }`}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {errorMessage && (
                  <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <span>Searching...</span>
                  ) : (
                    <>
                      <FaSearch className="mr-2" />
                      <span>Search Papers</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {searchResults.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Results</h2>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Term
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((paper) => (
                    <tr key={paper.paper_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {paper.subject_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paper.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paper.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paper.term}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          href={paper.signed_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          View <FaExternalLinkAlt className="ml-1" size={12} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-white/90 backdrop-blur-sm">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group hover:transform hover:scale-105 transition-all duration-200">
            <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-lg border border-blue-100">
              <div className="text-blue-600 mb-4 bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                <FaGraduationCap size={24} />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Easy Access</h3>
              <p className="text-blue-800">Find question papers from all branches and years in one centralized platform</p>
            </div>
          </div>

          <div className="group hover:transform hover:scale-105 transition-all duration-200">
            <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-lg border border-blue-100">
              <div className="text-blue-600 mb-4 bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                <FaBook size={24} />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Smart Search</h3>
              <p className="text-blue-800">Quickly find papers using subject codes or names with our intelligent search</p>
            </div>
          </div>

          <div className="group hover:transform hover:scale-105 transition-all duration-200">
            <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-lg border border-blue-100">
              <div className="text-blue-600 mb-4 bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                <FaUpload size={24} />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Contribute</h3>
              <p className="text-blue-800">Help your peers by uploading and sharing your question papers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-white/90 text-sm">
              © 2024 JIIT Papers. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
} 