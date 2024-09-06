//FUNCTION THAT LOADS ALL THE COMPONENTS FROM THE DATABASE AND DRAWS THE TABLE WITH THE RETRIEVED DATA (RUNS AT PAGE LOAD)
function visualizeComponents(){    
    const storedComponents = JSON.parse(localStorage.getItem("components_to_edit"));
    let url="/querycomp/bylistofcodes?search";
    storedComponents.forEach((element)=>{url+=`&articles=${element}`;});
    
    const target_table=document.querySelector("#targettable");
    target_table.innerHTML=`<div class="row">                    
    <div class="col cw100 text-center etheader border ">
        <h3>ID</h3>
    </div> 
    <div class="col cw150  text-center etheader border   ">
        <h3>Part code</h3>
    </div>
    <div class="col cw350  text-center etheader border ">
        <h3>Description</h3>
    </div>
    <div class="col cw150  text-center etheader border ">
        <h3>Intercompany</h3>
    </div>
    <div class="col cw200  text-center etheader border ">
        <h3>Family</h3>
    </div>
    <div class="col cw200 text-center etheader border ">
        <h3>Conical STD</h3>
    </div>
    <div class="col cw150 text-center etheader border ">
        <h3>Pack. Material</h3>
    </div>
    <div class="col cw150  text-center etheader border ">
        <h3>In contact</h3>
    </div>
    <div class="col cw150 text-center etheader border ">
        <h3>California65</h3>
    </div>    
    <div class="col cw150 text-center etheader border  ">
        <h3>Action</h3>
    </div>  
    
</div>



`;    
    
    axios.get(url,{ headers: { 'Authorization': authenticationheader()}})
      .then(function (response) {        
        for (const obj of response.data) {
            const check_intercompany= obj.intercompany? "checked" : "";
            
            const check_packaging= obj.packagingmaterial? "checked" : "";
            const check_contact= obj.contact? "checked" : "";
            const check_california= obj.ca65? "checked" : "";
            const standardplaceholder= obj.standard==null ? "NULL" : obj.standard;
            target_table.innerHTML+=`
            <div class="row" style="position: relative;">                    
                <div class="col cw100 py-2 text-center etitem  border  bg-light etinactive boxid ">${obj.id}</div>
                <div class="col cw150 py-2 text-center etitem border  bg-light etinactive editable boxarticle ">${obj.comp_id}</div>
                <div class="col cw350 py-2 text-center etitem border  bg-light etinactive editable boxdescription ">${obj.description}</div>
                <div class="col cw150 py-2 text-center etitem border  bg-light etinactive editable  editcheck"><input class="form-check-input boxintercompany " type="checkbox" ${check_intercompany} id="flexCheckDefault"></div>
                <div class="col cw200 py-2 text-center etitem border  bg-light etinactive editable  editselect "> <select class="form-select selectcompfamily boxfamily" aria-label="Default select example"><option selected>${obj.family}</option></select></div>
                <div class="col cw200 py-2 text-center etitem border  bg-light etinactive editable editselect "> <select class="form-select selectstandard boxstandard"  aria-label="Default select example"><option selected>${standardplaceholder}</option></select></div>
                
                <div class="col cw150 py-2 text-center etitem border  bg-light etinactive triggerrowcontrol editable  editcheck"><input class="form-check-input boxpackaging" type="checkbox" ${check_packaging} id="flexCheckDefault"></div>
                <div class="col cw150 py-2 text-center etitem border  bg-light etinactive triggerrowcontrol editable  editcheck"><input class="form-check-input boxcontact" type="checkbox" ${check_contact} id="flexCheckDefault"></div>
                <div class="col cw150 py-2 text-center etitem border  bg-light etinactive triggerrowcontrol editable  editcheck"><input class="form-check-input boxcalifornia" type="checkbox" ${check_california} id="flexCheckDefault"></div>
                    
                <div class="col cw150 py-2 text-center etitem border  bg-light etinactive ">
                    <i class="fa fa-trash-o deletebutton actionbutton"  onclick="deleteItem(${obj.id})" aria-hidden="true"></i> Delete
                    
                </div>                
            </div>
            `;
        }
                   
         updateView();
        const allchecks=document.querySelectorAll(".editcheck.editable input");
        const allselects=document.querySelectorAll(".editselect.editable select");
        
        allchecks.forEach(check=>{ check.addEventListener("change",()=>editFather(check))});
        allselects.forEach(select=>{ select.addEventListener("change",()=>editFather(select))});
        document.querySelectorAll(".selectcompfamily").forEach(select=>{
            let current_value=select.value;
            select.innerHTML=`
                <option value="ADJUVANTS" selected>Adjuvants</option>
                <option value="BAGS" selected>Bags</option>
                <option value="CAPS">Caps</option>
                <option value="CARTONS" selected>Boxes</option>
                <option value="CHAMBERS" selected>Drip Chambers</option>
                <option value="CLAMPS" selected>Clamps</option>
                <option value="CONNECTORS" selected>Connectors</option>
                <option value="CONICALCONNECTORS" selected>Conical Connectors</option>
                <option value="COVERS" selected>Covers</option>
                <option value="ELECTRODES" selected>Electrodes & Accessories</option>
                <option value="FILTERS" selected>Filters</option>
                <option value="FILMS" selected>Films</option>
                <option value="HOTSTAMPING" selected>Hot stamping</option>
                <option value="IFU" selected>IFU-Instructions for use</option>
                <option value="INJECTIONPOINTS" selected>Injection Points</option>
                <option value="LABELS" selected>Labels</option>
                <option value="MATERIALS" selected>Raw materials</option>
                <option value="POUCHES" selected>Pouches</option>
                <option value="SFTUBES" selected>Semifinished tubes</option>
                <option value="SFVARIOUS" selected>Various semifinished goods</option>
                <option value="SPIKES" selected>Spikes</option>
                <option value="TRANSDUCERS" selected>Transducers</option>
                <option value="TUBES" selected>Tubes</option>
                <option value="VARIOUS" selected>Various components</option>
            `;
            select.value=current_value;
        });
        document.querySelectorAll(".selectstandard").forEach(select=>{
            let current_value=select.value;
            select.innerHTML=`
            <option value="LUERLOCK">Luer</option>
              <option value="ENFIT">ENFIT</option>
              <option value="TPNLOCK">TPN Lock</option>
              <option value="NULL">N/A</option>
            `;
            select.value=current_value;
        });
        
      })
 
}

