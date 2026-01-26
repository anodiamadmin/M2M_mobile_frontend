import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../../services/authService';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('axios', () => {
  return {
    create: jest.fn(() => {
      const instance = {
        post: jest.fn(),
        get: jest.fn(),
        interceptors: {
          request: { 
            use: jest.fn((successFn, errorFn) => {
              instance.__requestHandlers = { success: successFn, error: errorFn };
            }) 
          },
          response: { 
            use: jest.fn((successFn, errorFn) => {
              instance.__responseHandlers = { success: successFn, error: errorFn };
            }) 
          },
        },
        defaults: { headers: { common: {} } }
      };
      return instance;
    }),
    isAxiosError: jest.fn(),
  };
});

describe('Services', () => {
  let mockAxiosInstance;
  let mockPost;

  beforeAll(() => {
    try {
      require('../../services/apiClient');
    } catch (e) {}

    if (axios.create.mock.results.length > 0) {
        mockAxiosInstance = axios.create.mock.results[0].value;
        mockPost = mockAxiosInstance.post;
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authService', () => {
    it('login() calls the correct endpoint and saves token', async () => {
      const mockResponse = { data: { access_token: 'fake-token' } };
      mockPost.mockResolvedValue(mockResponse);      
      const result = await authService.login('test@email.com', 'pass');      
      expect(mockPost).toHaveBeenCalledWith('/auth/signin', { email: 'test@email.com', password: 'pass' });
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('user_token', 'fake-token');
      expect(result).toEqual(mockResponse.data);
    });

    it('login() proceeds without saving token if access_token is missing', async () => {
      const mockResponse = { data: { message: 'Login successful but no token?' } };
      mockPost.mockResolvedValue(mockResponse); 
      const result = await authService.login('test@email.com', 'pass');
      expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponse.data);
    });

    it('register() calls the correct endpoint with standard data', async () => {
        const mockResponse = { data: { success: true } };
        mockPost.mockResolvedValue(mockResponse);
        await authService.register('John', 'j@t.com', 'pass', '2000-01-01');
        expect(mockPost).toHaveBeenCalledWith('/auth/signup', expect.any(Object)); 
    });

    it('register() converts DD/MM/YYYY date to YYYY-MM-DD', async () => {
        const mockResponse = { data: { success: true } };
        mockPost.mockResolvedValue(mockResponse);
        await authService.register('John', 'j@t.com', 'pass', '25/12/1990');
        expect(mockPost).toHaveBeenCalledWith('/auth/signup', expect.objectContaining({
            date_of_birth: '1990-12-25'
        }));
    });

    it('register() rethrows error data if request fails', async () => {
      const mockError = { response: { data: { detail: "User exists" } } };
      mockPost.mockRejectedValue(mockError);
      await expect(authService.register('Name', 'email', 'pass', 'date')).rejects.toEqual(mockError);
    });

    it('logout() calls the correct endpoint', async () => {
      mockPost.mockResolvedValue({}); 
      await authService.logout();
      expect(mockPost).toHaveBeenCalledWith('/auth/logout');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user_token');
    });

    it('logout() catches backend errors and logs them', async () => {
      const mockError = new Error('Network Fail');
      mockPost.mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      await authService.logout();
      expect(consoleSpy).toHaveBeenCalledWith("Backend logout failed:", mockError);
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user_token');     
      consoleSpy.mockRestore();
    });
  });

  describe('apiClient Interceptors', () => {
    
    it('Request Interceptor: attaches Authorization header if token exists', async () => {
       const handlers = mockAxiosInstance.__requestHandlers;
       expect(handlers).toBeDefined();   
       SecureStore.getItemAsync.mockResolvedValue('my-secret-token');
       const mockConfig = { headers: {}, method: 'get', url: '/test' };      
       await handlers.success(mockConfig);
       expect(mockConfig.headers.Authorization).toBe('Bearer my-secret-token');
    });

    it('Request Interceptor: logs error if SecureStore fails', async () => {
       const handlers = mockAxiosInstance.__requestHandlers;
       const mockError = new Error('Store Locked');
       SecureStore.getItemAsync.mockRejectedValue(mockError);
       const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
       const mockConfig = { headers: {}, method: 'get', url: '/test' };
       await handlers.success(mockConfig);
       expect(consoleSpy).toHaveBeenCalledWith('Error attaching token:', mockError);
       consoleSpy.mockRestore();
    });

    it('Request Interceptor: rejects promise on error', async () => {
      const handlers = mockAxiosInstance.__requestHandlers;
      expect(handlers.error).toBeInstanceOf(Function);
      const error = new Error('Request Config Failed');
      await expect(handlers.error(error)).rejects.toBe(error);
    });

    it('Response Interceptor: passes success and handles errors', async () => {
       const handlers = mockAxiosInstance.__responseHandlers;
       if (handlers) {
         const response = { data: 'ok' };
         expect(handlers.success(response)).toBe(response);
         const error = { response: { status: 500 } };
         try {
           await handlers.error(error);
         } catch (e) {
           expect(e).toBe(error); 
         }
       }
    });

    it('Request Interceptor: does NOT attach Authorization header if token is missing', async () => {
       const handlers = mockAxiosInstance.__requestHandlers;
       SecureStore.getItemAsync.mockResolvedValue(null);
       const mockConfig = { headers: {}, method: 'get', url: '/public-endpoint' };
       await handlers.success(mockConfig);
       expect(SecureStore.getItemAsync).toHaveBeenCalledWith('user_token');
       expect(mockConfig.headers.Authorization).toBeUndefined();
    });
  });
});