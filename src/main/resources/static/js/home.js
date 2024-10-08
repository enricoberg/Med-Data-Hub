


  async function renderpage(section){
    
    //CHANGE THE LOGO BASED ON THE SCREEN WIDTH
    if (window.innerWidth<1299) {
      document.querySelector(".logoscritta").innerHTML="MDH";
      
    }
    //REDIRECTS TO THE FUNCTIONS THAT HANDLE THE VISUALIZATION OF THE PAGE
    const logged = await validateuser();
    if(!logged) window.location.replace("/app/");
    if (document.body.classList.contains("invisible")) document.body.classList.remove("invisible");
    document.cookie = 'resultpage=1';
    document.cookie = 'resultview=50';
    switch(section) {
      case "users":
          window.location.replace("/app/myprofile");
        break;
      case "suppliers":
          rendersuppliers();
        break;
      case "materials":
          rendermaterials();
        break;
      case "products":
          renderproducts();
        break;
      case "components":          
          rendercomponents();          
        break;
      case "specifications":
          renderspecifications();
        break;
      case "dashboard":
          renderdashboard();
        break;
      default:
        
    }
}

resetPage();
function clearbomtitles(){
  bomtitles=document.querySelectorAll(".bomtitle");
  try{
    for(title of bomtitles){
      title.remove();
    }
    bomtitles=document.querySelectorAll(".bomtitle").classList.add("invisible");
  }
  catch(error){}
  for(container of document.querySelectorAll(".container")) {
                  container.remove();
              }
}
function authenticationheader(){
    const jwt=getCookie("jwt");
    return `Bearer ${jwt}`;
}

//PERIODICALLY CHECKS IF TOKEN NEEDS TO BE REFRESHED
setInterval(()=>{
    const timeleft=expirationTimeLeft(getCookie("jwt"));
    if(timeleft<70000) sendRefresh();
}, 10000);




// document.querySelector("#searchbutton").addEventListener("click", ()=>{
//   quickSearch(document.querySelector("#searchstring").value)
// });




const urlParams = new URLSearchParams(window.location.search);
const sectionToDisplay = urlParams.get('section'); 
if(sectionToDisplay){

setTimeout(()=>{
  switch(sectionToDisplay){
      
    case "components":        
      document.querySelector("#componentsection").click();              
    break;
    case "products":        
      document.querySelector("#productsection").click();             
    break;
    case "materials":        
      document.querySelector("#materialsection").click();             
    break;
    case "suppliers":        
      document.querySelector("#suppliersection").click();             
    break;
  }
},150);
  
}
