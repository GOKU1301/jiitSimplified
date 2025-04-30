const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper for making API requests
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default options with credentials
  const defaultOptions: RequestInit = {
    credentials: 'include', // Always include credentials
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  
  // Merge options
  const fetchOptions = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, fetchOptions);
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Not authenticated');
    }
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    // Parse JSON response
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Papers API
export const papersApi = {
  // Search papers by criteria
  searchPapers: async (params: {
    query?: string;
    fromYear: number;
    toYear: number;
    terms: string | string[];
  }) => {
    // Convert the params object to a query string
    const queryParams = new URLSearchParams();
    
    if (params.query) {
      queryParams.append('query', params.query);
    }
    
    queryParams.append('fromYear', params.fromYear.toString());
    queryParams.append('toYear', params.toYear.toString());
    
    // Handle terms (can be single string or array)
    if (Array.isArray(params.terms)) {
      params.terms.forEach(term => queryParams.append('terms', term));
    } else {
      queryParams.append('terms', params.terms);
    }
    
    return fetchApi(`/papers/search?${queryParams.toString()}`);
  },
  
  // Upload a paper
  uploadPaper: async (formData: FormData) => {
    return fetch(`${API_BASE_URL}/papers/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData, // Don't set Content-Type header for FormData
    }).then(async response => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }
      return response.json();
    });
  },
  
  // Delete a paper
  deletePaper: async (paperId: number) => {
    return fetchApi(`/papers/${paperId}`, {
      method: 'DELETE',
    });
  },
};

// Auth API
export const authApi = {
  getCurrentUser: async () => {
    try {
      return await fetchApi('/auth/me');
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await fetchApi('/auth/logout');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};