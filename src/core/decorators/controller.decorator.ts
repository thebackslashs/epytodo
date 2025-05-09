import { setMetadata } from './metadata.storage';

export function Controller(prefix: string = '') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any): void => {
    setMetadata(target, 'prefix', prefix);
    setMetadata(target, 'isController', true);
  };
}
