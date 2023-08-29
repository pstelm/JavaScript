const colorModeBtn = document.querySelector('.color-btn');

const input = document.querySelector('input');
const todoError = document.querySelector('.todo-error');
const addBtn = document.querySelector('.add-btn');
const ulList = document.querySelector('ul');

const popup = document.querySelector('.popup');
const popupInput = document.querySelector('.popup-input');
const popupError = document.querySelector('.popup-error');
const popupAcceptBtn = document.querySelector('.popup-btn--accept');
const popupCancelBtn = document.querySelector('.popup-btn--cancel');

const changeColor = () => {
	document.documentElement.classList.toggle('dark');
};

// pobranie tablicy z localStorage
let tasksArray = JSON.parse(localStorage.getItem('tasks')) || [];

// wyświetlenie tablicy z localStorage
const printTodoList = () => {
	tasksArray.forEach((item) => {
		const storedTask = document.createElement('li');
		storedTask.innerText = item.task;
		storedTask.setAttribute('data-id', item.id);
		storedTask.classList.add('task');
		storedTask.append(createControls());
		ulList.append(storedTask);
	});
};

// dodanie nowego taska
const addTask = () => {
	if (input.value !== '') {
		const taskId = self.crypto.randomUUID();
		const newTaskObj = {
			id: taskId,
			task: input.value,
		};
		tasksArray.push(newTaskObj);
		localStorage.setItem('tasks', JSON.stringify(tasksArray));

		const newTask = document.createElement('li');
		newTask.innerText = input.value;
		newTask.setAttribute('data-id', taskId);
		newTask.classList.add('task');
		newTask.append(createControls());
		ulList.append(newTask);

		input.value = '';
		todoError.innerText = '';
	} else {
		todoError.innerText = `Can't add empty task`;
	}
};

const createControls = () => {
	const divControls = document.createElement('div');
	divControls.classList.add('task-controls');

	const checkBtn = document.createElement('button');
	checkBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
	checkBtn.classList.add('check-btn');

	const editBtn = document.createElement('button');
	editBtn.innerText = 'edit';
	editBtn.classList.add('edit-btn');

	const deleteBtn = document.createElement('button');
	deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
	deleteBtn.classList.add('delete-btn');

	divControls.append(checkBtn, editBtn, deleteBtn);
	return divControls;
};

// edycja taska
const editTask = (event) => {
	popup.style.display = 'flex';
	taskToEdit = event.target.closest('li');
	popupInput.value = taskToEdit.firstChild.textContent;

	popupAcceptBtn.addEventListener('click', acceptPopup);
	popupCancelBtn.addEventListener('click', closePopup);
};

const acceptPopup = () => {
	if (popupInput.value !== '') {
		const taskToEditId = taskToEdit.getAttribute('data-id');
		tasksArray.forEach((item) => {
			if (item.id === taskToEditId) {
				item.task = popupInput.value;
			}
		});
		localStorage.setItem('tasks', JSON.stringify(tasksArray));
		taskToEdit.firstChild.textContent = popupInput.value;
		closePopup();
	} else {
		popupError.innerText = `Can't add empty task`;
	}
};

const closePopup = () => {
	popup.style.display = 'none';
};

// usuwanie taska
const deleteTask = (clickedTask) => {
	const deletedTaskId = clickedTask.getAttribute('data-id');
	tasksArray = tasksArray.filter((item) => item.id != deletedTaskId);
	localStorage.setItem('tasks', JSON.stringify(tasksArray));

	clickedTask.remove();
};

// wykrywanie która kontrolka przy tasku została kliknięta
const checkClickedBtn = (event) => {
	const clickedBtn = event.target;
	const clickedTask = event.target.closest('li');

	if (clickedBtn.classList.contains('check-btn')) {
		clickedTask.classList.toggle('checked');
	} else if (clickedBtn.classList.contains('edit-btn')) {
		editTask(event);
	} else if (clickedBtn.classList.contains('delete-btn')) {
		deleteTask(clickedTask);
	}
};

document.addEventListener('DOMContentLoaded', printTodoList);
colorModeBtn.addEventListener('click', changeColor);
addBtn.addEventListener('click', addTask);
ulList.addEventListener('click', checkClickedBtn);
