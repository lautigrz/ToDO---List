import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { ToDoRepository } from "../repository/todo.repository.js";

vi.mock("../repository/todo.repository.js");


describe("GET /", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    it("should return 200 with the todos when found", async () => {
        const todos = [
            {
                id: 1,
                title: "Test ToDo",
                completed: false,
                createdAt: new Date()
            },
            {
                id: 2,
                title: "Test ToDo",
                completed: false,
                createdAt: new Date()
            }
        ]

        vi.mocked(ToDoRepository.prototype.findAll).mockResolvedValue(todos);
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(todos.map((todo) => ({ ...todo, createdAt: todo.createdAt.toISOString() })));
    })
})

describe("GET /:id", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })


    it("should return 200 with the todo when found", async () => {
        const todo = {
            id: 1,
            title: "Test ToDo",
            completed: false,
            createdAt: new Date()
        }

        vi.mocked(ToDoRepository.prototype.findById).mockResolvedValue(todo);

        const response = await request(app).get("/1");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ...todo, createdAt: todo.createdAt.toISOString() });
    })

    it("should return 400 when a non-numeric parameter is sent", async () => {
        const response = await request(app).get("/abc");
        expect(response.status).toBe(400);
    })

    it("should return 404 if it does not find the resource", async () => {
        vi.mocked(ToDoRepository.prototype.findById).mockResolvedValue(null);
        const response = await request(app).get("/1");
        expect(response.status).toBe(404);
    })


})

describe("DELETE /:id", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    it("should return 400 if the id is invalid to delete the requested resource", async () => {

        const response = await request(app).delete("/abc");
        expect(response.status).toBe(400);

    })

    it("should return 404 if it does not find the resource", async () => {

        vi.mocked(ToDoRepository.prototype.delete).mockRejectedValue(new Error("ToDo not found"));
        const response = await request(app).delete("/1");
        expect(response.status).toBe(404);
    })

    it("should return 204 if the resource is deleted successfully", async () => {
        const todo = {
            id: 1,
            title: "Test ToDo",
            completed: false,
            createdAt: new Date()
        }

        vi.mocked(ToDoRepository.prototype.delete).mockResolvedValue(todo);
        const response = await request(app).delete("/1");
        expect(response.status).toBe(204);
    })
})


describe("POST /", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    it("should return 400 if the request is invalid", async () => {
        const response = await request(app).post("/");
        expect(response.status).toBe(400);
    })

    it("should return 400 if the title is invalid", async () => {
        const response = await request(app).post("/").send({ title: "" });
        expect(response.status).toBe(400);
    })

    it("should return 201 if the resource is created successfully", async () => {
        const todo = {
            id: 1,
            title: "Test ToDo",
            completed: false,
            createdAt: new Date()
        }

        vi.mocked(ToDoRepository.prototype.create).mockResolvedValue(todo);
        const response = await request(app).post("/").send({ title: "Test ToDo" });
        expect(response.status).toBe(201);
    })
})

describe("PUT /:id", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    it("should return 400 if the id is invalid to update the requested resource", async () => {
        const response = await request(app).put("/abc");
        expect(response.status).toBe(400);
    })

    it("should return 404 if it does not find the resource", async () => {
        vi.mocked(ToDoRepository.prototype.update).mockRejectedValue(new Error("ToDo not found"));
        const response = await request(app).put("/1").send({ title: "Test ToDo", completed: true });
        expect(response.status).toBe(404);
    })

    it("should return 200 if the resource is updated successfully", async () => {
        const todo = {
            id: 1,
            title: "Test ToDo",
            completed: false,
            createdAt: new Date()
        }

        vi.mocked(ToDoRepository.prototype.update).mockResolvedValue(todo);
        const response = await request(app).put("/1").send({ title: "Test ToDo" });
        expect(response.status).toBe(200);
    })
})

