
async function rendersuppliers(){
    document.cookie = `resultpage=1`;
    localStorage.setItem("currentsection","suppliers");
    localStorage.setItem("editmode","false");
    resetPage();
    //CREATE A NEW DASHBOARD
    const newDash = document.createElement("div");
    document.body.insertBefore(newDash, document.body.firstChild);
    newDash.classList.add("dashboard");
    newDash.classList.add("materials");
    newDash.innerHTML=`
    <div class="pagelabel">PAGE 1/7</div>
    <div class="rainbowtext sectiontitle">SUPPLIERS TABLE</div>
    <div class="editbutton hover-message " title="Toggle edit mode" onclick="toggleEditMode(['ENGINEER'])"><img class="btnsmall" alt="Edit selection" src="https://i.postimg.cc/xCjY1RdG/write.png"></img></div>
    <div class="prevbutton hover-message" title="Previous Page" onclick="changePageSuppliers(-1)"><img class="btnsmall" alt="Previous page" src="https://i.postimg.cc/zXN62Tk8/prev.png"></img></div>
    <div class="nextbutton hover-message" title="Next Page" onclick="changePageSuppliers(1)"><img class="btnsmall" alt="Next page" src="https://i.postimg.cc/FsxqM1Pc/next.png"></img></div>
    <div class="csvbutton hover-message" title="Download CSV File" onclick="downloadFile()"><img class="btnsmall" alt="Download CSV file" src="../../css/download.png"></img></div>
    <div class="flopbutton hover-message" style="right:75px;" title="Save edits" onclick="saveSuppliersModifications()"><img class="btnsmall" alt="Save edits" src="../../css/diskette.png"></img></div>
    <div class="clipboardbutton hover-message" title="Copy to clipboard" onclick="copyTableToClipboard()"><img alt="Copy content of the table" class="btnsmall" src="../../css/copy.png"></img></div>
    <div class="newrecbutton hover-message" title="New record" onclick="rendernewsuppliers()"><img alt="New record" class="btnsmall" src="../../css/add.png"></img></div>   
       
    <form action="">
        <div class="input-group ">
            <input type="text" class="form-control documentcontrol" placeholder="Supplier Name" name="nameinput" id="suppliernameinput">
            <input type="text" class="form-control documentcontrol" placeholder="Supplier's SAP Code" name="sapinput">
            <input type="text" class="form-control documentcontrol" placeholder="Supplier's Contacts" name="contactinput">
        </div>



        <div class="resultbanner">~  Found 0 results  ~</div>
     </form>`;

    updateSuppliersTable();
    const controls=document.querySelectorAll(".documentcontrol");
    for (let control of controls){

            control.addEventListener("input", ()=>{
                    startBuffering();
                    for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                        timeouts.push(setTimeout(updateSuppliersTable.bind(null),500));
                    });

        }
        const selectcontrols=document.querySelectorAll(".selectcontrol");
        for (let control of selectcontrols){

                control.addEventListener("change", ()=>{
                        startBuffering();
                        for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                            timeouts.push(setTimeout(updateSuppliersTable.bind(null),100));
                        });

            }

    }








