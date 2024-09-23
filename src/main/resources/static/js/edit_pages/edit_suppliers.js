//PREVENT BACK BUTTONS TO REDIRECT TO THIS PAGE
window.history.forward();
        function noBack() {
            window.history.forward();
        }



//FUNCTION THAT LOADS ALL THE COMPONENTS FROM THE DATABASE AND DRAWS THE TABLE WITH THE RETRIEVED DATA (RUNS AT PAGE LOAD)
function visualizeSuppliers(){    
    const storedComponents = JSON.parse(localStorage.getItem("suppliers_to_edit"));
    let url="/querysup/bylistofcodes?search";
    storedComponents.forEach((element)=>{url+=`&articles=${element}`;});
    
    const target_table=document.querySelector("#targettable");
    target_table.innerHTML=`<div class="row">                    
    <div class="col cw150 text-center etheader border ">
        <h3>ID</h3>
    </div> 
    <div class="col cw400  text-center etheader border   ">
        <h3>Supplier Name</h3>
    </div>
    <div class="col cw350  text-center etheader border ">
        <h3>SAP Code</h3>
    </div>
    <div class="col cw500  text-center etheader border ">
        <h3>Contacts</h3>
    </div>
    
     
    <div class="col cw200 text-center etheader border  ">
        <h3>Action</h3>
    </div>  
    
</div>



`;    
    
    axios.get(url,{ headers: { 'Authorization': authenticationheader()}})
      .then(function (response) {        
        for (const obj of response.data) {
            
            const contactplaceholder= obj.contact==null ? "NULL" : obj.contact;
            
            target_table.innerHTML+=`
            <div class="row" style="position: relative;">                    
                <div class="col cw150 py-2 text-center etitem  border  bg-light etinactive boxid ">${obj.id}</div>
                <div class="col cw400 py-2 text-center etitem border  bg-light etinactive editable boxname ">${obj.supplier_name}</div>
                <div class="col cw350 py-2 text-center etitem border  bg-light etinactive editable boxsap ">${obj.sap_code}</div>
                <div class="col cw500 py-2 text-center etitem border  bg-light etinactive editable  boxcontacts ">${contactplaceholder}</div>
                
                
                <div class="col cw200 py-2 text-center etitem border  bg-light etinactive ">
                    <i class="fa fa-trash-o deletebutton actionbutton"  onclick="deleteSupplier(${obj.id})" aria-hidden="true"></i> Delete
                    
                </div>                
            </div>
            `;
        }
                   
         updateView();
        const allchecks=document.querySelectorAll(".editcheck.editable input");
        const allselects=document.querySelectorAll(".editselect.editable select");
        
        allchecks.forEach(check=>{ check.addEventListener("change",()=>editFather(check))});
        allselects.forEach(select=>{ select.addEventListener("change",()=>editFather(select))});
              
        
      })
 
}

//FUNCTION TO DELETE ONE SUPPLIER
function deleteSupplier(id){    
    createCustomAlert('Attention','ARE YOU SURE YOU WANT TO DELETE THIS SUPPLIER PERMANENTLY?', 'yesno')
    .then((result) => {
             if(!result) return;
             else{
                axios.delete(`/querysup/delete/${id}`,{ headers: { 'Authorization': authenticationheader()}})
                .then((response) => {
                    visualizeSuppliers();
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                    createCustomAlert('Error','Something went wrong trying to delete this supplier', 'ok');
                    
                });    
             }
            });
    




   
}

//FUNCTION TO SAVE THE DATA OF ALL MODIFIED USERS
function saveSuppliersModifications(){
    inputToTableItem();
    const modified_items=document.querySelectorAll(".edited");
    if(modified_items.length===0){
        createCustomAlert('Error','The table is already up to date', 'ok');        
        return;
    }
    
    createCustomAlert('Attention',"ARE YOU SURE YOU WANT TO UPDATE ALL "+modified_items.length+" MODIFIED FIELDS?", 'yesno')
    .then((result) => {
             if(!result) return;
             else{
                let processed_items=0;
    
                modified_items.forEach(function(button){
                    processed_items++;
                    const parentRow = button.closest('.row');
                    if (parentRow) {
                        const id = parentRow.querySelector('.boxid').innerHTML;
                        const name = parentRow.querySelector('.boxname').innerHTML;
                        const sap= parentRow.querySelector('.boxsap').innerHTML; 
                        const contact= parentRow.querySelector('.boxcontacts').innerHTML;             
                        
                        
            
                        
                        const sup_correct = { 
                                                sapcode: sap,
                                                name: name,
                                                contact: contact
                                            };
                        
                        axios.put(`/querysup/updatesupplier/${id}`, sup_correct,{ headers: { 'Authorization': authenticationheader()}}) ;
                        if (processed_items==modified_items.length)  setTimeout(()=>{visualizeSuppliers()},250);         
                        
                    }
                });
             }
            });

}

visualizeSuppliers();




