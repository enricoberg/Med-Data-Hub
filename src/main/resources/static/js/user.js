async function renderuser(){
  const logged = await validateuser();
  if(!logged) window.location.replace("/app/");
  document.querySelector("#mailplaceholder").innerHTML="User Email:  "+currentuser();
  
  currentRole();
  let quicksearchenabled=localStorage.getItem("quicksearchenabled");
  
  
  if(quicksearchenabled==null) localStorage.setItem("quicksearchenabled", true);;
  if(quicksearchenabled=="false") {
    
    document.querySelector("#quicksearch").checked=false;
  }
  else document.querySelector("#quicksearch").checked=true;
    // if (window.innerWidth<992) {
    //     document.querySelector(".usermenu").style.top="360px";
    //     document.querySelector(".usermenu").style.left="0px";
    //     }
    //     else{
    //     document.querySelector(".usermenu").style.top="60px";
    //     document.querySelector(".usermenu").style.right="0px";
    //     }
    // if(document.querySelector(".usermenu").classList.contains("invisible")){
        
    //     document.querySelector(".usermenu").classList.remove("invisible");
    // } 
    // document.body.addEventListener("click",()=>{
    //     document.querySelector(".usermenu").classList.add("invisible");
    // });


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
renderuser();
document.querySelector("#quicksearch").addEventListener('change',()=>{
  
  let quicksearchenabled= document.querySelector("#quicksearch").checked;
  
  localStorage.setItem("quicksearchenabled", quicksearchenabled);
  
});
// document.querySelector("#manualdownload").addEventListener('click',()=>{
//                 fetch(document.querySelector("#manualdownload").getAttribute('targetref'), {headers: {'Authorization': authenticationheader()}})
//                         .then(response => response.blob())
//                         .then(pdfBlob => {
//                           var pdfUrl = URL.createObjectURL(pdfBlob);
//                           var newTab = window.open();
//                           newTab.document.write('<object width="100%" height="100%" data="' + pdfUrl + '" type="application/pdf"></object>');
//                         })
//                         .catch(error => alert("The Document you are looking for does not exists"));
//                     });


