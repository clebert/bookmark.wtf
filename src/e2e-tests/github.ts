import {select} from 'sonnar';
import {is} from './is';

const Page = select('descendant', '*').filter(is('.application-main'));

export const github = {
  LoginPage: Page,
  loginPage: {
    LoginField: Page.select('descendant', '*').filter(is('#login_field')),
    PasswordField: Page.select('descendant', '*').filter(is('#password')),
    SignInButton: Page.select('descendant', '*').filter(is('.btn-primary')),
  },

  TwoFactorPage: Page,
  twoFactorPage: {
    OTPField: Page.select('descendant', '*').filter(is('#otp')),
    VerifyButton: Page.select('descendant', '*').filter(is('.btn-primary')),
  },
};
