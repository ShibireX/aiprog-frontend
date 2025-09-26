import { User } from ".";

export interface SignUpState {
    username:string;
    email: string;
    password: string;
    repeatPassword: string;
    isSubmitting: boolean;
    errorMessage?: string |null;
}

export interface RegisterResponse {
    token: string;
    user: User;
}

