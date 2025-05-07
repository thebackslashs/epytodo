const metadataStorage = new Map();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setMetadata(target: any, key: string, value: any): void {
  if (!metadataStorage.has(target)) {
    metadataStorage.set(target, new Map());
  }
  metadataStorage.get(target).set(key, value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getMetadata(target: any, key: string): any {
  if (!metadataStorage.has(target)) {
    return undefined;
  }
  return metadataStorage.get(target).get(key);
}
