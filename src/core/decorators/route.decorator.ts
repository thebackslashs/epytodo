import { ControllerInstance, HttpMethod } from './types';
import { getMetadata, setMetadata } from './metadata.storage';

function createRouteDecorator(method: HttpMethod) {
  return function (path: string = '/') {
    return function (
      target: ControllerInstance,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ): PropertyDescriptor {
      const routes = getMetadata(target.constructor, 'routes') || [];

      routes.push({
        method,
        path,
        handlerName: propertyKey,
      });
      setMetadata(target.constructor, 'routes', routes);
      return descriptor;
    };
  };
}

export const Get = createRouteDecorator('GET');
export const Post = createRouteDecorator('POST');
export const Put = createRouteDecorator('PUT');
export const Delete = createRouteDecorator('DELETE');
