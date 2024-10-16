
async function rendermaterials(){
    
    document.cookie = `resultpage=1`;
    localStorage.setItem("currentsection","materials");
    localStorage.setItem("editmode","false");
    
    

    // event.preventDefault();
    resetPage();
    
    //CREATE A NEW DASHBOARD

    const newDash = document.createElement("div");
    document.body.insertBefore(newDash, document.body.firstChild);
    newDash.classList.add("dashboard");
    newDash.classList.add("materials");
    newDash.innerHTML=`
    <div class="pagelabel">PAGE 1/7</div>
    <div class="rainbowtext sectiontitle">MATERIALS TABLE</div>
    <div class="editbutton hover-message " title="Toggle edit mode" onclick="toggleEditMode(['ENGINEER'])"><img class="btnsmall" alt="Edit selection" src="https://i.postimg.cc/xCjY1RdG/write.png"></img></div>
    
    <div class="prevbutton hover-message" title="Previous Page" onclick="changePageMaterials(-1)"><img class="btnsmall" alt="Previous page" src="https://i.postimg.cc/zXN62Tk8/prev.png"></img></div>
    <div class="nextbutton hover-message" title="Next Page" onclick="changePageMaterials(1)"><img class="btnsmall" alt="Next page" src="https://i.postimg.cc/FsxqM1Pc/next.png"></img></div>
    <div class="uploadbutton hover-message invisible" title="Upload certificate" onclick="rendernewcertificate()"><img class="btnsmall" alt="Edit selection" src="https://i.postimg.cc/Rhyf8b1h/upload.png"></img></div>
    <div class="csvbutton hover-message" title="Download CSV File" onclick="downloadFile()"><img class="btnsmall" alt="Download CSV file" src="../../css/download.png"></img></div>
    <div class="flopbutton hover-message" style="right:75px;" title="Save edits" onclick="saveMaterialsModifications()"><img class="btnsmall" alt="Save edits" src="../../css/diskette.png"></img></div>
    <div class="clipboardbutton hover-message" title="Copy to clipboard" onclick="copyTableToClipboard()"><img alt="Copy content of the table" class="btnsmall" src="../../css/copy.png"></img></div>
    <div class="newrecbutton hover-message" title="New record" onclick="rendernewmaterials()"><img alt="New record" class="btnsmall" src="../../css/add.png"></img></div>
    <form action="">
        <div class="input-group ">
            <input type="text" class="form-control documentcontrol" placeholder="Brand Name" name="brandinput" id="materialnameinput" >
            <input type="text" class="form-control documentcontrol" placeholder="Manufactured By" name="supplierinput">
            <input type="text" class="form-control documentcontrol" placeholder="Plasticizer" name="plasticizerinput">
        </div>
        <div class="selectcontainer" style="display:flex; justify-content:align-center; align-items:center; flex-wrap:wrap;">
        <div class="form-group ">
        <label for="family" class="control-label "> Material Type </label>
        <select id="ifamily" class="form-select form-select-sm selectcontrol" name="familyinput"><option value="all" selected>Select All</option></select>
        </div>


        </div>


        <div class="resultbanner">~  Found 0 results  ~</div>
     </form>`;
     retrieveOptions('MATERIALS').then(result => {
        document.querySelector("#ifamily").innerHTML = result+document.querySelector("#ifamily").innerHTML;        
    }).catch(error => {
        console.error('Failed to retrieve and log options:', error);
    });
    updateMaterialsTable();
    const controls=document.querySelectorAll(".documentcontrol");
    for (let control of controls){

            control.addEventListener("input", ()=>{
                startBuffering();
                    for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                        timeouts.push(setTimeout(updateMaterialsTable.bind(null),500));
                    });

        }
        const selectcontrols=document.querySelectorAll(".selectcontrol");
        for (let control of selectcontrols){

                control.addEventListener("change", ()=>{
                        startBuffering();
                        for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                            timeouts.push(setTimeout(updateMaterialsTable.bind(null),20));
                        });

            }

    }








