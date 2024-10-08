
//FUNCTION THAT LOADS ALL THE COMPONENTS FROM THE DATABASE AND DRAWS THE TABLE WITH THE RETRIEVED DATA (RUNS AT PAGE LOAD)
function visualizeBoms(product){  
    resetPage();
    bufferTimeoutStart();
    localStorage.setItem("bom_to_edit",product);
    
    const newDash = document.createElement("div");
    document.body.insertBefore(newDash, document.body.firstChild);
    newDash.classList.add("containertable");
    newDash.classList.add("offsetvertical");
    newDash.innerHTML=`
    <img src="https://i.postimg.cc/DwP8n2Bn/copy.png" alt="" class="pastebutton invisible" onclick="dumpBoms()">
        <img src="https://i.postimg.cc/8kh4z23y/add-button-1.png" alt="" class="addbutton" onclick="addNewBomLine()">
        <img src="https://i.postimg.cc/dVsMMKqW/diskette.png" alt="" class="savebutton" style="display: none;" onclick="saveBomsModifications()">
        <div class="row mx-2" >
            <div style="width: 100%; text-align: center;" class="titleh1"><h1 style="font-family: 'Roboto', sans-serif;">Bill of Materials</h1></div>            
            <div class=" mx-auto" id="targettable">              
            </div>
        </div>
    `;
    
    let url=`/queryboms/?article=${product}`;    
    axios.get(`/queryprod/byidint?article=${product}`,{ headers: { 'Authorization': authenticationheader()}})
      .then(function (response) {         
        document.querySelector("h1").innerHTML=`${response.data.code} - Bill of Materials - <a href="#" onclick="renderproducts();">BACK TO PRODUCTS</a>` ; 
     })

    
    const target_table=document.querySelector("#targettable");
    target_table.innerHTML=`<div class="row headerrow">                    
    
    <div class="col cw350  text-center etheader border   ">
        <h3>Part code</h3>
    </div>
    <div class="col cw500  text-center etheader border ">
        <h3>Description</h3>
    </div>
    <div class="col cw150  text-center etheader border ">
        <h3>Assembly</h3>
    </div>
    <div class="col cw250  text-center etheader border ">
        <h3>Quantity</h3>
    </div>
    <div class="col cw200  text-center etheader border ">
        <h3>Unit of measure</h3>
    </div>        
    <div class="col cw250 text-center etheader border  ">
        <h3>Action</h3>
    </div>  
    
</div>



`;    
    
    axios.get(url,{ headers: { 'Authorization': authenticationheader()}})
      .then(function (response) {        
        for (const obj of response.data) {
            
            const check_assembly= obj.assembly? "checked" : "";
            target_table.innerHTML+=`
            <div class="row bomrow" style="position: relative;">                    
                <div class="col cw350 py-2 text-center etitem  border  bg-light etinactive bomid="${obj.id}"  boxarticle">${obj.comp_id}</div>
                <div class="col cw500 py-2 text-center etitem border  bg-light etinactive   boxdescription">${obj.comp_description}</div>
                <div class="col cw150 py-2 text-center etitem border  bg-light etinactive editable  editcheck" ><input disabled class="form-check-input boxassembly " type="checkbox" ${check_assembly} id="flexCheckDefault"></div>
                <div class="col cw250 py-2 text-center etitem border  bg-light etinactive  boxqty ">${obj.qty}</div>
                <div class="col cw200 py-2 text-center etitem border  bg-light etinactive   boxum">${obj.um}</div>
                
                <div class="col cw250 py-2 text-center etitem border  bg-light etinactive ">
                    <i class="fa fa-trash-o deletebutton actionbutton"  onclick="deleteBom('${obj.comp_id}',${product},${obj.assembly},${obj.id})" aria-hidden="true"></i> Delete
                    
                </div>                
            </div>
            `;
        }
                   
         updateView();
        const allchecks=document.querySelectorAll(".editcheck.editable input");
        const allselects=document.querySelectorAll(".editselect.editable select");
        
        allchecks.forEach(check=>{ check.addEventListener("change",()=>editFather(check))});
        allselects.forEach(select=>{ select.addEventListener("change",()=>editFather(select))});
        
        
      }).then(()=>bufferTimeoutStop());
 
}

