import {descendant, query} from 'sonnar';

export const Github = query('body', {
  LoginPage: descendant('.application-main', {
    LoginField: descendant('#login_field', {}),
    PasswordField: descendant('#password', {}),
    SignInButton: descendant('.btn-primary', {}),
  }),

  TwoFactorPage: descendant('.application-main', {
    OTPField: descendant('#otp', {}),
    VerifyButton: descendant('.btn-primary', {}),
  }),
});
