import {descendant, query} from 'sonnar';

export class GithubCOM {
  static readonly LoginPage = query('body', {
    LoginInput: descendant('#login_field', {}),
    PasswordInput: descendant('#password', {}),
    SignInButton: descendant('.btn-primary', {}),
  });

  static readonly TwoFactorPage = query('body', {
    OTPInput: descendant('#otp', {}),
    VerifyButton: descendant('.btn-primary', {}),
  });
}
