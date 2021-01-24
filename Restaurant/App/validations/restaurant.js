export const validateRestaurantName = (name) => {
  let errors = [];
  if (!name) errors.push('Restaurant name should not be empty.');
  if (name !== null && name.length > 50)
    errors.push('Restaurant name should have a maximum length of 50.');
  return {'Restaurant Name': errors};
};

export const validateRestaurantAddress = (address) => {
  let errors = [];
  if (!address) errors.push('Restaurant address should not be empty.');
  if (address !== null && address.length > 100)
    errors.push('Restaurant name should have a maximum length of 100.');
  return {'Restaurant Address': errors};
};

export const validateRestaurantImage = (imageName) => {
  let errors = [];
  if (!imageName) errors.push('Restaurant image has not been uploaded.');
  return {'Restaurant Image': errors};
};
