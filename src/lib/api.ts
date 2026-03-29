import { toast } from 'sonner';

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
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
