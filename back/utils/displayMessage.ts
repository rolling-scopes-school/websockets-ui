export function displayMessage(message: string) {
  const longLine = '*'.repeat(message.length + 12);
  const shortLine = '*'.repeat(5);
  console.log(longLine);
  console.log(`${shortLine} ${message} ${shortLine}`);
  console.log(longLine);
}