//FUNCTION THAT LOADS ALL THE COMPONENTS FROM THE DATABASE AND DRAWS THE TABLE WITH THE RETRIEVED DATA (RUNS AT PAGE LOAD)
function visualizeConfigurations(){   
    
    const component= JSON.parse(localStorage.getItem("config_to_edit"));     
    axios.get(`/querycomp/byid?article=${component}`,{ headers: { 'Authorization': authenticationheader()}})
      .then(function (response) {    
        let article= response.data.comp_id;    
        document.querySelector("h1").innerHTML=`${article} - Configurations Table` ; 
        const target_table=document.querySelector("#targettable");
        target_table.innerHTML=`<div class="row">                    
        
        <div class="col cw150  text-center etheader border   ">
            <h3>ID</h3>
        </div>
        <div class="col cw400  text-center etheader border ">
            <h3>Supplier</h3>
        </div>
        <div class="col cw400  text-center etheader border ">
            <h3>Supplier Code</h3>
        </div>
        <div class="col cw400  text-center etheader border ">
            <h3>Core Material</h3>
        </div>          
        <div class="col cw250 text-center etheader border  ">
            <h3>Action</h3>
        </div>          
        </div>
        `;  
        let url=`/queryconfigs/?article=${article}`;   
        axios.get(url,{ headers: { 'Authorization': authenticationheader()}})
        .then(function (response) {        
          for (const obj of response.data) {
              const check_assembly= obj.assembly? "checked" : "";
              target_table.innerHTML+=`
              <div class="row" style="position: relative;">                    
                  <div class="col cw150 py-2 text-center etitem  border  bg-light etinactive boxid">${obj.id}</div>
                  <div class="col cw400 py-2 text-center etitem border  bg-light etinactive  editable editselect "><select disabled class="form-select  boxsupplier" aria-label="Default select example"><option selected>${obj.supplier}</option></select></div>
                  <div class="col cw400 py-2 text-center etitem border  bg-light etinactive  boxsupcode " >${obj.suppliercode}</div>
                  <div class="col cw400 py-2 text-center etitem border  bg-light etinactive editable  editselect"><select disabled class="form-select  boxmaterial" aria-label="Default select example"><option selected>${obj.brandname}</option></select></div>                  
                  
                  <div class="col cw250 py-2 text-center etitem border  bg-light etinactive ">
                      <i class="fa fa-trash-o deletebutton actionbutton"  onclick="deleteConfig(this)" aria-hidden="true"></i> Delete
                      
                  </div>                
              </div>
              `;
          }
                     
           updateView();
          const allchecks=document.querySelectorAll(".editcheck.editable input");
          const allselects=document.querySelectorAll(".editselect.editable select");
          
          allchecks.forEach(check=>{ check.addEventListener("change",()=>editFather(check))});
          allselects.forEach(select=>{ select.addEventListener("change",()=>editFather(select))});

          //POPULATE THE MATERIAL SELECT
          
          document.querySelectorAll(".boxmaterial").forEach(select=>{
            let current_value=select.querySelector("option").innerHTML;
            select.innerHTML="";
            axios.get('/querymat/',{ headers: { 'Authorization': authenticationheader()}})
            .then((response)=>{
                response.data.forEach(function(materialobj){
                    select.innerHTML+=`
                    <option value="${materialobj.id}" >${materialobj.brandname}</option>            
                    `;
                })
                const options = select.options;
                for (const option of options) {
                    if (option.innerHTML === current_value) {
                        option.selected = true;
                        select.setAttribute('actualvalue', option.innerHTML);
                        break;
                    }
                }
                
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
                createCustomAlert('Error','Something went wrong retrieving materials', 'ok');
            });  
            
            
        });
        //POPULATE THE SUPPLIER SELECT
        
        document.querySelectorAll(".boxsupplier").forEach(select=>{
            let current_supplier=select.querySelector("option").innerHTML;
            select.innerHTML="";            
            axios.get('/querysup/',{ headers: { 'Authorization': authenticationheader()}})
            .then((response)=>{
                response.data.forEach(function(supobj){
                    select.innerHTML+=`
                    <option value="${supobj.id}" >${supobj.supplier_name}</option>            
                    `;
                })
                const options = select.options;
                for (const option of options) {
                    if (option.innerHTML === current_supplier) {
                        option.selected = true;
                        select.setAttribute('actualvalue', option.innerHTML);
                        break;
                    }
                }
                
                
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
                createCustomAlert('Error','Something went wrong retrieving suppliers', 'ok');
            });  
            
            
        });
          
          
        })




     }) 
}

