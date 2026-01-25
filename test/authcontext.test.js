import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { useContext } from 'react';
import { Button, Text } from 'react-native';
import { AuthStatus } from '../constants/types';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { authService } from '../services/authService';

// --- MOCKS ---
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('../services/authService', () => ({
  authService: {
    logout: jest.fn(),
  },
}));

const TestConsumer = () => {
  const { authStatus, logout } = useContext(AuthContext);
  return (
    <>
      <Text testID="status">{authStatus}</Text>
      <Button testID="logout-btn" title="Logout" onPress={logout} />
    </>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes as UNKNOWN then becomes AUTHENTICATED if token exists', async () => {
    SecureStore.getItemAsync.mockResolvedValue('valid-token');

    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // ✅ FIX: Verify initial state first
    expect(getByTestId('status').props.children).toBe(AuthStatus.UNKNOWN);

    // ✅ FIX: Use waitFor with a slightly longer timeout if needed, but usually default is fine.
    // Ensure the expectation matches exactly what your component renders.
    await waitFor(() => {
      expect(getByTestId('status').props.children).toBe(AuthStatus.AUTHENTICATED);
    });
  });

  it('initializes as UNKNOWN then becomes UNAUTHENTICATED if no token exists', async () => {
    SecureStore.getItemAsync.mockResolvedValue(null);

    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('status').props.children).toBe(AuthStatus.UNAUTHENTICATED);
    });
  });

  it('handles errors during token check gracefully', async () => {
    SecureStore.getItemAsync.mockRejectedValue(new Error('Storage failure'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('status').props.children).toBe(AuthStatus.UNAUTHENTICATED);
    });

    consoleSpy.mockRestore();
  });

  it('logout() clears token, calls service, and sets status to UNAUTHENTICATED', async () => {
    SecureStore.getItemAsync.mockResolvedValue('valid-token');
    
    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => expect(getByTestId('status').props.children).toBe(AuthStatus.AUTHENTICATED));

    await act(async () => {
      fireEvent.press(getByTestId('logout-btn'));
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user_token');
    expect(getByTestId('status').props.children).toBe(AuthStatus.UNAUTHENTICATED);
  });

  it('logout() handles backend failures gracefully', async () => {
    SecureStore.getItemAsync.mockResolvedValue('valid-token');
    authService.logout.mockRejectedValue(new Error('Network Error'));
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => expect(getByTestId('status').props.children).toBe(AuthStatus.AUTHENTICATED));

    await act(async () => {
      fireEvent.press(getByTestId('logout-btn'));
    });

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user_token');
    expect(getByTestId('status').props.children).toBe(AuthStatus.UNAUTHENTICATED);
    
    consoleSpy.mockRestore();
  });

  it('logout() proceeds safely if authService.logout is undefined (Branch Coverage)', async () => {
    SecureStore.getItemAsync.mockResolvedValue('valid-token');
    
    const originalLogout = authService.logout;
    authService.logout = undefined;

    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => expect(getByTestId('status').props.children).toBe(AuthStatus.AUTHENTICATED));

    await act(async () => {
      fireEvent.press(getByTestId('logout-btn'));
    });

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user_token');
    expect(getByTestId('status').props.children).toBe(AuthStatus.UNAUTHENTICATED);

    authService.logout = originalLogout;
  });
});