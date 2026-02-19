const BASE_URL = "http://localhost:8080/api/v1";

export const getAllTasks = async () => {
  const res = await fetch(`${BASE_URL}/task`);
  return res.json();
};

export const getTaskDetails = async (id) => {
    const res = await fetch(`${BASE_URL}/task-details?id=${id}`, {
    method: "POST"
  });
  return res.json();
};

export const addTask = async (task) => {
  const res = await fetch(`${BASE_URL}/add-task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  return res.json();
};

export const updateTaskStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/update-task-status?id=${id}&newStatus=${status}`, {
    method: "POST"
  });
  return res.text();
};

export const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}/delete-task?id=${id}`, {
    method: "DELETE",
  });

  return res.text();
};
