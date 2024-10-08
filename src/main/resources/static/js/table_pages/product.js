
async function renderproducts(){
    
    document.cookie = `resultpage=1`;
    localStorage.setItem("currentsection","products");
    localStorage.setItem("editmode","false");
    resetPage();
    // let totalcolumns=totalproductcolumns;
    
    //CREATE A NEW DASHBOARD

    const newDash = document.createElement("div");        
        document.body.insertBefore(newDash, document.body.firstChild);
        newDash.classList.add("dashboard");
        newDash.classList.add("products");
        newDash.innerHTML=`
        <div class="pagelabel">PAGE 1/7</div>
        <div class="rainbowtext sectiontitle">PRODUCTS TABLE</div>
        
        <div class="editbutton hover-message " title="Toggle edit mode" onclick="toggleEditMode(['ENGINEER'])"><img class="btnsmall" alt="Edit selection" src="https://i.postimg.cc/xCjY1RdG/write.png"></img></div>
        <div class="newrecbutton hover-message" title="New record" onclick="rendernewproduct()"><img alt="New record" class="btnsmall" src="../../css/add.png"></img></div>
        <div class="flopbutton hover-message" style="right:75px;" title="Save edits" onclick="saveProductsModifications()"><img class="btnsmall" alt="Save edits" src="../../css/diskette.png"></img></div> 
        <div class="prevbutton hover-message" title="Previous Page" onclick="changePageProducts(-1)"><img class="btnsmall" alt="Previous page" src="https://i.postimg.cc/zXN62Tk8/prev.png"></img></div>
        <div class="nextbutton hover-message" title="Next Page" onclick="changePageProducts(1)"><img class="btnsmall" alt="Next page" src="https://i.postimg.cc/FsxqM1Pc/next.png"></img></div>
       
        <div class="csvbutton hover-message" title="Download CSV File" onclick="downloadFile()"><img class="btnsmall" alt="Download CSV file" src="../../css/download.png"></img></div>
        <div class="clipboardbutton hover-message" title="Copy to clipboard" onclick="copyTableToClipboard()"><img alt="Copy content of the table" class="btnsmall" src="../../css/copy.png"></img></div>
        <form action="">
            <div class="input-group ">
                <input type="text" class="form-control documentcontrol" placeholder="Article number" name="articleinput" id="productarticleinput">
                <input type="text" class="form-control documentcontrol" placeholder="Description" name="descriptioninput" id="productdescriptioninput">
                <input type="text" class="form-control documentcontrol" placeholder="DHF number" name="dhfinput">
                <input type="text" class="form-control documentcontrol" placeholder="RMF" name="rmfinput" >
                <input type="text" class="form-control documentcontrol" placeholder="BUDI" name="budiinput" >
                
                <input type="text" class="form-control documentcontrol" placeholder="Shelf life (months)" name="shelflifeinput" >
            </div>

            <div class=" pl-2 pt-4 ">
                                <span >Family of the product: </span>
                                <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="familyinput" id="familyinput">
                                    <option value="ASS" >ASSEMBLIES</option>    
                                    <option value="AV" selected>A/V SYSTEMS</option>
                                    <option value="AA" >ACUTE & APHERESIS</option>
                                    <option value="CATH" >CATHETERS & ACCESSORIES</option>  
                                    <option value="CONC" >CONCENTRATES</option>
                                    <option value="EC" >EMPTY CONTAINERS</option>                                    
                                    <option value="ENT" >ENTERAL NUTRITION & ACCESSORIES</option>
                                    <option value="IU" >IRRIGATION / UROLOGY</option>    
                                    <option value="HARDWARE" >MACHINE COMPONENTS</option>    
                                    <option value="OEM" >OEM</option>                                                                
                                    <option value="BAGS" >TPN BAGS & ACCESSORIES</option>
                                    <option value="WM" >WOUND-OSTOMY MANAGEMENT</option>
                                    <option value="INWORK" >IN WORK</option>   
                                    
                                    
                                    <option value="all" selected>See All</option>
                                  </select>
                                  <span class="ml-3">SAP STATUS: </span>
                                <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="sapstatusinput" id="sapstatusinput">
                                    <option value="M1V1" selected>M1V1 (planning stage)</option>
                                    <option value="M2V1" >M2V1 (active, planning stage)</option>
                                    <option value="M2V2" >M2V2 (active, free for sale)</option>
                                    <option value="M2V4" >M2V4 (active, not saleable)</option>
                                    <option value="M3V3" >M3V3 (discontinued line)</option>
                                    <option value="M4V4" >M4V4 (end of life, not saleable)</option>
                                    <option value="all" selected >See All</option>

                                  </select>
                                  <span class="ml-3">Sterilization Method: </span>
                                <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="sterimethodinput" id="sterimethodinput">
                                                                      
                                    
                                    <option value="BETA" >Beta radiation</option>
                                    <option value="GAMMA" >Gamma radiation</option>
                                    <option value="ETO21" selected>ETO - cycle 21</option>                                    
                                    <option value="ETO22" >ETO - cycle 22</option>  
                                    <option value="BULK" >Non sterile / Bulk</option>
                                    <option value="UNKNOWN" >Not applicable</option>
                                    <option value="all" selected >See All</option>

                                  </select>
                                  

            </div>
            <div class=" pl-2">
                                  <span class="ml-3">Intercompany: </span>
                                  <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="intercompanyinput">
                                      <option value="true" >Intercompany</option>
                                      <option value="false" >Non Intercompany</option>
                                      <option value="all" selected>See All</option>
                                   </select>
                                   <span class="ml-3">Semifinished: </span>
                                   <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="semiinput">
                                     <option value="true" >Semifinished good</option>
                                     <option value="false" >Products</option>
                                     <option value="all" selected>See All</option>
                                   </select>
                                   <span class="ml-3">Sterilization Site: </span>
                                   <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="sterisiteinput">
                                    <option value="BAI" >B.Braun Avitum Italy</option>                                                                        
                                    <option value="Melsungen" >B.Braun Melsungen</option>
                                    <option value="Sterilverona" >Sterilverona</option>
                                    <option value="Sterisastkomenda" >Sterisast Komenda</option>
                                    <option value="Sterilveronanogara" >Sterilverona Nogara</option>
                                    <option value="Sterisastseriate" >Sterisast Seriate</option>
                                    <option value="Sterisastwestport" >Sterisast Westport</option>
                                    <option value="Synergyhealth" >Synergy Health</option>                                    
                                    <option value="all" selected>See All</option>
                                   </select>
                                   <span class="ml-3">Manufacturer: </span>
                                  <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="supplierinput" id="supplierinput">
                                    
                                    <option value="all" selected >See All</option>

                                  </select>
            </div>

            <div class="resultbanner">~  Found 0 results  ~</div>
         </form>`;
         sup_options=document.querySelector("#supplierinput");
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
             data.forEach(element => {                
                 sup_options.innerHTML+=`<option value="${element.id}" >${element.supplier_name}</option>`;                   
             });
         })
         .catch(error => {            
             console.error('Error during fetch:', error);
         });

    updateProductsTable();
    const controls=document.querySelectorAll(".documentcontrol");
    for (let control of controls){

            control.addEventListener("input", ()=>{
                startBuffering();
                document.cookie = `resultpage=1`;
                    for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                        timeouts.push(setTimeout(updateProductsTable.bind(null),500));
                    });

        }
        const selectcontrols=document.querySelectorAll(".selectcontrol");
        for (let control of selectcontrols){
                startBuffering();
                control.addEventListener("change", ()=>{
                        
                        document.cookie = `resultpage=1`;
                        for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                            timeouts.push(setTimeout(updateProductsTable.bind(null),100));
                        });

            }

    }








