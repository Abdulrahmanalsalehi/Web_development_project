const users = JSON.parse(localStorage.getItem("users")) || [];

function getLoggedIntUser() {
  return JSON.parse(localStorage.getItem("LoggedInUser"));
}

function loadHeaderProfile() {
  const user = getLoggedIntUser();
  if (!user) return;

  document.getElementById("posts-count").textContent = user.posts ? user.posts.length : 0;
  document.getElementById("followers-count").textContent = user.followers ? user.followers.length : 0;
  document.getElementById("following-count").textContent = user.following ? user.following.length : 0;
  
  if(user.username){
     document.getElementById("username-header").textContent = user.username;
  }
  if (user.profilePic) {
    document.getElementById("profile-pic").src = user.profilePic;
  }
}


function renderFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = ""; // clear old feed

  users.forEach(user => {
    user.posts.slice().reverse().forEach(post => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.innerHTML = `
        <div class="post-header">
          <img src="${user.profilePic}" class="default-pic-post">
          <div>
            <div class="post-username">@${user.username}</div>
            <div class="timestamp">${post.timestamp}</div>
          </div>
        </div>
        <div class="post-content">${post.content}</div>
        <div class="post-actions">
          <button class="like"><img src="media/heart.svg"></button>
          <button class="comment"><img src="media/message-circle.svg"></button>
        </div>
      `;
      feed.appendChild(postElement);
    });
  });
}

// Handle new post creation
document.getElementById("post-button").addEventListener("click", () => {
  const user_input = document.getElementById("post-input");
  const content = user_input.value.trim()
  if (!content) return;

  const loggedUser = getLoggedIntUser();
  const userIndex = users.findIndex(u => u.username === loggedUser.username);

  if (userIndex !== -1) {
    const newPost = {
      content,
      timestamp: new Date().toLocaleString()
    };
    users[userIndex].posts.push(newPost);

    // update localStorage for everone
    localStorage.setItem("users", JSON.stringify(users));
    // update localStorage for the loggedInUser
    localStorage.setItem("LoggedInUser", JSON.stringify(users[userIndex]))

    // Clear input
    user_input.value = "";

    // Refresh header stats and feed
    loadHeaderProfile();
    renderFeed();
  }
});

// Initial load
loadHeaderProfile();
renderFeed();
