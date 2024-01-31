
function rendernewsuppliers(){
    let totalcolumns=9;
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
    newDash.classList.add("container");
    newDash.classList.add("mt-5");
    newDash.classList.add("addcomponent");
    newDash.innerHTML=`<div class="row">
                                   <div class="col-8 mx-auto mt-3">

                                       <form>
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
                                               <button type="submit" class="btn btn-primary btn-lg mx-auto" type="button">Submit Supplier</button>
                                           </div>





                                         </form>
                                   </div>
                               </div>`;

    }