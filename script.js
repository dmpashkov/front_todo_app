const input = document.querySelector('.todo__input');
const button = document.querySelector('.todo-btn');
const btnRem = document.querySelector('.todo-btn:last-child');
let tasks = [];

renderTask = async () => {
  const resp = await fetch('http://localhost:8000/allTasks', {
    method: 'GET'
  });
  let result = await resp.json();
  tasks = result.data;
  tasks.sort((a, b) => a.isCheck > b.isCheck ? 1 : -1);
  const taskrend = document.querySelector('.todo__tasks');

  while (taskrend.firstChild) {
    taskrend.removeChild(taskrend.firstChild)
  }
  tasks.forEach(elem => {
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

addTask = async (event) => {
  let value = '';
  value = event.target.value;
  tasks.unshift({
    text: value,
    isCheck: false
  })
  const resp = await fetch('http://localhost:8000/createTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      text: value,
      isCheck: false
    })
  });
  let result = await resp.json();
  tasks = result.data;
  value = "";
  event.target.value = '';
  renderTask();
}

onChangeCheckbox = async (event) => {
  const check = event.target.parentNode.classList.contains('todo__task_complete');
  const resp = await fetch('http://localhost:8000/updateTask', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      "isCheck": !check,
      "_id": event.target.parentNode.id
    })
  });
  let result = await resp.json();
  tasks = result.data;
  renderTask();
}

editTask = async (event) => {
  const check = event.target.parentNode.classList.contains('todo__task_complete');
  if (!check) {
    const edit = prompt('Введите новый текст', '');
    if (edit) {
      event.text = edit;
      const resp = await fetch('http://localhost:8000/updateTask', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          "text": edit,
          "_id": event.target.parentNode.id
        })
      });
      let result = await resp.json();
      tasks = result.data;
      renderTask();
    }
  }
}

deleteTask = async (event) => {
  const elemId = event.target.parentNode.id;
  const resp = await fetch(`http://localhost:8000/deleteTask?_id=${elemId}`, {
    method: 'DELETE'
  });
  await resp.json();
  renderTask();
}

deleteAllTask = async () => {
  const resp = await fetch(`http://localhost:8000/deleteAllTask`, {
    method: 'DELETE'
  });
  let result = await resp.json();
  tasks = [];
  renderTask();
}

button.addEventListener("click", input.addTask);
btnRem.addEventListener("click", deleteAllTask)
input.addEventListener("change", addTask);

renderTask();
