import { useEffect, useState } from "react";
import {
  getAllTasks,
  getTaskDetails,
  addTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "./services/taskService";

function App() {
  const [taskList, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    getAllTasks()
      .then((data) => setTasks(data.taskList || []))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTask = async () => {
    try {
      const payload = {
        ...newTask,
        isCompleted: false,
        dueDate: newTask.dueDate + ":00",
      };

      const created = await addTask(payload);
      setTasks((prev) => [...prev, created]);

      setNewTask({ title: "", description: "", dueDate: "" });
      setShowForm(false);

    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTask = async () => {
    try {
      const payload = {
        id: selectedTask.id,
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate + ":00",
        isCompleted: selectedTask.completed,
      };

      console.log("UPDATE PAYLOAD:", payload);

      const updated = await updateTask(payload);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id ? { ...t, ...updated } : t
        )
      );

      setSelectedTask(updated);

      setNewTask({ title: "", description: "", dueDate: "" });
      setShowForm(false);
      setIsEditMode(false);

    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (id) => {
    if (showForm) return;

    getTaskDetails(id)
      .then((data) =>
        setSelectedTask({
          ...data,
          completed: data.completed ?? data.isCompleted,
        })
      )
      .catch((err) => console.error(err));
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      await updateTaskStatus(id, newStatus);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: newStatus } : task
        )
      );

      if (selectedTask?.id === id) {
        setSelectedTask({ ...selectedTask, completed: newStatus });
      }

    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedTask) return;

    try {
      await deleteTask(selectedTask.id);

      setTasks((prev) =>
        prev.filter((t) => t.id !== selectedTask.id)
      );

      setSelectedTask(null);

    } catch (err) {
      console.error(err);
    }
  };

  const thStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
  };

  const tdStyle = {
    border: "1px solid #ddd",
    padding: "10px",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tasks</h1>

      <button onClick={() => setShowForm(true)}>
        Add New Task
      </button>

      {showForm && (
        <div style={{ margin: "20px 0", border: "1px solid #ccc", padding: "15px" }}>
          <h3>{isEditMode ? "Edit Task" : "Add Task"}</h3>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newTask.title}
            onChange={handleChange}
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newTask.description}
            onChange={handleChange}
            style={{ marginLeft: "10px" }}
          />

          <input
            type="datetime-local"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleChange}
            style={{ marginLeft: "10px" }}
          />

          <button
            onClick={isEditMode ? handleUpdateTask : handleAddTask}
            style={{ marginLeft: "10px" }}
          >
            {isEditMode ? "Update" : "Save"}
          </button>

          <button
            onClick={() => {
              setShowForm(false);
              setIsEditMode(false);
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Due Date</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>

        <tbody>
          {taskList.map((task) => (
            <tr
              key={task.id}
              onClick={() => handleSelect(task.id)}
              style={{
                cursor: "pointer",
                backgroundColor:
                  selectedTask?.id === task.id ? "#e0f7fa" : "white",
              }}
            >
              <td style={tdStyle}>{task.title}</td>
              <td style={tdStyle}>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleString()
                  : "N/A"}
              </td>
              <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    handleToggle(task.id, task.completed)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTask && (
        <div style={{ marginTop: "20px" }}>
          <h2>Task Details</h2>

          <p><b>Title:</b> {selectedTask.title}</p>
          <p><b>Description:</b> {selectedTask.description || "N/A"}</p>
          <p><b>Completed:</b> {selectedTask.completed ? "✅" : "❌"}</p>
          <p><b>Due:</b> {new Date(selectedTask.dueDate).toLocaleString()}</p>

          <button
            onClick={() => {
              setNewTask({
                title: selectedTask.title,
                description: selectedTask.description || "",
                dueDate: selectedTask.dueDate?.slice(0, 16),
              });
              setIsEditMode(true);
              setShowForm(true);
            }}
            style={{ marginRight: "10px" }}
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            style={{
              padding: "8px 12px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Delete Task
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
