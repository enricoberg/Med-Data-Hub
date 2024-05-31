
async function rendercomponents(){
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


    let totalcolumns=totalcomponentcolumns;
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
    newDash.classList.add("documents");
    newDash.innerHTML=`
    <div class="pagelabel">PAGE 1/7</div>
    <div class="add_button invisible "  onclick="rendernewcomponents()"><i class="fa-regular fa-square-plus"></i>Create new</div>
    <div class="prevbutton hover-message" title="Previous Page" onclick="changePageComponents(-1)"><img class="btnsmall" alt="Previous page" src="https://i.postimg.cc/zXN62Tk8/prev.png"></img></div>
    <div class="nextbutton hover-message" title="Next Page" onclick="changePageComponents(1)"><img class="btnsmall" alt="Next page" src="https://i.postimg.cc/FsxqM1Pc/next.png"></img></div>
    <div class="csvbutton hover-message" title="Download CSV File" onclick="downloadFile()"><img class="btnsmall" alt="Download CSV file" src="https://i.postimg.cc/28Sp2V64/download.png"></img></div>
    <div class="clipboardbutton hover-message" title="Copy to clipboard" onclick="copyTableToClipboard()"><img alt="Copy content of the table" class="btnsmall" src="https://i.postimg.cc/gj4V1S6V/copy.png"></img></div>
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
            <select id="family" class="form-select form-select-sm selectcontrol compfamilyinput" name="family" >
                <option value="MATERIALS" selected>Raw materials</option>
                <option value="CAPS">Caps</option>
                <option value="CONNECTORS" selected>Connectors</option>
                <option value="CONICALCONNECTORS" selected>Conical Connectors</option>
                <option value="INJECTIONPOINTS" selected>Injection Points</option>
                <option value="FILTERS" selected>Filters</option>
                <option value="CLAMPS" selected>Clamps</option>
                <option value="SPIKES" selected>Spikes</option>
                <option value="CHAMBERS" selected>Drip Chambers</option>
                <option value="COVERS" selected>Covers</option>
                <option value="TUBES" selected>Tubes</option>
                <option value="VARIOUS" selected>Various components</option>
                <option value="BAGS" selected>Bags</option>
                <option value="CARTONS" selected>Boxes</option>
                <option value="POUCHES" selected>Pouches</option>
                <option value="ADJUVANTS" selected>Adjuvants</option>
                <option value="LABELS" selected>Labels</option>
                <option value="SFTUBES" selected>Semifinished tubes</option>
                <option value="SFVARIOUS" selected>Various semifinished goods</option>
                <option value="SFSPECIALBAGS" selected>Special Bags</option>
                <option value="SFBAGS150" selected>Semifinished bags 150mL</option>
                <option value="SFBAGS250" selected>Semifinished bags 250mL</option>
                <option value="SFBAGS500" selected>Semifinished bags 500mL</option>
                <option value="SFBAGS1500" selected>Semifinished bags 1000-1500mL</option>
                <option value="SFBAGS2500" selected>Semifinished bags 2000-2500mL</option>
                <option value="SFBAGS3500" selected>Semifinished bags 3000-3500mL</option>
                <option value="SFBAGS4500" selected>Semifinished bags 4000-4500mL</option>
                <option value="SFBAGS7000" selected>Semifinished bags 7000mL</option>
                <option value="PFG" selected>Purchased Finished Goods</option>


                <option value="all" selected>See All</option>
            </select>
        </div>
        <div class="form-group ">
        <label for="standard" class="control-label">Conical Standard</label>
            <select id="standard" class="form-select form-select-sm selectcontrol" name="standard">
              <option value="luer">Luer</option>
              <option value="enfit">ENFIT</option>
              <option value="tpnlock">TPN Lock</option>
              <option value="all" selected>See All</option>
            </select>
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


        <div class="resultbanner mt-4">~  Found 0 results  ~</div>
     </form>`;
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
    updateComponentsTable(totalcolumns);
    const controls=document.querySelectorAll(".documentcontrol");
    for (let control of controls){

            control.addEventListener("input", ()=>{
                    for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                        timeouts.push(setTimeout(updateComponentsTable.bind(null, totalcolumns),800));
                    });

        }
        const selectcontrols=document.querySelectorAll(".selectcontrol");
        for (let control of selectcontrols){

                control.addEventListener("change", ()=>{
                        for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                            timeouts.push(setTimeout(updateComponentsTable.bind(null, totalcolumns),800));
                        });

            }

    }

 
   





