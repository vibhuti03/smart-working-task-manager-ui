import { useEffect, useState } from "react";
import { getAllTasks, getTaskDetails, addTask, updateTaskStatus, deleteTask } from "./services/taskService";


function App() {
  const [taskList, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
      title: "",
      description: "",
      dueDate: "",
    });
  const [selectedTask, setSelectedTask] = useState(null);

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

      const createdTask = await addTask(payload);

      setTasks((prev) => [...prev, createdTask]);

      setNewTask({
        title: "",
        description: "",
        dueDate: "",
      });

      setShowForm(false); // ✅ CLOSE FORM

    } catch (err) {
      console.error(err);
    }
  };


  const handleSelect = (id) => {
    getTaskDetails(id)
      .then((data) => setSelectedTask(data))
      .catch((err) => console.error(err));
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      await updateTaskStatus(id, newStatus);

      // ✅ Update UI instantly (no refetch)
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: newStatus } : task
        )
      );

      // update selected task too (if same)
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

      // remove from UI
      setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));

      // clear selection
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
          <h3>Add Task</h3>

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
            onClick={handleAddTask}
            style={{ marginLeft: "10px" }}
          >
            Save
          </button>

          <button
            onClick={() => setShowForm(false)}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
      )}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
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
              <td style={tdStyle}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleToggle(task.id, task.completed);
                  }}
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
          onClick={handleDelete}
          style={{
            marginTop: "10px",
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
