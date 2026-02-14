
import { useAuthStore } from '../store/useAuthStore';

// The BASE_URL is typically handled by a proxy or environment variable.
// We use relative paths to ensure compatibility with the host domain.
const BASE_URL = ''; 

async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { token, logout } = useAuthStore.getState();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Token ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    
    if (response.status === 401) {
      logout();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}

export const api = {
  auth: {
    loginWithTelegram: (initData: string) => 
      fetcher<{ token: string; user: any }>('/api-token-auth/', {
        method: 'POST',
        body: JSON.stringify({ init_data: initData }),
      }),
    getProfile: () => fetcher<any>('/school/profile/'),
  },
  student: {
    // Matches: GET /testapp/api/v1/student/tests/
    getTests: () => fetcher<any[]>('/testapp/api/v1/student/tests/'),
    // Matches: POST /testapp/api/v1/student/tests/{test_id}/start/
    startTest: (testId: string) => 
      fetcher<any>(`/testapp/api/v1/student/tests/${testId}/start/`, { method: 'POST' }),
    // Matches: POST /testapp/api/v1/student/attempts/{attempt_id}/submit/
    submitAttempt: (attemptId: string, answers: any) =>
      fetcher<any>(`/testapp/api/v1/student/attempts/${attemptId}/submit/`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      }),
    // Matches: GET /testapp/api/v1/student/attempts/{attempt_id}/result/
    getResult: (attemptId: string) => 
      fetcher<any>(`/testapp/api/v1/student/attempts/${attemptId}/result/`),
  },
  teacher: {
    // Matches: GET /testapp/teacher/tests/
    getTests: () => fetcher<any[]>('/testapp/teacher/tests/'),
    // Matches: POST /testapp/teacher/tests/
    createTest: (data: any) => 
      fetcher<any>('/testapp/teacher/tests/', { method: 'POST', body: JSON.stringify(data) }),
    // Matches: GET /testapp/api/v1/teacher/tests/{test_id}/results/
    getResults: (testId: string) => 
      fetcher<any>(`/testapp/api/v1/teacher/tests/${testId}/results/`),
  }
};
