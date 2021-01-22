export const validateAll = (validationItems) => {
  const errors = {};
  validationItems.map((item) => {
    const result = callValidateFunction(item);
    const errorPropertyName = getErrorPropertyName(result);
    if (errorPropertyName && result[errorPropertyName].length > 0)
      errors[errorPropertyName] = result[errorPropertyName];
  });

  if (isEmptyObject(errors)) return null;
  return errors;
};

const callValidateFunction = ([validationFunction, value]) => {
  return validationFunction(value);
};

const getErrorPropertyName = (validationResult) => {
  var keys = Object.keys(validationResult);
  if (keys.length === 0) return null;
  return keys[0];
};

const isEmptyObject = (object) => {
  return Object.keys(object).length === 0;
};
