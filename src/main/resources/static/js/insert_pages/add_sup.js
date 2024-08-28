
function rendernewsuppliers(){
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
            newTitle.innerHTML=`NEW SUPPLIER FORM - <a href="#" onclick="rendersuppliers();">BACK TO SUPPLIERS</a>`;
    const newDash = document.createElement("div");
    const referenceElement2 = document.body.children[2];
    document.body.insertBefore(newDash, referenceElement2);
    newDash.classList.add("container");
    newDash.classList.add("mt-5");
    newDash.classList.add("addcomponent");
    newDash.innerHTML=`<div class="row">
                                   <div class="col-8 mx-auto mt-3">

                                       <form id="newsupform">
                                           <div class="mb-3">
                                             <label for="articleinput" class="form-label">Supplier Name</label>
                                             <input type="text" class="form-control" id="nameinput" name="nameinput">
                                           </div>
                                           <div class="mb-3">
                                               <label for="revinput" class="form-label">Supplier SAP number</label>
                                               <input type="text" class="form-control" id="sapinput" name="sapinput">
                                           </div>
                                           <div class="mb-3">
                                               <label for="revinput" class="form-label">Supplier Contacts</label>
                                               <input type="text" class="form-control" id="contactinput" name="contactinput" style="min-height: 100px;">
                                           </div>


                                           <div class="errormessage text-danger invisible mb-2" id="pwerror">Passwords are not matching</div>
                                           <div class="mb-3 w-100 text-center">
                                               <button type="button" class="btn btn-primary btn-lg mx-auto" type="button" id="submitnewsup" onclick="submitsnewsup()">Submit Supplier</button>
                                           </div>





                                         </form>
                                   </div>
                               </div>`;

    }

    function submitsnewsup(){

                //RETRIEVE ALL THE DATA FROM THE FORM
                let errormessage=document.querySelector(".errormessage");
                let form = document.getElementById('newsupform');
                let formData = new FormData(form);
                let name=document.querySelector("#nameinput").value;
                let sap=document.querySelector("#sapinput").value;
                let contact=document.querySelector("#contactinput").value;



                //VALIDATE THE INPUT OF THE USER
                if(name=="" || sap==""){
                    if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                    errormessage.innerHTML="Attention, Supplier name and sap code are mandatory fields";
                return;
                }

                if (!errormessage.classList.contains("invisible")) errormessage.classList.add("invisible");
                //SEND CONFIRMATION MESSAGE BEFORE SUBMITTING               
                createCustomAlert('Attention:','Are you sure you want to insert this document?', 'yesno')
                .then((result) => {    
                    if(!result) return;
                    else{
                        const url="/querysup/new"
                        formData.append('name', name);
                        formData.append('sap', sap);
                        formData.append('contact', contact);
        
                        
        
                        fetch(url, {
                            method: 'POST',
                            body: formData,
                            headers: {'Authorization': authenticationheader() }
                        })
                        .then(response => {
                            if (!response.ok)  throw new Error('Network response was not ok');                    
                            createCustomAlert('Great!','New Supplier added successfully!', 'ok');
                            rendersuppliers();
                        })
                        .catch(error => { createCustomAlert('Oops!','Your request is invalid or you do not have permission to perform it.', 'ok'); });
                    } 
                });

               

        }