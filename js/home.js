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

// *********** Redirect when clicking on some elements in the app header ***********
const logout_window = document.getElementById("logout-window");
const logout_header = document.getElementById("logout-header");
const yes = document.getElementById("Yes");
const no = document.getElementById("No");
const username = document.getElementById("username-header");
const profile_pic = document.getElementById("profile-pic");

profile_pic.addEventListener("click", () => {
  window.location.href = "profile.html"
});
username.addEventListener("click", () => {
  window.location.href = "profile.html";
});
logout_header.addEventListener("click", () => {
  logout_window.style.display = "flex";
});
yes.addEventListener("click", () => {
  window.location.href = "login.html";
});
no.addEventListener("click", () => {
  logout_window.style.display = "none";
});



// *********** function to dispaly a stream of posts ***********
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
  // new posts will apear at the top of the feed 
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
          <div class="post-username"> ${post.username} </div>
          <div class="timestamp"> ${post.timestamp} </div>
        </div>
      </div>

      <div class="post-content"> ${post.content} </div>
    
      <div class="post-actions">
        <button class="like"> 
          <img src="media/heart.svg"> 
          <span class="like-count"> ${post.likes ? post.likes.length : 0} </span>
        </button>
        <button class="comment"> 
          <img src="media/message-circle.svg"> 
          <span class="comment-count"> ${post.comments.length}</span>
        </button>
      </div>
    `;
    feed.appendChild(post_element);

    post_element.addEventListener("click", () => {
    openPost(post); }); // allow the user to see the post in more details
   
    const username = post_element.querySelector(".post-username")
    const pic = post_element.querySelector(".default-pic-post")
    const like_button = post_element.querySelector(".like");
    const like_count = post_element.querySelector(".like-count");

    username.addEventListener("click", (e) => {
      e.stopPropagation(); // ---> prevent post window from showing
      window.location.href = "profile.html";
    });
     pic.addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = "profile.html";
    });
    like_button.addEventListener("click", (e) =>{
      e.stopPropagation(); // ---> prevent post window from showing
      showLikes(post, like_count);
    });


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

    
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("LoggedInUser", JSON.stringify(users[userIndex]))

    // Clear input
    user_input.value = "";

    // Refresh header stats and feed
    loadHeaderProfile();
    showFeeds();
  }
});

function showLikes(post, like_count){
  const loggedUser = getLoggedIntUser();
   if (!loggedUser) return;

  const postOwnerIndex = users.findIndex(u => u.username === post.username);
       if (postOwnerIndex === -1) return;

  // 2. Find post
  const postIndex = users[postOwnerIndex].posts.findIndex(
    p => p.timestamp === post.timestamp
  );
  if (postIndex === -1) return;

  const realPost = users[postOwnerIndex].posts[postIndex];

  if (!realPost.likes) {
    realPost.likes = [];
  }

  const userLikeIndex = realPost.likes.indexOf(loggedUser.username);

  if (userLikeIndex === -1) {
    realPost.likes.push(loggedUser.username);
  } else {
    realPost.likes.splice(userLikeIndex, 1);
  }

  // Update local post object
  post.likes = realPost.likes;

  // Save
  localStorage.setItem("users", JSON.stringify(users));

  // Update UI
  like_count.textContent = realPost.likes.length;

}






function openPost(post){

  document.getElementById("detail-profile-pic").src = post.profilePic;
  document.getElementById("detail-username").textContent = post.username;
  document.getElementById("detail-timestamp").textContent = post.timestamp;
  document.getElementById("detail-content").textContent = post.content;
  document.getElementById("comment-count").textContent = post.comments ? post.comments.length : 0;

  const post_window = document.getElementById("post-window");
  post_window.style.display = "flex";

  document.getElementById("arrow-back").onclick = () => {
    post_window.style.display = "none";
  };
  document.getElementById("detail-like").onclick = () => {
    const like_count = document.getElementById("like-count");
    showLikes(post, like_count);
  };
  
  document.getElementById("detail-comment").onclick = () => {
    const section = document.getElementById("comments-section");
    const currentDisplay = window.getComputedStyle(section).display;
    section.style.display = section.style.display =currentDisplay === "none" ? "block" : "none";
    renderComments(post);
  };

  // Add comment
  document.getElementById("comment-button").onclick = () => {
    addComment(post);
  };
  
}



function renderComments(post){
  const comments_list = document.getElementById("comments-list");
  comments_list.innerHTML = "";

  if(post.comments && post.comments.length > 0){
    post.comments.forEach(comment => {
      const comment_element = document.createElement("div");
      comment_element.classList.add("comment-box");
      comment_element.innerHTML = `
        <div class="comment-header">
          <img src="${comment.profilePic}" class="default-pic-post">
          <div>
            <div class="post-username">${comment.username}</div>
            <div class="timestamp">${comment.timestamp}</div>
          </div>
        </div>
        <div class="comment-content">${comment.content}</div>
      `;
      comments_list.appendChild(comment_element);
    });
  }
}

function addComment(post){
  const input = document.getElementById("comment-input");
  const content = input.value.trim();
  if (!content) return;

  const loggedUser = getLoggedIntUser();
  
  // 1. Find the OWNER of the post in the users array
  const postOwnerIndex = users.findIndex(u => u.username === post.username);
  
  if (postOwnerIndex !== -1) {
    // 2. Find the specific post in that user's posts array
    const postIndex = users[postOwnerIndex].posts.findIndex(p => p.timestamp === post.timestamp);

    if (postIndex !== -1) {
      const newComment = {
        content: content,
        timestamp: new Date().toLocaleString(),
        username: loggedUser.username,
        profilePic: loggedUser.profilePic
      };

      // 3. Push the comment to the correct user's post
      if (!users[postOwnerIndex].posts[postIndex].comments) {
        users[postOwnerIndex].posts[postIndex].comments = [];
      }
      
      users[postOwnerIndex].posts[postIndex].comments.push(newComment);

      // 4. Update the local 'post' object so the UI refreshes immediately
      post.comments = users[postOwnerIndex].posts[postIndex].comments;

      // 5. Save to localStorage
      localStorage.setItem("users", JSON.stringify(users));

      // Clear input and refresh UI
      input.value = "";
      renderComments(post);
      document.getElementById("comment-count").textContent = post.comments.length;
    }
  }

  showFeeds();  // keeps feed counts in sync



}






// Initial load
loadHeaderProfile();
showFeeds();
