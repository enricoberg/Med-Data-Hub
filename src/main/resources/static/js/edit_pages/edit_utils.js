

function updateView(){

    const editMode=localStorage.getItem("editmode");

    if(editMode=="false"){
        document.querySelectorAll("#targettable select").forEach(select => select.disabled = true)
        document.querySelectorAll("#targettable input").forEach(check => check.disabled = true)
        return;
    }
    else{
        
    
    
    
            //CREATE AN INPUT INSIDE THE TABLE CELL TO ALLOW MODIFICATION OF THE FIELD
            let etitems=document.querySelectorAll(".etitem,.etitembulk");
            
            etitems.forEach(function(etitem){
                
                if(!etitem.classList.contains("editable") || etitem.classList.contains("editcheck") || etitem.classList.contains("editselect") || etitem.classList.contains("toggleable")) return;
                
                etitem.addEventListener("click",()=>{
                    
                    event.stopPropagation();
                    
                    if(!etitem.classList.contains("etinactive")) return;
                    inputToTableItem();
                    etitem.classList.remove("etinactive");
                    etitem.classList.add("etactive");                
                    let content =  etitem.innerHTML;
                    etitem.innerHTML=`<input type="text" class="w-100 text-start" value="${content}"> `;
                    localStorage.setItem("content", content);
    
                });
        })
        document.addEventListener("click",(event)=>{
            if (!event.target.classList.contains("etitem") && !event.target.classList.contains("editcheck") && !event.target.classList.contains("editselect") && !event.target.classList.contains("etitembulk") && !event.target.classList.contains("row") && !event.target.classList.contains("rowbulk")){
                
                inputToTableItem();
            }
            
        
        });
    
        

    }
    
    
}



function inputToTableItem(){
    //UPDATE THE VALUE OF THE CELL AFTER INPUT HAS BEEN CHANGED
    
    let etitems=document.querySelectorAll(".etitem,.etitembulk");
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
    
    const ancestor = element.closest(`.etitem,.etitembulk`);
    if (ancestor) ancestor.classList.add('edited');    
}


function toggleEditMode(allowedRoles= []){

    

    

    axios.get(`/aux/getrole?email=${currentuser()}`,{ headers: { 'Authorization': authenticationheader()}})
    .then((response) => {        
        const additionalrolescheck=  allowedRoles.includes(response.data);
        const editMode = document.querySelectorAll('.toggleable').length > 0;
        if(response.data==="USER") {
            localStorage.setItem("editmode","false");
            return;
        }
        if (!editMode) {
        if (response.data === "ADMIN" || additionalrolescheck) {
            
            let editMode=localStorage.getItem("editmode");
            if(editMode=="false") localStorage.setItem("editmode","true");
            else localStorage.setItem("editmode","false");
            let current_section=localStorage.getItem("currentsection");
            if(current_section=="components") updateComponentsTable();
            if(current_section=="products") updateProductsTable();
            if(current_section=="materials") updateMaterialsTable();
            if(current_section=="suppliers") updateSuppliersTable();


            
        }
        
    }
    });
}


