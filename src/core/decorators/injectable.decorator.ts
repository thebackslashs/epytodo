import { setMetadata } from './metadata.storage';

export function Injectable(token?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any): void => {
    setMetadata(target, 'injectable', true);
    if (token) {
      setMetadata(target, 'token', token);
    }
  };
}
