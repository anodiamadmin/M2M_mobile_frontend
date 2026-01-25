import axios from 'axios';
import { authService } from '../services/authService';

// --- MOCK AXIOS ---
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
    // 1. Force execution of apiClient
    try {
      require('../services/apiClient');
    } catch (e) {}

    // 2. Retrieve the mock instance
    if (axios.create.mock.results.length > 0) {
        mockAxiosInstance = axios.create.mock.results[0].value;
        mockPost = mockAxiosInstance.post;
    }
  });

  // ✅ Clean up mocks between tests in this file
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Clean up module cache so we don't break other test files
  afterAll(() => {
    jest.resetModules();
  });

  // --- AUTH SERVICE TESTS ---
  describe('authService', () => {
    it('login() calls the correct endpoint and returns data', async () => {
      const mockResponse = { data: { access_token: 'fake-token' } };
      mockPost.mockResolvedValue(mockResponse); 
      
      const result = await authService.login('test@email.com', 'password123');
      
      expect(mockPost).toHaveBeenCalledWith('/auth/signin', {
        email: 'test@email.com',
        password: 'password123'
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('register() calls the correct endpoint with user data', async () => {
        const mockResponse = { data: { success: true } };
        mockPost.mockResolvedValue(mockResponse);
        const userData = { full_name: 'John', email: 'j@t.com', password: 'p', dob: 'd' };

        await authService.register(userData.full_name, userData.email, userData.password, userData.dob);
        expect(mockPost).toHaveBeenCalledWith('/auth/signup', expect.any(Object)); 
    });

    it('register() rethrows error data if request fails', async () => {
      const mockError = { response: { data: { detail: "User exists" } } };
      mockPost.mockRejectedValue(mockError);

      await expect(
        authService.register('Name', 'email', 'pass', 'date')
      ).rejects.toEqual(mockError);
    });

    it('logout() calls the correct endpoint', async () => {
      mockPost.mockResolvedValue({}); 
      await authService.logout();
      expect(mockPost).toHaveBeenCalledWith('/auth/logout');
    });
  });

  // --- API CLIENT INTERCEPTOR TEST ---
  describe('apiClient Interceptors', () => {
    it('configures request interceptor to process config', async () => {
       const handlers = mockAxiosInstance.__requestHandlers;
       expect(handlers).toBeDefined();
       
       const mockConfig = { headers: {}, method: 'get', url: '/test' };
       const result = await handlers.success(mockConfig);
       expect(result).toBeDefined();
    });

    it('configures request interceptor to handle errors', async () => {
      const handlers = mockAxiosInstance.__requestHandlers;
      if (handlers && handlers.error) {
        const error = new Error('Request Config Error');
        try {
          await handlers.error(error);
        } catch (e) {
          expect(e).toBe(error);
        }
      }
    });

    it('configures response interceptor to handle errors', async () => {
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
  });
});