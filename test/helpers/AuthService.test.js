import apiClient from '../../services/apiClient';
import { authService } from '../../services/authService';

jest.mock('../../services/apiClient', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('login() calls the correct endpoint with data', async () => {
    const mockResponse = { data: { access_token: '123' } };
    apiClient.post.mockResolvedValue(mockResponse);
    await authService.login('test@email.com', 'password123');
    expect(apiClient.post).toHaveBeenCalledWith('/auth/signin', {
      email: 'test@email.com',
      password: 'password123',
    });
  });

  it('register() calls the correct endpoint with data', async () => {
    const mockResponse = { data: { success: true } };
    apiClient.post.mockResolvedValue(mockResponse);
    const result = await authService.register('John', 'test@email.com', 'pass', '2000-01-01');
    expect(apiClient.post).toHaveBeenCalledWith('/auth/signup', {
      full_name: 'John',
      email: 'test@email.com',
      password: 'pass',
      date_of_birth: '2000-01-01', 
    });
    expect(result).toEqual(mockResponse.data);
  });
});