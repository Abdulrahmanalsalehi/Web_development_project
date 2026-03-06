/*************** STORAGE HELPERS ***************/
function loadUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getLoggedIntUser() {
  return JSON.parse(localStorage.getItem("LoggedInUser"));
}

function setLoggedIntUser(user) {
  localStorage.setItem("LoggedInUser", JSON.stringify(user));
}

let users = loadUsers();


/*************** HEADER PROFILE ***************/
function loadHeaderProfile() {

  const user = getLoggedIntUser();
  if (!user) return;

  const posts = document.getElementById("posts-count");
  const followers = document.getElementById("followers-count");
  const following = document.getElementById("following-count");

  if (posts)
    posts.textContent = user.posts ? user.posts.length : 0;

  if (followers)
    followers.textContent = user.followers ? user.followers.length : 0;

  if (following)
    following.textContent = user.following ? user.following.length : 0;

  if (document.getElementById("username-header"))
    document.getElementById("username-header").textContent = user.username;

  if (document.getElementById("profile-pic") && user.profilePic)
    document.getElementById("profile-pic").src = user.profilePic;

}


/*************** LOGOUT WINDOW ***************/
const logout_window = document.getElementById("logout-window");
const logout_header = document.getElementById("logout-header");
const yes = document.getElementById("Yes");
const no = document.getElementById("No");

if (logout_header)
  logout_header.addEventListener("click", () => {
    logout_window.style.display = "flex";
  });

if (yes)
  yes.addEventListener("click", () => {
    localStorage.removeItem("LoggedInUser");
    window.location.href = "login.html";
  });

if (no)
  no.addEventListener("click", () => {
    logout_window.style.display = "none";
  });


/*************** PROFILE REDIRECT ***************/
const usernameHeader = document.getElementById("username-header");
const profilePicHeader = document.getElementById("profile-pic");

if (usernameHeader)
  usernameHeader.addEventListener("click", () => {
    window.location.href = "profile.html";
  });

if (profilePicHeader)
  profilePicHeader.addEventListener("click", () => {
    window.location.href = "profile.html";
  });


/*************** HOME FEED ***************/
function showFeeds() {

  const feed = document.getElementById("feed");
  if (!feed) return;

  feed.innerHTML = "";

  let allPosts = [];

  users.forEach(user => {
    if (user.posts) {
      user.posts.forEach(post => {
        allPosts.push({
          ...post,
          username: user.username,
          profilePic: user.profilePic
        });
      });
    }
  });

  allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  allPosts.forEach(post => {

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

    post_element.addEventListener("click", () => openPost(post));

    const username = post_element.querySelector(".post-username");
    const pic = post_element.querySelector(".default-pic-post");
    const likeBtn = post_element.querySelector(".like");
    const likeCount = post_element.querySelector(".like-count");

    username.addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = "profile.html";
    });

    pic.addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = "profile.html";
    });

    likeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLike(post, likeCount);
    });

  });

}


/*************** CREATE POST ***************/
const postBtn = document.getElementById("post-button");

if (postBtn) {
  postBtn.addEventListener("click", () => {

    const input = document.getElementById("post-input");
    const content = input.value.trim();
    if (!content) return;

    const loggedUser = getLoggedIntUser();
    const userIndex = users.findIndex(u => u.username === loggedUser.username);

    const newPost = {
      content,
      timestamp: new Date().toLocaleString(),
      likes: [],
      comments: []
    };

    users[userIndex].posts.push(newPost);

    saveUsers(users);
    setLoggedIntUser(users[userIndex]);

    input.value = "";

    loadHeaderProfile();
    showFeeds();
  });
}


/*************** LIKE SYSTEM ***************/
function toggleLike(post, likeCount) {

  const loggedUser = getLoggedIntUser();

  const ownerIndex = users.findIndex(u => u.username === post.username);
  const postIndex = users[ownerIndex].posts
    .findIndex(p => p.timestamp === post.timestamp);

  const realPost = users[ownerIndex].posts[postIndex];

  if (!realPost.likes) realPost.likes = [];

  const likeIndex = realPost.likes.indexOf(loggedUser.username);

  if (likeIndex === -1)
    realPost.likes.push(loggedUser.username);
  else
    realPost.likes.splice(likeIndex, 1);

  post.likes = realPost.likes;

  saveUsers(users);

  if (likeCount)
    likeCount.textContent = realPost.likes.length;

  showFeeds();
  showUserPosts();

}


