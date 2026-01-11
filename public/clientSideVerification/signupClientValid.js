function containsNumbers(str){
    return /[0-9]/.test(str);
}

function containsLetters(str){
    return /[a-z]/.test(str)
}

function containsSpecialCharacters(str){
    return /\W/.test(str);
}

document.getElementById("signupForm").addEventListener("submit", function(e){
            
            let valid = true;

            const username = document.getElementById("signupUsername").value;
            const password1 = document.getElementById("signupPassword1").value;
            const password2 = document.getElementById("signupPassword2").value;

            const usernameErrorMessage = document.querySelector("#usernameErrorMessage");
            const password1ErrorMessage = document.querySelector("#password1ErrorMessage");
            const password2ErrorMessage = document.querySelector("#password2ErrorMessage");
            

            //If too short, no normal letters, or contains special characters its invalid
            if((username.length < 3) || (!containsLetters(username)) || (containsSpecialCharacters(username))){
                valid = false;
                usernameErrorMessage.style.display = "block";
            }else{
                usernameErrorMessage.style.display = "none";

            }

            //If no numbers or no letters or too short or no special characters its invalid
            if(!containsNumbers(password1) || (!containsLetters(password1)) || (password1.length < 5) || !(containsSpecialCharacters(password1))){
                valid = false;
                password1ErrorMessage.style.display = "block";
            }else{
                password1ErrorMessage.style.display = "none";
            }


            if(!(password1 === password2)){
                valid = false;
                password2ErrorMessage.style.display = "block";
            }else{
                password2ErrorMessage.style.display = "none";
            }

            if (!valid){
                e.preventDefault()
            }else{
                
            }

        })