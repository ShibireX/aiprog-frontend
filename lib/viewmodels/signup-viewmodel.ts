'use client';

import { useState, useRef } from 'react';
import { RegisterResponse, SignUpState } from '@/types/signup';
import { graphqlClient } from '@/lib/graphql/client';
import { REGISTER_USER } from '../graphql/queries';


export class SignUpViewModel {
  private state: SignUpState;
  private setState: (state: SignUpState) => void;

  constructor(initialState: SignUpState, setState: (state: SignUpState) => void) {
    this.state = initialState;
    this.setState = setState;
  }

  // Getters
  get username() { return this.state.username; }
  get email() { return this.state.email; }
  get password() { return this.state.password; }
  get repeatPassword() { return this.state.repeatPassword; }
  get isSubmitting() { return this.state.isSubmitting; }
  get errorMessage() { return this.state.errorMessage; }

  // Actions
  setUsername = (username: string) => this.updateState({ username });
  setEmail = (email: string) => this.updateState({ email });
  setPassword = (password: string) => this.updateState({ password });
  setRepeatPassword = (repeatPassword: string) => this.updateState({ repeatPassword });



  onSubmit = async () => {
    this.updateState({ isSubmitting: true, errorMessage: "" });
    
    try {
      const result = await this.registerUserAPI(this.username, this.email, this.password);


      // store token if you want
      graphqlClient.setAuthToken?.(result.token);

      this.updateState({ isSubmitting: false });
    } catch (err: any) {
      this.updateState({
        isSubmitting: false,
        errorMessage: err.message || "Signup failed",
      });
    }
  };


  private registerUserAPI = async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    const variables = { 
     input:{
      username: username,
      email: email,
      password: password
    } 
    }
    
    const response = await graphqlClient.request<{register: RegisterResponse}>({
      query: REGISTER_USER,
      variables
    })
    return response.register;
  }


  private updateState = (partial: Partial<SignUpState>) => {
    this.state = { ...this.state, ...partial };
    this.setState(this.state);
  };
}

// Hook for React
export function useSignUpViewModel() {
  const [state, setState] = useState<SignUpState>({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
    isSubmitting: false,
    errorMessage: '',
  });

  const viewModel = useRef(new SignUpViewModel(state, setState));
  viewModel.current = new SignUpViewModel(state, setState);

  return viewModel.current;
}
