export default (text) => {
  const regexp = /[^A-Za-z0-9]+/g;
  const rawValue = text;
  const trimmedValue = rawValue.trim();
  if (regexp.test(trimmedValue)) {
    return trimmedValue;
  } else {
    return false;
  }
};
