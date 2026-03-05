import { describe, it, expect } from 'vitest';
import { ToDoRepository } from '../repository/todo.repository.js';
import { prisma } from '../prisma.client.js';
import type { ToDoUpdate } from '../interface/todo.interface.js';

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

    it('should find all ToDos', async () => {

        await Promise.all([
            toDoRepository.create('Test ToDo 1'),
            toDoRepository.create('Test ToDo 2'),
        ])

        const todos = await prisma.todo.findMany();
        expect(todos).toBeDefined();
        expect(todos.length).toBe(2);
    });

    it('should find by id ToDO', async () => {

        const todo = await toDoRepository.create('Test ToDo');
        const foundTodo = await toDoRepository.findById(todo.id);
        expect(foundTodo).toBeDefined();
        expect(foundTodo?.id).toBe(todo.id);
        expect(foundTodo?.title).toBe(todo.title);
        expect(foundTodo?.completed).toBe(todo.completed);

    })

    it('should update ToDo', async () => {
        const todo = await toDoRepository.create('Test ToDo');

        const todoUpdate: ToDoUpdate = {
            title: 'Updated ToDo',
            completed: true
        }

        const updatedTodo = await toDoRepository.update(todo.id, todoUpdate);
        expect(updatedTodo).toBeDefined();
        expect(updatedTodo?.id).toBe(todo.id);
        expect(updatedTodo?.title).toBe('Updated ToDo');
        expect(updatedTodo?.completed).toBe(true);
    })

    it('should delete ToDo', async () => {
        const todo = await toDoRepository.create('Test ToDo');
        const deletedTodo = await toDoRepository.delete(todo.id);
        expect(deletedTodo).toBeDefined();
        expect(deletedTodo?.id).toBe(todo.id);
        expect(deletedTodo?.title).toBe(todo.title);
        expect(deletedTodo?.completed).toBe(todo.completed);
    })
});