async function updateProductsTable(){
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
    document.querySelector("#targettable").innerHTML=
        `<div class="row headerrow">                    
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
    let article=document.getElementsByName("articleinput")[0].value;
    let description=document.getElementsByName("descriptioninput")[0].value;
    let intercompany=document.getElementsByName("intercompanyinput")[0].value;
    let family=document.getElementsByName("familyinput")[0].value;
    let sapstatus=document.getElementsByName("sapstatusinput")[0].value;
    let semifinished=document.getElementsByName("semiinput")[0].value;
    let dhf=document.getElementsByName("dhfinput")[0].value;
    let rmf=document.getElementsByName("rmfinput")[0].value;
    let budi=document.getElementsByName("budiinput")[0].value;
    let sterimethod=document.getElementsByName("sterimethodinput")[0].value;
    let sterisite=document.getElementsByName("sterisiteinput")[0].value;
    let shelflife= document.getElementsByName("shelflifeinput")[0].value;
    let supplierid=document.getElementsByName("supplierinput")[0].value;


    //SEND REQUEST TO THE REST API

    let url = '/queryprod/';
    url+=`?description=${description}&article=${article}&intercompany=${intercompany}&family=${family}&sapstatus=${sapstatus}&semifinished=${semifinished}&dhf=${dhf}&rmf=${rmf}&budi=${budi}&sterimethod=${sterimethod}&sterisite=${sterisite}&shelflife=${shelflife}`;
    if(supplierid!="all") url+=`&supplierid=${supplierid}`
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
        


        const processJsonResponseForProducts = async (jsonResponse) => {

            return new Promise((resolve) => {
                let productsToEdit = [];
                const promises = [];
                let i = 0;
                const rv = 50;
                const rp = parseInt(getCookie("resultpage"));
                
                const minview = (rp-1)*50
                const maxview = rp*50-1;
            
                jsonResponse.forEach(obj => {
                    
            
                    if (i >= minview && i <=maxview && minview <= jsonResponse.length) {
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
                        document.querySelector("#targettable").innerHTML+=`
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
                            <div class="col cw250 py-2 text-center etitem border  bg-light etinactive ">
                                <i class="fa fa-trash-o deletebutton actionbutton"  onclick="deleteProduct(${obj.id})" aria-hidden="true"></i> <i class="fa fa-search-plus fa-1  actionbutton"  onclick="visualizeBoms(${obj.id})" aria-hidden="true"></i><i class="fa fa-link fa-1  actionbutton pdfopener" targetref="/download/activespec?article=${obj.code}" style="background-color: #F5B041;" onclick="" aria-hidden="true"></i>
                                
                            </div>                
                        </div>
                        `;
            
                        
                    }
                    i++;
                });
                resolve();
            })
           
        };
        
        // Usage

        async function handleProductsResponse(jsonResponse) {
            await processJsonResponseForProducts(jsonResponse);
            const allchecks=document.querySelectorAll(".editcheck.editable input");            
            const allselects=document.querySelectorAll(".editselect.editable select");            
            allchecks.forEach(check=>{ check.addEventListener("change",()=>editFather(check))});
            allselects.forEach(select=>{ select.addEventListener("change",()=>editFather(select))});
            document.querySelectorAll(".boxfamily").forEach(select=>{
                let current_value=select.value;
                select.innerHTML=`
                <option value="AV" selected>A/V SYSTEMS</option>
                                        <option value="ASS" >ASSEMBLIES</option>    
                                        <option value="AV" selected>A/V SYSTEMS</option>
                                        <option value="AA" >ACUTE & APHERESIS</option>
                                        <option value="CATH" >CATHETERS & ACCESSORIES</option>  
                                        <option value="CONC" >CONCENTRATES</option>
                                        <option value="EC" >EMPTY CONTAINERS</option>                                    
                                        <option value="ENT" >ENTERAL NUTRITION & ACCESSORIES</option>
                                        <option value="IU" >IRRIGATION / UROLOGY</option>    
                                        <option value="HARDWARE" >MACHINE COMPONENTS</option>    
                                        <option value="OEM" >OEM</option>                                                                
                                        <option value="BAGS" >TPN BAGS & ACCESSORIES</option>
                                        <option value="WM" >WOUND-OSTOMY MANAGEMENT</option>
                                        <option value="INWORK" >IN WORK</option>                                                                      
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
                <option value="UNKNOWN" >Not applicable</option>
                `;
                select.value=current_value;
            });
            updateView();
            listenForDownloads();
            setTimeout(()=>{stopBuffering();document.getElementById("productarticleinput").focus();},350);
        }
        handleProductsResponse(jsonResponse);
        //UPDATE NUMBER OF RESULTS
        document.querySelector(".resultbanner").innerHTML=`~  Found ${jsonResponse.length} results  ~`;
        
        return ;
    } catch (error) {
        console.error('Error during fetch:', error);
        return ;
    }

}


function getExtendedFamily(family) {
    let selectElement = document.querySelector("#familyinput")
    let options = selectElement.options;    
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === family) return options[i].textContent;        
    }    
    return "";
}
function getExtendedSapStatus(status) {
    let selectElement = document.querySelector("#sapstatusinput")
    let options = selectElement.options;    
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === status) return options[i].textContent;        
    }    
    return "";
}
function getExtendedSteriMethod(method) {
    let selectElement = document.querySelector("#sterimethodinput")
    let options = selectElement.options;    
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === method) return options[i].textContent;        
    }    
    return "";
}
function changePageProducts(increment){
    let rp=parseInt(getCookie("resultpage"));
    let totals=parseInt(getCookie("totalresults"));

    let numberofpages=Math.ceil(totals/getCookie("resultview"));
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
    updateProductsTable(totalproductcolumns);
}

function sendToEditProducts(){

    window.location.href="/app/editproducts";


}

function renderEditableBoms(id){
    localStorage.setItem("bom_to_edit", id);
    window.location.replace("/app/editboms")
}



//FUNCTION TO DELETE ONE PRODUCT
function deleteProduct(id){
    
    createCustomAlert('Attention','ARE YOU SURE YOU WANT TO DELETE THIS PRODUCT PERMANENTLY? ALL RELATED BOM ITEMS WILL BE DELETED PERMANENTLY', 'yesno')
    .then((result) => {
             if(!result) return;
             else{
                axios.delete(`/queryprod/delete/${id}`,{ headers: { 'Authorization': authenticationheader()}})
                .then((response) => {
                    updateProductsTable();
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                    createCustomAlert('Error','Something went wrong trying to delete this product', 'ok');
                    
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
                        if (processed_items==modified_items.length)  setTimeout(()=>{updateProductsTable();},250);           
                        
                    }
                });
             }
     
            });





    
}