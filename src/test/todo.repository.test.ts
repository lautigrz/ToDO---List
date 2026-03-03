import { describe, it, expect } from 'vitest';
import { ToDoRepository } from '../repository/todo.repository.js';
import { prisma } from '../prisma.client.js';

describe('ToDoRepository', () => {
    const toDoRepository = new ToDoRepository();

    it('should create a new ToDo', async () => {
        const todo = await toDoRepository.create('Test ToDo');
        expect(todo.id).toBeDefined();
        expect(todo.title).toBe('Test ToDo');
        expect(todo.completed).toBe(false);

        const dbTodo = await prisma.todo.findUnique({ where: { id: todo.id } });
        expect(dbTodo).toBeDefined();
        expect(dbTodo?.title).toBe('Test ToDo');
        expect(dbTodo?.completed).toBe(false);
    });
});