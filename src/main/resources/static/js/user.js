async function renderuser(){
  const logged = await validateuser();
  if(!logged) window.location.replace("/app/");
  document.querySelector("#mailplaceholder").innerHTML="User Email:  "+currentuser();
  
  currentRole();
  //UPDATE CHE CHECKBOXES OF THE USER PREFERENCES
  let quicksearchenabled=localStorage.getItem("quicksearchenabled"); 
  if(quicksearchenabled==null) localStorage.setItem("quicksearchenabled", false);;
  if(quicksearchenabled=="false") {
    
    document.querySelector("#quicksearch").checked=false;
  }
  else document.querySelector("#quicksearch").checked=true;

  let searchonlydocuments=localStorage.getItem("onlydocs"); 
  if(searchonlydocuments==null) localStorage.setItem("onlydocs", false);;
  if(searchonlydocuments=="false") {
    
    document.querySelector("#searchmode").checked=false;
  }
  else document.querySelector("#searchmode").checked=true;



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
    
    createCustomAlert('Log Out','Are you sure you want to sign out of this session?', 'yesno').then((result) => {     
      if(result) {
        fetch('/app/auth/logout', {
          method: 'GET'
        })
        .then(response => {
          if(response.ok) {
            location.replace("/app/");
          }
        })
        .catch(error => {
          createCustomAlert('Error','Something went wrong signing out', 'ok');          
        });
      }
      else return;      
    });

    


}
renderuser();
listenForDownloads();
//ADD EVENT LISTENERS FOR CHECKBOXES VALUE CHANGE
document.querySelector("#quicksearch").addEventListener('change',()=>{
  
  let quicksearchenabled= document.querySelector("#quicksearch").checked;
  
  localStorage.setItem("quicksearchenabled", quicksearchenabled);
  
});
document.querySelector("#searchmode").addEventListener('change',()=>{
  
  let searchonlydocuments= document.querySelector("#searchmode").checked;
  
  localStorage.setItem("onlydocs", searchonlydocuments);
  
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


