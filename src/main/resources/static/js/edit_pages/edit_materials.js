//PREVENT BACK BUTTONS TO REDIRECT TO THIS PAGE
window.history.forward();
        function noBack() {
            window.history.forward();
        }


//FUNCTION THAT LOADS ALL THE COMPONENTS FROM THE DATABASE AND DRAWS THE TABLE WITH THE RETRIEVED DATA (RUNS AT PAGE LOAD)
function visualizeMaterials(){    
    const storedComponents = JSON.parse(localStorage.getItem("materials_to_edit"));
    let url="/querymat/bylistofcodes?search";
    storedComponents.forEach((element)=>{url+=`&articles=${element}`;});
    
    const target_table=document.querySelector("#targettable");
    target_table.innerHTML=`<div class="row">                    
    <div class="col cw100 text-center etheader border ">
        <h3>ID</h3>
    </div> 
    <div class="col cw350  text-center etheader border   ">
        <h3>Brand Name</h3>
    </div>
    <div class="col cw250  text-center etheader border ">
        <h3>Supplier</h3>
    </div>
    <div class="col cw250  text-center etheader border ">
        <h3>Mat. Type</h3>
    </div>
    <div class="col cw250  text-center etheader border ">
        <h3>Plasticizer</h3>
    </div>
    <div class="col cw250 text-center etheader border ">
        <h3>Notes</h3>
    </div>
     
    <div class="col cw200 text-center etheader border  ">
        <h3>Action</h3>
    </div>  
    
</div>



`;    
    
    axios.get(url,{ headers: { 'Authorization': authenticationheader()}})
      .then(function (response) {        
        for (const obj of response.data) {
            // const check_intercompany= obj.intercompany? "checked" : "";
            
            // const check_packaging= obj.packagingmaterial? "checked" : "";
            // const check_contact= obj.contact? "checked" : "";
            // const check_california= obj.ca65? "checked" : "";
            const plastiplaceholder= obj.plasticizer==null ? "NULL" : obj.plasticizer;
            const notesplaceholder= obj.notes==null || obj.notes=="" ? "NULL" : obj.notes;
            target_table.innerHTML+=`
            <div class="row" style="position: relative;">                    
                <div class="col cw100 py-2 text-center etitem  border  bg-light etinactive boxid ">${obj.id}</div>
                <div class="col cw350 py-2 text-center etitem border  bg-light etinactive editable boxarticle ">${obj.brandname}</div>
                <div class="col cw250 py-2 text-center etitem border  bg-light etinactive editable boxsupplier ">${obj.supplier}</div>
                <div class="col cw250 py-2 text-center etitem border  bg-light etinactive editable  editselect "><select class="form-select  boxfamily" aria-label="Default select example"><option selected>${obj.family}</option></select></div>
                <div class="col cw250 py-2 text-center etitem border  bg-light etinactive editable  boxplasticizer">${plastiplaceholder}</div>
                <div class="col cw250 py-2 text-center etitem border  bg-light etinactive editable boxnotes">${notesplaceholder}</div>
                
                <div class="col cw200 py-2 text-center etitem border  bg-light etinactive ">
                    <i class="fa fa-trash-o deletebutton actionbutton"  onclick="deleteMaterial(${obj.id})" aria-hidden="true"></i> Delete
                    
                </div>                
            </div>
            `;
        }
                   
         updateView();
        const allchecks=document.querySelectorAll(".editcheck.editable input");
        const allselects=document.querySelectorAll(".editselect.editable select");
        
        allchecks.forEach(check=>{ check.addEventListener("change",()=>editFather(check))});
        allselects.forEach(select=>{ select.addEventListener("change",()=>editFather(select))});
        document.querySelectorAll(".boxfamily").forEach(select=>{
            let current_value=select.value;
            select.innerHTML=`
                        
                        <option value="ABS">ABS</option>
                        <option value="ADDITIVE">Additives</option>
                        <option value="ADHESIVEPAPER">Adhesive Paper</option>
                        <option value="ADHESIVETAPE">Adhesive Tape</option>
                        <option value="ADHESIVE">Adhesives</option>
                        <option value="ALUMINUM">Aluminium</option>
                        <option value="BRASS">Brass</option>
                        <option value="CARTONBOX">Cartonbox</option>
                        <option value="CIIR">CIIR (Chlorobutyl)</option>
                        <option value="COLORANT">Colorants</option>                        
                        <option value="COP">COP</option>
                        <option value="EVA">EVA</option>
                        <option value="HDPE">HDPE</option>
                        <option value="HIPS">HIPS</option>
                        <option value="INK">Inks</option>
                        <option value="IR">IR</option>
                        <option value="LDPE">LDPE</option>
                        <option value="MABS">MABS</option>
                        <option value="MEDICALPAPER">Medical Paper</option>
                        <option value="MULTIMATERIAL">Multimaterial</option>        
                        <option value="NITINOL">Nitinol</option>
                        <option value="PA">PA</option>
                        <option value="PAPE">PA/PE</option>
                        <option value="PAPER">Paper</option>
                        <option value="PC">PC</option>
                        <option value="PCABS">PC/ABS</option>
                        <option value="PE">PE</option>
                        <option value="PEEVA">PE/EVA</option>
                        <option value="PES">PES</option>
                        <option value="PET">PET</option>
                        <option value="PETPE">PET/PE</option>
                        <option value="PETPP">PET/PP</option>
                        <option value="PMMA">PMMA</option>
                        <option value="PO">PO</option>
                        <option value="POM">POM</option>
                        <option value="PP">PP</option>
                        <option value="PPPE">PP/PE</option>
                        <option value="PPC">PPC</option>
                        <option value="PPE">PPE</option>
                        <option value="PPH">PPH</option>
                        <option value="PS">PS</option>
                        <option value="PSU">PSU</option>
                        <option value="PTFE">PTFE</option>
                        <option value="PUR">PUR</option>
                        <option value="PVC">PVC</option>
                        <option value="PVP">PVP</option>
                        <option value="SAN">SAN</option>
                        <option value="SBC">SBC</option>
                        <option value="SEBS">SEBS</option>
                        <option value="SI">Silicone</option>
                        <option value="SOLVENT">Solvents</option>
                        <option value="SST">SST</option>
                        <option value="SUBSTANCES">Substances</option>
                        <option value="SULFATE">Sulfates</option>
                        <option value="TPE">TPE</option>
                        <option value="TPU">TPU</option>
                        <option value="TUNGSTEN>Tungsten</option>
                        <option value="UNKNOWN">N/A - Not applicable</option>
            `;
            select.value=current_value;
        });        
        
      })
 
}

