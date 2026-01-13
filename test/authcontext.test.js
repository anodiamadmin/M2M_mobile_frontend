import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, AuthContext } from '../AuthContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

const Consumer = () => {
  const { authStatus } = React.useContext(AuthContext);
  return <>{authStatus}</>;
};

describe('Auth Context', () => {
  it('sets AUTHENTICATED if token exists', async () => {
    AsyncStorage.getItem.mockResolvedValue('token');

    const { getByText } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(getByText('AUTHENTICATED')).toBeTruthy()
    );
  });

  it('sets UNAUTHENTICATED if token missing', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    const { getByText } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(getByText('UNAUTHENTICATED')).toBeTruthy()
    );
  });
});
