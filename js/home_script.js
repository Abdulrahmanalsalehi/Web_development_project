// Load users from localStorage
const users = JSON.parse(localStorage.getItem("users")) || [];

// Example: add a sample post to a user (in real app, this comes from user actions)
if (users.length > 0) {
  users[0].posts.push({
    content: "Hello world, this is my first post!",
    timestamp: new Date().toLocaleString()
  });
  localStorage.setItem("users", JSON.stringify(users));
}

// Render posts from all users
const feed = document.getElementById("feed");

users.forEach(user => {
  user.posts.forEach(post => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
      <div class="post-header">
        <img src="${user.profilePic}" alt="profile pic" class="default-pic-post">
        <div>
          <div class="post-username">@${user.username}</div>
          <div class="timestamp">${post.timestamp}</div>
        </div>
      </div>
      <div class="post-content">${post.content}</div>
      <div class="post-actions">
        <button class="like"><img src="https://img.icons8.com/ios-filled/24/like.png" alt="like"></button>
        <button class="comment"><img src="https://img.icons8.com/ios-filled/24/comments.png" alt="comment"></button>
      </div>
    `;
    feed.appendChild(postElement);
  });
});