//FUNCTION TO DELETE ONE USER
function deleteBom(comp_id,prod_id, assembly,id){
    createCustomAlert('Attention','Are you sure you want to delete this record permanently?', 'yesno')
    .then((result) => { 
            if(!result) return;
            else{
                axios.get(`/queryboms/deletebom?compid=${comp_id}&prodid=${prod_id}&assembly=${assembly}&id=${id}`,{ headers: { 'Authorization': authenticationheader()}})
                .then((response) => {
                    visualizeBoms(localStorage.getItem("bom_to_edit"));
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                    createCustomAlert('Error','Something went wrong trying to delete this element', 'ok');
                    
                }); 
            }
        });
    
     
          
}

//FUNCTION TO SAVE THE DATA OF ALL MODIFIED USERS
function saveBomsModifications(){
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
                const id= JSON.parse(localStorage.getItem("bom_to_edit"));
                modified_items.forEach(function(button){
                    processed_items++;
                    const parentRow = button.closest('.row');
                    if (parentRow) {
                        
                        const article = parentRow.querySelector('.boxarticle').innerHTML;
                        const description = parentRow.querySelector('.boxdescription').innerHTML;
                        const assembly = parentRow.querySelector('.boxassembly').checked;
                        let qty=parentRow.querySelector('.boxqty').innerHTML;
                        const um = parentRow.querySelector('.boxum').innerHTML;
                        qty=qty.replace(/,/g, '.');   
                        
                        const bom_correct = { 
                                                article: article,
                                                description: description,
                                                assembly: assembly,
                                                qty: qty,
                                                um: um
                                            };
                        
                        axios.put(`/queryboms/update/${id}`, bom_correct,{ headers: { 'Authorization': authenticationheader()}}) ;
                        if (processed_items==modified_items.length)  setTimeout(()=>{visualizeBoms(localStorage.getItem("bom_to_edit"))},350);         
                        
                    }
                });
            }  
        });






    
}

function addNewBomLine(){
    const target_table=document.querySelector("#targettable");
    const additems=document.querySelectorAll(".additem");
    if (additems.length!=0) return;
    target_table.innerHTML+=`
    <div class="row bomrow" style="position: relative;">                    
        <div class="etitem col cw350  additem boxarticle"><input class="codeinput" type="text" class="w-100 text-start" value="" style="z-index: 2000;"></div>
        <div class="etitem col cw500  additem  boxdescription">Description</div>
        <div class="etitem col cw150  additem editable  editcheck" ><input class="checkinput" class="form-check-input boxassembly " type="checkbox"  id="flexCheckDefault" style="z-index: 2000;"></div>
        <div class="etitem col cw250  additem editable boxqty "><input class="qtyinput"type="text" class="w-100 text-start" value="" style="z-index: 2000;"></div>
        <div class="etitem col cw200  additem editable  boxum"><input class="uminput" type="text" class="w-100 text-start" value="" style="z-index: 2000;"></div>
        
        <div class="etitem col cw250 py-2 text-center etitem border  bg-light etinactive" >
            <i class="fa fa-floppy-o  actionbutton floppybutton "  onclick="SaveBomItem(this)" aria-hidden="true"></i> Save
            
        </div>                
    </div>
    `;
    
}

