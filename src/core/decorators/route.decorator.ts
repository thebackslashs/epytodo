import { ControllerInstance, HttpMethod } from './types';
import { getMetadata, setMetadata } from './metadata.storage';

type ContentType =
  | 'application/json'
  | 'text/html'
  | 'text/yaml'
  | 'text/plain';

function createRouteDecorator(method: HttpMethod) {
  return function (
    path: string = '/',
    status: number = 200,
    contentType: ContentType = 'application/json'
  ) {
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
        status,
        contentType,
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
