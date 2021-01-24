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

export const validateReply = (reply) => {
  let errors = [];
  if (!reply) errors.push('Reply should not be empty.');
  if (reply !== null && (reply.length < 5 || reply.length > 256))
    errors.push(
      'Reply should have a minimum length of 5 and maximum length of 256.',
    );
  return {Reply: errors};
};
