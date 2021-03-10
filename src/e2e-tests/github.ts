import {descendant, query} from 'sonnar';

export class Github {
  static readonly LoginPage = query('body', {
    LoginField: descendant('#login_field', {}),
    PasswordField: descendant('#password', {}),
    SignInButton: descendant('.btn-primary', {}),
  });

  static readonly TwoFactorPage = query('body', {
    OTPField: descendant('#otp', {}),
    VerifyButton: descendant('.btn-primary', {}),
  });
}
