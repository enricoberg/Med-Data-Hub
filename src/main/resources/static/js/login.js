const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const formlogin =document.getElementById("FormLogin");
const formsignup=document.getElementById("FormSignup");

let alltextinput=document.querySelectorAll("input");
for (let input of alltextinput) {
  input.addEventListener('input', () => {
    validate();
  });
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function validate(){  container.classList.contains("right-panel-active")? validate_signup() : validate_login();}
function validate_login(){
  
  errormessage=document.querySelector(`#loginerror`); 
  if(document.querySelector("#is1").value!=="" && document.querySelector("#is2").value!=="") {
    errormessage.classList.add("invisible");
    return true;}
  errormessage.innerHTML="Error: missing credentials";
  errormessage.classList.remove("invisible");
  return false;
}
function validate_signup(){  
  errormessage=document.querySelector(`#signuperror`);
  const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  checkemail=emailRegex.test(document.querySelector("#il3").value);
  checkpassword=document.querySelector("#il4").value==document.querySelector("#il5").value;
  if(document.querySelector("#il1").value!=="" && document.querySelector("#il2").value!=="" && document.querySelector("#il3").value!=="" && document.querySelector("#il4").value!=="") {
    if(!checkemail){
      errormessage.innerHTML="Error: invalid email";
      errormessage.classList.remove("invisible");
      return false;
    }
    if(!checkpassword){
      errormessage.innerHTML="Error: passwords are not matching";
      errormessage.classList.remove("invisible");
      return false;
    }

    errormessage.classList.add("invisible");
    return true;}
  errormessage.innerHTML="Error: missing credentials";
  errormessage.classList.remove("invisible");
  return false;
}

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});



document.querySelector("#signupbutton").addEventListener('click',()=>{
    let firstnamef=document.querySelector("#il1").value;
    let lastnamef=document.querySelector("#il2").value;
    let emailf=document.querySelector("#il3").value;
    let passwordf=document.querySelector("#il4").value;
    let passwordf2=document.querySelector("#il5").value;
    
    event.preventDefault(); 
    if(!validate_signup()) return;	
  
    
      data= {
        firstName: firstnamef.toLowerCase(),
        lastName: lastnamef.toLowerCase(),
        email: emailf.toLowerCase(),
        password: passwordf
      }
    
    fetch('/app/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if(response.ok) {
        alert("SIGNED UP SUCCESFULLY!");
        location.reload();
      }
    })
    .catch(error => {
      errormessage=document.querySelector(`#signuperror`);  
      errormessage.innerHTML="Invalid credentials";
      errormessage.classList.remove("invisible");
    });
});

document.querySelector("#loginbutton").addEventListener('click',()=>{
  event.preventDefault();
  if(!validate_login()) return;
  
  let emails=document.querySelector("#is1").value;
  let passwords=document.querySelector("#is2").value; 
	
  data= {
    email: emails,
    password: passwords
  }

fetch('/app/auth/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => {  
  if(response.ok) return response.json();
})
.then(data=>{
  document.cookie = `jwt=${data.token}`;
  

  window.location.replace("/app/home")

})
.catch(error => {
  errormessage=document.querySelector(`#loginerror`);  
  errormessage.innerHTML="Invalid credentials";
  errormessage.classList.remove("invisible");
});
  
});

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
async function validateuser(){
  const jwt=getCookie("jwt");
  const url = '/user/validate';
  const jwtheader=`Bearer ${jwt}`;    
  const requestOptions = {
    method: 'POST', 
    headers: {
        'Content-type':'application/json',
        'Authorization': jwtheader
    }
  }
  try {
      const response = await fetch(url,requestOptions);  
      
      if (response.status!=200) return false;
      return true;        
    } catch (error) {
      return false;
    }
}


async function renderpage(){

  const logged = await validateuser();    
  if(logged) window.location.replace("/app/home");  
}



renderpage();