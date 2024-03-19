
function rendermaterials(){
    let totalcolumns=totalmaterialcolumns;
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
    <div class="add_button invisible" onclick="rendernewmaterials()"><i class="fa-regular fa-square-plus"></i>Create new</div>
    <div class="prevbutton hover-message" title="Previous Page" onclick="changePageMaterials(-1)"><img class="btnsmall" alt="Previous page" src="https://i.postimg.cc/zXN62Tk8/prev.png"></img></div>
        <div class="nextbutton hover-message" title="Next Page" onclick="changePageMaterials(1)"><img class="btnsmall" alt="Next page" src="https://i.postimg.cc/FsxqM1Pc/next.png"></img></div>
    <div class="csvbutton hover-message" title="Download CSV File" onclick="downloadFile()"><img class="btnsmall" alt="Download CSV file" src="https://i.postimg.cc/28Sp2V64/download.png"></img></div>
    <div class="clipboardbutton hover-message" title="Copy to clipboard" onclick="copyTableToClipboard()"><img alt="Copy content of the table" class="btnsmall" src="https://i.postimg.cc/gj4V1S6V/copy.png"></img></div>
    <form action="">
        <div class="input-group ">
            <input type="text" class="form-control documentcontrol" placeholder="Brand Name" name="brandinput" id="materialnameinput" >
            <input type="text" class="form-control documentcontrol" placeholder="Manufactured By" name="supplierinput">
            <input type="text" class="form-control documentcontrol" placeholder="Plasticizer" name="plasticizerinput">
        </div>
        <div class="selectcontainer" style="display:flex; justify-content:align-center; align-items:center; flex-wrap:wrap;">
        <div class="form-group ">
        <label for="family" class="control-label "> Material Type </label>
        <select id="ifamily" class="form-select form-select-sm selectcontrol" name="familyinput">
                      <option value="ABS">ABS</option>
                      <option value="ACRYLIC">ACRYLIC</option>
                      <option value="ADHESIVE">ADHESIVE</option>
                      <option value="ADHESIVETPAPER">ADHESIVETPAPER</option>
                      <option value="ADHESIVETAPE">ADHESIVETAPE</option>
                      <option value="ALUMINIUM">ALUMINIUM</option>
                      <option value="CARDBOARD">CARDBOARD</option>
                      <option value="COATING">COATING</option>
                      <option value="COLORANT">COLORANT</option>
                      <option value="ETPU">ETPU</option>
                      <option value="FILM">FILM</option>
                      <option value="HDPE">HPE</option>
                      <option value="HIPS">HIPS</option>
                      <option value="INK">INK</option>
                      <option value="LDPE">LDPE</option>
                      <option value="MABS">MABS</option>
                      <option value="MEDICALPAPER">MEDICALPAPER</option>
                      <option value="MEMBRANE">MEMBRANE</option>
                      <option value="PA">PA</option>
                      <option value="PC">PC</option>
                      <option value="PES">PES</option>
                      <option value="PET">PET</option>
                      <option value="PETG">PETG</option>
                      <option value="PMMA">PMMA</option>
                      <option value="PP">PP</option>
                      <option value="PPE">PPE</option>
                      <option value="PRIMER">PRIMER</option>
                      <option value="PS">PS</option>
                      <option value="PSU">PSU</option>
                      <option value="PTFE">PTFE</option>
                      <option value="PU">PU</option>
                      <option value="PUR">PUR</option>
                      <option value="PVC">PVC</option>
                      <option value="PVCDEHPFREE">PVCDEHPFREE</option>
                      <option value="SAN">SAN</option>
                      <option value="SEBS">SEBS</option>
                      <option value="SILICONE">SILICONE</option>
                      <option value="SOLVENT">SOLVENT</option>
                      <option value="STEEL">STEEL</option>
                      <option value="TPE">TPE</option>
                      <option value="TYVEK">TYVEK</option>
                      <option value="VARIOUS">VARIOUS</option>
                      <option value="all" selected>Select All</option>
                    </select>
        </div>


        </div>


        <div class="resultbanner">~  Found 0 results  ~</div>
     </form>`;

    updateMaterialsTable(totalcolumns);
    const controls=document.querySelectorAll(".documentcontrol");
    for (let control of controls){

            control.addEventListener("input", ()=>{
                    for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                        timeouts.push(setTimeout(updateMaterialsTable.bind(null, totalcolumns),800));
                    });

        }
        const selectcontrols=document.querySelectorAll(".selectcontrol");
        for (let control of selectcontrols){

                control.addEventListener("change", ()=>{
                        for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                            timeouts.push(setTimeout(updateMaterialsTable.bind(null, totalcolumns),800));
                        });

            }

    }








async function updateMaterialsTable(totalcolumns){
    clearTable(totalcolumns);

    //CREATE HEADERS
    document.querySelector(".grid-container").innerHTML+=
            `<div class="grid-item tableheader">Brand Name</div>
            <div class="grid-item tableheader">Manufactured By</div>
            <div class="grid-item tableheader">Material Type</div>
            <div class="grid-item tableheader">Plasticizer</div>
            <div class="grid-item tableheader">Datasheet</div>


            `;


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


        //POPULATE THE TABLE
        let i=0;
        jsonResponse.forEach(obj => {

        //CALCULATE THE MATCHING INTERVAL OF RESULTS TO DISPLAY
                let rv=parseInt(getCookie("resultview"));
                let rp=parseInt(getCookie("resultpage"));
                let minview=rv*(rp-1);
                let maxview=rv*rp;

                if(i>=minview && i<maxview){
        let checknull1= obj.family==null ? "&#10007;" : obj.family;
        let checknull2= obj.plasticizer==null ? "&#10007;" : obj.plasticizer;
            document.querySelector(".grid-container").innerHTML+=
        `

        <div class="grid-item ">${obj.brandname}</div>
        <div class="grid-item ">${obj.supplier}</div>
        <div class="grid-item ">${checknull1}</div>
        <div class="grid-item ">${checknull2}</div>
        <div class="grid-item "><a class="pdfopener" targetref="/download/?filename=TDS_${obj.id}">TDS</a> ---
        <a class="pdfopener"  targetref="/download/?filename=SDS_${obj.id}">SDS</a> ---
        <a  class="usagelink" onclick="renderqueryadv3(${obj.id})">See Usage</a>
        </div>
        `;

        }
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
function changePageMaterials(increment){
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
    updateMaterialsTable(totalmaterialcolumns);
}



