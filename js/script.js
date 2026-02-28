

function loadUsers(){
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users;
}

function saveUsers(users){ 
    localStorage.setItem("users", JSON.stringify(users)); 
}

