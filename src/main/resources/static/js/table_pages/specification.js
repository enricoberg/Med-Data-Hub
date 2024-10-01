let timeouts=[];
function renderspecifications(){
    event.preventDefault();
    window.addEventListener('resize', ()=>{ adjustTableCSS(); });
    document.cookie = `resultpage=1`;
    let totalcolumns=totaldocumentcolumns;
    resetPage();
    //CREATE A NEW DASHBOARD
        
    const newDash = document.createElement("div");
    // const referenceElement = document.body.children[1]; 
    document.body.insertBefore(newDash, document.body.firstChild);
    // document.body.insertBefore(newDash, referenceElement);
    newDash.classList.add("dashboard");
    newDash.classList.add("documents");
    newDash.innerHTML=`
    <div class="pagelabel"></div>
    
    <div class="prevbutton hover-message" title="Previous Page" onclick="changePageDocuments(-1)"><img class="btnsmall" alt="Previous page" src="https://i.postimg.cc/zXN62Tk8/prev.png"></img></div>
        <div class="nextbutton hover-message" title="Next Page" onclick="changePageDocuments(1)"><img class="btnsmall" alt="Next page" src="https://i.postimg.cc/FsxqM1Pc/next.png"></img></div>
    <div class="csvbutton hover-message" title="Download CSV File" onclick="downloadFile()"><img class="btnsmall" alt="Download CSV file" src="https://i.postimg.cc/28Sp2V64/download.png"></img></div>
    <div class="clipboardbutton hover-message" title="Copy to clipboard" onclick="copyTableToClipboard()"><img alt="Copy content of the table" class="btnsmall" src="https://i.postimg.cc/gj4V1S6V/copy.png"></img></div>
    <form action="">
    <div class="input-group ">
        <input type="text" class="form-control documentcontrol" placeholder="Article number" name="codeinput" id="speccodeinput" >
        <input type="text" class="form-control documentcontrol" placeholder="Description" name="descriptioninput" id="specdescinput">                
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
        <div class="labelinput">Artworks</div>
        <input type="checkbox" name="checkartwork" id="checkartwork" class="documentcontrol" style="position: relative; left: 10px;" >
        <div class="labelinput invisible">PPC</div>
        <input type="checkbox" name="checkppc" id="checkppc" class="documentcontrol invisible" style="position: relative; left: 10px;" >
        <div class="labelinput invisible">Test Reports</div>
        <input type="checkbox" name="checktr" id="checktr" class="documentcontrol invisible" style="position: relative; left: 10px;" >
        <div class="labelinput invisible">Design Documents</div>
        <input type="checkbox" name="checkdd" id="checkdd" class="documentcontrol invisible" style="position: relative; left: 10px;" >
        <div class="labelinput invisible">DHR</div>
        <input type="checkbox" name="checkdhr" id="checkdhr" class="documentcontrol invisible" style="position: relative; left: 10px;" >
        
    </div>   
    <div class="resultbanner"></div>                
 </form>`;
    
    updateDocumentsTable(totalcolumns);
    const controls=document.querySelectorAll(".documentcontrol");
    for (let control of controls){
        control.addEventListener("input", ()=>{
            // startBuffering()
            document.cookie = `resultpage=1`;
        for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
            timeouts.push(setTimeout(updateDocumentsTable.bind(null, totalcolumns),800));
        });


        }

    }

 
   





