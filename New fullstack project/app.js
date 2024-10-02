const form = document.getElementById('userForm');
const userTable = document.getElementById('userTable');

// Fetch users from the database and display
function fetchUsers() {
    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(data => {
            userTable.innerHTML = '';
            data.forEach(user => {
                userTable.innerHTML += `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>
                            <button onclick="deleteUser(${user.id})">Delete</button>
                            <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Edit</button>
                        </td>
                    </tr>
                `;
            });
        });
}

// Add a new user or update an existing one
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    // Check if we are editing a user
    const userId = form.getAttribute('data-edit-id');

    if (userId) {
        // Update user
        fetch(`http://localhost:3000/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        })
            .then(response => response.text())
            .then(data => {
                alert(data);
                form.reset();
                form.removeAttribute('data-edit-id'); // Clear the edit ID
                fetchUsers(); // Refresh the user list
            });
    } else {
        // Add a new user
        fetch('http://localhost:3000/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        })
            .then(response => response.text())
            .then(data => {
                alert(data);
                form.reset();
                fetchUsers(); // Refresh the user list
            });
    }
});

// Delete a user
function deleteUser(id) {
    fetch(`http://localhost:3000/delete/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            fetchUsers();
        });
}

// Edit user
function editUser(id, name, email) {
    // Set the input fields with the user's current details
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;

    // Save the user ID in a hidden input or variable to use it when submitting the form
    form.setAttribute('data-edit-id', id);
}

// Fetch users when the page loads
fetchUsers();