async function updateSuppliersTable(){
    setTimeout(() => {
        startBuffering();
    }, 25);
    
    resetPage(["dashboard"]);

    const gridContainer = document.createElement("div");    
    gridContainer.classList.add("containertable");
    // gridContainer.classList.add("thininvisible");
    document.body.insertBefore(gridContainer, document.body.lastChild);  

    //CREATE HEADERS
    gridContainer.innerHTML=`<div class=" mx-auto" id="targettable"></div>`;
    document.querySelector("#targettable").innerHTML=`
    <div class="row headerrow">                    
    <div class="col cw100 text-center etheader border ">
        <h3>ID</h3>
    </div> 
    <div class="col cw350  text-center etheader border   ">
        <h3>Supplier Name</h3>
    </div>
    <div class="col cw150  text-center etheader border ">
        <h3>SAP Code</h3>
    </div>
    <div class="col cw950  text-center etheader border ">
        <h3>Contacts</h3>
    </div>   
     
    <div class="col cw150 text-center etheader border  ">
        <h3>Action</h3>
    </div>      
    </div>
    `;

    //DO NOT SEND REQUEST IF NOT NECESSARY    
    if(localStorage.getItem("needupdate")==null) localStorage.setItem("needupdate", true);
    if(localStorage.getItem("needupdate")=="false") {
        localStorage.setItem("needupdate", true);
        return;
    }
    //GET THE QUERY PARAMETERS
    let name=document.getElementsByName("nameinput")[0].value;
    let sapcode=document.getElementsByName("sapinput")[0].value;
    let contact=document.getElementsByName("contactinput")[0].value;


    //SEND REQUEST TO THE REST API
    let url = '/querysup/';
    url+=`?name=${name}&sapcode=${sapcode}&contact=${contact}`;



    const requestOptions = {
      method: 'GET',
      headers: {
          'Content-type':'application/json',
          'Authorization': authenticationheader()
      }
    }
    try {
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();
        document.cookie = `totalresults=${jsonResponse.length}`;
        //UPDATE THE NUMBER OF CURRENT PAGE
        let numberofpages=Math.ceil(getCookie("totalresults")/50);
        let currentpage=getCookie("resultpage");        
        document.querySelector(".pagelabel").innerHTML=`PAGE ${currentpage}/${numberofpages}`;

        


        //POPULATE THE TABLE
        
        

        const processJsonResponseForComponents = (jsonResponse) => {
        return new Promise((resolve) => {
        let i = 0;        
        const rp = parseInt(getCookie("resultpage"));            
        const minview = (rp-1)*50
        const maxview = rp*50-1;   
        jsonResponse.forEach(obj => {
        //CALCULATE THE MATCHING INTERVAL OF RESULTS TO DISPLAY
        

        if(i >= minview && i <=maxview && minview <= jsonResponse.length){
            
            let contactplaceholder= obj.contact==null ? "NULL" : obj.contact;
            contactplaceholder= contactplaceholder.replaceAll("<br>","&ensp;-&ensp;");
            
            document.querySelector("#targettable").innerHTML+=
        `
            <div class="row" style="position: relative; margin-top: 3px; ">                    
                <div class="col cw100 py-2 text-center etitem border  bg-light etinactive boxid "  style="white-space: normal; top:0; ">${obj.id}</div>
                <div class="col cw350 py-2 text-center etitem border  bg-light etinactive editable boxname "  style="white-space: normal; top:0; ">${obj.supplier_name}</div>
                <div class="col cw150 py-2 text-center etitem border  bg-light etinactive editable boxsap " style="white-space: normal; top:0; ">${obj.sap_code}</div>
                <div class="col cw950 py-2 text-center etitem  border  bg-light etinactive editable  boxcontacts "  style=" top:0;  text-overflow: ellipsis; text-wrap: normal;">${contactplaceholder}</div>
                
                
                <div class="col cw150 py-2 text-center etitem border  bg-light etinactive "  style="white-space: normal; top:0; ">
                    <i class="fa fa-trash-o deletebutton actionbutton"  onclick="deleteSupplier(${obj.id})" aria-hidden="true"></i>
                    
                </div>                
            </div>
            `;

        }
        i++;
        });
        resolve();
    });
    }

    async function handleSuppliersResponse(jsonResponse) {
        await processJsonResponseForComponents(jsonResponse);
        const allchecks=document.querySelectorAll(".editcheck.editable input");        
        const allselects=document.querySelectorAll(".editselect.editable select");        
        allchecks.forEach(check=>{ check.addEventListener("change",()=>editFather(check))});
        allselects.forEach(select=>{ select.addEventListener("change",()=>editFather(select))});
        updateView();
        listenForDownloads();        
        setTimeout(()=>{stopBuffering();document.getElementById("suppliernameinput").focus();},350);

    }
    handleSuppliersResponse(jsonResponse);
        
    //UPDATE NUMBER OF RESULTS
    document.querySelector(".resultbanner").innerHTML=`~  Found ${jsonResponse.length} results  ~`;
    //SHOW THE TABLE
        
        stopBuffering();
        return ;
    } catch (error) {
        console.error('Error during fetch:', error);
        return ;
    }

}
function changePageSuppliers(increment){
    let rp=parseInt(getCookie("resultpage"));
    let totals=parseInt(getCookie("totalresults"));

    let numberofpages=Math.ceil(totals/50);
    if(rp>=numberofpages && increment>0) {
        document.cookie=`resultpage=${numberofpages}`;
        return;
    }        
    document.querySelector(".pagelabel").innerHTML=`PAGE ${rp}/${numberofpages}`;


    rp=rp+increment;
    if(rp<1) {
        rp=1;
        document.cookie = `resultpage=${rp}`;
        return;
    }
    document.cookie = `resultpage=${rp}`;
    updateSuppliersTable(totalsuppliercolumns);
}

//FUNCTION TO DELETE ONE SUPPLIER
function deleteSupplier(id){    
    createCustomAlert('Attention','ARE YOU SURE YOU WANT TO DELETE THIS SUPPLIER PERMANENTLY?', 'yesno')
    .then((result) => {
             if(!result) return;
             else{
                axios.delete(`/querysup/delete/${id}`,{ headers: { 'Authorization': authenticationheader()}})
                .then((response) => {
                    updateSuppliersTable();
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                    createCustomAlert('Error','Something went wrong trying to delete this supplier', 'ok');
                    
                });    
             }
            });
}
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
                let allmodifiedrows=document.querySelectorAll(".row:has(.edited)");
                allmodifiedrows.forEach(function(parentRow){
                    processed_items++;
                    // const parentRow = button.closest('.row');
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
                        
                        axios.put(`/querysup/updatesupplier/${id}`, sup_correct,{ headers: { 'Authorization': authenticationheader()}})
                        .then((response) => {
                            
                            if(response.status!=200) createCustomAlert('Error','Something went wrong trying to save modifications', 'ok');
                        })
                        
                    }
                });
                setTimeout(()=>{updateSuppliersTable();},250);  
                setTimeout(()=>{toggleEditMode(['ENGINEER']);},500);  
             }
            });

}
