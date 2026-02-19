import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import * as api from "./services/taskService";
import userEvent from "@testing-library/user-event";

jest.mock("./services/taskService");

test("renders tasks from API", async () => {
  api.getAllTasks.mockResolvedValue({
    taskList: [
      { id: 1, title: "Test Task", dueDate: "2026-02-02T10:00:00", completed: false },
    ],
  });

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });
});

test("clicking a task loads details", async () => {
  api.getAllTasks.mockResolvedValue({
    taskList: [
      { id: 1, title: "Test Task", dueDate: "2026-02-02T10:00:00", completed: false },
    ],
  });

  api.getTaskDetails.mockResolvedValue({
    id: 1,
    title: "Test Task",
    description: "Details here",
    dueDate: "2026-02-02T10:00:00",
    completed: false,
  });

  render(<App />);

  const task = await screen.findByText("Test Task");

  await userEvent.click(task);

  await waitFor(() => {
    expect(screen.getByText("Details here")).toBeInTheDocument();
  });
});