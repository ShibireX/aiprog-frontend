'use client';

import { useState, useRef, useEffect } from 'react';
import { User } from '@/types';
import { getAuthState, logout as logoutUtil, validateToken, getStoredToken } from '@/lib/auth';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export class AuthViewModel {
  private state: AuthState;
  private setState: (state: AuthState) => void;

  constructor(initialState: AuthState, setState: (state: AuthState) => void) {
    this.state = initialState;
    this.setState = setState;
  }

  // Getters
  get isAuthenticated() { return this.state.isAuthenticated; }
  get user() { return this.state.user; }
  get token() { return this.state.token; }

  // Actions
  checkAuthStatus = async () => {
    const authState = getAuthState();
    
    if (authState.token) {
      // We have a token, validate it
      const user = await validateToken(authState.token);
      
      if (user) {
        // Token is valid, user is authenticated
        this.updateState({
          isAuthenticated: true,
          user,
          token: authState.token,
        });
      } else {
        // Token is invalid, clear state
        this.updateState({
          isAuthenticated: false,
          user: null,
          token: null,
        });
      }
    } else {
      // No token, user is not authenticated
      this.updateState(authState);
    }
  };

  logout = () => {
    logoutUtil();
    this.updateState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  private updateState = (partial: Partial<AuthState>) => {
    this.state = { ...this.state, ...partial };
    this.setState(this.state);
  };
}

// Hook for React
export function useAuthViewModel() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  const viewModel = useRef(new AuthViewModel(state, setState));
  viewModel.current = new AuthViewModel(state, setState);

  // Check auth status on mount
  useEffect(() => {
    viewModel.current.checkAuthStatus();
  }, []);

  return viewModel.current;
}
