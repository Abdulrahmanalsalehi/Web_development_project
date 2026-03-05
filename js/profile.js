

function loadUsers(){
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users;
}

function saveUsers(users){ 
    localStorage.setItem("users", JSON.stringify(users)); 
}

function getLoggedIntUser() {
  return JSON.parse(localStorage.getItem("LoggedInUser"));
}

function setLoggedIntUser(user) {
  localStorage.setItem("LoggedInUser", JSON.stringify(user));
}


function loadProfile(){
    const user = getLoggedIntUser();
    if(!user){
        return;
    }
    document.getElementById("editFullname").value = user.fullname;
    document.getElementById("editUsername").value = user.username;
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editPhone").value = user.phone;
    document.getElementById("editBio").value = user.bio;

    document.getElementById("username").textContent = user.username;
    document.getElementById("bio").textContent = user.bio || "This is my bio"
}

loadProfile();
showUserPosts();

const edit_window = document.getElementById("edit-window");

document.getElementById("edit").addEventListener("click", (e) => {
  edit_window.style.display = "flex";
});

document.getElementById("cancel").addEventListener("click", () => {
  edit_window.style.display = "none";
});


document.getElementById("save").addEventListener("click", () => {
  let users = loadUsers();
  let loggedInUser = getLoggedIntUser();

  const updatedUser = {
    ...loggedInUser,
    fullname: document.getElementById("editFullname").value.trim(),
    username: document.getElementById("editUsername").value.trim(),
    email: document.getElementById("editEmail").value.trim(),
    phone: document.getElementById("editPhone").value.trim(),
    bio: document.getElementById("editBio").value.trim(),
  };

  // Update in users array
  users = users.map(user =>
    user.id === loggedInUser.id ? updatedUser : user
  );

  saveUsers(users);
  setLoggedIntUser(updatedUser);

  edit_window.style.display = "none";
  loadProfile();
});


function showUserPosts() {
  const feed = document.getElementById("my-posts");
  feed.innerHTML = "";

  const loggedUser = getLoggedIntUser();
  if (!loggedUser || !loggedUser.posts) return;

  let users = loadUsers();
  const realUser = users.find(u => u.id === loggedUser.id);
  if(!realUser || !realUser.posts) return;

  // Copy posts and attach username/profilePic
  let userPosts = loggedUser.posts.map(post => ({
    ...post,
    username: loggedUser.username,
    profilePic: loggedUser.profilePic,
  }));

  // Sort posts by timestamp (latest first)
  userPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Render each post
  userPosts.forEach(post => {
    const post_element = document.createElement("div");
    post_element.classList.add("post");

    post_element.innerHTML = `
      <div class="post-header">
        <img src="${post.profilePic}" class="default-pic-post">
        <div>
          <div class="post-username">${post.username}</div>
          <div class="timestamp">${post.timestamp}</div>
        </div>
      </div>

      <div class="post-content">${post.content}</div>

      <div class="post-actions">
        <button class="like">
          <img src="media/heart.svg">
          <span class="like-count">${post.likes ? post.likes.length : 0}</span>
        </button>
        <button class="comment">
          <img src="media/message-circle.svg">
          <span class="comment-count">${post.comments ? post.comments.length : 0}</span>
        </button>
      </div>
    `;

    feed.appendChild(post_element);

    // Allow opening post details
    post_element.addEventListener("click", () => {
      openPost(post);
    });

    const like_button = post_element.querySelector(".like");
    const like_count = post_element.querySelector(".like-count");

    like_button.addEventListener("click", (e) => {
      e.stopPropagation();
      showLikes(post, like_count);
    });
  });

  document.getElementById("posts-count").textContent = realUser.posts.length;
}


