import { toast } from 'sonner';
import { settings, services } from '../data';

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  // Handle static data mocks
  if (url === '/api/settings' && (!options || options.method === 'GET')) {
    return settings as unknown as T;
  }
  if (url === '/api/services' && (!options || options.method === 'GET')) {
    return services as unknown as T;
  }
  if (url === '/api/auth/me') {
    return { authenticated: false, email: null } as unknown as T;
  }

  // For other requests or mutations in static mode, we skip actual network calls
  if (options && options.method && options.method !== 'GET') {
    console.warn(`Static Mode: Blocked ${options.method} request to ${url}`);
    toast.info("Changes cannot be saved in static preview mode.");
    return null;
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
      
      toast.error(errorMessage, {
        description: `Failed to fetch from ${url}`,
      });
      
      return null;
    }
    
    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    
    toast.error('Connection Error', {
      description: message,
    });
    
    return null;
  }
}
