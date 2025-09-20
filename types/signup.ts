export interface SignUpState {
    username:string;
    email: string;
    password: string;
    repeatPassword: string;
    isSubmitting: boolean;
    errorMessage?: string |null;
}

export interface SignUpResult {
    username:string;
    email:string;
    password:string;

}