async function updateMaterialsTable(){
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
    document.querySelector("#targettable").innerHTML=`<div class="row headerrow">                    
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
        <h3>Certificates</h3>
    </div>
     
    <div class="col cw250 text-center etheader border  ">
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

    let family=document.getElementsByName("familyinput")[0].value;
    let brand=document.getElementsByName("brandinput")[0].value;
    let plasticizer=document.getElementsByName("plasticizerinput")[0].value;
    let supplier=document.getElementsByName("supplierinput")[0].value;

    //SEND REQUEST TO THE REST API
    let url = '/querymat/';
    url+=`?brand=${brand}&family=${family}&plasticizer=${plasticizer}&supplier=${supplier}`;



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
                //CALCULATE THE MATCHING INTERVAL OF RESULTS TO DISPLAY
                
                let i = 0;                
                const rp = parseInt(getCookie("resultpage"));
                
                const minview = (rp-1)*50
                const maxview = rp*50-1;

                jsonResponse.forEach(obj => {
                    if(i >= minview && i <=maxview && minview <= jsonResponse.length){
                        const plastiplaceholder= obj.plasticizer==null ? "NULL" : obj.plasticizer;
                        const notesplaceholder= obj.notes==null || obj.notes=="" ? "NULL" : obj.notes;
                        document.querySelector("#targettable").innerHTML+=`
                        <div class="row" style="position: relative;">                    
                            <div class="col cw100 py-2 text-center etitem  border  bg-light etinactive boxid ">${obj.id}</div>
                            <div class="col cw350 py-2 text-center etitem border  bg-light etinactive editable boxarticle ">${obj.brandname}</div>
                            <div class="col cw250 py-2 text-center etitem border  bg-light etinactive editable boxsupplier ">${obj.supplier}</div>
                            <div class="col cw250 py-2 text-center etitem border  bg-light etinactive editable  editselect "><select class="form-select  boxfamily" aria-label="Default select example"><option selected>${obj.family}</option></select></div>
                            <div class="col cw250 py-2 text-center etitem border  bg-light etinactive editable  boxplasticizer">${plastiplaceholder}</div>
                            <div class="col cw250 py-2 text-center etitem border  bg-light etinactive editable boxnotes"><strong class="certificatebutton pdfopener" targetref="/download/?filename=TDS_${obj.id}">TDS</strong><strong class="certificatebutton pdfopener" targetref="/download/?filename=SDS_${obj.id}" style="background-color: rgba(0,212,255,1);">SDS</strong><strong class="certificatebutton pdfopener" targetref="/download/?filename=COA_${obj.id}" style="background-color: #F5B041;">COA</strong></div>
                            
                            <div class="col cw250 py-2 text-center etitem border  bg-light etinactive ">
                                <i class="fa fa-trash-o deletebutton actionbutton"  onclick="deleteMaterial(${obj.id})" aria-hidden="true"></i> <strong class="certificatebutton" onclick="renderqueryadv3(${obj.id})" style="background-color: rgb(0, 123, 255);">USAGE</strong>
                                
                            </div>                
                        </div>
                        `;
        
                }
                i++;
            });
            resolve();
            });
                
            
            
        }

        async function handleMaterialsResponse(jsonResponse) {
                    await processJsonResponseForComponents(jsonResponse);
                    const allchecks=document.querySelectorAll(".editcheck.editable input");
                    
                const allselects=document.querySelectorAll(".editselect.editable select");
                
                allchecks.forEach(check=>{ check.addEventListener("change",()=>editFather(check))});
                allselects.forEach(select=>{ select.addEventListener("change",()=>editFather(select))});
                // ASSIGN THE CORRECT OPTIONS TO THE SELECT INSIDE THE RESULTS TABLE
                const htmloptionsfamily= await retrieveOptions('MATERIALS');
                document.querySelectorAll(".boxfamily").forEach(select=>{
                    let current_value=select.value;
                    select.innerHTML=htmloptionsfamily;
                    select.value=current_value;
                });        
        
        
                updateView();
                listenForDownloads();
                
                setTimeout(()=>{stopBuffering();document.getElementById("materialnameinput").focus();},350);
                

        
        
        return ;
    }
    handleMaterialsResponse(jsonResponse);
    //UPDATE NUMBER OF RESULTS
    document.querySelector(".resultbanner").innerHTML=`~  Found ${jsonResponse.length} results  ~`;
    } catch (error) {
        console.error('Error during fetch:', error);
        return ;
    }

}
function changePageMaterials(increment){
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
    updateMaterialsTable(totalmaterialcolumns);
}





//FUNCTION TO DELETE ONE USER
function deleteMaterial(id){
        
    createCustomAlert('Attention','ARE YOU SURE YOU WANT TO DELETE THIS MATERIAL PERMANENTLY?', 'yesno')
    .then((result) => {
             if(!result) return;
             else{
                axios.delete(`/querymat/delete/${id}`,{ headers: { 'Authorization': authenticationheader()}})
                .then((response) => {
                    updateMaterialsTable();
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
                let allmodifiedrows=document.querySelectorAll(".row:has(.edited)");
                allmodifiedrows.forEach(function(parentRow){
                    processed_items++;
                    // const parentRow = button.closest('.row');
                    if (parentRow) {
                        const id = parentRow.querySelector('.boxid').innerHTML;
                        const brandname = parentRow.querySelector('.boxarticle').innerHTML;
                        const plasticizer= parentRow.querySelector('.boxplasticizer').innerHTML;            
                        const family = parentRow.querySelector('.boxfamily').value;
                        const supplier= parentRow.querySelector('.boxsupplier').innerHTML;
                        // const notes = parentRow.querySelector('.boxnotes').innerHTML;
                        
            
                        
                        const mat_correct = { 
                                                plasticizer: plasticizer,
                                                brandname: brandname,
                                                family: family  ,
                                                supplier: supplier
                                                // notes: null
                                            };
                        
                        axios.put(`/querymat/updatematerial/${id}`, mat_correct,{ headers: { 'Authorization': authenticationheader()}})
                        .then((response) => {
                            
                            if(response.status!=200) createCustomAlert('Error','Something went wrong trying to save modifications', 'ok');
                        })
                    }
                });
                setTimeout(()=>{updateMaterialsTable();},250);  
                setTimeout(()=>{toggleEditMode(['ENGINEER']);},300); 
             }
            });





    
}
