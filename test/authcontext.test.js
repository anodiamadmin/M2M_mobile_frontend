import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { AuthContext, AuthProvider } from '../context/AuthContext';

/* =====================================================
   MOCK expo-secure-store (CRITICAL)
===================================================== */
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
}));

/* =====================================================
   TEST CONSUMER COMPONENT
   (to read context values)
===================================================== */
function TestConsumer() {
  return (
    <AuthContext.Consumer>
      {({ authStatus }) => <Text testID="authStatus">{authStatus}</Text>}
    </AuthContext.Consumer>
  );
}

/* =====================================================
   TEST SUITE
===================================================== */
describe('AuthContext', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sets authStatus to AUTHENTICATED when token exists', async () => {
    SecureStore.getItemAsync.mockResolvedValue('mock_token');

    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('authStatus').props.children)
        .toBe('AUTHENTICATED');
    });
  });

  it('sets authStatus to UNAUTHENTICATED when token does not exist', async () => {
    SecureStore.getItemAsync.mockResolvedValue(null);

    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('authStatus').props.children)
        .toBe('UNAUTHENTICATED');
    });
  });

  it('falls back to UNAUTHENTICATED if SecureStore throws error', async () => {
    SecureStore.getItemAsync.mockRejectedValue(new Error('SecureStore error'));

    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('authStatus').props.children)
        .toBe('UNAUTHENTICATED');
    });
  });
});
