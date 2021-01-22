export const validateUserName = (userName) => {
  let errors = [];
  if (!userName) errors.push('User name should not be empty.');
  if (!userName && userName.length > 256)
    errors.push('User name should have a maximum length of 256.');
  return {UserName: errors};
};

export const validatePassword = (password) => {
  let errors = [];
  if (!password) errors.push('Password should not be empty.');
  if (!password || password.length < 15 || password.length > 256)
    errors.push('Password should have a length between 15 and 256 characters.');
  return {Password: errors};
};
