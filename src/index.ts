import express, { type Request, type Response } from "express";
import { ToDoRepository } from "./repository/todo.repository.js";
import { type ToDo, type ToDoUpdate } from "./interface/todo.interface.js";
const app = express();
app.use(express.json());
const toDoRepository = new ToDoRepository();

app.get("/", async (req: Request, res: Response) => {
    res.status(200).json(await toDoRepository.findAll());
});

app.get("/:id", async (req: Request, res: Response) => {
    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
        res.status(400).send("Invalid ID");
        return;
    }

    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
        res.status(400).send("ID must be a number");
        return;
    }

    try {
        const toDo: any = await toDoRepository.findById(id);

        if (toDo === null) {
            res.status(404).json({ message: "ToDo not found" });
            return;
        }
        res.status(200).json(toDo);
    } catch (error) {
        res.status(404).json({ message: "ToDo not found" });
        return;
    }
});

app.delete("/:id", async (req: Request, res: Response) => {
    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
        res.status(400).send("Invalid ID");
        return;
    }

    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
        res.status(400).send("ID must be a number");
        return;
    }

    try {
        await toDoRepository.delete(id);
    } catch (error) {
        res.status(404).json({ message: "ToDo not found" });
        return;
    }

    res.status(204).json({ message: "ToDo deleted successfully" });
});


app.post("/", async (req: Request, res: Response) => {
    const todo: ToDo | undefined = req.body;

    if (!todo) {
        res.status(400).send("Invalid request");
        return;
    }

    if (!todo.title || todo.title.trim() === "") {
        res.status(400).send("Title is required");
        return;
    }

    await toDoRepository.create(todo.title);
    res.send("ToDo created successfully");
})

app.put("/:id", async (req: Request, res: Response) => {

    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
        res.status(400).send("Invalid ID");
        return;
    }

    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
        res.status(400).send("ID must be a number");
        return;
    }

    const todoUpdate: ToDoUpdate | undefined = req.body;

    if (!todoUpdate) {
        res.status(400).send("Invalid request");
        return;
    }

    try {
        await toDoRepository.update(id, todoUpdate);
    } catch (error) {
        res.status(404).json({ message: "ToDo not found" });
        return;
    }

    res.status(200).json({ message: "ToDo updated successfully" });

})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});