/*************** POST DETAILS POPUP ***************/
function openPost(post) {

  const windowBox = document.getElementById("post-window");
  if (!windowBox) return;

  document.getElementById("detail-profile-pic").src = post.profilePic;
  document.getElementById("detail-username").textContent = post.username;
  document.getElementById("detail-timestamp").textContent = post.timestamp;
  document.getElementById("detail-content").textContent = post.content;
  document.getElementById("comment-count").textContent =
    post.comments ? post.comments.length : 0;

  windowBox.style.display = "flex";

  document.getElementById("arrow-back").onclick = () => {
    windowBox.style.display = "none";
  };

  document.getElementById("detail-like").onclick = () => {
    const likeCount = document.getElementById("like-count");
    toggleLike(post, likeCount);
  };

  document.getElementById("detail-comment").onclick = () => {

    const section = document.getElementById("comments-section");
    const display = window.getComputedStyle(section).display;

    section.style.display = display === "none" ? "block" : "none";

    renderComments(post);
  };

  document.getElementById("comment-button").onclick = () => {
    addComment(post);
  };

}


/*************** COMMENTS ***************/
function renderComments(post) {

  const list = document.getElementById("comments-list");
  list.innerHTML = "";

  if (!post.comments) return;

  post.comments.forEach(comment => {

    const box = document.createElement("div");
    box.classList.add("comment-box");

    box.innerHTML = `
      <div class="comment-header">
        <img src="${comment.profilePic}" class="default-pic-post">
        <div>
          <div class="post-username">${comment.username}</div>
          <div class="timestamp">${comment.timestamp}</div>
        </div>
      </div>

      <div class="comment-content">${comment.content}</div>
    `;

    list.appendChild(box);

  });

}


function addComment(post) {

  const input = document.getElementById("comment-input");
  const content = input.value.trim();
  if (!content) return;

  const loggedUser = getLoggedIntUser();

  const ownerIndex = users.findIndex(u => u.username === post.username);
  const postIndex = users[ownerIndex].posts
    .findIndex(p => p.timestamp === post.timestamp);

  const newComment = {
    content,
    timestamp: new Date().toLocaleString(),
    username: loggedUser.username,
    profilePic: loggedUser.profilePic
  };

  users[ownerIndex].posts[postIndex].comments.push(newComment);

  post.comments = users[ownerIndex].posts[postIndex].comments;

  saveUsers(users);

  input.value = "";

  renderComments(post);

  document.getElementById("comment-count").textContent = post.comments.length;

  showFeeds();
  showUserPosts();
}


/*************** PROFILE PAGE ***************/
function loadProfile() {

  const user = getLoggedIntUser();
  if (!user) return;

  if (document.getElementById("editFullname"))
    document.getElementById("editFullname").value = user.fullname;

  if (document.getElementById("editUsername"))
    document.getElementById("editUsername").value = user.username;

  if (document.getElementById("editEmail"))
    document.getElementById("editEmail").value = user.email;

  if (document.getElementById("editPhone"))
    document.getElementById("editPhone").value = user.phone;

  if (document.getElementById("editBio"))
    document.getElementById("editBio").value = user.bio;

  if (document.getElementById("username"))
    document.getElementById("username").textContent = user.username;

  if (document.getElementById("bio"))
    document.getElementById("bio").textContent = user.bio || "This is my bio";
}

function editProfile(){
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

}





function showUserPosts() {

  const feed = document.getElementById("my-posts");
  if (!feed) return;

  feed.innerHTML = "";

  const loggedUser = users.find(u => u.username === getLoggedIntUser().username);
  if (!loggedUser.posts) return;

  let userPosts = loggedUser.posts.map(post => ({
    ...post,
    username: loggedUser.username,
    profilePic: loggedUser.profilePic
  }));

  userPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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

    post_element.addEventListener("click", () => openPost(post));

    const username = post_element.querySelector(".post-username");
    const pic = post_element.querySelector(".default-pic-post");
    const likeBtn = post_element.querySelector(".like");
    const likeCount = post_element.querySelector(".like-count");

    username.addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = "profile.html";
    });

    pic.addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = "profile.html";
    });

    likeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLike(post, likeCount);
    });

  });

}


/*************** INITIAL LOAD ***************/
loadHeaderProfile();
showFeeds();
loadProfile();
editProfile();
showUserPosts();