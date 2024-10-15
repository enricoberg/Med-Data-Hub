
async function rendercomponents(){
    document.cookie = `resultpage=1`;
    localStorage.setItem("currentsection","components");
    localStorage.setItem("editmode","false");
    
    

    // event.preventDefault();
    resetPage();
    // window.addEventListener('resize', ()=>{ adjustTableCSS(); });
    
    //CREATE A NEW DASHBOARD

    const newDash = document.createElement("div");
    document.body.insertBefore(newDash, document.body.firstChild);
    newDash.classList.add("dashboard");
    newDash.classList.add("components");
    newDash.innerHTML=`
    <div class="pagelabel">PAGE 1/7</div>
    <div class="rainbowtext sectiontitle">COMPONENTS TABLE</div>
    <div class="prevbutton hover-message" title="Previous Page" onclick="changePageComponents(-1)"><img class="btnsmall" alt="Previous page" src="https://i.postimg.cc/zXN62Tk8/prev.png"></img></div>
    <div class="nextbutton hover-message" title="Next Page" onclick="changePageComponents(1)"><img class="btnsmall" alt="Next page" src="https://i.postimg.cc/FsxqM1Pc/next.png"></img></div>
    <div class="editbutton hover-message " title="Toggle edit mode" onclick="toggleEditMode(['ENGINEER'])"><img class="btnsmall" alt="Edit selection" src="https://i.postimg.cc/xCjY1RdG/write.png"></img></div>
    <div class="csvbutton hover-message" title="Download CSV File" onclick="downloadFile()"><img class="btnsmall" alt="Download CSV file" src="../../css/download.png"></img></div>
    <div class="flopbutton hover-message" style="right:75px;" title="Save edits" onclick="saveComponentsModifications()"><img class="btnsmall" alt="Save edits" src="../../css/diskette.png"></img></div>
    <div class="clipboardbutton hover-message" title="Copy to clipboard" onclick="copyTableToClipboard()"><img alt="Copy content of the table" class="btnsmall" src="../../css/copy.png"></img></div>
    <div class="newrecbutton hover-message" title="New record" onclick="rendernewcomponents()"><img alt="New record" class="btnsmall" src="../../css/add.png"></img></div>
    <form action="">
        <div class="input-group ">
            <input type="text" id="componentarticleinput" class="form-control documentcontrol" placeholder="Article number" name="codeinput" >
            <input type="text" id="componentdescriptioninput" class="form-control documentcontrol" placeholder="Description" name="descriptioninput">
        </div>
        <div class="selectcontainer" style="display:flex; justify-content:align-center; align-items:center; flex-wrap:wrap;">
        <div class="form-group ">
        <label for="intercompany" class="control-label "> Intercompany </label>
        <select id="intercompany" class="form-select form-select-sm selectcontrol" name="intercompany">
                      <option value="true">Intercompany</option>
                      <option value="false">Non-intercompany</option>
                      <option value="all" selected>See All</option>
                    </select>
        </div>
        <div class="form-group ">
        <label for="family" class="control-label">Component Family </label>
            <select id="family" class="form-select form-select-sm selectcontrol compfamilyinput" name="family" ><option value="all" selected >See All</option></select>
        </div>
        <div class="form-group ">
        <label for="standard" class="control-label">Conical Standard</label>
            <select id="standard" class="form-select form-select-sm selectcontrol" name="standard"><option value="all" selected >See All</option></select>
        </div>
        <div class="form-group ">
        <label for="packaging" class="control-label">Packaging Material</label>
            <select id="packaging" class="form-select form-select-sm selectcontrol" name="packaging">
              <option value="true">Packaging material</option>
              <option value="false">Non-packaging material</option>
              <option value="all" selected>See All</option>
            </select>
        </div>

        <div class="form-group ">
        <label for="contact" class="control-label">In Contact</label>
            <select id="contact" class="form-select form-select-sm selectcontrol" name="contact">
              <option value="true">In Contact</option>
              <option value="false">No Contact</option>
              <option value="all" selected>See All</option>
            </select>
        </div>

        <div class="form-group ">
        <label for="ca65" class="control-label">California 65</label>
            <select id="ca65" class="form-select form-select-sm selectcontrol" name="ca65">
              <option value="true">California65 In Scope</option>
              <option value="false">CA65 Non in Scope</option>
              <option value="all" selected>See All</option>
            </select>
        </div>
        <div class="form-group ">
        <label for="baimold" class="control-label">BAI Mold</label>
            <select id="baimold" class="form-select form-select-sm selectcontrol" name="baimold">
              <option value="true">Mold of BAI property</option>
              <option value="false">Commercial component</option>
              <option value="all" selected>See All</option>
            </select>
        </div>
        <div class="form-group ">
        <label for="materialinput" class="control-label">Contains Material:</label>
            <select id="materialinput" class="form-select form-select-sm selectcontrol" name="materialinput"> 
            <option value="all" selected >See All</option>             
            </select>
        </div>
        <div class="form-group ">
        <label for="supplierinput" class="control-label">Supplied by:</label>
            <select id="supplierinput" class="form-select form-select-sm selectcontrol" name="supplierinput"> 
            <option value="all" selected >See All</option>             
            </select>
        </div>
        </div>


        
     </form>
     <div class="resultbanner mt-4">~  Found 0 results  ~</div>
     `;
    // POPULATE THE SELECTS IN THE DASHBOARD
    retrieveOptions('COMPONENTFAMILY').then(result => {
        document.querySelector("#family").innerHTML = result+document.querySelector("#family").innerHTML;        
    }).catch(error => {
        console.error('Failed to retrieve and log options:', error);
    });
    retrieveOptions('CONICALSTANDARDS').then(result => {
        document.querySelector("#standard").innerHTML = result+document.querySelector("#standard").innerHTML;        
    }).catch(error => {
        console.error('Failed to retrieve and log options:', error);
    });
    

     mat_options=document.querySelector("#materialinput");
     fetch('/aux/getmaterials',{
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
             mat_options.innerHTML+=`<option value="${element.id}" >${element.brandname}</option>`;                   
         });
     })
     .catch(error => {            
         console.error('Error during fetch:', error);
     });
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
    updateComponentsTable();
    
    const controls=document.querySelectorAll(".documentcontrol");
    for (let control of controls){

            control.addEventListener("input", ()=>{
                startBuffering();
                document.cookie = `resultpage=1`;
                    for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                        timeouts.push(setTimeout(updateComponentsTable.bind(null),500));
                    });

        }
        const selectcontrols=document.querySelectorAll(".selectcontrol");
        for (let control of selectcontrols){
                startBuffering();
                control.addEventListener("change", ()=>{
                        
                        document.cookie = `resultpage=1`;
                        for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                            timeouts.push(setTimeout(updateComponentsTable.bind(null),100));
                        });

            }

    }

 
   





