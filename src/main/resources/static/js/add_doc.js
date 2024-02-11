
async function rendernewdocuments(){
    let totalcolumns=9;
    clearbomtitles();
    clearTable(totalcolumns);
    //PREPARE THE DASHBOARD
    for(dashboard of document.querySelectorAll(".dashboard")) {
        dashboard.remove();
    }
    //CREATE A NEW DASHBOARD
    const newTitle = document.createElement("h3");
            const referenceElement = document.body.children[1];
            document.body.insertBefore(newTitle, referenceElement);
            newTitle.classList.add("bomtitle");
            newTitle.classList.add("mt-5");
            newTitle.innerHTML=`NEW DOCUMENT FORM - <a href="#" onclick="renderspecifications();">BACK TO DOCUMENTS</a>`;
    const newDash = document.createElement("div");
    const referenceElement2 = document.body.children[2];
    document.body.insertBefore(newDash, referenceElement2);
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
                                           </div>
                                           <div class="mb-3">
                                               <label for="formFile" class="form-label">Select the file attachment</label>
                                               <input class="form-control" type="file" id="formFile" name="docfile">
                                             </div>
                                            <div class="errormessage text-danger invisible mb-2" id="pwerror">Passwords are not matching</div>
                                           <div class="mb-3">
                                               <button type="button" class="btn btn-primary btn-lg mx-auto"  id="submitnewdoc" onclick="submitsnewdoc()">Submit Document</button>
                                           </div>





                                         </form>
                                   </div>
                               </div>`;
                          
    
    }

    function submitsnewdoc(){
            //RETRIEVE THE DATA FROM THE FORM
            let article=document.querySelector("#articleinput").value;
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
            //VALIDATE THE INPUT OF THE USER
            if(article=="" || revision=="" || ppc=="") {
                    if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                    errormessage.innerHTML="Attention, all fields are mandatory before submitting the request";
                    return;
            }
            if(fileInput.files.length ==0) {
                    if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                    errormessage.innerHTML="Attention, you must select a file to upload first";
                    return;
            }
            //CHECK THE INSERTED ARTICLE NUMBER EXISTS AND THROW AN ERROR IF NOT

            fetch(`/querycomp/byname?id=${article}`,{headers: {'Authorization': authenticationheader() }})
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.text();
              })
              .then(data => {

                  if (data=== "") {
                  if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                  errormessage.innerHTML="The article number you inserted is not present in the database";
                  return;
                  }

                //MAKE THE QUERY IF THE ARTICLE IS VALID
                if (!errormessage.classList.contains("invisible")) errormessage.classList.add("invisible");
                const url="/querydocs/new";

                //SEND CONFIRMATION MESSAGE BEFORE SUBMITTING
                if(!confirm("Are you sure you want to insert this document?")) return;

                formData.append('article', article);
                formData.append('revision', revision);
                formData.append('ppc', ppc);
                formData.append('active', active);
                formData.append('assembly', assembly);
                formData.append('type', type);


                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {'Authorization': authenticationheader() }
                })
                .then(response => {
                    if (!response.ok)  throw new Error('Network response was not ok');
                    alert("New document created successfully!");
                    renderspecifications();
                })
                .catch(error => { alert("Something went wrong with your request"); });
                })
                .catch(error => {
                  console.error('There was a problem with the fetch operation:', error);
                });



      


    }