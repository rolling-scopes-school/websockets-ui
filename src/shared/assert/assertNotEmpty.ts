function assertNotEmpty<T>(
  value: T,
  message = 'Value is empty',
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

export default assertNotEmpty;
