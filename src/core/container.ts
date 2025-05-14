/* eslint-disable @typescript-eslint/no-explicit-any */

import { ControllerInstance } from './decorators/index';
import { getMetadata } from './decorators/metadata.storage';
import { Logger, red, yellow } from '@/lib/logger';

const ContainerLogger = new Logger('Container');

export class Container {
  private instances = new Map();
  private dependencies = new Map();
  private exportedProviders = new Map();
  private tokenMap = new Map<string, any>();

  private addProvider(provider: any): void {
    const token = getMetadata(provider, 'token');
    const isController = getMetadata(provider, 'isController');

    if (token) {
      this.tokenMap.set(token, provider);
    }

    if (!this.dependencies.has(provider.name)) {
      this.dependencies.set(provider.name, provider);
      if (!isController) {
        const providerName = token || provider.name;
        ContainerLogger.info(
          `Registered provider ${yellow(providerName)}${
            token && token !== providerName
              ? ` with token ${yellow(token)}`
              : ''
          }`
        );
      }
    }
  }

  registerModule(moduleClass: any): void {
    const providers = getMetadata(moduleClass, 'providers') || [];
    const controllers = getMetadata(moduleClass, 'controllers') || [];
    const imports = getMetadata(moduleClass, 'imports') || [];
    const exports = getMetadata(moduleClass, 'exports') || [];

    for (const provider of providers) {
      this.addProvider(provider);
    }

    for (const controller of controllers) {
      this.addProvider(controller);
    }

    for (const importedModule of imports) {
      this.registerModule(importedModule);

      const moduleExports = getMetadata(importedModule, 'exports') || [];

      for (const exportedProvider of moduleExports) {
        this.exportedProviders.set(exportedProvider, importedModule);
        this.addProvider(exportedProvider);
      }
    }

    for (const exportedModule of exports) {
      this.exportedProviders.set(exportedModule, exportedModule);
    }

    this.resolve(moduleClass);
  }

  resolve<T>(target: any): T {
    if (this.instances.has(target)) {
      return this.instances.get(target) as T;
    }

    const dependency = this.dependencies.get(target) || target;

    const isInjectable = getMetadata(dependency, 'injectable');
    const isController = getMetadata(dependency, 'isController');
    const isExported = this.exportedProviders.has(dependency);

    if (
      !isInjectable &&
      !isController &&
      !isExported &&
      dependency !== target
    ) {
      ContainerLogger.error(
        `${red(dependency.name)} is not injectable or not exported by an imported module`
      );
      process.exit(1);
    }

    const injectionTokens = getMetadata(dependency, 'injectionTokens') || [];

    const params = [];
    for (let i = 0; i < injectionTokens.length; i++) {
      const token = injectionTokens[i];
      if (!token) {
        params.push(undefined);
      } else {
        const provider =
          this.tokenMap.get(token) || this.dependencies.get(token);
        if (provider || this.exportedProviders.has(token)) {
          params.push(this.resolve(provider || token));
        } else {
          ContainerLogger.error(
            `${red(token)} is not available in ${red(dependency.name)}. Ensure it is provided by an imported module.`
          );
          process.exit(1);
        }
      }
    }

    const instance = new dependency(...params);

    this.instances.set(target, instance);
    this.instances.set(dependency, instance);

    return instance as T;
  }

  getControllers(): ControllerInstance[] {
    const controllers: ControllerInstance[] = [];

    for (const [key, value] of this.dependencies.entries()) {
      if (getMetadata(value, 'isController')) {
        controllers.push(this.resolve(key));
      }
    }

    return controllers;
  }
}
