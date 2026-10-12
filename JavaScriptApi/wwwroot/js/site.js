const uri = '/api/todoitems';
let todos = [];

async function getItems() {
    const response = await fetch(uri);
    todos = await response.json();
    displayItems();
}

function displayItems() {
    const table = document.getElementById('todos');
    table.innerHTML = '';

    todos.forEach(item => {
        const row = document.createElement('tr');

        const completeCell = document.createElement('td');
        completeCell.textContent = item.isComplete ? 'Yes' : 'No';

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;

        const actionsCell = document.createElement('td');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editItem(item);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteItem(item.id);

        actionsCell.append(editButton, deleteButton);
        row.append(completeCell, nameCell, actionsCell);
        table.appendChild(row);
    });
}

document.getElementById('addForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('addName').value.trim();
    if (!name) return;

    await fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            isComplete: false
        })
    });

    document.getElementById('addName').value = '';
    await getItems();
});

async function editItem(item) {
    const newName = prompt('Enter new todo name:', item.name);
    if (newName === null || !newName.trim()) return;

    await fetch(`${uri}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: item.id,
            name: newName.trim(),
            isComplete: item.isComplete
        })
    });

    await getItems();
}

async function deleteItem(id) {
    await fetch(`${uri}/${id}`, {
        method: 'DELETE'
    });

    await getItems();
}

getItems();