import type { ToDoUpdate } from "../interface/todo.interface.js";
import { prisma } from "../prisma.client.js";

export class ToDoRepository {
    async create(title: string) {
        return await prisma.todo.create({
            data: {
                title,
            },
        });
    }

    async findAll() {
        return await prisma.todo.findMany();
    }

    async findById(id: number) {
        return await prisma.todo.findUnique({
            where: {
                id,
            },
        });
    }

    async update(id: number, todoUpdate: ToDoUpdate) {
        return await prisma.todo.update({
            where: {
                id,
            },
            data: {
                ...(todoUpdate.title !== undefined && { title: todoUpdate.title }),
                ...(todoUpdate.completed !== undefined && { completed: todoUpdate.completed }),
            },
        });
    }

    async delete(id: number) {
        return await prisma.todo.delete({
            where: {
                id,
            },
        });
    }
}