
async function rendernewcertificate(){
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
            newTitle.innerHTML=`NEW CERTIFICATE FORM - <a href="#" onclick="rendermaterials();">BACK TO MATERIALS</a>`;
    const newDash = document.createElement("div");
    const referenceElement2 = document.body.children[2];
    document.body.insertBefore(newDash, referenceElement2);
    newDash.classList.add("container");
    newDash.classList.add("mt-5");
    newDash.classList.add("addcertificate");
    newDash.innerHTML=`<div class="row">
                                   <div class="col-8 mx-auto mt-3">

                                       <form id="newcertform">
                                           <div class="mb-3 text-center">
                                                <label for="materialinput mx-auto text-center" class="form-label">Select the material</label>                                                
                                           </div>
                                           <div class="mb-3">                                                
                                                <select class="boxmaterial w-100 text-center" id="materialinput" name="materialinput"></select>
                                           </div>
                                           <div class="mb-3 coloredsection pl-2 pt-1 pb-1">
                                               <div class="form-check">
                                                   <input class="form-check-input" type="radio" name="docutypeinput" id="typetds" checked value="TDS" >
                                                   <label class="form-check-label" for="typetds">
                                                     Technical Datasheet
                                                   </label>
                                                </div>
                                                <div class="form-check">
                                                   <input class="form-check-input" type="radio" name="docutypeinput" id="typesds" value="SDS" >
                                                   <label class="form-check-label" for="typesds">
                                                     Safety Datasheet
                                                   </label>
                                                </div>
                                                <div class="form-check">
                                                   <input class="form-check-input" type="radio" name="docutypeinput" id="typecoa" value="COA" >
                                                   <label class="form-check-label" for="typecoa">
                                                     Certificate of Analysis
                                                   </label>
                                                </div>
                                                 
                                           </div>
                                           <div class="mb-3">
                                               <label for="formFile" class="form-label">Select the file attachment</label>
                                               <input class="form-control" type="file" id="formFile" name="docfile">
                                            </div>
                                            <div class="errormessage text-danger invisible mb-2" id="pwerror">Passwords are not matching</div>
                                           <div class="mb-3 text-center">
                                               <button type="button" class="btn btn-primary btn-lg mx-auto "  id="submitnewcert" onclick="submitsnewcert()">Submit Certificate</button>
                                           </div>





                                         </form>
                                   </div>
                               </div>`;



            //POPULATE THE MATERIAL SELECT
          
          document.querySelectorAll(".boxmaterial").forEach(select=>{
            
            select.innerHTML="";
            axios.get('/querymat/',{ headers: { 'Authorization': authenticationheader()}})
            .then((response)=>{
                response.data.forEach(function(materialobj){
                    select.innerHTML+=`
                    <option value="${materialobj.id}" >${materialobj.brandname}</option>            
                    `;
                });
                select.selectedIndex = -1;               
                
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
                alert("Something went wrong retrieving materials");
            });  
        });


    
    }

    function submitsnewcert(){
            //RETRIEVE THE DATA FROM THE FORM
            let form = document.getElementById('newcertform');
            let formData = new FormData(form);
            let errormessage=document.querySelector("#pwerror");
            if (!errormessage.classList.contains("invisible")) errormessage.classList.add("invisible");
            let materialid=document.querySelector("#materialinput").value;            
            let docutype = document.querySelector('input[name="docutypeinput"]:checked').value;
            let fileInput=document.querySelector("#formFile");
            //VALIDATE THE INPUT OF THE USER
            if(document.querySelector("#materialinput").selectedIndex==-1) {
                    errormessage.innerHTML="Attention, select a material first";
                    if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                    
                    return;
            }
            if(fileInput.files.length ==0) {
                    errormessage.innerHTML="Attention, you must select a file to upload first";
                    if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                    
                    return;
            }
            

            //MAKE THE QUERY IF THE ARTICLE IS VALID
            if (!errormessage.classList.contains("invisible")) errormessage.classList.add("invisible");
            

            //SEND CONFIRMATION MESSAGE BEFORE SUBMITTING
            if(!confirm("Are you sure you want to insert this document?")) return;

                formData.append('materialid', materialid);
                formData.append('docutype', docutype);
                


                fetch("/querydocs/newcert", {
                    method: 'POST',
                    body: formData,
                    headers: {'Authorization': authenticationheader() }
                })
                .then(response => {
                    if (!response.ok) {
                      if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                      errormessage.innerHTML="The document you tried to insert is already present";                      
                      throw new Error('Network response was not ok: ');
                    } 
                    
                    alert("New certificated uploaded successfully!");
                    rendernewcertificate();
                })
                .catch(error => { alert("Something went wrong with your request"); });               



    }

    
