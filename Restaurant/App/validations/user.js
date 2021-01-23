export const validateUserName = (userName) => {
  let errors = [];
  if (!userName) errors.push('User name should not be empty.');
  if (!userName && userName.length < 4 && userName.length > 256)
    errors.push(
      'User name should have a minimum length < 4 && maximum length of 256.',
    );
  return {'User Name': errors};
};

export const validatePassword = (password) => {
  let errors = [];
  if (!password) errors.push('Password should not be empty.');
  if (!password || password.length < 15 || password.length > 256)
    errors.push('Password should have a length between 15 and 256 characters.');
  return {Password: errors};
};

export const validateConfirmPassword = ({password, confirmPassword}) => {
  let errors = [];
  if (!confirmPassword) errors.push('Confirm password should not be empty.');
  if (password !== confirmPassword)
    errors.push('Password does not match confirm password.');
  return {'Confirm Password': errors};
};

export const validateFirstName = (firstName) => {
  let errors = [];
  if (!firstName) errors.push('First name should not be empty.');
  if (!firstName && firstName.length > 256)
    errors.push('First name should have a maximum length of 256.');
  return {'First Name': errors};
};

export const validateLastName = (lastName) => {
  let errors = [];
  if (!lastName) errors.push('Last name should not be empty.');
  if (!lastName && lastName.length > 256)
    errors.push('Last name should have a maximum length of 256.');
  return {'Last Name': errors};
};
