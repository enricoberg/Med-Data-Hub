
async function rendersuppliers(){
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


    let totalcolumns=totalsuppliercolumns;
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
    newDash.classList.add("suppliers");
    newDash.innerHTML=`
    <div class="pagelabel">PAGE 1/7</div>
    <div class="add_button invisible" onclick="rendernewsuppliers()"><i class="fa-regular fa-square-plus"></i>Create new</div>
    <div class="prevbutton hover-message" title="Previous Page" onclick="changePageSuppliers(-1)"><img class="btnsmall" alt="Previous page" src="https://i.postimg.cc/zXN62Tk8/prev.png"></img></div>
        <div class="nextbutton hover-message" title="Next Page" onclick="changePageSuppliers(1)"><img class="btnsmall" alt="Next page" src="https://i.postimg.cc/FsxqM1Pc/next.png"></img></div>
        <div class="editbutton hover-message invisible" title="Edit Selection" onclick="sendToEditSuppliers()"><img class="btnsmall" alt="Edit selection" src="https://i.postimg.cc/xCjY1RdG/write.png"></img></div>
        <div class="csvbutton hover-message" title="Download CSV File" onclick="downloadFile()"><img class="btnsmall" alt="Download CSV file" src="https://i.postimg.cc/28Sp2V64/download.png"></img></div>
    <div class="clipboardbutton hover-message" title="Copy to clipboard" onclick="copyTableToClipboard()"><img alt="Copy content of the table" class="btnsmall" src="https://i.postimg.cc/gj4V1S6V/copy.png"></img></div>
    <form action="">
        <div class="input-group ">
            <input type="text" class="form-control documentcontrol" placeholder="Supplier Name" name="nameinput" id="suppliernameinput">
            <input type="text" class="form-control documentcontrol" placeholder="Supplier's SAP Code" name="sapinput">
            <input type="text" class="form-control documentcontrol" placeholder="Supplier's Contacts" name="contactinput">
        </div>



        <div class="resultbanner">~  Found 0 results  ~</div>
     </form>`;

    updateSuppliersTable(totalcolumns);
    const controls=document.querySelectorAll(".documentcontrol");
    for (let control of controls){

            control.addEventListener("input", ()=>{
                    startBuffering();
                    for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                        timeouts.push(setTimeout(updateSuppliersTable.bind(null, totalcolumns),800));
                    });

        }
        const selectcontrols=document.querySelectorAll(".selectcontrol");
        for (let control of selectcontrols){

                control.addEventListener("change", ()=>{
                        startBuffering();
                        for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                            timeouts.push(setTimeout(updateSuppliersTable.bind(null, totalcolumns),100));
                        });

            }

    }








async function updateSuppliersTable(totalcolumns){
    clearTable(totalcolumns);

    //CREATE HEADERS
    document.querySelector(".grid-container").innerHTML+=
            `<div class="grid-item tableheader">Supplier Name</div>
            <div class="grid-item tableheader">SAP Code</div>
            <div class="grid-item tableheader">Contact information</div>
            `;


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
        let suppliersToEdit=[];
        let i=0;
        jsonResponse.forEach(obj => {
        //CALCULATE THE MATCHING INTERVAL OF RESULTS TO DISPLAY
                let rv=parseInt(getCookie("resultview"));
                let rp=parseInt(getCookie("resultpage"));
                let minview=rv*(rp-1);
                let maxview=rv*rp;

                if(i>=minview && i<maxview){
            suppliersToEdit.push(obj.id);
            const check1= obj.contact==null ? "No contact information" : obj.contact
            document.querySelector(".grid-container").innerHTML+=
        `
        <div class="grid-item ">${obj.supplier_name}</div>
        <div class="grid-item ">${obj.sap_code}</div>
        <div class="grid-item ">${check1}</div>
        `;

        }
        i++;
        });
        localStorage.setItem("suppliers_to_edit", JSON.stringify(suppliersToEdit));
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
function changePageSuppliers(increment){
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
    updateSuppliersTable(totalsuppliercolumns);
}

function sendToEditSuppliers(){

    window.location.href="/app/editsuppliers";


}