//FUNCTION TO DELETE ONE CONFIGURATION
function deleteConfig(button){
    const parentRow = button.closest('.row');
    if (!parentRow) return;           
    const matid = parentRow.querySelector('.boxmaterial').value;
    const configid = parentRow.querySelector('.boxid').innerHTML;     
      
       
    createCustomAlert('Attention','ARE YOU SURE YOU WANT TO DELETE THIS CONFIGURATION PERMANENTLY?', 'yesno')
    .then((result) => {
             if(!result) return;
             else{
                axios.get(`/queryconfigs/deleteconfig?matid=${matid}&confid=${configid}`,{ headers: { 'Authorization': authenticationheader()}})
                .then((response) => {
                    visualizeConfigurations();
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                    createCustomAlert('Error','Something went wrong trying to delete this configuration', 'ok');
                });  
             }
            });




     
     
}


function addNewLine(){
    const target_table=document.querySelector("#targettable");
    const additems=document.querySelectorAll(".additem");
    if (additems.length!=0) return;
    target_table.innerHTML+=`
    <div class="row" style="position: relative;">                    
        <div class="col cw150  additem boxid">ID</div>
        <div class="col cw400  additem  editable editselect"><select class="form-select  addboxsupplier" ></select></div>        
        <div class="col cw400  additem editable  "><input class="addsupcodeinput"type="text" class="w-100 text-start" value=""></div>        
        <div class="col cw400  additem editable  editselect" ><select class="form-select  addboxmaterial" ></select></div>
        <div class="col cw250 py-2 text-center etitem border  bg-light etinactive ">
            <i class="fa fa-floppy-o  actionbutton floppybutton"  onclick="SaveConfItem(this)" aria-hidden="true"></i> Save
            
        </div>                
    </div>
    `;
    document.querySelectorAll(".boxmaterial").forEach(select=>{
        const parent=select.parentNode;
        const actualvalue=select.getAttribute('actualvalue');
        parent.innerHTML=`<div>${actualvalue}</div>`;
        
        
    });
    document.querySelectorAll(".boxsupplier").forEach(select=>{
        const parent=select.parentNode;
        const actualvalue=select.getAttribute('actualvalue');
        parent.innerHTML=`<div>${actualvalue}</div>`;
        
    });
    
    //POPULATE THE MATERIAL SELECT        
     
    document.querySelectorAll(".addboxmaterial").forEach(select=>{     
        
           
        axios.get('/querymat/',{ headers: { 'Authorization': authenticationheader()}})
        .then((response)=>{ response.data.forEach(function(materialobj){select.innerHTML+=`<option value="${materialobj.id}" >${materialobj.brandname}</option> `;}) 
        select.selectedIndex = -1;
    })
        .catch((error) => { createCustomAlert('Error','Something went wrong retrieving materials', 'ok');});                  
    });
    //POPULATE THE SUPPLIER SELECT 
        
    document.querySelectorAll(".addboxsupplier").forEach(select=>{   
                 
        axios.get('/querysup/',{ headers: { 'Authorization': authenticationheader()}})
        .then((response)=>{response.data.forEach(function(supobj){select.innerHTML+=`<option value="${supobj.id}" >${supobj.supplier_name}</option>`;})
        select.selectedIndex =-1;
    })
        .catch((error) => {createCustomAlert('Error','Something went wrong retrieving suppliers', 'ok');});         
    });
}

function SaveConfItem(element){
    
    const parentRow = element.closest('.row');
    const componentid= JSON.parse(localStorage.getItem("config_to_edit"));
    const supplierid = parentRow.querySelector(".addboxsupplier").value;
    const materialid = parentRow.querySelector(".addboxmaterial").value;
    let supcode = parentRow.querySelector(".addsupcodeinput").value;   
    if(supcode=="" || supcode=="/" || supcode==null || supcode==" " || supcode.toUpperCase()=="NA" || supcode.toUpperCase()=="N.A.") supcode="N.A.";
    
if(document.querySelector(".addboxmaterial").selectedIndex===-1 || document.querySelector(".addboxsupplier").selectedIndex===-1 ) {
    createCustomAlert('Error','Please fill all the fields first', 'ok');
    return;}


createCustomAlert('Attention','Are you sure you want to add this item to the bom?', 'yesno')
.then((result) => { 
        if(!result) return;
        else{
            const conf_data=[{
                supcompcode: supcode,
                compid: componentid,
                matid: materialid,
                supid: supplierid
            }]
            
            axios.post(`/queryconfigs/new`, conf_data, { headers: { 'Authorization': authenticationheader()}})
            .then((response) => { setTimeout(()=>{window.location.reload()},150);})
            .catch((error) => {createCustomAlert('Error','Something went wrong trying to add item', 'ok');}); 
        }
    });
}



visualizeConfigurations();




