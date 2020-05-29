let timerId = null;
let preventClick = false;

const editTaskEvent = new Event("editTask", { bubbles: true });

const tasksList = JSON.parse(localStorage.getItem("tasks")) || [];
if (tasksList.length === 0) {
  setMessagePanelVisibility(true);
}

const taskListItem = document.querySelector("#task-list");
invalidateTaskListItem(tasksList, taskListItem);

taskListItem.addEventListener("click", function (e) {
  Array.from(this.children).forEach(function (elem, i) {
    if (elem.querySelector(".task-content") === e.target) {
      if (preventClick) {
        return;
      }

      timerId = setTimeout(function () {
        toggleTask(i);
        e.target.classList.toggle("done");
        e.target.blur();
        preventClick = false;
        invalidateLocalStorage(tasksList);
      }, 200);

      preventClick = true;
    }

    if (elem.querySelector(".fa-trash") === e.target) {
      deleteTask(i);
      e.target.parentElement.parentElement.remove();
      invalidateLocalStorage(tasksList);
      setMessagePanelVisibility(tasksList.length === 0);
    }
  });
});

taskListItem.addEventListener("dblclick", function (e) {
  Array.from(this.children).forEach(function (elem, i) {
    if (elem.querySelector(".task-content") === e.target) {
      clearTimeout(timerId);
      preventClick = false;
      e.target.readOnly = false;
      e.target.focus();
      e.target.classList.remove("done");
    }
  });
});

taskListItem.addEventListener("focusout", function (e) {
  Array.from(this.children).forEach(function (elem, i) {
    if (elem.querySelector(".task-content") === e.target) {
      tasksList[i] = {
        value: e.target.value,
        isDone: e.target.classList.contains("done"),
      };
      e.target.readOnly = true;
    }
  });

  invalidateLocalStorage(tasksList);
});

const createButtons = document.querySelectorAll(".create-task-btn");
createButtons.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    const task = createTaskItem({});
    const input = task.querySelector(".task-content");
    input.readOnly = false;
    input.focus();
  });
});


//////////////////////////////////////////////////
// Visual Elements Creation
//////////////////////////////////////////////////
function createTaskItem({ value = null, isDone = null }) {
  const task = document.createElement("li");
  task.classList.add("task-list__item");

  const inputField = createInput();
  task.append(inputField);

  const deleteTaskButton = createDeleteTaskButton();
  task.append(deleteTaskButton);

  setMessagePanelVisibility(false);
  document.querySelector("#task-list").append(task);

  if (value) {
    inputField.value = value;
  }
  if (isDone) {
    inputField.classList.add("done");
  }

  return task;
}

function createInput() {
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.classList.add("task-content");
  inputField.readOnly = true;
  return inputField;
}

function createDeleteTaskButton() {
  const deleteTaskButton = document.createElement("button");
  deleteTaskButton.classList.add("delete-task-btn");
  deleteTaskButton.innerHTML = "<i class='fas fa-trash'></i>";
  return deleteTaskButton;
}

function invalidateTaskListItem(tasksList, taskListItem) {
  taskListItem.innerHTML = "";
  tasksList.forEach(function (task) {
    createTaskItem(task);
  });
}

//////////////////////////////////////////////////
// Utils
//////////////////////////////////////////////////
function setMessagePanelVisibility(isVisible) {
  const panel = document.querySelector("#message-panel");
  if (isVisible) {
    panel.classList.remove("hidden");
  } else {
    panel.classList.add("hidden");
  }
}

//////////////////////////////////////////////////
// Update data
//////////////////////////////////////////////////
function toggleTask(index) {
  tasksList[index].isDone = !tasksList[index].isDone;
}

function deleteTask(index) {
  tasksList.splice(index, 1);
}

//////////////////////////////////////////////////
// Save data
//////////////////////////////////////////////////
function invalidateLocalStorage(tasksList) {
  localStorage.clear();
  localStorage.setItem("tasks", JSON.stringify(tasksList));
}
