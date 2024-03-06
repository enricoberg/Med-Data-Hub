
  

  async function renderpage(section){
    
    //REDIRECTS TO THE FUNCTIONS THAT HANDLE THE VISUALIZATION OF THE PAGE
    const logged = await validateuser();
    if(!logged) window.location.replace("/app/");
    if (document.body.classList.contains("invisible")) document.body.classList.remove("invisible");
    document.cookie = 'resultpage=1';
    document.cookie = 'resultview=50';
    switch(section) {
      case "users":
          renderuser();
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

document.querySelector("#usersection").addEventListener("click",()=>{
    renderpage("users");
    event.stopPropagation();
  });

document.querySelector("#suppliersection").addEventListener("click",()=>{
  
  renderpage("suppliers");
  });
document.querySelector("#materialsection").addEventListener("click",()=>{
   renderpage("materials");  
  });
document.querySelector("#productsection").addEventListener("click",()=>{
  renderpage("products");   
  });
document.querySelector("#componentsection").addEventListener("click",()=>{
  renderpage("components");    
  });
document.querySelector("#specificationsection").addEventListener("click",()=>{    
  renderpage("specifications");    
  });
document.querySelector("#dashboardsection").addEventListener("click",()=>{    
  renderpage("dashboard");    
  });
renderpage("dashboard");

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

document.cookie= 'refreshcount=0';
setInterval(()=>{
    let refreshcount=parseInt(getCookie("refreshcount"));
    refreshcount+=1;
    if(refreshcount<8) {
    test();
    document.cookie=`refreshcount=${refreshcount}`;
    }


}, 150);
