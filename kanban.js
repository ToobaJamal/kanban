export default class Kanban {
  static getTasks(columnId) {
    const data = read();
    return data[columnId].tasks;
  }

  static insertTask(columnId, content, date) {
    const data = read();
    const column = data.find((column) => {
      return column.columnId == columnId;
    });
    const task = {
      taskId: Math.floor(Math.random() * 100000),
      date: date,
      content: content,
    };
    column.tasks.push(task);
    save(data);

    return task;
  }

  static deleteTask(taskId) {
    const data = read();
    for (const column of data) {
      const task = column.tasks.find((task) => task.taskId == taskId);
      if (task) {
        column.tasks.splice(column.tasks.indexOf(task), 1);
      }
    }
    save(data);
  }

  static updateTask(taskId, updatedContent) {
    const data = read();
    function findColumnTask() {
      for (const column of data) {
        const task = column.tasks.find((task) => task.taskId == taskId);
        if (task) {
          return [task, column];
        }
      }
    }

    const [task, currentColumn] = findColumnTask();

    const targetColumn = data.find(
      (column) => column.columnId == updatedContent.columnId,
    );

    // update task
    task.content = updatedContent.content;
    task.date = updatedContent.date;
    // update column
    currentColumn.tasks.splice(currentColumn.tasks.indexOf(task), 1);
    targetColumn.tasks.push(task);

    save(data);
  }

  static getAllTasks() {
    const data = read();
    columnCount();
    return [data[0].tasks, data[1].tasks, data[2].tasks];
  }
}

function read() {
  const data = localStorage.getItem("data");
  try {
    if (!data) {
      return [
        { columnId: 0, tasks: [] },
        { columnId: 1, tasks: [] },
        { columnId: 2, tasks: [] },
      ];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data from localStorage:", error);
    return [
      { columnId: 0, tasks: [] },
      { columnId: 1, tasks: [] },
      { columnId: 2, tasks: [] },
    ];
  }
}

function save(data) {
  localStorage.setItem("data", JSON.stringify(data));
  columnCount();
}

function columnCount() {
  const data = read();
  const todo = document.querySelector("span.todo");

  todo.textContent = data[0].tasks.length;

  const pending = document.querySelector("span.pending");
  pending.textContent = data[1].tasks.length;

  const completed = document.querySelector("span.completed");
  completed.textContent = data[2].tasks.length;
}