function SaveBomItem(element){
    const productid= JSON.parse(localStorage.getItem("bom_to_edit"));
    const parentRow = element.closest('.row');
    const code = parentRow.querySelector(".codeinput").value;
    const assembly = parentRow.querySelector(".checkinput").checked;
    const qty = parentRow.querySelector(".qtyinput").value.replace(/,/g, '.');   
    const um= parentRow.querySelector(".uminput").value;
    if(code=="" || qty=="" || um=="" ) {alert("Fill mandatory fields first");
        return;
    }
    if(um!="CM" && um!="KG" && um!="C" && um!="M2" && um!="PAC" && um!="PZ" && um!="L" && um!="M")  {alert("Invalid unit of measure");
        return;
    }
    if(Number(qty) != qty ) {
        createCustomAlert('Error','Invalid quantity', 'ok');
        
        return;
    }

createCustomAlert('Attention','Are you sure you want to add this item to the bom?', 'yesno')
.then((result) => { 
        if(!result) return;
        else{
            if(!assembly){
                axios.get(`/querycomp/byname?id=${code}`,{ headers: { 'Authorization': authenticationheader()}})
                .then((response) => {
                    
                    if(response.data.length==0) {     
                        createCustomAlert('Warning','The component does not exist and must be created first', 'ok');      
                        
                        return;
                    }
                    const compid=response.data.id;
                    const bom_data=[{
                        compid: compid,
                        prodid: productid,
                        assembly: assembly,
                        qty: qty,
                        um: um
                    }]
            
                    axios.post(`/queryboms/new`, bom_data, { headers: { 'Authorization': authenticationheader()}})
                    .then((response) => {    setTimeout(()=>{visualizeBoms(localStorage.getItem("bom_to_edit"))},150);})
                    .catch((error) => {createCustomAlert('Error','Something went wrong trying to add item', 'ok'); }); 
            
            
            
            
            
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);        
                }); 
            }
            else{
                axios.get(`/queryprod/byid?article=${code}`,{ headers: { 'Authorization': authenticationheader()}})
                .then((response) => {
                    
                    if(response.data==null) {
                        createCustomAlert('Warning','The component does not exist and must be created first', 'ok');                        
                        return;
                    }
                    const compid=response.data;
                    const bom_data=[{
                        compid: compid,
                        prodid: productid,
                        assembly: assembly,
                        qty: qty,
                        um: um
                    }]
                    
                    axios.post(`/queryboms/new`, bom_data, { headers: { 'Authorization': authenticationheader()}})
                    .then((response) => {    setTimeout(()=>{visualizeBoms(localStorage.getItem("bom_to_edit"))},150);})
                    .catch((error) => {createCustomAlert('Error','Something went wrong trying to add item', 'ok'); }); 
            
            
            
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);        
                }); 
            
            }
        } 
    });


}

async function dumpBoms(){
    const clipboardtext = await navigator.clipboard.readText();
    createCustomAlert('Attention','This procedure allows you to dump content copied to the clipboard inside the BOM.<br> Have you copied the right table and do you wish to proceed?<br>The table must be in format:<br>Component code\t|\tProduct code\t|\tQuantity\t|\tUnit of Measure', 'yesno')
    .then((result) => { 
            if(!result) return;
            else{
                
                const rows = clipboardtext.split('\n');
                const bom_data = [];               
                
                for (const row of rows) {
                  
                  const columns = row.split('\t');
                  console.log("columns: "+columns.length)
                  if(row=="") continue;
                  if (columns.length === 4) {
                    qty=columns[2].replace(",", ".");
                    qty=parseFloat(qty);
                    um=columns[3];
                    um=um.replace("\r", '');
                    const object = {
                      component: columns[0],
                      product: columns[1],
                      qty: qty,
                      um: um
                    };
                    bom_data.push(object);
                  }
                  else {
                    createCustomAlert('Error','Invalid input format', 'ok');
                    return;
                }
                }
              
                
                
                axios.post(`/queryboms/pastefromclipboard`, bom_data, { headers: { 'Authorization': authenticationheader()}})
                .then((response) => {   console.log(response.data);})
                .catch((error) => {createCustomAlert('Error','Something went wrong trying to add item', 'ok'); }); 
              }
              
              











                    





                



            
        });
    
}






