

function updateView(){
    //CREATE AN INPUT INSIDE THE TABLE CELL TO ALLOW MODIFICATION OF THE FIELD
    let etitems=document.querySelectorAll(".etitem");
    etitems.forEach(function(etitem){
        if(!etitem.classList.contains("editable") || etitem.classList.contains("editcheck") || etitem.classList.contains("editselect")) return;
        etitem.addEventListener("click",()=>{
            event.stopPropagation();
            if(!etitem.classList.contains("etinactive")) return;
            inputToTableItem();
            etitem.classList.remove("etinactive");
            etitem.classList.add("etactive");
            let content=etitem.innerHTML;
            etitem.innerHTML=`<input type="text" class="w-100 text-start" value="${content}"> `;
            localStorage.setItem("content", content);

        });
    })
    document.addEventListener("click",(event)=>{
        if (!event.target.classList.contains("etitem") && !event.target.classList.contains("editcheck") && !event.target.classList.contains("editselect"))
        inputToTableItem();
    
    });
}

function inputToTableItem(){
    //UPDATE THE VALUE OF THE CELL AFTER INPUT HAS BEEN CHANGED
    let etitems=document.querySelectorAll(".etitem");
    etitems.forEach(function(etitem){
        if(etitem.classList.contains("etactive")){
            etitem.classList.remove("etactive");
            etitem.classList.add("etinactive");
        }
        const inputElement = etitem.querySelector('input[type="text"]');
        
        if (inputElement) {
            
            let content=inputElement.value;
            inputElement.remove();
            etitem.innerHTML=content;           
            //COLOR ONLY THE CHANGED ITEMS
            if(content!=localStorage.getItem("content") &&!etitem.classList.contains("edited") ) {
                etitem.classList.add("edited");
                
            }
            
            
        }
    });
}

function logOut(){
    if(!confirm("Are you sure you want to log out of the application?")) return;
    document.cookie = `sessiontoken=; path=/`;  
    document.cookie = `user=; path=/`;  
    location.replace("/");
}
function authenticationheader(){
    const jwt=getCookie("jwt");
    return `Bearer ${jwt}`;
}
function editFather(element){
    
    const ancestor = element.closest(`.etitem`);
    if (ancestor) ancestor.classList.add('edited');    
}
