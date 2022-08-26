const url = 'http://localhost:8000';
const headers = {
  'Content-Type': 'application/json;charset=utf-8'
}
let tasks = [];

window.onload = () => {
  try {
    if (document.querySelector('.todo-btn:last-child') === null
      || document.querySelector('.todo__input') === null
      || document.querySelector('.todo-btn') === null) {
      throw new Error;
    }
  } catch (err) {
    getError(err);
    throw err
  }
  getAllTasks();
}

const getAllTasks = async () => {
  try {
    const resp = await fetch(`${url}/tasks`, {
      method: 'GET'
    });
    const result = await resp.json();
    tasks = result.data;
    render();
  } catch (err) {
    getError(err);
    throw err;
  }
}

const render = () => {
  const tasksCopy = [...tasks];
  const todoTasks = document.querySelector('.todo__tasks');
  if (todoTasks === null) {
    throw new Error;
  }
  while (todoTasks.firstChild) {
    todoTasks.removeChild(todoTasks.firstChild)
  }
  tasksCopy.forEach(elem => {
    const { _id, text, isCheck } = elem;

    const task = document.createElement('div');
    task.id = `task-${_id}`;
    task.classList.add('todo__task');

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    task.appendChild(checkBox);

    const taskText = document.createElement('div');
    taskText.innerText = text;
    task.appendChild(taskText);

    const editButton = document.createElement('button');
    const editIcon = document.createElement('img');
    editIcon.alt = "edit_icon";
    editIcon.src = 'icons/edit-btn.png';
    editButton.appendChild(editIcon);
    editButton.classList.add('edit-btn');

    const deleteButton = document.createElement('button');
    const deleteIcon = document.createElement('img');
    deleteIcon.alt = "remove_icon";
    deleteIcon.src = 'icons/remove-btn.png';
    deleteButton.appendChild(deleteIcon);
    deleteButton.classList.add('delete-button');

    editButton.onclick = () => {
      creatEditInput(_id, text);
    }

    deleteButton.onclick = () => {
      deleteTask(_id);
    }

    checkBox.onchange = () => {
      onChangeCheckbox(isCheck, _id);
    }

    const theFirstChild = todoTasks.firstChild;

    if (isCheck) {
      task.classList.add("todo__task_complete");
      todoTasks.appendChild(task);
    } else {
      task.classList.remove("todo__task_complete");
      task.appendChild(editButton);
      todoTasks.insertBefore(task, theFirstChild);
    }
    task.appendChild(deleteButton);
  })
}

const creatEditInput = (_id, text) => {
  const task = document.getElementById(`task-${_id}`);
  if (task === null) {
    throw new Error;
  }
  if (!task.classList.contains('edit')) {
    task.classList.add('edit');
    const edit = document.createElement("input");
    edit.type = "text";
    edit.value = text;

    edit.onchange = () => {
      text = task.lastChild.value;
      editTask(_id, text);
    }
    task.appendChild(edit);
    edit.focus();
  } else {
    task.classList.remove('edit');
    task.removeChild(task.lastChild);
  }
}

const getError = (error) => {
  const showError = document.querySelector('.error');
  if (showError === null) {
    throw new Error;
  }
  showError.innerHTML = error;
  showError.style.display = 'block'
  setTimeout(() => showError.style.display = 'none', 2000);
}

const addTask = async () => {
  try {
    const input = document.querySelector('.todo__input');
    let inputText = input.value;
    if (inputText.trim() === '') {
      input.value = '';
      throw new Error;
    }
    const resp = await fetch(`${url}/tasks/new`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        text: inputText
      })
    });
    const result = await resp.json();
    tasks.push(result);
    input.value = '';
    render();
  } catch (err) {
    getError(err);
    throw err;
  }
}

const onChangeCheckbox = async (check, _id) => {
  try {
    const resp = await fetch(`${url}/tasks/${_id}/complete`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify({
        isCheck: !check,
        _id
      })
    });
    const result = await resp.json();
    tasks.forEach(element => {
      if (element._id === result._id) {
        element.isCheck = !element.isCheck;
      }
    })
    render();
  } catch (err) {
    getError(err);
    throw err;
  }
}

const editTask = async (id, text) => {
  try {
    if (text) {
      const resp = await fetch(`${url}/tasks/${id}/update`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({
          text,
          _id: id
        })
      });
      tasks.forEach(element => {
        if (element._id === id) {
          element.text = text;
        }
      })
      render();
    }
  } catch (err) {
    getError(err);
    throw err;
  }
}

const deleteTask = async (id) => {
  try {
    const resp = await fetch(`${url}/tasks/${id}/delete`, {
      method: 'DELETE'
    });
    const result = await resp.json();
    if (result.deletedCount === 1) {
      tasks = tasks.filter((task) => task._id !== id)
    }
    render();
  } catch (err) {
    getError(err);
    throw err;
  }
}

const deleteAllTask = async () => {
  try {
    const resp = await fetch(`${url}/tasks/deleteall`, {
      method: 'DELETE'
    });
    tasks = [];
    render();
  } catch (err) {
    getError(err);
    throw err;
  }
}
