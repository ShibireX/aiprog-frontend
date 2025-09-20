'use client';

import { useState, useRef } from 'react';
import { SignUpState } from '@/types/signup';
export class SignUpViewModel {
  private state: SignUpState;
  private setState: (state: SignUpState) => void;

  constructor(initialState: SignUpState, setState: (state: SignUpState) => void) {
    this.state = initialState;
    this.setState = setState;
  }

  // Getters
  get username(){return this.state.username;}
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
    if (!this.state.email || !this.state.password || !this.state.repeatPassword) {
      this.updateState({ errorMessage: "All fields are required" });
      return;
    }
    if (this.state.password !== this.state.repeatPassword) {
      this.updateState({ errorMessage: "Passwords do not match" });
      return;
    }

    this.updateState({ isSubmitting: true, errorMessage: undefined });

  };

  private updateState = (partial: Partial<typeof this.state>) => {
    this.state = { ...this.state, ...partial };
    this.setState(this.state);
  };
}





export function useSignUpViewModel() {
    const [state, setState] = useState<SignUpState>({
        username:'',
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
