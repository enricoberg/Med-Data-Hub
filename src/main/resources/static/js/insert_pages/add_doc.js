
async function rendernewdocuments(){
  event.preventDefault();
  resetPage();
    //CREATE A NEW DASHBOARD
    const newTitle = document.createElement("h3");
    
    newTitle.classList.add("bomtitle");
    newTitle.classList.add("mt-5");
    newTitle.innerHTML=`NEW DOCUMENT FORM - <a href="#" onclick="renderspecifications();">BACK TO DOCUMENTS</a>`;
    const newDash = document.createElement("div");   
    
    document.body.insertBefore(newDash, document.body.firstChild);
    document.body.insertBefore(newTitle, document.body.firstChild);
    newDash.classList.add("container");
    newDash.classList.add("mt-5");
    newDash.classList.add("addcomponent");
    newDash.innerHTML=`<div class="row">
                                   <div class="col-8 mx-auto mt-3">

                                       <form id="newdocform">
                                           <div class="mb-3">
                                             <label for="articleinput" class="form-label">Article Number</label>
                                             <input type="text" class="form-control" id="articleinput" name="articleinput">
                                           </div>
                                           <div class="mb-3">
                                               <label for="revinput" class="form-label">Revision</label>
                                               <input type="text" class="form-control" id="revinput" name="revinput">
                                           </div>
                                           <div class="mb-3">
                                               <label for="revinput" class="form-label">PPC Number</label>
                                               <input type="text" class="form-control" id="ppcinput" name="ppcinput">
                                           </div>
                                           <div class="mb-3">
                                               <label for="descinput" class="form-label">Description (only new component/product)</label>
                                               <input type="text" class="form-control" id="descinput" name="descinput">
                                           </div>
                                           <div class="mb-3 form-check ">
                                             <input type="checkbox" class="form-check-input" id="activeinput" name="activeinput" checked>
                                             <label class="form-check-label" for="activeinput">Active Revision</label>

                                           </div>
                                           <div class="mb-3 coloredsection pl-2 pt-1 pb-1">
                                               <div class="form-check">
                                                   <input class="form-check-input" type="radio" name="assemblyinput" id="assemblyinputfalse" checked>
                                                   <label class="form-check-label" for="assemblyinputfalse">
                                                     Component
                                                   </label>
                                                 </div>
                                                 <div class="form-check">
                                                   <input class="form-check-input" type="radio" name="assemblyinput" id="asssemblyinputtrue" >
                                                   <label class="form-check-label" for="asssemblyinputtrue">
                                                     Assembly
                                                   </label>
                                                 </div>
                                           </div>
                                           <div class="mb-3 coloredsection pl-2 pt-1 pb-1">
                                               <div class="form-check">
                                                   <input class="form-check-input" type="radio" name="docutypeinput" id="typeinternal" checked value="internal" >
                                                   <label class="form-check-label" for="typeinternal">
                                                     Internal Specification
                                                   </label>
                                                 </div>
                                                 <div class="form-check">
                                                   <input class="form-check-input" type="radio" name="docutypeinput" id="typesupplier" value="supplier" >
                                                   <label class="form-check-label" for="typesupplier">
                                                     Supplier Specification
                                                   </label>
                                                 </div>
                                                 <div class="form-check">
                                                   <input class="form-check-input" type="radio" name="docutypeinput" id="typewi" value="wi" >
                                                   <label class="form-check-label" for="typewi">
                                                     Work instructions
                                                   </label>
                                                 </div>
                                                 <div class="form-check">
                                                   <input class="form-check-input" type="radio" name="docutypeinput" id="typeartwork" value="artwork" >
                                                   <label class="form-check-label" for="typeartwork">
                                                     Artwork
                                                   </label>
                                                 </div>
                                           </div>
                                           <div class="mb-3">
                                               <label for="formFile" class="form-label">Select the file attachment</label>
                                               <input class="form-control" type="file" id="formFile" name="docfile" >
                                             </div>
                                            <div class="errormessage text-danger invisible mb-2" id="pwerror">Passwords are not matching</div>
                                           <div class="mb-3 w-100 text-center">
                                               <button type="button" class="btn btn-primary btn-lg mx-auto"  id="submitnewdoc" onclick="submitsnewdoc()">Submit Document</button>
                                           </div>





                                         </form>
                                   </div>
                               </div>`;
            document.querySelector("#articleinput").addEventListener("change",getLatestRev);
            document.querySelector("#activeinput").addEventListener("change",getLatestRev);
            document.querySelector("#typeinternal").addEventListener("change",getLatestRev);
            document.querySelector("#typesupplier").addEventListener("change",getLatestRev);
            document.querySelector("#typewi").addEventListener("change",getLatestRev);
            document.querySelector("#typeartwork").addEventListener("change",getLatestRev);
            document.querySelector("#articleinput").addEventListener("input",()=>{
             document.querySelector("#articleinput").value=document.querySelector("#articleinput").value.toUpperCase();
             });

             
          //CONTROL THAT THE INSERTED FILE IS SMALLER THAN 1MB
          document.getElementById('formFile').addEventListener('change',
              () => {
                let fileinput=document.querySelector("#formFile");                
                const file = fileinput.files[0];
                let errormessage=document.querySelector(".errormessage");
                if (file.size/1024 > 1024) {
                  
                  if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                  errormessage.innerHTML="The file you selected is too large. The maximum file size is 1 MB.";
                  fileinput.value="";
                } 
                else{
                  if (!errormessage.classList.contains("invisible")) errormessage.classList.add("invisible");
                }
              });
    
    }

    function submitsnewdoc(){
            //RETRIEVE THE DATA FROM THE FORM
            let article=document.querySelector("#articleinput").value;
            let description=document.querySelector("#descinput").value;
            let errormessage=document.querySelector(".errormessage");
            let form = document.getElementById('newdocform');
            let fileInput=document.querySelector("#formFile");
            let formData = new FormData(form);
            let type;
            let revision=document.querySelector("#revinput").value.toUpperCase();
            let ppc=document.querySelector("#ppcinput").value;
            let active=document.querySelector("#activeinput").checked? "true" : "false";
            let assembly=document.querySelector("#assemblyinputfalse").checked? "false" : "true";
            if(document.querySelector("#typeinternal").checked) type="internal";
            else if(document.querySelector("#typesupplier").checked) type="supplier";
            else if(document.querySelector("#typewi").checked) type="wi";
            else if(document.querySelector("#typeartwork").checked) type="artwork";
            //VALIDATE THE INPUT OF THE USER
            if(article=="" || revision=="" ) {
                    if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                    errormessage.innerHTML="Attention, all fields are mandatory before submitting the request";
                    return;
            }
            if(fileInput.files.length ==0) {
                    if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                    errormessage.innerHTML="Attention, you must select a file to upload first";
                    return;
            }
            if(description.length>60){
              if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                    errormessage.innerHTML="The description is too long. You are allowed 60 characters max";
                    return;
            }
            //CHECK THE INSERTED ARTICLE NUMBER EXISTS AND THROW AN ERROR IF NOT

            
                  const check=codeExists(article);
                  
                  if (!check) {
                  if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                  errormessage.innerHTML="The article number you inserted is not present in the database";
                  return;
                  }

                //MAKE THE QUERY IF THE ARTICLE IS VALID
                if (!errormessage.classList.contains("invisible")) errormessage.classList.add("invisible");
                const url="/querydocs/new";

                //SEND CONFIRMATION MESSAGE BEFORE SUBMITTING               


                createCustomAlert('Attention:','Are you sure you want to insert this document?', 'yesno')
                .then((result) => {   
                  if(!result) return;
                  else{
                    formData.append('article', article);
                    formData.append('revision', revision);
                    if(description!="") formData.append('description', description);
                    if(ppc!="") formData.append('ppc', ppc);                
                    formData.append('active', active);
                    formData.append('assembly', assembly);
                    formData.append('type', type);
    
    
                    fetch(url, {
                        method: 'POST',
                        body: formData,
                        headers: {'Authorization': authenticationheader() }
                    })
                    .then(response => {
                        if (!response.ok && response.status==501) {
                          if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                          errormessage.innerHTML="The document you tried to insert is already present"
                          
                          throw new Error('Network response was not ok: ');
                        } 
                        else if(!response.ok && response.status==502){
                          if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                          errormessage.innerHTML="No matching part, description is mandatory";
                          
                          throw new Error('Network response was not ok: ');
                        }
                        
                        localStorage.setItem("needupdate", false);
                        renderspecifications();
                        
                        
                          
                          setTimeout(()=>{document.querySelector("#speccodeinput").value=article;
                            setTimeout(()=>{
                              updateDocumentsTable(totaldocumentcolumns);
                            },50)
                        },350); 
                              
                        
                        
                    })
                    .catch(error => { createCustomAlert('Oops!','Something went wrong with your request.', 'ok'); });
                  }
                 });




                
                



      


    }

    function getLatestRev(){

    if(!document.querySelector("#activeinput").checked) return;
    let article=document.querySelector("#articleinput").value;
                    let docutype="";
                    if (document.querySelector("#typeinternal").checked) docutype="internal";
                    else if (document.querySelector("#typesupplier").checked) docutype="supplier";
                    else if (document.querySelector("#typewi").checked) docutype="wi";
                    else if (document.querySelector("#typeartwork").checked) docutype="artwork";
                    fetch(`/querydocs/getnextrev?article=${article}&type=${docutype}`,{
                                                method: 'GET',
                                                headers: {'Authorization': authenticationheader() }})
                    .then(response => {
                                                if (!response.ok) {
                                                    throw new Error('Network response was not ok: ' + response.statusText);
                                                }
                                                return response.text();
                                            })
                    .then(data => {
                                                document.querySelector("#revinput").value=data;
                                            })
                    .catch(error => {
                                                console.error('Error retrieving latest revision:', error);
                                            });

    }

    async function codeExists(article){

      fetch(`/querycomp/byname?id=${article}`,{headers: {'Authorization': authenticationheader() }})
      .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');                
                return response.text();
              })
      .then(data => { 
        
        if (data!= "") return true; 
    
              else{
                fetch(`/queryprod/byid?article=${article}`,{headers: {'Authorization': authenticationheader() }})
                .then(response => {
                          if (!response.ok) throw new Error('Network response was not ok');                
                          return response.text();
                        })
                .then(data => { 
                  
                  if (data!= "") {return true;}
                    return false; })
                .catch(error => { console.log("Error searching product");});
                  }
    
    
    })
    .catch(error => { console.log("Error searching component");});

    }