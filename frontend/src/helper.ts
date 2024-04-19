const moment = require('moment');

export const formatDateWithMoment = (dateString: string) => {
  return moment(dateString).format('DD/MM/YY HH:mm');
}

export const validatePassword = (password: string): boolean => {
  const hasLength = password.length >= 8;
  const hasNumbers = /\d/.test(password);
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+]/.test(password);

  return hasLength && hasNumbers && hasLetters && hasSpecialChars;
};

// Example usage:
