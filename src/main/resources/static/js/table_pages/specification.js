let timeouts=[];
function renderspecifications(){
    // event.preventDefault();    
    document.cookie = `resultpage=1`;    
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
    <div class="rainbowtext sectiontitle">DOCUMENTS TABLE</div>
    <div class="prevbutton hover-message" title="Previous Page" onclick="changePageDocuments(-1)"><img class="btnsmall" alt="Previous page" src="https://i.postimg.cc/zXN62Tk8/prev.png"></img></div>
    <div class="nextbutton hover-message" title="Next Page" onclick="changePageDocuments(1)"><img class="btnsmall" alt="Next page" src="https://i.postimg.cc/FsxqM1Pc/next.png"></img></div>
    <div class="csvbutton hover-message" title="Download CSV File" onclick="downloadFile()"><img class="btnsmall" alt="Download CSV file" src="../../css/download.png"></img></div>    
    <div class="clipboardbutton hover-message" title="Copy to clipboard" onclick="copyTableToClipboard()"><img alt="Copy content of the table" class="btnsmall" src="../../css/copy.png"></img></div>
    <div class="newrecbutton hover-message" title="New record" onclick="rendernewdocuments()" style="right:75px;"><img alt="New record" class="btnsmall" src="../../css/add.png"></img></div>
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
    
    updateDocumentsTable();
    const controls=document.querySelectorAll(".documentcontrol");
    for (let control of controls){
        control.addEventListener("input", ()=>{
            // startBuffering()
            document.cookie = `resultpage=1`;
        for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
            timeouts.push(setTimeout(updateDocumentsTable.bind(null),800));
        });


        }

    }

 
   





async function updateDocumentsTable(){
    setTimeout(() => {
        startBuffering();
    }, 25);
    
    resetPage(["dashboard"]);	
    const gridContainer = document.createElement("div");    
    // gridContainer.classList.add("containertabless");
    // gridContainer.classList.add("thininvisible");
    document.body.insertBefore(gridContainer, document.body.firstChild.nextSibling); 
    gridContainer.id="targettable";
    //CREATE HEADERS
    // gridContainer.innerHTML=`<div class=" mx-auto" id="targettable"></div>`;
    document.querySelector("#targettable").innerHTML=`<div class="row headerrow">                    
    <div class="col cw100 text-center etheader border ">
        <h3>ID</h3>
    </div> 
    <div class="col cw250  text-center etheader border   ">
        <h3>Article Number</h3>
    </div>
    <div class="col cw200  text-center etheader border ">
        <h3>Type of document</h3>
    </div>
    <div class="col cw150  text-center etheader border ">
        <h3>Revision</h3>
    </div>
    <div class="col cw150  text-center etheader border ">
        <h3>PPC</h3>
    </div>
    <div class="col cw550 text-center etheader border ">
        <h3>Description</h3>
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
            let descriptionplaceholder = obj.description==null ? "Description not found" : obj.description;
            if(obj.active) classcolor="text-primary";    
            document.querySelector("#targettable").innerHTML+=
        `
        <div class="row bomrow" style="position: relative;">                    
    <div class="etitem col cw100 text-center  border etinactive" >${obj.docid}</div> 
    <div class="etitem col cw250  text-center  border   etinactive">${obj.id}</div>
    <div class="etitem col cw200  text-center  border etinactive">${docutype}</div>
    <div class="etitem col cw150  text-center  border etinactive ${classcolor}">${obj.revision}</div>
    <div class="etitem col cw150  text-center  border etinactive ">${ppcnumber}</div>
    <div class="etitem col cw550 text-center  border etinactive">${descriptionplaceholder}</div>      
    <div class="etitem col cw250 text-center  border  etinactive">
        <i class="fa fa-trash-o fa-1 deletebutton actionbutton"  onclick="deleteItemDocument(${obj.docid})" aria-hidden="true"></i> <i class="fa fa-recycle fa-1  actionbutton"  onclick="sendToReplace(${obj.id})" aria-hidden="true"></i><i class="fa fa-link fa-1  actionbutton pdfopener" targetref="/download/?filename=${obj.id}_${obj.revision.toUpperCase()}_${obj.documentType.toUpperCase()}" style="background-color: #F5B041;" onclick="" aria-hidden="true"></i>
    </div>      
</div>       
        
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



function renderReplaceDocumentPage(specific=false){
    event.preventDefault();
    resetPage();
    const newTitle = document.createElement("h3");
    
    newTitle.classList.add("bomtitle");
    
    newTitle.innerHTML=`REPLACE EXISTING DOCUMENT -  <a href="#" onclick="renderspecifications();">BACK TO DOCUMENTS</a>`;


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
                    createCustomAlert('Success','New document replaced successfully!', 'ok') ;                    
                    window.location.replace("/app/home");
                })
                .catch(error => { createCustomAlert('Error','Something went wrong with your request', 'ok') ;});

    });



}

function deleteItemDocument(id){
     
    createCustomAlert('Attention','ARE YOU SURE YOU WANT TO DELETE THIS DOCUMENT PERMANENTLY? REMEMBER TO SET THE APPROPRIATE ACTIVE ATTRIBUTE TO THE REMAINING DOCS', 'yesno')
    .then((result) => {
             if(!result) return;
             else{
                axios.delete(`/querydocs/delete/${id}`,{ headers: { 'Authorization': authenticationheader()}})
                .then((response) => {
                    updateDocumentsTable();
                })
                .catch((error) => {
                    console.error("Error deleting doc:", error);
                    createCustomAlert('Error','Something went wrong trying to delete this document', 'ok');
                    
                });
             } 
            });
    

       
}
function sendToReplace(article){
    localStorage.setItem("articletoreplace",article);
    renderReplaceDocumentPage(true);
    
}