async function updateComponentsTable(){
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
    <div class="col cw50 text-center etheader border ">
        <h3>ID</h3>
    </div> 
    <div class="col cw150  text-center etheader border   ">
        <h3>Part code</h3>
    </div>
    <div class="col cw400  text-center etheader border ">
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
    <div class="col cw100 text-center etheader border ">
        <h3>Packaging</h3>
    </div>
    <div class="col cw100  text-center etheader border ">
        <h3>Contact</h3>
    </div>
    <div class="col cw100 text-center etheader border ">
        <h3>CA65</h3>
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
    let article=document.getElementsByName("codeinput")[0].value;
    let description=document.getElementsByName("descriptioninput")[0].value;
    let intercompany=document.getElementsByName("intercompany")[0].value;
    let family=document.getElementsByName("family")[0].value;
    let standard=document.getElementsByName("standard")[0].value;
    let packaging=document.getElementsByName("packaging")[0].value;
    let contact=document.getElementsByName("contact")[0].value;
    let ca65=document.getElementsByName("ca65")[0].value;
    let baimold=document.getElementsByName("baimold")[0].value;
    let contains=document.getElementsByName("materialinput")[0].value;
    let suppliedby=document.getElementsByName("supplierinput")[0].value;

    //SEND REQUEST TO THE REST API

    let url = '/querycomp/';
    url+=`?description=${description}&article=${article}&intercompany=${intercompany}&family=${family}&standard=${standard}&packaging=${packaging}&contact=${contact}&ca65=${ca65}&baimold=${baimold}&contains=${contains}&suppliedby=${suppliedby}`;

    

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


        
        

    
        // if (response.status !== 200) {
        //     console.error('Request failed with status:', response.status);
        //     return ;
        // }

        let i=0;
        //POPULATE THE TABLE
        const processJsonResponseForComponents = (jsonResponse) => {
            return new Promise((resolve) => {
                
                
                let i = 0;
                const rv = 50;
                const rp = parseInt(getCookie("resultpage"));
                
                const minview = (rp-1)*50
                const maxview = rp*50-1;
                
                jsonResponse.forEach(obj => {
                    
                    if (i >= minview && i <=maxview && minview <= jsonResponse.length) {


                        const check_intercompany= obj.intercompany? "checked" : "";            
                        const check_packaging= obj.packagingmaterial? "checked" : "";
                        const check_contact= obj.contact? "checked" : "";
                        const check_california= obj.ca65? "checked" : "";
                        const standardplaceholder= obj.standard==null ? "NULL" : obj.standard;
                        document.querySelector("#targettable").innerHTML+=`
                        <div class="row" style="position: relative;">                    
                            <div class="col cw50 py-2 text-center etitem   border  bg-light etinactive boxid ">${obj.id}</div>
                            <div class="col cw150 py-2 text-center etitem border  bg-light etinactive editable boxarticle ">${obj.comp_id}</div>
                            <div class="col cw400 py-2 text-center etitem border  bg-light etinactive editable boxdescription ">${obj.description}</div>
                            <div class="col cw150 py-2 text-center etitem border  bg-light etinactive editable  editcheck"><input class="form-check-input boxintercompany " type="checkbox" ${check_intercompany} id="flexCheckDefault"></div>
                            <div class="col cw200 py-2 text-center etitem border  bg-light etinactive editable  editselect "> <select class="form-select selectcompfamily boxfamily" aria-label="Default select example"><option selected>${obj.family}</option></select></div>
                            <div class="col cw200 py-2 text-center etitem border  bg-light etinactive editable editselect "> <select class="form-select selectstandard boxstandard"  aria-label="Default select example"><option selected>${standardplaceholder}</option></select></div>
                            
                            <div class="col cw100 py-2 text-center etitem border  bg-light etinactive triggerrowcontrol editable  editcheck"><input class="form-check-input boxpackaging" type="checkbox" ${check_packaging} id="flexCheckDefault"></div>
                            <div class="col cw100 py-2 text-center etitem border  bg-light etinactive triggerrowcontrol editable  editcheck"><input class="form-check-input boxcontact" type="checkbox" ${check_contact} id="flexCheckDefault"></div>
                            <div class="col cw100 py-2 text-center etitem border  bg-light etinactive triggerrowcontrol editable  editcheck"><input class="form-check-input boxcalifornia" type="checkbox" ${check_california} id="flexCheckDefault"></div>
                                
                            <div class="col cw250 py-2 text-center etitem border  bg-light etinactive ">
                                <i class="fa fa-trash-o fa-1 deletebutton actionbutton"  onclick="deleteItemComponent(${obj.id})" aria-hidden="true"></i> <i class="fa fa-search-plus fa-1  actionbutton"  onclick="retrieveMaterialandSupplierinfos(${obj.id})" aria-hidden="true"></i><i class="fa fa-link fa-1  actionbutton pdfopener" targetref="/download/activespec?article=${obj.comp_id}" style="background-color: #F5B041;" onclick="" aria-hidden="true"></i>
                                
                            </div>                
                        </div>
                        `;

                    }
                    i++;
                });
                
                
                resolve();
            });
        };
        
        // Usage
        async function handleComponentsResponse(jsonResponse) {
            await processJsonResponseForComponents(jsonResponse);
            const allchecks=document.querySelectorAll(".editcheck.editable input");
            
        const allselects=document.querySelectorAll(".editselect.editable select");
        
        allchecks.forEach(check=>{ check.addEventListener("change",()=>editFather(check))});
        allselects.forEach(select=>{ select.addEventListener("change",()=>editFather(select))});
        // ASSIGN THE CORRECT OPTIONS TO THE SELECT INSIDE THE RESULTS TABLE
        const htmloptionsfamily= await retrieveOptions('COMPONENTFAMILY');
        document.querySelectorAll(".selectcompfamily").forEach(select=>{
            let current_value=select.value;
            select.innerHTML=htmloptionsfamily;
            select.value=current_value;      
        });
        const htmloptionsstandards= await retrieveOptions('CONICALSTANDARDS');
        document.querySelectorAll(".selectstandard").forEach(select=>{
            let current_value=select.value;
            select.innerHTML=htmloptionsstandards;
            select.value=current_value;
        });
        updateView();
        listenForDownloads();
        
        setTimeout(()=>{stopBuffering();document.getElementById("componentarticleinput").focus();},350);
        }
        handleComponentsResponse(jsonResponse);
        //UPDATE NUMBER OF RESULTS
        document.querySelector(".resultbanner").innerHTML=`~  Found ${jsonResponse.length} results  ~`;        
        
        // adjustTableCSS();
        //SHOW THE TABLE
        let totalcolumns=totalcomponentcolumns;
        // activeCellColoring(totalcolumns);
        // if(document.querySelector(".tabledisplay").classList.contains("invisible")) document.querySelector(".tabledisplay").classList.remove("invisible");
        
        return ;        
    } catch (error) {
        console.error('Error during fetch:', error);
        return ;
    }
    
}



