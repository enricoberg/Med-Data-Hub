let timeouts=[];
function renderspecifications(){
    let totalcolumns=5;
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
    <div class="add_button invisible" onclick="rendernewdocuments()"><a href="#"><i class="fa-regular fa-square-plus"></i>Create new</a></div>
    <div class="csvbutton hover-message" title="Download CSV File" onclick="downloadFile()"><img class="btnsmall" alt="Download CSV file" src="https://i.postimg.cc/28Sp2V64/download.png"></img></div>
    <div class="clipboardbutton hover-message" title="Copy to clipboard" onclick="copyTableToClipboard()"><img alt="Copy content of the table" class="btnsmall" src="https://i.postimg.cc/gj4V1S6V/copy.png"></img></div>
    <form action="">
    <div class="input-group ">
        <input type="text" class="form-control documentcontrol" placeholder="Article number" name="codeinput" >
        <input type="text" class="form-control documentcontrol" placeholder="Description" name="descriptioninput">                
        <input type="text" class="form-control documentcontrol" placeholder="Revision" name="revinput">
        <input type="text" class="form-control documentcontrol" placeholder="PPC number" name="ppcinput" >
    </div>
    <div class="input-group " style="display: flex; justify-content: center;">
        <div class="labelinput">Active docs only</div>
        <input type="checkbox" name="checkactive" id="checkactive" class="documentcontrol" style="position: relative; left: 10px;" checked>
        <div class="labelinput">Internal Specification</div>
        <input type="checkbox" name="checkintspec" id="checkintspec" class="documentcontrol" style="position: relative; left: 10px;" checked>
        <div class="labelinput">Supplier spec</div>
        <input type="checkbox" name="checksupspec" id="checksupspec" class="documentcontrol" style="position: relative; left: 10px;" >
        <div class="labelinput">WI</div>
        <input type="checkbox" name="checkwi" id="checkwi" class="documentcontrol" style="position: relative; left: 10px;" >
        
        
    </div>   
    <div class="resultbanner">~  Found 0 results  ~</div>                
 </form>`;

    updateDocumentsTable(totalcolumns);
    const controls=document.querySelectorAll(".documentcontrol");
    for (let control of controls){
        control.addEventListener("input", ()=>{
        for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
            timeouts.push(setTimeout(updateDocumentsTable.bind(null, totalcolumns),800));
        });


        }

    }

 
   





async function updateDocumentsTable(totalcolumns){
    clearTable(totalcolumns);

    //CREATE HEADERS
    document.querySelector(".grid-container").innerHTML+=
        `<div class="grid-item tableheader">Article Number</div>
        <div class="grid-item tableheader">Type of document</div>
        <div class="grid-item tableheader">Revision</div>
        <div class="grid-item tableheader">PPC</div>
        <div class="grid-item tableheader">Description</div>
        `;

    //GET THE QUERY PARAMETERS
    let article=document.getElementsByName("codeinput")[0].value;
    let description=document.getElementsByName("descriptioninput")[0].value;
    let revision=document.getElementsByName("revinput")[0].value;
    let ppc=document.getElementsByName("ppcinput")[0].value;
    let wi=document.querySelector("#checkwi").checked;
    let intspec=document.querySelector("#checkintspec").checked;
    let supspec=document.querySelector("#checksupspec").checked;
    let active=document.querySelector("#checkactive").checked;   
    //SEND REQUEST TO THE REST API

    let url = '/querydocs/';
    url+=`?description=${description}&revision=${revision}&article=${article}&ppc=${ppc}&active=${active}&wi=${wi}&intspec=${intspec}&supplierspec=${supspec}`;



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
        jsonResponse.forEach(obj => {
            document.querySelector(".grid-container").innerHTML+=
        `
        <div class="grid-item "><a class="pdfopener"  targetref="/download/?filename=${obj.id}_${obj.revision.toUpperCase()}_${obj.documentType.toUpperCase()}">${obj.id}</a></div>
        <div class="grid-item ">${obj.documentType}</div>
        <div class="grid-item ">${obj.revision}</div>
        <div class="grid-item ">${obj.ppc}</div>
        <div class="grid-item ">${obj.description}</div>
        `;
        });

        //UPDATE NUMBER OF RESULTS
        document.querySelector(".resultbanner").innerHTML=`~  Found ${jsonResponse.length} results  ~`;
        //SHOW THE TABLE
        activeCellColoring(totalcolumns);
        if(document.querySelector(".tabledisplay").classList.contains("invisible")) document.querySelector(".tabledisplay").classList.remove("invisible");
        listenForDownloads();

        return ;        
    } catch (error) {
        console.error('Error during fetch:', error);
        return ;
    }
    
}

function clearTable(totalcolumns){

    const elementToRemove = document.querySelector('.bomcontainer');
    if (elementToRemove) elementToRemove.parentNode.removeChild(elementToRemove);

    //CHECK THE TABLE IS HIDDEN
        if(!document.querySelector(".tabledisplay").classList.contains("invisible")) document.querySelector(".tabledisplay").classList.add("invisible");
            
            document.documentElement.style.setProperty('--columnsnumber', totalcolumns);
            const container=document.querySelector(".grid-container");
            while (document.querySelector(".grid-container").firstChild) {
                container.removeChild(container.firstChild);
            }

}


