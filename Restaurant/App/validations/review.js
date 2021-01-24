export const validateRating = (stars) => {
  let errors = [];
  if (stars <= 0 || stars > 5) errors.push('Rating should be between 1 and 5.');
  return {Rating: errors};
};

export const validateComment = (comment) => {
  let errors = [];
  if (!comment) errors.push('Comment should not be empty.');
  if (comment !== null && (comment.length < 5 || comment.length > 256))
    errors.push(
      'Comment should have a minimum length of 5 and maximum length of 256.',
    );
  return {Comment: errors};
};
