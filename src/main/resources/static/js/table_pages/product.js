
async function renderproducts(){
    const curr_role= await fetch(`/aux/getrole?email=${currentuser()}`,{
        method: 'GET',
        headers: {'Authorization': authenticationheader() }})
    .then(response => {
        if (response.ok) return response.text();
    })    
    .catch(error => {
        console.error('Error during fetch:', error);
    });
    if(curr_role=="USER") {
        document.querySelector("#dashboardsection").click();
        return;
    }

    
    let totalcolumns=totalproductcolumns;
    clearbomtitles();
    clearTable(totalcolumns);
    //PREPARE THE DASHBOARD
    for(dashboard of document.querySelectorAll(".dashboard")) {
        dashboard.remove();
    }
    //CREATE A NEW DASHBOARD

    const newDash = document.createElement("div");
        const referenceElement = document.body.children[1];
        document.body.insertBefore(newDash, referenceElement);
        newDash.classList.add("dashboard");
        newDash.classList.add("products");
        newDash.innerHTML=`
        <div class="pagelabel">PAGE 1/7</div>
        <div class="add_button invisible" onclick="rendernewproduct()"><i class="fa-regular fa-square-plus"></i>Create new</div>
        <div class="prevbutton hover-message" title="Previous Page" onclick="changePageProducts(-1)"><img class="btnsmall" alt="Previous page" src="https://i.postimg.cc/zXN62Tk8/prev.png"></img></div>
        <div class="nextbutton hover-message" title="Next Page" onclick="changePageProducts(1)"><img class="btnsmall" alt="Next page" src="https://i.postimg.cc/FsxqM1Pc/next.png"></img></div>
        <div class="editbutton hover-message invisible" title="Edit Selection" onclick="sendToEditProducts()"><img class="btnsmall" alt="Edit selection" src="https://i.postimg.cc/xCjY1RdG/write.png"></img></div>
        <div class="csvbutton hover-message" title="Download CSV File" onclick="downloadFile()"><img class="btnsmall" alt="Download CSV file" src="https://i.postimg.cc/28Sp2V64/download.png"></img></div>
        <div class="clipboardbutton hover-message" title="Copy to clipboard" onclick="copyTableToClipboard()"><img alt="Copy content of the table" class="btnsmall" src="https://i.postimg.cc/gj4V1S6V/copy.png"></img></div>
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
                                    <option value="AV" selected>A/V SYSTEMS</option>
                                    <option value="BAGS" >TPN BAGS & ACCESSORIES</option>
                                    <option value="EC" >EMPTY CONTAINERS</option>
                                    <option value="AA" >ACUTE & APHERESIS</option>
                                    <option value="ENT" >ENTERAL NUTRITION & ACCESSORIES</option>
                                    <option value="OEM" >OEM</option>
                                    <option value="IU" >IRRIGATION / UROLOGY</option>
                                    <option value="ACCD" >ACID CONCENTRATE FOR CHRONIC DIALYSIS</option>
                                    <option value="HW" >HARDWARE</option>
                                    <option value="CATH" >CATHETERS & ACCESSORIES</option>
                                    <option value="COMP" >COMPONENTS - VARIOUS</option>
                                    <option value="PFG" >PURCHASED FINISHED GOODS</option>
                                    <option value="all" selected>See All</option>
                                  </select>
                                  <span class="ml-3">SAP STATUS: </span>
                                <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="sapstatusinput" id="sapstatusinput">
                                    <option value="M1V1" selected>M1V1 (planning stage)</option>
                                    <option value="M2V1" >M2V1 (active, planning stage)</option>
                                    <option value="M2V2" >M2V2 (active, free for sale)</option>
                                    <option value="M3V3" >M3V3 (discontinued line)</option>
                                    <option value="M4V4" >M4V4 (end of life, not saleable)</option>
                                    <option value="all" selected >See All</option>

                                  </select>
                                  <span class="ml-3">Sterilization Method: </span>
                                <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="sterimethodinput" id="sterimethodinput">
                                    <option value="S1XETO21" selected>1 x ETO 21</option>
                                    <option value="S2XETO21" >2 x ETO 21</option>
                                    <option value="S1XETO22" >1 x ETO 22</option>
                                    <option value="S2XETO22" >2 x ETO 22</option>
                                    <option value="GAMMA" >Raggi Gamma</option>
                                    <option value="BETA" >Raggi Beta</option>
                                    <option value="BULK" >Bulk / Non sterile</option>
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
                                    <option value="Sterilverona" >Sterilverona</option>
                                    <option value="Sterilveronanogara" >Sterilverona Nogara</option>
                                    <option value="Melsungen" >B.Braun Melsungen</option>
                                    <option value="Sterisastkomenda" >Sterisast Komenda</option>
                                    <option value="Sterisastwestport" >Sterisast Westport</option>
                                    <option value="Sterisastseriate" >Sterisast Seriate</option>
                                    <option value="Synergyhealth" >Synergy Health</option>
                                    
                                    <option value="all" selected>See All</option>
                                   </select>
            </div>

            <div class="resultbanner">~  Found 0 results  ~</div>
         </form>`;

    updateProductsTable(totalcolumns);
    const controls=document.querySelectorAll(".documentcontrol");
    for (let control of controls){

            control.addEventListener("input", ()=>{
                startBuffering();
                    for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                        timeouts.push(setTimeout(updateProductsTable.bind(null, totalcolumns),800));
                    });

        }
        const selectcontrols=document.querySelectorAll(".selectcontrol");
        for (let control of selectcontrols){

                control.addEventListener("change", ()=>{
                        startBuffering();
                        for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                            timeouts.push(setTimeout(updateProductsTable.bind(null, totalcolumns),100));
                        });

            }

    }








