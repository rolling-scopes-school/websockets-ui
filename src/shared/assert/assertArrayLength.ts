function assertArrayLength<T>(
  arr: T[],
  length: number,
  message: string | undefined,
): asserts arr is T[] {
  if (arr.length !== length) {
    throw new Error(
      message ?? `Expected array length of ${length} but got ${arr.length}`,
    );
  }
}

export default assertArrayLength;
