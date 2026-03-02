// Load users from localStorage
const users = JSON.parse(localStorage.getItem("users")) || [];

function getLoggedINtUser() {
  return JSON.parse(localStorage.getItem("LoggedINUser"));
}


function loadHeaderProfile() {
  const user = getLoggedINtUser();
  if (!user) {
   return;
  }
  
  const posts_ount = document.getElementById("posts-count");
  const followers_count = document.getElementById("followers-count");
  const following_count = document.getElementById("following-count");
  const headerPic = document.getElementById("profile-pic");

  posts_ount.textContent = user.posts ? user.posts.length : 0;
  followers_count.textContent = user.followers ? user.followers.length : 0;
  following_count.textContent = user.following ? user.following.length : 0;

  if (user.profilePic) {
    headerPic.src = user.profilePic;
  }
}

loadHeaderProfile();




// Example: add a sample post to a user (in real app, this comes from user actions)
if (users.length > 0) {
  users[0].posts.push({
    content: "Hello world, this is my first post!",
    timestamp: new Date().toLocaleString()
  });
  localStorage.setItem("users", JSON.stringify(users));
}


const feed = document.getElementById("feed");

users.forEach(user => {
  user.posts.forEach(post => {
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


