function renderuser(){
    if (window.innerWidth<992) {
        document.querySelector(".usermenu").style.top="360px";
        document.querySelector(".usermenu").style.left="0px";
        }
        else{
        document.querySelector(".usermenu").style.top="60px";
        document.querySelector(".usermenu").style.right="0px";
        }
    if(document.querySelector(".usermenu").classList.contains("invisible")){
        
        document.querySelector(".usermenu").classList.remove("invisible");
    } 
    document.body.addEventListener("click",()=>{
        document.querySelector(".usermenu").classList.add("invisible");
    });


}
function logoutuser(){

    if(!confirm("Are you sure you want to sign out of this session?")) return;

    fetch('/app/auth/logout', {
          method: 'GET'
        })
        .then(response => {
          if(response.ok) {

            location.replace("/app/");
          }
        })
        .catch(error => {
          alert("ERROR SIGNING OUT");
        });


}

