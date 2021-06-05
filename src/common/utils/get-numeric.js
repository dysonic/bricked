const getNumeric = value => {
  const parsed = parseInt(value, 10);
  if (!isNaN(parsed)) {
    return parsed;
  }
  return null;
}

export default getNumeric;