async function updateComponentsTable(totalcolumns){
    clearTable(totalcolumns);

    //CREATE HEADERS
    document.querySelector(".grid-container").innerHTML+=
            `<div class="grid-item tableheader">Part code</div>
            <div class="grid-item tableheader">Description</div>
            <div class="grid-item tableheader">Intercompany</div>
            <div class="grid-item tableheader">Family</div>
            <div class="grid-item tableheader">Conical standard</div>
            <div class="grid-item tableheader">Packaging Material</div>
            <div class="grid-item tableheader">In Contact</div>
            <div class="grid-item tableheader">California65 InScope</div>
            <div class="grid-item tableheader">BAI Mold</div>
            <div class="grid-item tableheader">Configurations</div>
            `;


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
                            if(data=="SUPERUSER" || data=="ADMIN") document.querySelector(".add_button").classList.remove("invisible");
                        })
                        .catch(error => {
                            console.error('Error during fetch:', error);
                        });

    
        if (response.status !== 200) {
            console.error('Request failed with status:', response.status);
            return ;
        }

        let i=0;
        //POPULATE THE TABLE
        jsonResponse.forEach(obj => {
        //CALCULATE THE MATCHING INTERVAL OF RESULTS TO DISPLAY
        let rv=parseInt(getCookie("resultview"));
        let rp=parseInt(getCookie("resultpage"));
        let minview=rv*(rp-1);
        let maxview=rv*rp;

        if(i>=minview && i<maxview && minview<=jsonResponse.length){


        const check1= obj.intercompany==true ? "&#10003;" : "&#10007;"
        const check2= obj.family==null ? "&#10007;" :getExtendedCompFamily(obj.family)
        const check3= obj.packagingmaterial==true ? "&#10003;" : "&#10007;"
        const check4= obj.contact==true ? "&#10003;" : "&#10007;"
        const check5= obj.ca65==true ? "&#10003;" : "&#10007;"
        const check6= obj.baimold==true ? "&#10003;" : "&#10007;"
        const check7= obj.standard==null ? "&#10007;" : obj.standard
            document.querySelector(".grid-container").innerHTML+=
        `
        <div class="grid-item "><a class="pdfopener" targetref="/download/activespec?article=${obj.comp_id}">${obj.comp_id}</a></div>
        <div class="grid-item ">${obj.description}</div>
        <div class="grid-item ">${check1}</div>
        <div class="grid-item ">${check2}</div>
        <div class="grid-item ">${check7}</div>
        <div class="grid-item ">${check3}</div>
        <div class="grid-item ">${check4}</div>
        <div class="grid-item ">${check5}</div>
        <div class="grid-item ">${check6}</div>
        <div class="grid-item "><a href="#" onclick="renderconfigurations('${obj.comp_id}')">See configurations</a></div>
        `;}
        i++;
        });
        listenForDownloads();
        //UPDATE NUMBER OF RESULTS
        document.querySelector(".resultbanner").innerHTML=`~  Found ${jsonResponse.length} results  ~`;        
        
        
        //SHOW THE TABLE
        activeCellColoring(totalcolumns);
        if(document.querySelector(".tabledisplay").classList.contains("invisible")) document.querySelector(".tabledisplay").classList.remove("invisible");
        
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
    
    updateComponentsTable(totalcomponentcolumns);
}