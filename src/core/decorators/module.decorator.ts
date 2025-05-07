import { ModuleConstructor, ModuleOptions } from './types';
import { setMetadata } from './metadata.storage';

export function Module(options: ModuleOptions = {}) {
  return function (target: ModuleConstructor): void {
    setMetadata(target, 'imports', options.imports || []);
    setMetadata(target, 'controllers', options.controllers || []);
    setMetadata(target, 'providers', options.providers || []);
    setMetadata(target, 'exports', options.exports || []);
  };
}
