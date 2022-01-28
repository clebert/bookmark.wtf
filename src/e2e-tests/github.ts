import {NodeSet} from 'sonnar';

const {any, attribute} = NodeSet;
const page = any().filter(attribute(`.application-main`));

export const github = {
  loginField: page.path(any().filter(attribute(`#login_field`))),
  passwordField: page.path(any().filter(attribute(`#password`))),
  primaryButton: page.path(any().filter(attribute(`.btn-primary`))),
  otpField: page.path(any().filter(attribute(`#otp`))),
};
