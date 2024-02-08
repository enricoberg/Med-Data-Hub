
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



                                           <div class="mb-3">
                                               <button type="button" class="btn btn-primary btn-lg mx-auto" type="button" id="submitnewsup" onclick="submitsnewsup()">Submit Supplier</button>
                                           </div>





                                         </form>
                                   </div>
                               </div>`;

    }

    function submitsnewsup(){



                let form = document.getElementById('newsupform');
                let formData = new FormData(form);


                let name=document.querySelector("#nameinput").value;
                let sap=document.querySelector("#sapinput").value;
                let contact=document.querySelector("#contactinput").value;


                const url="/querysup/new"
                if(name=="" || sap=="") return;


                formData.append('name', name);
                formData.append('sap', sap);
                formData.append('contact', contact);



                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {'Authorization': authenticationheader() }
                })
                .then(response => {
                    if (response.ok) alert("New Supplier added successfully!");
                    rendersuppliers();
                })
                .catch(error => { alert("Your request is invalid or you do not have permission to perform it"); });

        }