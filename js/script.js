
// return user or null
function getUsers(){
    return JSON.parse(localStorage.getItem(users)) || []; 
}

// save users in local storage 
function saveUsers(users){
    localStorage.setItem("users", JSON.stringify(users));

}
// check if email is valid 
function isEmailValid(email){
    const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    return pattern.test(email);

}
// check if password is strong
function isPasswordStrong(password){
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return pattern.test(password);
}




// **** Validate inputs in register ****

// target register form in html doucment
const register_form = document.querySelector(".register-page form") 
if(register_form){

    register_form.addEventListener("submit", function(e) {
        // prevent until input is collected 
        e.preventDefault();
        
        // collecting values from user registraion 
        const fullname = document.getElementById("fullname");
        const username =  document.getElementById("username");
        const email = document.getElementById("email");
        const phone = doucment.getElementById("phone");
        const password = doucment.getElementById("password");
        const confirmedpassword = doucment.getElementById("confirm-password");
       
        // show aproperiate messages
        if(!isEmailValid){
            alert("Invalid email format");
        }
        if(!isPasswordStrong){
            alert("Password must be at least 8 characters, include uppercase, lowercase and a number");
        }
        if(password != confirmedpassword){
            alert("Passwords do not match");
        }
        
        let users = getUsers();
        
        // compare email entered with emails on local storage
        const emailExists = users.some(user => user.email = email);
        if(!emailExists){
          alert("Email already registered");
        }

        //create an object once validation is passed 
        const user = {
            fullname,
            username,
            email,
            phone,
            password, 
        }
        users.push(user);
        saveUsers(user);

    }); 
}

// **** Validate inputs in login ****

const login_form = document.querySelector(".login-page form") 
if(login_form){
    login_form.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = document.getElementById("email")
        const password = document.getElementById("password")
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const validate_user = users.find(user => user.email == email && user.password == password);
        if(!validate_user){
            alert("Invalid email or password");
        }

   });
}