function getExtendedCompFamily(family) {
    let selectElement = document.querySelector(".compfamilyinput")
    let options = selectElement.options;    
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === family) return options[i].textContent;        
    }    
    return "";
}
function changePageComponents(increment){
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
    
    updateComponentsTable();
}
function sendToEditComponents(){

    window.location.href="/app/editcomponents";


}

function renderEditableConfigs(id){
    localStorage.setItem("config_to_edit", id);
    window.location.replace("/app/editconfigurations")
}


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
                        
                        axios.put(`/querycomp/updatecomponent/${id}`, comp_correct,{ headers: { 'Authorization': authenticationheader()}})
                        .then((response) => {
                            if(!response.ok) createCustomAlert('Error','Something went wrong trying to save modifications', 'ok');
                        })
                        
                        if (processed_items==modified_items.length)  setTimeout(()=>{updateComponentsTable();},250);         
                        
                    }
                });               
             }  
            });




    
}
function deleteItemComponent(id){
     
    createCustomAlert('Attention','ARE YOU SURE YOU WANT TO DELETE THIS COMPONENT PERMANENTLY?', 'yesno')
    .then((result) => {
             if(!result) return;
             else{
                axios.delete(`/querycomp/delete/${id}`,{ headers: { 'Authorization': authenticationheader()}})
                .then((response) => {
                    updateComponentsTable();
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                    createCustomAlert('Error','Something went wrong trying to delete this user', 'ok');
                    
                });
             } 
            });
    

       
}