async function updateDocumentsTable(totalcolumns){
    setTimeout(() => {
        startBuffering();
    }, 25);
    // clearTable(totalcolumns);
    resetPage(["dashboard"]);	
    const gridContainer = document.createElement("div");    
    gridContainer.classList.add("grid-container");
    gridContainer.classList.add("thininvisible");
    document.body.insertBefore(gridContainer, document.body.lastChild);    
    
    
    //CREATE HEADERS
    gridContainer.innerHTML+=
        `
        <div class="grid-item cw250 tableheader">Article Number</div>
        <div class="grid-item cw200 tableheader ">Type of document</div>
        <div class="grid-item cw150 tableheader">Revision</div>
        <div class="grid-item cw250 tableheader">PPC</div>
        <div class="grid-item cw500 tableheader">Description</div>
        
        
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
    let revision=document.getElementsByName("revinput")[0].value;
    let ppc=document.getElementsByName("ppcinput")[0].value;
    let wi=document.querySelector("#checkwi").checked;
    let intspec=document.querySelector("#checkintspec").checked;
    let supspec=document.querySelector("#checksupspec").checked;
    let artwork=document.querySelector("#checkartwork").checked;
    let testreport=document.querySelector("#checktr").checked;
    let designdocument=document.querySelector("#checkdd").checked;
    let dhr=document.querySelector("#checkdhr").checked;
    let ppcdoc=document.querySelector("#checkppc").checked;
    let active=document.querySelector("#checkactive").checked;   
    //SEND REQUEST TO THE REST API
    
    let url = '/querydocs/';
    url+=`?description=${description}&revision=${revision}&article=${article}&ppc=${ppc}&active=${active}&wi=${wi}&intspec=${intspec}&supplierspec=${supspec}&page=${getCookie("resultpage")}&artwork=${artwork}&tr=${testreport}&dd=${designdocument}&dhr=${dhr}&ppcdoc=${ppcdoc}`;
    


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
                    if(data=="DOCUMENTATION" || data=="ADMIN") document.querySelector(".add_button").classList.remove("invisible");
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
                
                
                

                if(true){
                let ppcnumber = (obj.ppc!=null && obj.ppc!="null" ) ? obj.ppc : "n.a.";
                let docutype="";
                switch(obj.documentType){
                    case "InternalSpecification":
                        docutype="Internal Specification";
                        break;
                    case "SupplierSpecification":
                        docutype="Supplier Specification";
                        break;
                    case "WI":
                        docutype="Work Instruction";
                        break;
                    case "ARTWORK":
                        docutype="Artwork";
                        break;
                    case "TR":
                        docutype="Test Report";
                        break;
                    case "DD":
                        docutype="Design Document";
                        break;
                    case "PPC":
                        docutype="Post Production Change";
                        break;
                    case "DHR":
                        docutype="Device History Record";
                        break;
                    default:                        
                        docutype="Undefined";
                        break;
                }

            let classcolor="";
            if(obj.active) classcolor="text-primary";    
            document.querySelector(".grid-container").innerHTML+=
        `
        
        <div class="grid-item cw250"><a class="pdfopener"  targetref="/download/?filename=${obj.id}_${obj.revision.toUpperCase()}_${obj.documentType.toUpperCase()}">${obj.id}</a></div>
        <div class="grid-item cw200">${docutype}</div>
        
        
        <div class="grid-item cw150 ${classcolor}">${obj.revision}</div>
        <div class="grid-item cw250">${ppcnumber}</div>
        <div class="grid-item cw500">${obj.description}</div>
        
        
        `;

        }
        i++;
        });
        
        let rv=parseInt(getCookie("totalresults"));
        let rp=parseInt(getCookie("resultpage"));
        let minview=rv*(rp-1);
        let maxview=rv*rp;        
        //UPDATE NUMBER OF RESULTS
        if(getCookie("totalresults")<=0) document.querySelector(".resultbanner").innerHTML=`  No more results `;
        else if(getCookie("totalresults")<50) document.querySelector(".resultbanner").innerHTML=`  Viewing results ${minview+1} ÷ ${minview+parseInt(getCookie("totalresults"))} `;
        else document.querySelector(".resultbanner").innerHTML=`  Viewing results ${minview+1} ÷ ${maxview} `;
        adjustTableCSS();
        
        //SHOW THE TABLE
        activeCellColoring(totalcolumns);
        
        // if(document.querySelector(".tabledisplay").classList.contains("invisible")) document.querySelector(".tabledisplay").classList.remove("invisible");
        listenForDownloads();
        stopBuffering();
        
        return ;        
    } catch (error) {
        console.error('Error during fetch:', error);
        return ;
    }
    
}

function clearTable(totalcolumns){
    document.cookie= 'refreshcount=0';
    

    

    for (let i = 0; i < elementsToRemove.length; i++) {
        const elementToRemove = document.querySelector(elementsToRemove[i]);
        if (elementToRemove) elementToRemove.parentNode.removeChild(elementToRemove);
    }
    

    //CHECK THE TABLE IS HIDDEN
        if(!document.querySelector(".tabledisplay").classList.contains("invisible")) document.querySelector(".tabledisplay").classList.add("invisible");
            
            document.documentElement.style.setProperty('--columnsnumber', totalcolumns);
            const container=document.querySelector(".grid-container");
            while (document.querySelector(".grid-container").firstChild) {
                container.removeChild(container.firstChild);
            }

}
function changePageDocuments(increment){
    let rp=parseInt(getCookie("resultpage"));
    

    
    


    rp=rp+increment;
    if(rp<1) {
        rp=1;
        document.cookie = `resultpage=${rp}`;
        return;
    }
    document.cookie = `resultpage=${rp}`;
    updateDocumentsTable(totaldocumentcolumns);
}



function renderReplaceDocumentPage(){
    event.preventDefault();
    resetPage();
    const newTitle = document.createElement("h3");
    
    newTitle.classList.add("bomtitle");
    
    newTitle.innerHTML=`REPLACE EXISTING DOCUMENT -  <a href="" onclick="renderspecifications();">BACK TO DOCUMENTS</a>`;


    const newDash = document.createElement("div");    
    document.body.prepend(newDash);    
    document.body.insertBefore(newTitle, document.body.firstChild);
    newDash.classList.add("formcontainer"); 
    newDash.style.flexDirection="column"; 
    newDash.style.minHeight="50vh";
    newDash.innerHTML=`
    <div class="mb-3" style="justify-content: center">           
        <label for="formFile"  style="display: block; text-align: center">Select the correct file, make sure the filename is correct</label>                  
    </div>
    <div class="mb-3"  style="justify-content: center">
        <input class="form-control mx-auto w-50" type="file" id="formFile" name="docfile">   
    </div>    
    <div class="mb-3" style="justify-content: center">
        <button type="button" class="btn btn-primary mx-auto w-25" id="replacebutton">Replace the file</button>
    </div>
    `;
    
    document.querySelector("#replacebutton").addEventListener("click", function(){
        let fileInput=document.querySelector("#formFile");
        if(fileInput.files.length ==0) {      
                createCustomAlert('Attention','You must select a file to upload first', 'ok') ;           
                return;
        }
        if(!window.confirm("Are you sure you want to replace the existing document? Make sure the filename is correct before submitting, the operation is irreversible")) return;
        const formData = new FormData(); 
        formData.append('docfile', fileInput.files[0]);       


        fetch("/querydocs/replace", {
                    method: 'POST',
                    body: formData,
                    headers: {'Authorization': authenticationheader() }
                })
                .then(response => {
                    if (!response.ok)  throw new Error('Network response was not ok');
                    alert("New document replaced successfully!");
                    window.location.replace("/app/home");
                })
                .catch(error => { alert("Something went wrong with your request"); });

    });



}

