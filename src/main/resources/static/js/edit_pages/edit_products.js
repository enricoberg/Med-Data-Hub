//FUNCTION THAT LOADS ALL THE PRODUCTS FROM THE DATABASE AND DRAWS THE TABLE WITH THE RETRIEVED DATA (RUNS AT PAGE LOAD)
function visualizeProducts(){    
    const storedComponents = JSON.parse(localStorage.getItem("products_to_edit"));
    let url="/queryprod/bylistofcodes?search";
    storedComponents.forEach((element)=>{url+=`&articles=${element}`;});
    
    const target_table=document.querySelector("#targettable");
    target_table.innerHTML=`<div class="row">                    
    <div class="col cw100 text-center etheader border ">
        <h3>ID</h3>
    </div> 
    <div class="col cw150  text-center etheader border   ">
        <h3>Article code</h3>
    </div>
    <div class="col cw350  text-center etheader border ">
        <h3>Description</h3>
    </div>
    <div class="col cw150  text-center etheader border ">
        <h3>SAP Status</h3>
    </div>
    <div class="col cw200  text-center etheader border ">
        <h3>Family</h3>
    </div>
    <div class="col cw150 text-center etheader border ">
        <h3>Intercompany</h3>
    </div>
    <div class="col cw150 text-center etheader border ">
        <h3>Semifinished</h3>
    </div>
    <div class="col cw150 text-center etheader border ">
        <h3>DHF</h3>
    </div>
    <div class="col cw150 text-center etheader border ">
        <h3>RMF</h3>
    </div>
    <div class="col cw150 text-center etheader border ">
        <h3>BUDI</h3>
    </div>
    <div class="col cw150  text-center etheader border ">
        <h3>Ster. method</h3>
    </div>
    <div class="col cw150 text-center etheader border ">
        <h3>Ster. site</h3>
    </div> 
    <div class="col cw150 text-center etheader border ">
        <h3>Shelf life</h3>
    </div> 
    <div class="col cw150 text-center etheader border ">
        <h3>Supplier</h3>
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
            const check_semifinished= obj.semifinished? "checked" : "";             
            const stericycleplaceholder= obj.sterilizationcycle==null ? "NULL" : obj.sterilizationcycle;
            const sterisiteplaceholder= obj.sterilizationsite==null ? "NULL" : obj.sterilizationsite;
            const sapplaceholder= obj.sapstatus==null ? "NULL" : obj.sapstatus;
            const dhf=  obj.dhf==null ? "NULL" : obj.dhf;
            const rmf=  obj.rmf==null ? "NULL" : obj.rmf;
            const budi=  obj.budi==null ? "NULL" : obj.budi;
            const shelflife=  obj.shelflife==null ? "NULL" : obj.shelflife;
            const supplierplaceholder= obj.supplierid==null? "NULL" : obj.supplierid;
            target_table.innerHTML+=`
            <div class="row" style="position: relative;">                    
                <div class="col cw100 text-center etitem border etinactive editable boxid">${obj.id}</div> 
                <div class="col cw150  text-center etitem border etinactive editable boxarticle">${obj.code}</div>
                <div class="col cw350  text-center etitem border etinactive editable boxdescription">${obj.description}</div>
                <div class="col cw150  text-center etitem border etinactive editable editselect"><select class="form-select  boxsap" aria-label="Default select example"><option selected>${sapplaceholder}</option></select></div>
                <div class="col cw200  text-center etitem border etinactive editable editselect"><select class="form-select boxfamily" aria-label="Default select example"><option selected>${obj.family}</option></select></div>
                <div class="col cw150 text-center etitem border etinactive editable editcheck"><input class="form-check-input boxintercompany " type="checkbox" ${check_intercompany}></div>
                <div class="col cw150 text-center etitem border etinactive editable editcheck"><input class="form-check-input boxsemifinished " type="checkbox" ${check_semifinished}></div>
                <div class="col cw150 text-center etitem border etinactive editable boxdhf">${dhf}</div>
                <div class="col cw150 text-center etitem border etinactive editable boxrmf">${rmf}</div>
                <div class="col cw150 text-center etitem border etinactive editable boxbudi">${budi}</div>
                <div class="col cw150  text-center etitem border etinactive editable editselect"><select class="form-select  boxstericycle" aria-label="Default select example"><option selected>${stericycleplaceholder}</option></select></div>
                <div class="col cw150 text-center etitem border etinactive editable editselect"><select class="form-select  boxsterisite" aria-label="Default select example"><option selected>${sterisiteplaceholder}</option></select></div> 
                <div class="col cw150 text-center etitem border etinactive editable boxshelflife">${shelflife}</div>   
                <div class="col cw150 text-center etitem border etinactive editable editselect"><select class="form-select  boxsupplier" aria-label="Default select example"><option value="${supplierplaceholder}" selected></option></select></div>   
                <div class="col cw150 py-2 text-center etitem border  bg-light etinactive ">
                    <i class="fa fa-trash-o deletebutton actionbutton"  onclick="deleteProduct(${obj.id})" aria-hidden="true"></i> Delete
                    
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
            <option value="AV" selected>A/V SYSTEMS</option>
                                    <option value="AV" selected>A/V SYSTEMS</option>
                                    <option value="BAGS" >TPN BAGS & ACCESSORIES</option>
                                    <option value="EC" >EMPTY CONTAINERS</option>
                                    <option value="AA" >ACUTE & APHERESIS</option>
                                    <option value="ENT" >ENTERAL NUTRITION & ACCESSORIES</option>
                                    <option value="OEM" >OEM</option>
                                    <option value="IU" >IRRIGATION / UROLOGY</option>                                  
                                    <option value="CATH" >CATHETERS & ACCESSORIES</option>                                  
                                    <option value="WM" >WOUND-OSTOMY MANAGEMENT</option>
                                    <option value="CONC" >CONCENTRATES</option>
                                    <option value="ASS" >ASSEMBLIES</option>                                                                     
            `;
            select.value=current_value;
        });
        // INSERT SUPPLIER SELECT OPTIONS HERE
        fetch('/aux/getsuppliers',{
            method: 'GET',            
            headers: {'Authorization': authenticationheader() }})
        .then(response => {            
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }            
            return response.json();
        })
        .then(data => {    
            sup_options="";        
            data.forEach(element => {                
                sup_options+=`<option value="${element.id}" >${element.supplier_name}</option>`;                   
            });
            document.querySelectorAll(".boxsupplier").forEach(select=>{
                let current_value=select.value;
                if (current_value==undefined) current_value="NULL"
                select.innerHTML=sup_options;
                select.innerHTML+=`<option value="NULL">NULL</option>`;
                select.value=current_value;
                
            });


        })
        .catch(error => {            
            console.error('Error during fetch:', error);
        });
        
        document.querySelectorAll(".boxsap").forEach(select=>{
            let current_value=select.value;
            select.innerHTML=`            
            <option value="M1V1" >M1/V1</option>
            <option value="M2V1" >M2/V1</option>
            <option value="M2V2" >M2/V2</option>
            <option value="M2V4" >M2/V4</option>
            <option value="M3V3" >M3/V3</option>
            <option value="M4V4" >M4/V4</option>                                   
            `;
            select.value=current_value;
        });
        document.querySelectorAll(".boxsterisite").forEach(select=>{
            let current_value=select.value;
            select.innerHTML=`
            <option value="BAI" >B.Braun Avitum Italy</option>
            <option value="Sterilverona" >Sterilverona</option>
            <option value="Sterilveronanogara" >Sterilverona Nogara</option>
            <option value="Melsungen" >B.Braun Melsungen</option>
            <option value="Sterisastkomenda" >Sterisast Komenda</option>
            <option value="Sterisastwestport" >Sterisast Westport</option>
            <option value="Sterisastseriate" >Sterisast Seriate</option>
            <option value="Synergyhealth" >Synergy Health</option>
            <option value="NULL">N/A</option>
            `;
            select.value=current_value;
        });
        document.querySelectorAll(".boxstericycle").forEach(select=>{
            let current_value=select.value;
            select.innerHTML=`
            <option value="ETO21" selected>ETO - cycle 21</option>                                    
            <option value="ETO22" >ETO - cycle 22</option>                                    
            <option value="GAMMA" >Raggi Gamma</option>
            <option value="BETA" >Raggi Beta</option>
            <option value="BULK" >Bulk / Non sterile</option>
            <option value="NA" >Not applicable</option>
            `;
            select.value=current_value;
        });
        
      })
 
}

//FUNCTION TO DELETE ONE PRODUCT
function deleteProduct(id){
    
    createCustomAlert('Attention','ARE YOU SURE YOU WANT TO DELETE THIS PRODUCT PERMANENTLY?', 'yesno')
    .then((result) => {
             if(!result) return;
             else{
                axios.delete(`/queryprod/delete/${id}`,{ headers: { 'Authorization': authenticationheader()}})
                .then((response) => {
                    visualizeProducts();
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                    createCustomAlert('Error','Something went wrong trying to delete this user', 'ok');
                    
                });    
             } 
            });

}

//FUNCTION TO SAVE THE DATA OF ALL MODIFIED USERS
function saveProductsModifications(){
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
                        const semifinished = parentRow.querySelector('.boxsemifinished').checked;
                        const family = parentRow.querySelector('.boxfamily').value;
                        const sapstatus = parentRow.querySelector(".boxsap").value;
                        const dhf = parentRow.querySelector('.boxdhf').innerHTML;
                        const rmf = parentRow.querySelector('.boxrmf').innerHTML;
                        const budi = parentRow.querySelector('.boxbudi').innerHTML;
                        const shelflife = parentRow.querySelector('.boxshelflife').innerHTML;
                        const stericycle = parentRow.querySelector(".boxstericycle").value;
                        const sterisite = parentRow.querySelector(".boxsterisite").value;
                        const supplierid = parentRow.querySelector(".boxsupplier").value;
                          
            
                        const prod_correct = { 
                                                article: article,
                                                description: description,
                                                sapstatus: sapstatus,
                                                intercompany: intercompany,
                                                semifinished: semifinished,
                                                family: family  ,
                                                dhf: dhf,
                                                rmf: rmf,
                                                budi: budi,
                                                sterisite: sterisite,
                                                stericycle: stericycle,
                                                shelflife: shelflife,
                                                supplierid: supplierid
                                            };
                        
                        axios.put(`/queryprod/updatecomponent/${id}`, prod_correct,{ headers: { 'Authorization': authenticationheader()}}) ;
                        if (processed_items==modified_items.length)  setTimeout(()=>{visualizeProducts()},250);         
                        
                    }
                });
             }
     
            });





    
}

visualizeProducts();




