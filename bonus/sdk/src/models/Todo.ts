/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Todo = {
  id?: number;
  title?: string;
  description?: string;
  created_at?: string;
  due_time?: string;
  user_id?: number;
  status?: Todo.status;
};
export namespace Todo {
  export enum status {
    NOT_STARTED = 'not started',
    TODO = 'todo',
    IN_PROGRESS = 'in progress',
    DONE = 'done',
  }
}