async function updateProductsTable(totalcolumns){
    clearTable(totalcolumns);

    //CREATE HEADERS
    document.querySelector(".grid-container").innerHTML+=
        `<div class="grid-item tableheader">Article Number</div>
        <div class="grid-item tableheader">Description</div>
        <div class="grid-item tableheader">SAP Status</div>
        <div class="grid-item tableheader">Product Family</div>
        <div class="grid-item tableheader">Intercompany</div>
        <div class="grid-item tableheader">Semifinished</div>
        <div class="grid-item tableheader">DHF</div>
        <div class="grid-item tableheader">RMF</div>
        <div class="grid-item tableheader">BUDI</div>
        <div class="grid-item tableheader">Sterilization Method</div>
        <div class="grid-item tableheader">Sterilization Site</div>
        <div class="grid-item tableheader">Shelf Life</div>
        <div class="grid-item tableheader">Bill of materials</div>
        `;


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


    //SEND REQUEST TO THE REST API

    let url = '/queryprod/';
    url+=`?description=${description}&article=${article}&intercompany=${intercompany}&family=${family}&sapstatus=${sapstatus}&semifinished=${semifinished}&dhf=${dhf}&rmf=${rmf}&budi=${budi}&sterimethod=${sterimethod}&sterisite=${sterisite}&shelflife=${shelflife}`;

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
        let numberofpages=Math.ceil(getCookie("totalresults")/getCookie("resultview"));
        let currentpage=getCookie("resultpage");        
        document.querySelector(".pagelabel").innerHTML=`PAGE ${currentpage}/${numberofpages}`;

        //UNHIDE THE ADD BUTTON IF THE USER HAS THE AUTHORITY (API IS BLOCKED BY SERVER IF NOT ALLOWED ANYWAY)
        fetch(`/aux/getrole?email=${currentuser()}`,{
                            method: 'GET',
                            headers: {'Authorization': authenticationheader() }})
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok: ' + response.statusText);
                            }
                            return response.text();
                        })
                        .then(data => {
                            if(data=="ENGINEER" || data=="ADMIN") document.querySelector(".add_button").classList.remove("invisible");
                            if(data=="ENGINEER" || data=="ADMIN") document.querySelector(".editbutton").classList.remove("invisible");
                        })
                        .catch(error => {
                            console.error('Error during fetch:', error);
                        });

        if (response.status !== 200) {
            console.error('Request failed with status:', response.status);
            return ;
        }


        //POPULATE THE TABLE
        let i=0;
        let productsToEdit=[];
        jsonResponse.forEach(obj => {
        //CALCULATE THE MATCHING INTERVAL OF RESULTS TO DISPLAY
                let rv=parseInt(getCookie("resultview"));
                let rp=parseInt(getCookie("resultpage"));
                let minview=rv*(rp-1);
                let maxview=rv*rp;

                if(i>=minview && i<maxview){
        productsToEdit.push(obj.code);
        const check1= obj.intercompany==true ? "&#10003;" : "&#10007;";
        const check2= obj.semifinished==true ? "&#10003;" : "&#10007;";
        const check3= obj.dhf!=null ? obj.dhf : "&#10007;";
        const check4= obj.rmf!=null ? obj.rmf : "&#10007;";
        const check5= obj.budi!=null ? obj.budi : "&#10007;";
        const check6= obj.sterilizationsite!=null ? obj.sterilizationsite : "&#10007;";
        const check7= obj.shelflife!=null ? obj.shelflife+" months" : "";
        
            document.querySelector(".grid-container").innerHTML+=
        `

        <div class="grid-item "><a class="pdfopener" targetref="/download/activespec?article=${obj.code}">${obj.code}</a></div>
        <div class="grid-item ">${obj.description}</div>
        <div class="grid-item ">${getExtendedSapStatus(obj.sapstatus)}</div>
        <div class="grid-item ">${getExtendedFamily(obj.family)}</div>
        <div class="grid-item ">${check1}</div>
        <div class="grid-item ">${check2}</div>
        <div class="grid-item ">${check3}</div>
        <div class="grid-item ">${check4}</div>
        <div class="grid-item ">${check5}</div>
        <div class="grid-item ">${getExtendedSteriMethod(obj.sterilizationcycle)}</div>
        <div class="grid-item ">${check6}</div>
        <div class="grid-item ">${check7}</div>
        <div class="grid-item "><a class="bomlink" onclick="renderEditableBoms(${obj.id})">See BOM</a></div>
        `;
        
        // <div class="grid-item "><a class="bomlink" onclick="renderboms('${obj.code}',${obj.id});">See BOM</a></div>
        }
        i++;
        });
        localStorage.setItem("products_to_edit", JSON.stringify(productsToEdit));
        listenForDownloads();
        //UPDATE NUMBER OF RESULTS
        document.querySelector(".resultbanner").innerHTML=`~  Found ${jsonResponse.length} results  ~`;
        //SHOW THE TABLE
        activeCellColoring(totalcolumns);
        if(document.querySelector(".tabledisplay").classList.contains("invisible")) document.querySelector(".tabledisplay").classList.remove("invisible");
        stopBuffering();
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
