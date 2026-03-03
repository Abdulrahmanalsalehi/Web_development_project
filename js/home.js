const users = JSON.parse(localStorage.getItem("users")) || [];

function getLoggedIntUser() {
  return JSON.parse(localStorage.getItem("LoggedInUser"));
}
// load home screen header for loggedInUser including,
//  username --- |Fost|Followers|Following| --- profile-pic
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

const logout_window = document.getElementById("logout-window");
const logout_header = document.getElementById("logout-header");
const yes = document.getElementById("Yes");
const no = document.getElementById("No");


logout_header.addEventListener("click", () => {
  logout_window.style.display = "flex";
});
yes.addEventListener("click", () => {
  window.location.href = "login.html";
});
no.addEventListener("click", () => {
  logout_window.style.display = "none";
});



// function to dispaly a stream of posts
function showFeeds() {
  const feed = document.getElementById("feed");
  feed.innerHTML = ""; 

  // get all posts from each user
  let allPosts = [];
  users.forEach(user => {
    if (user.posts) {
      user.posts.forEach(post => {
        allPosts.push({
          ...post,
          username: user.username,
          profilePic: user.profilePic,
        });
      });
    }
  });

  // new posts will apear at the top of the feed (descending)
  allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // create a div for each post
  allPosts.forEach(post => {
    const post_element = document.createElement("div");
    post_element.classList.add("post");
  
    // write html structure for post here
    post_element.innerHTML = `
      <div class="post-header">

        <img src="${post.profilePic}" class="default-pic-post">
        <div>
          <div class="post-username"> @${post.username} </div>
          <div class="timestamp"> ${post.timestamp} </div>
        </div>
      </div>

      <div class="post-content"> ${post.content} </div>
    
      <div class="post-actions">
        <button class="like"> 
          <img src="media/heart.svg"> <span id="like-count"> 0 </span>
        </button>
        <button class="comment"> 
          <img src="media/message-circle.svg"> <span id="comment-count"> 0 </span>
        </button>
      </div>
    `;
    feed.appendChild(post_element);
  });
}


// collect input from user when creating a post 
document.getElementById("post-button").addEventListener("click", () => {
  const user_input = document.getElementById("post-input");
  const content = user_input.value.trim()
  if (!content) return;

  const loggedUser = getLoggedIntUser();
  const userIndex = users.findIndex(u => u.username === loggedUser.username);

  if (userIndex !== -1) {
    const newPost = {
      content,
      timestamp: new Date().toLocaleString(),
      comments: []
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
    showFeeds();
  }
});

function addComment(){
  
}







// Initial load
loadHeaderProfile();
showFeeds();
