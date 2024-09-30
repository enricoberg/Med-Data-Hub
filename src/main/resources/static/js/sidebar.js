

function renderBot(){
    const BotContainer = document.createElement('div');
    BotContainer.classList.add("assistantcontainer");
    BotContainer.innerHTML=`<img src="../css/littlebot.webp" alt="" class="dancing-image" onclick="createCustomAlert('Coming soon','Hello, my name is B|Buddy and I am your personal assistant.<br> Unfortunately I am not ready to be deployed yet, please try again later...', 'ok');">`;
    document.body.appendChild(BotContainer);
}
function renderNavbar(){
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = "navbar.css";
    document.head.appendChild(link); 
    const navBar = document.createElement('nav');
    navBar.classList.add("main-menu");
    navBar.innerHTML=`      
    
        <div class="logoarea" onclick="window.location.href='/app/'">
            <img src="../css/logo.png" alt="Med Data Hub logo">
            <h1>Med Data Hub</h1>
            <input type="text" class="searchbar" placeholder="Search for..." id="searchstring">
        </div>
        <ul>
            
            
            <li >
                <a href="#" >
                   <i class="fa-solid fa-book fa-1-5x"></i>
                    <span class="nav-text" onclick="renderspecifications()">
                        Documents
                    </span>
                    <i class="fas fa-chevron-down menuexpander"></i>
                </a>
                
            </li>
            <li style="display: none;" class="submenu" >
                <a href="#" >
                    <i class="fas fa-stream fa-1-5x  "></i>
                     <span class="nav-text" onclick="rendernewdocuments()">
                        Add new document
                     </span>
                 </a>
             </li>
             <li style="display: none;" class="submenu">
                <a href="#" >
                    <i class="fas fa-stream fa-1-5x  "></i>
                     <span class="nav-text" onclick="renderReplaceDocumentPage()">
                        Replace existing document
                     </span>
                 </a>
             </li>
            <li >
                <a href="#">
                   <i class="fa-solid fa-puzzle-piece fa-1-5x "></i>
                    <span class="nav-text" onclick="rendercomponents()">
                        Components
                    </span>
                    <i class="fas fa-chevron-down menuexpander"></i>
                </a>
               
            </li>
            <li style="display: none;" class="submenu">
                <a href="#" >
                    <i class="fas fa-stream fa-1-5x  "></i>
                     <span class="nav-text" onclick="rendernewcomponents()">
                        Add new component
                     </span>
                 </a>
             </li>
            <li style="display: none;" class="submenu">
                <a href="#" >
                    <i class="fas fa-stream fa-1-5x  "></i>
                     <span class="nav-text" onclick="renderqueryadv1()">
                        Usage in Assemblies
                     </span>
                 </a>
             </li>
             
             
            <li>
                <a href="#">
                    <i class="fa-solid fa-diagram-project fa-1-5x"></i>
                    <span class="nav-text" onclick="renderproducts()">
                        Products
                    </span>
                    <i class="fas fa-chevron-down menuexpander"></i>
                </a>
            </li>
            <li style="display: none;" class="submenu">
                <a href="#" >
                    <i class="fas fa-stream fa-1-5x  "></i>
                     <span class="nav-text" onclick="rendernewproduct()">
                        Add new product
                     </span>
                 </a>
             </li>
            <li style="display: none;" class="submenu">
                <a href="#" >
                    <i class="fas fa-stream fa-1-5x submenu "></i>
                     <span class="nav-text" onclick="renderqueryadv2()">
                         Multilevel BOM
                     </span>
                 </a>
             </li>
            <li>
                <a href="#">
                    <i class="fa-solid fa-atom fa-1-5x"></i>
                    <span class="nav-text" onclick="rendermaterials()">
                       Materials
                    </span>
                    <i class="fas fa-chevron-down menuexpander"></i>
                </a>
            </li>
            
            <li style="display: none;" class="submenu">
                <a href="#" >
                    <i class="fas fa-stream fa-1-5x  "></i>
                     <span class="nav-text" onclick="rendernewmaterials()">
                        Add new material
                     </span>
                 </a>
             </li>
             <li style="display: none;" class="submenu">
                <a href="#" >
                    <i class="fas fa-stream fa-1-5x  "></i>
                     <span class="nav-text" onclick="rendernewcertificate()">
                        Load certificate
                     </span>
                 </a>
             </li>
            <li>
               <a href="#">
                   <i class="fa-solid fa-users fa-1-5x"></i>
                    <span class="nav-text" onclick="rendersuppliers()">
                        Suppliers
                    </span>
                    <i class="fas fa-chevron-down menuexpander"></i>
                </a>
            </li>
            <li style="display: none;" class="submenu">
                <a href="#" >
                    <i class="fas fa-stream fa-1-5x  "></i>
                     <span class="nav-text" onclick="rendernewsuppliers()">
                        Add new supplier
                     </span>
                 </a>
             </li>
             <li>
                <a href="#">
                    <i class="fa-solid fa-rotate fa-1-5x"></i>
                    <span class="nav-text">
                       Changes
                    </span>
                    <i class="fas fa-chevron-down menuexpander"></i>
                </a>
              
            </li>
            <li style="display: none;" class="submenu">
                <a href="#" >
                    <i class="fas fa-stream fa-1-5x  "></i>
                     <span class="nav-text">
                        Add new PPC
                     </span>
                 </a>
             </li>
             <li style="display: none;" class="submenu">
                <a href="#" >
                    <i class="fas fa-stream fa-1-5x  "></i>
                     <span class="nav-text">
                        Load a VOC
                     </span>
                 </a>
             </li>
             <li>
                <a href="#">
                    <i class="fa-solid fa-circle-question fa-1-5x"></i>
                    <span class="nav-text">
                       Help
                    </span>                    
                </a>
              
            </li>
             
             
            <li></li>
        </ul>

        <ul class="logout">
            <li>
               <a href="#">
                     <i class="fa-solid fa-user fa-1-5x"></i>
                    <span class="nav-text" onclick="renderuser()">
                        User Settings
                    </span>
                </a>
            </li>  
        </ul>
        
    `;
    
    document.body.appendChild(navBar);
    const currentURL = window.location.pathname;    
    if (!currentURL.startsWith('/app/home')) {
        
        let allspans=document.querySelectorAll(".main-menu li span");
        for(const span of allspans){
            span.onclick = function() {
                window.location.href='/app/';
            };
        }
        
     
    } 
    const allmenuexpanders=document.querySelectorAll(".menuexpander");
    for (const element of allmenuexpanders) {
        element.addEventListener("click",()=>{
            if (element.classList.contains("fa-chevron-down")){
                element.classList.remove("fa-chevron-down");
                element.classList.add("fa-chevron-up");
            }
            else if(element.classList.contains("fa-chevron-up")){
                element.classList.remove("fa-chevron-up");
                element.classList.add("fa-chevron-down");
            }
            let followingLiElements =[];
            let start=true;
            let parent=getFirstLiAncestor(element);
            while (start){
                if(parent.nextElementSibling.classList.contains("submenu")) followingLiElements.push(parent.nextElementSibling);
                else start=false;
                parent=parent.nextElementSibling;
            }
            for(const submenus of followingLiElements){
                if(submenus.style.display=="none"){
                    submenus.style.display="block";
                }
                else{
                    submenus.style.display="none";
                }
            }
            
    
    
            
        });
      }
    
    
      document.querySelector(".main-menu").addEventListener("mouseleave",()=>{
        
          for(const element of allmenuexpanders){
            if(element.classList.contains("fa-chevron-up")){
                element.classList.remove("fa-chevron-up");
                element.classList.add("fa-chevron-down");
            }
          }
       let alllielements=document.querySelectorAll(".main-menu ul li.submenu");
       for(const element of alllielements){
        if(element.style.display!="none") element.style.display="none";
       }
      });
}


  function getFirstLiAncestor(element) {
    while (element && element.tagName !== 'LI') {
      element = element.parentElement;
    }
    return element;
  }


renderNavbar();
renderBot();
