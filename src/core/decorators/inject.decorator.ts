import { getMetadata, setMetadata } from './metadata.storage';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Inject(token: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any, _: any, parameterIndex: number): void => {
    const injectionTokens = getMetadata(target, 'injectionTokens') || [];
    injectionTokens[parameterIndex] = token;
    setMetadata(target, 'injectionTokens', injectionTokens);
  };
}
