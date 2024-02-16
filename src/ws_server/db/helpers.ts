
export function getIndex(model: Map<any, any>) {
  const index = Math.floor(1 + Math.random() * 10000);
  if (model.has(index)) {
    this.getIndex(model);
  }
  return index;
}
