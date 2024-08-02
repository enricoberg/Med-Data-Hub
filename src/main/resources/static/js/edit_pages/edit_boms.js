//FUNCTION THAT LOADS ALL THE COMPONENTS FROM THE DATABASE AND DRAWS THE TABLE WITH THE RETRIEVED DATA (RUNS AT PAGE LOAD)
function visualizeBoms(){    
    const product= JSON.parse(localStorage.getItem("bom_to_edit"));
    let url=`/queryboms/?article=${product}`;    
    axios.get(`/queryprod/byidint?article=${product}`,{ headers: { 'Authorization': authenticationheader()}})
      .then(function (response) {         
        document.querySelector("h1").innerHTML=`${response.data.code} - Bill of Materials` ; 
     })

    
    const target_table=document.querySelector("#targettable");
    target_table.innerHTML=`<div class="row">                    
    
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
            <div class="row" style="position: relative;">                    
                <div class="col cw350 py-2 text-center etitem  border  bg-light etinactive  boxarticle">${obj.comp_id}</div>
                <div class="col cw500 py-2 text-center etitem border  bg-light etinactive   boxdescription">${obj.comp_description}</div>
                <div class="col cw150 py-2 text-center etitem border  bg-light etinactive editable  editcheck" ><input disabled class="form-check-input boxassembly " type="checkbox" ${check_assembly} id="flexCheckDefault"></div>
                <div class="col cw250 py-2 text-center etitem border  bg-light etinactive  boxqty ">${obj.qty}</div>
                <div class="col cw200 py-2 text-center etitem border  bg-light etinactive   boxum">${obj.um}</div>
                
                <div class="col cw250 py-2 text-center etitem border  bg-light etinactive ">
                    <i class="fa fa-trash-o deletebutton actionbutton"  onclick="deleteBom('${obj.comp_id}',${product},${obj.assembly})" aria-hidden="true"></i> Delete
                    
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

//FUNCTION TO DELETE ONE USER
function deleteBom(comp_id,prod_id, assembly){
    if(!window.confirm("ARE YOU SURE YOU WANT TO DELETE THIS USER PERMANENTLY?")) return;     
     
    axios.get(`/queryboms/deletebom?compid=${comp_id}&prodid=${prod_id}&assembly=${assembly}`,{ headers: { 'Authorization': authenticationheader()}})
    .then((response) => {
        visualizeBoms();
    })
    .catch((error) => {
        console.error("Error deleting user:", error);
        alert("Something went wrong trying to delete this user");
    });       
}

//FUNCTION TO SAVE THE DATA OF ALL MODIFIED USERS
function saveBomsModifications(){
    inputToTableItem();
    const modified_items=document.querySelectorAll(".edited");
    if(modified_items.length===0){
        alert("The table is already up to date");
        return;
    }
    if(!window.confirm("ARE YOU SURE YOU WANT TO UPDATE ALL "+modified_items.length+" MODIFIED FIELDS?")) return;  
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
            if (processed_items==modified_items.length)  setTimeout(()=>{window.location.reload()},350);         
            
        }
    });
    
}

function addNewLine(){
    const target_table=document.querySelector("#targettable");
    const additems=document.querySelectorAll(".additem");
    if (additems.length!=0) return;
    target_table.innerHTML+=`
    <div class="row" style="position: relative;">                    
        <div class="col cw350  additem boxarticle"><input class="codeinput" type="text" class="w-100 text-start" value=""></div>
        <div class="col cw500  additem  boxdescription">Description</div>
        <div class="col cw150  additem editable  editcheck" ><input class="checkinput" class="form-check-input boxassembly " type="checkbox"  id="flexCheckDefault"></div>
        <div class="col cw250  additem editable boxqty "><input class="qtyinput"type="text" class="w-100 text-start" value=""></div>
        <div class="col cw200  additem editable  boxum"><input class="uminput" type="text" class="w-100 text-start" value=""></div>
        
        <div class="col cw250 py-2 text-center etitem border  bg-light etinactive" >
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
    if(um!="CM" && um!="KG" && um!="C" && um!="M2" && um!="PAC" && um!="PZ")  {alert("Invalid unit of measure");
        return;
    }
    if(Number(qty) != qty ) {
        alert("Invalid quantity");
        return;
    }
if(!window.confirm("Are you sure you want to add this item to the bom?")) return;


if(!assembly){
    axios.get(`/querycomp/byname?id=${code}`,{ headers: { 'Authorization': authenticationheader()}})
    .then((response) => {
        
        if(response.data.length==0) {            
            alert("Warning: the component does not exist and must be created first");
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
        .then((response) => {    setTimeout(()=>{window.location.reload()},150);})
        .catch((error) => {alert("Something went wrong trying to add item"); }); 





    })
    .catch((error) => {
        console.error("Error deleting user:", error);        
    }); 
}
else{
    axios.get(`/queryprod/byid?article=${code}`,{ headers: { 'Authorization': authenticationheader()}})
    .then((response) => {
        
        if(response.data==null) {
            alert("Warning: the component does not exist and must be created first");
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
        .then((response) => {    setTimeout(()=>{window.location.reload()},150);})
        .catch((error) => {alert("Something went wrong trying to add item"); }); 



    })
    .catch((error) => {
        console.error("Error deleting user:", error);        
    }); 

}
}

function dumpBoms(){
    if(!window.confirm("This procedure allows you to dump content copied to the clipboard inside the BOM. Have you copied the right table and do you wish to proceed?")) return;
}

visualizeBoms();




