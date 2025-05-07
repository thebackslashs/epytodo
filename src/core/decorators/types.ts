import { Request, Response, Router } from 'express';

export type RouteHandler = (
  req: Request,
  res: Response
) => void | Promise<void>;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RouteMetadata {
  method: HttpMethod;
  path: string;
  handler: RouteHandler;
}

export interface ControllerMetadata {
  routes: RouteMetadata[];
  basePath: string;
}

export interface ModuleMetadata {
  controllers: ControllerConstructor[];
  modules: ModuleConstructor[];
  providers: InjectableConstructor[];
  providersInstances: Map<string, InjectableInstance>;
}

export interface ControllerInstance {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ControllerConstructor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): ControllerInstance;
  prototype: ControllerInstance;
}

export interface ModuleInstance {
  controllers?: ControllerInstance[];
  modules?: ModuleConstructor[];
  router?: Router;
  constructor: {
    name: string;
  };
}

export interface InjectableInstance {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ModuleConstructor {
  new (): ModuleInstance;
  name: string;
  prototype: ModuleInstance;
}

export interface InjectableConstructor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): InjectableInstance;
  prototype: InjectableInstance;
}

export interface ModuleOptions {
  imports?: ModuleConstructor[];
  controllers?: ControllerConstructor[];
  providers?: InjectableConstructor[];
  exports?: InjectableConstructor[];
}

// Metadata stores
export const controllerMetadataStore = new WeakMap<
  ControllerConstructor,
  ControllerMetadata
>();

export const moduleMetadataStore = new WeakMap<
  ModuleConstructor,
  ModuleMetadata
>();