//FUNCTION TO DELETE ONE USER
function deleteItem(id){
     
    createCustomAlert('Attention','ARE YOU SURE YOU WANT TO DELETE THIS COMPONENT PERMANENTLY?', 'yesno')
    .then((result) => {
             if(!result) return;
             else{
                axios.delete(`/querycomp/delete/${id}`,{ headers: { 'Authorization': authenticationheader()}})
                .then((response) => {
                    visualizeComponents();
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                    createCustomAlert('Error','Something went wrong trying to delete this user', 'ok');
                    
                });
             } 
            });
    

       
}

//FUNCTION TO SAVE THE DATA OF ALL MODIFIED USERS
function saveComponentsModifications(){
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
                        const article = parentRow.querySelector('.boxarticle').innerHTML;
                        const description = parentRow.querySelector('.boxdescription').innerHTML;
                        const intercompany = parentRow.querySelector('.boxintercompany').checked;
                        const family = parentRow.querySelector('.boxfamily').value;
                        const packaging= parentRow.querySelector('.boxpackaging').checked;
                        const california = parentRow.querySelector('.boxcalifornia').checked;
                        const contact = parentRow.querySelector('.boxcontact').checked;      
                        const cone = parentRow.querySelector(".boxstandard").value;   
            
                        // if(!id || !email || !password || !street || !number || !city || !province || !birthdate || !first || !second) return;
                        const comp_correct = { 
                                                article: article,
                                                description: description,
                                                intercompany: intercompany,
                                                packaging: packaging,
                                                contact: contact,
                                                ca65: california,
                                                family: family  ,
                                                standard: cone
                                            };
                        
                        axios.put(`/querycomp/updatecomponent/${id}`, comp_correct,{ headers: { 'Authorization': authenticationheader()}}) ;
                        if (processed_items==modified_items.length)  setTimeout(()=>{visualizeComponents()},250);         
                        
                    }
                });               
             }  
            });




    
}

visualizeComponents();




