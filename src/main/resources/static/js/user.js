async function renderuser(){
resetPage();
const logged = await validateuser();
if(!logged) window.location.replace("/app/");


const newDash = document.createElement("div");
  const referenceElement = document.body.children[1];
  document.body.prepend(newDash);    
  newDash.classList.add("containertable");
  
  
  newDash.innerHTML=`
  <div class="row mx-2" >
          <div style="width: 100%; text-align: center; margin-top:70px;" class="titleh1 "><h1 class="userinfo">User Information</h1></div>
          
          <div class=" mx-auto" id="targettable" style="height: 95vh; " >               

              <div class="userinfo" id="mailplaceholder">User Email : user@mail.com</div>
              <div class="userinfo" id="roleplaceholder">User Role : USER</div>
              <div class="userinfo">Password: <a href="/app/passwordchangelogged" class="manuallink">Change password</a></div>
              <div class="userinfo"><a class="pdfopener manuallink"  targetref="/download/?filename=MANUAL">Download User Manual</a></div>
              
              <div class="userinfo"><input type="checkbox" name="quicksearch" id="quicksearch" style="margin-right:30px">Enable quick search</div>
              <div class="userinfo"><input type="checkbox" name="searchmode" id="searchmode" style="margin-right:30px">Search for documents only</div>
              <div class="userinfo" ><a href="#" onclick="logoutuser()" id="logoutbutton">Log me out!</a></div>
          </div>
  </div>

  `;

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


//ADD EVENT LISTENERS FOR CHECKBOXES VALUE CHANGE
document.querySelector("#quicksearch").addEventListener('change',()=>{
  
  let quicksearchenabled= document.querySelector("#quicksearch").checked;
  
  localStorage.setItem("quicksearchenabled", quicksearchenabled);
  
});
document.querySelector("#searchmode").addEventListener('change',()=>{
  
  let searchonlydocuments= document.querySelector("#searchmode").checked;
  
  localStorage.setItem("onlydocs", searchonlydocuments);
  
});


listenForDownloads();
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


//ADD EVENT LISTENERS FOR CHECKBOXES VALUE CHANGE
// document.querySelector("#quicksearch").addEventListener('change',()=>{
  
//   let quicksearchenabled= document.querySelector("#quicksearch").checked;
  
//   localStorage.setItem("quicksearchenabled", quicksearchenabled);
  
// });
// document.querySelector("#searchmode").addEventListener('change',()=>{
  
//   let searchonlydocuments= document.querySelector("#searchmode").checked;
  
//   localStorage.setItem("onlydocs", searchonlydocuments);
  
// });









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


