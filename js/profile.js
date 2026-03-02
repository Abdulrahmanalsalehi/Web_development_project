

function loadUsers(){
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users;
}

function saveUsers(users){ 
    localStorage.setItem("users", JSON.stringify(users)); 
}

function getLoggedINtUser() {
  return JSON.parse(localStorage.getItem("LoggedINUser"));
}

function setLoggedINtUser(user) {
  localStorage.setItem("LoggedINUser", JSON.stringify(user));
}


function loadProfile(){
    const user = getLoggedINtUser();
    if(!user){
        return;
    }
    document.getElementById("editFullname").value = user.fullname;
    document.getElementById("editUsername").value = user.username;
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editPhone").value = user.phone;
    document.getElementById("editBio").value = user.bio || "";
}

loadProfile()

const edit_window = document.getElementById("edit-window");

document.getElementById("edit").addEventListener("click", () => {
  edit_window.style.display = "flex";
});

document.getElementById("cancel").addEventListener("click", () => {
  edit_window.style.display = "none";
});


document.getElementById("save").addEventListener("click", () => {
  let users = loadUsers();
  let loggedInUser = getLoggedINtUser();

  const updatedUser = {
    ...loggedInUser,
    fullname: document.getElementById("editFullname").value.trim(),
    username: document.getElementById("editUsername").value.trim(),
    email: document.getElementById("editEmail").value.trim(),
    phone: document.getElementById("editPhone").value.trim(),
    bio: document.getElementById("editBio").value.trim(),
    posts: [],
  };

  // Update in users array
  users = users.map(user =>
    user.email === loggedInUser.email ? updatedUser : user
  );

  saveUsers(users);
  setLoggedINtUser(updatedUser);

  edit_window.style.display = "none";
  loadProfile();
});

const my_posts = document.getElementById("my-posts");

loggedInUser.posts.array.forEach(post => {
  const postElement = document.createElement("div");
  postElement.classList("post")

  postElement.innerHTML = `
      <div class="post-header">
        <img src="${loggedInUser.profilePic}" class="default-pic-post">
        <div>
          <div class="post-username">@${loggedInUser.username}</div>
          <div class="timestamp">${post.timestamp}</div>
        </div>
      </div>
      <div class="post-content">${post.content}</div>
      <div class="post-actions">
        <button class="like"><img src="media/heart.svg"></button>
        <button class="comment"><img src="media/message-circle.svg"></button>
      </div>
    `;

    my_posts.appendChild(postElement);

  
});



