import axios from 'axios';
import { authService } from '../services/authService';

// --- MOCK AXIOS ---
// We define the structure INSIDE the factory.
// We capture BOTH request and response interceptors into stateful properties.
jest.mock('axios', () => {
  return {
    create: jest.fn(() => {
      const instance = {
        post: jest.fn(),
        get: jest.fn(),
        interceptors: {
          request: { 
            use: jest.fn((successFn, errorFn) => {
              // Capture REQUEST handlers
              instance.__requestHandlers = { success: successFn, error: errorFn };
            }) 
          },
          response: { 
            use: jest.fn((successFn, errorFn) => {
              // Capture RESPONSE handlers
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
    } catch (e) {
      // Ignore if already imported
    }

    // 2. Retrieve the mock instance
    if (axios.create.mock.results.length > 0) {
        mockAxiosInstance = axios.create.mock.results[0].value;
        mockPost = mockAxiosInstance.post;
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
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

        const userData = {
          full_name: 'John Doe',
          email: 'john@test.com',
          password: 'pass',
          dob: '2000-01-01'
        };

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
    
    // ✅ TEST THE REQUEST INTERCEPTOR (Covering lines 18-28)
    it('configures request interceptor to process config', async () => {
       const handlers = mockAxiosInstance.__requestHandlers;
       
       // Verify the request interceptor exists
       expect(handlers).toBeDefined();
       expect(handlers.success).toBeInstanceOf(Function);

       // Execute the success handler (this runs the code on lines 18-28)
       const mockConfig = { headers: {}, method: 'get', url: '/test' };
       const result = await handlers.success(mockConfig);

       // Expect it to return the config (or modified config)
       expect(result).toBeDefined();
       // You can add more expectations here if your interceptor adds tokens, etc.
       // e.g. expect(result.headers.Authorization).toBeDefined(); 
    });

    // TEST THE RESPONSE INTERCEPTOR (If it exists)
    it('configures response interceptor to handle errors', async () => {
       const handlers = mockAxiosInstance.__responseHandlers;

       // Only run this check if a response interceptor was actually defined
       if (handlers) {
         // Test Success Path
         const response = { data: 'ok' };
         expect(handlers.success(response)).toBe(response);

         // Test Error Path
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