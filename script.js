const url = 'http://localhost:8000';
const headers = {
  'Content-Type': 'application/json;charset=utf-8'
}
let tasks = [];

window.onload = () => {
  try {
    const buttonDelete = document.querySelector('.todo-btn:last-child');
    const input = document.querySelector('.todo__input');
    const inputButton = document.querySelector('.todo-btn');

    if (buttonDelete === null
      || input === null
      || inputButton === null) {
      return;
    }

    buttonDelete.onclick = () => deleteAllTask();
    input.onchange = () => addTask(input);
    inputButton.onclick = () => addTask(input);

  } catch (err) {
    throw err
  }
  getAllTask();
}

const getAllTask = async () => {
  try {
    const resp = await fetch(`${url}/allTasks`, {
      method: 'GET'
    });
    const result = await resp.json();
    tasks = result.data;
    render();
  } catch (err) {
    throw err;
  }
}

const render = () => {
  const tasksCopy = [...tasks];
  if (document.querySelector('.todo__tasks') === null) {
    return;
  }
  const todoTasks = document.querySelector('.todo__tasks');
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

    isCheck
      ? task.classList.add("todo__task_complete")
      : task.classList.remove("todo__task_complete");

    const taskText = document.createElement('div');
    taskText.innerText = text;
    task.appendChild(checkBox);
    task.appendChild(taskText);

    const editButton = document.createElement('button');
    const editIcon = document.createElement('img');
    editIcon.src = 'icons/edit-btn.png';
    editButton.appendChild(editIcon);
    editButton.classList.add('edit-btn');

    const deleteButton = document.createElement('button');
    const deleteIcon = document.createElement('img');
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

    isCheck
      ? null
      : task.appendChild(editButton);

    task.appendChild(deleteButton);

    const theFirstChild = todoTasks.firstChild;

    isCheck
      ? todoTasks.appendChild(task)
      : todoTasks.insertBefore(task, theFirstChild);
  })
}

const creatEditInput = (_id, text) => {
  const task = document.getElementById(`task-${_id}`);
  if (!task.classList.contains('edit')) {
    task.classList.add('edit');
    const edit = document.createElement("input");
    edit.type = "text";
    edit.value = text;
    edit.onchange = () => {
      editTask(_id, task.lastChild.value);
    }
    task.appendChild(edit);
    edit.focus();
  } else {
    task.classList.remove('edit');
    task.removeChild(task.lastChild);
    editTask(_id, task.lastChild.value);
  }
}

const addTask = async (input) => {
  try {
    let inputText = input.value;
    if (inputText.trim() === '') {
      input.value = '';
      return;
    }
    const resp = await fetch(`${url}/createTask`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text: inputText,
        isCheck: false
      })
    });
    const result = await resp.json();
    tasks.push(result);
    input.value = '';
    render();
  } catch (err) {
    throw err;
  }
}

const onChangeCheckbox = async (check, _id) => {
  try {
    const resp = await fetch(`${url}/completeTask`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        isCheck: !check,
        _id
      })
    });
    const result = await resp.json();
    tasks.forEach(element => {
      if (element._id === result._id) {
        element.isCheck = !result.isCheck;
      }
    })
    render();
  } catch (err) {
    throw err;
  }
}

const editTask = async (id, text) => {
  try {
    if (text) {
      const resp = await fetch(`${url}/updateTask`, {
        method: 'PATCH',
        headers,
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
    throw err;
  }
}

const deleteTask = async (id) => {
  try {
    const resp = await fetch(`${url}/deleteTask?_id=${id}`, {
      method: 'DELETE'
    });
    const result = await resp.json();
    if (result.deletedCount === 1) {
      tasks = tasks.filter((task) => task._id !== id)
    }
    render();
  } catch (err) {
    throw err;
  }
}

const deleteAllTask = async () => {
  try {
    const resp = await fetch(`${url}/deleteAllTask`, {
      method: 'DELETE'
    });
    tasks = [];
    render();
  } catch (err) {
    throw err;
  }
}
