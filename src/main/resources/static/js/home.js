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

  

  async function renderpage(section){
    
    
    
    const logged = await validateuser();
    if(!logged) window.location.replace("/app/");
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
renderpage("");

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