//FUNCTION TO DELETE ONE USER
function deleteMaterial(id){
        
    createCustomAlert('Attention','ARE YOU SURE YOU WANT TO DELETE THIS MATERIAL PERMANENTLY?', 'yesno')
    .then((result) => {
             if(!result) return;
             else{
                axios.delete(`/querymat/delete/${id}`,{ headers: { 'Authorization': authenticationheader()}})
                .then((response) => {
                    visualizeMaterials();
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                    createCustomAlert('Error','Something went wrong trying to delete this user', 'ok');
                    
                });  
             }
            });
    




     
}

//FUNCTION TO SAVE THE DATA OF ALL MODIFIED USERS
function saveMaterialsModifications(){
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
                        const brandname = parentRow.querySelector('.boxarticle').innerHTML;
                        const plasticizer= parentRow.querySelector('.boxplasticizer').innerHTML;            
                        const family = parentRow.querySelector('.boxfamily').value;
                        const supplier= parentRow.querySelector('.boxsupplier').innerHTML;
                        const notes = parentRow.querySelector('.boxnotes').innerHTML;
                        
            
                        
                        const mat_correct = { 
                                                plasticizer: plasticizer,
                                                brandname: brandname,
                                                family: family  ,
                                                supplier: supplier,
                                                notes: notes
                                            };
                        
                        axios.put(`/querymat/updatematerial/${id}`, mat_correct,{ headers: { 'Authorization': authenticationheader()}}) ;
                        if (processed_items==modified_items.length)  setTimeout(()=>{visualizeMaterials()},250);         
                        
                    }
                });
             }
            });





    
}

visualizeMaterials();




