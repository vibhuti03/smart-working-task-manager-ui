import { useEffect, useState } from "react";

function App() {
  const [taskList, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/task")
      .then((res) => res.json())
      .then((data) => {
        // adjust if your response is wrapped
        setTasks(data.taskList || data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Task List</h1>

      {taskList.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <ul>
          {taskList.map((task, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <strong>{task.title}</strong> <br />
              Completed: {task.completed ? "✅" : "❌"} <br />
              Due: {task.dueDate}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
