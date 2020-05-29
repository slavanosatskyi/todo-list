let timerId = null;
let preventClick = false;

const tasksList = JSON.parse(localStorage.getItem("tasks")) || [];
tasksList.forEach(function (task) {
  createTaskItem(task);
});
console.log(tasksList);

const taskListItem = document.querySelector("#task-list");
taskListItem.addEventListener("click", function (e) {
  if (e.target.classList.contains("task-content")) {
    toggleTask(e.target.parentElement);
  }

  if (e.target.classList.contains("fa-trash")) {
    deleteTask(e.target.parentElement.parentElement);
  }
});

taskListItem.addEventListener("dblclick", function (e) {
  if (e.target.classList.contains("task-content")) {
    editTask(e.target.parentElement);
  }
});

const createButtons = document.querySelectorAll(".create-task-btn");
createButtons.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    createTaskItem({});
  });
});

function setMessagePanelVisibility(isVisible) {
  const panel = document.querySelector("#message-panel");
  if (isVisible) {
    panel.classList.remove("hidden");
  } else {
    panel.classList.add("hidden");
  }
}

function createTaskItem({ value = null, isDone = null }) {
  const task = document.createElement("li");
  task.classList.add("task-list__item");

  const inputField = createInput();
  task.append(inputField);

  const deleteTaskButton = createDeleteTaskButton();
  task.append(deleteTaskButton);

  setMessagePanelVisibility(false);
  const taskListItem = document.querySelector("#task-list").append(task);

  if (value !== null && isDone !== null) {
    inputField.value = value;
    if (isDone) {
      inputField.classList.add("done");
    }
  } else {
    // Set focus on the created task
    task.querySelector("input[type='text']").focus();
  }
}

function createInput() {
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.classList.add("task-content");
  inputField.addEventListener("blur", function (e) {
    if (this.previousValue && this.value.length === 0) {
      this.value = this.previousValue;
    } else if (this.value.length === 0) {
      this.parentElement.remove();
      return;
    } else {
      this.previousValue = this.value;
    }

    this.setAttribute("readonly", null);
  });

  return inputField;
}

function createDeleteTaskButton() {
  const deleteTaskButton = document.createElement("button");
  deleteTaskButton.classList.add("delete-task-btn");
  deleteTaskButton.innerHTML = "<i class='fas fa-trash'></i>";
  return deleteTaskButton;
}

function toggleTask(taskItem) {
  // If prev click was done 200ms ago or current task is being edited now - skip click handling
  const taskContent = taskItem.querySelector("input[type='text']");
  if (
    preventClick ||
    (taskContent === document.activeElement &&
      !taskContent.getAttribute("readonly"))
  ) {
    return;
  }

  // Toggle task and reset "preventClick" after 200ms
  timerId = setTimeout(() => {
    taskContent.classList.toggle("done");
    taskContent.blur();
    preventClick = false;
  }, 200);

  // This is needed to avoid processing clicks during dblclick event
  preventClick = true;
}

function editTask(taskItem) {
  const taskContent = taskItem.querySelector("input[type='text']");

  clearTimeout(timerId);
  preventClick = false;
  taskContent.classList.remove("done");
  taskContent.removeAttribute("readonly");
  taskContent.focus();
}

function deleteTask(taskItem) {
  taskItem.remove();
}

function rewriteLocalStorage() {
  localStorage.clear();
  localStorage.setItem("tasks", tasksList);
}
