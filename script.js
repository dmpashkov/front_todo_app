const url = 'http://localhost:8000/';
let tasks = [];

window.onload = async () => {
  if (document.querySelector('.todo__input')
    && document.querySelector('.todo-btn')
    && document.querySelector('.todo-btn:last-child')) {
    document.querySelector('.todo__input').addEventListener("change", addTask);
    document.querySelector('.todo-btn').addEventListener("click", addTask);
    document.querySelector('.todo-btn:last-child').addEventListener("click", deleteAllTask);

    renderTask();
  } else {
    return new Error('element is not defined');
  }
}

const renderTask = async () => {
  const resp = await fetch(`${url}allTasks`, {
    method: 'GET'
  });
  const result = await resp.json();
  tasks = result.data;
  const tasksCopy = [ ...tasks ];
  tasksCopy.sort((a, b) => a.isCheck > b.isCheck ? 1 : -1);
  const taskrend = document.querySelector('.todo__tasks');

  while (taskrend.firstChild) {
    taskrend.removeChild(taskrend.firstChild)
  }
  tasksCopy.forEach(elem => {
    const task = document.createElement('div');
    task.id = `${elem._id}`;
    task.classList.add('todo__task');
    const checkB = document.createElement("INPUT");
    checkB.setAttribute("type", "checkbox");
    if (elem.isCheck) {
      task.classList.add("todo__task_complete");
    } else {
      task.classList.remove("todo__task_complete");
    }
    const text = document.createElement('div');
    text.innerText = elem.text;
    task.appendChild(checkB);
    task.appendChild(text)

    const editImg = document.createElement('img');
    const deltImg = document.createElement('img');
    editImg.src = 'icons/edit-btn.png';
    deltImg.src = 'icons/remove-btn.png';
    editImg.addEventListener("click", editTask);
    deltImg.addEventListener("click", deleteTask);
    checkB.addEventListener("click", onChangeCheckbox);

    task.appendChild(editImg);
    task.appendChild(deltImg);
    taskrend.appendChild(task);
  })
}

const addTask = async (event) => {
  let value = '';
  value = event.target.value;
  if (value && value.trim() !== '') {
    tasks.unshift({
      text: value,
      isCheck: false
    })
    const resp = await fetch(`${url}createTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        text: value,
        isCheck: false
      })
    });
    const result = await resp.json();
    tasks = result.data;
    value = '';
    event.target.value = '';
    renderTask();
  }
}

const onChangeCheckbox = async (event) => {
  const check = event.target.parentNode.classList.contains('todo__task_complete');
  const resp = await fetch(`${url}updateTask`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      isCheck: !check,
      _id: event.target.parentNode.id
    })
  });
  const result = await resp.json();
  tasks = result.data;
  renderTask();
}

const editTask = async (event) => {
  const check = event.target.parentNode.classList.contains('todo__task_complete');
  if (!check) {
    const edit = prompt('Введите новый текст', '');
    if (edit) {
      event.text = edit;
      const resp = await fetch(`${url}updateTask`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          text: edit,
          _id: event.target.parentNode.id
        })
      });
      const result = await resp.json();
      tasks = result.data;
      renderTask();
    }
  }
}

const deleteTask = async (event) => {
  const elemId = event.target.parentNode.id;
  const resp = await fetch(`${url}deleteTask?_id=${elemId}`, {
    method: 'DELETE'
  });
  await resp.json();
  renderTask();
}

const deleteAllTask = async () => {
  const resp = await fetch(`${url}deleteAllTask`, {
    method: 'DELETE'
  });
  await resp.json();
  renderTask();
}
