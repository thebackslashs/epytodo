export interface Todo {
    id: number;
    title: string;
    description: string;
    created_at: Date;
    due_time: Date;
    status: 'not started' | 'todo' | 'in progress' | 'done';
    user_id: number;
}