
function rendernewdocuments(){
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
                                                   <input class="form-check-input" type="radio" name="docutypeinput" id="typeinternal" checked>
                                                   <label class="form-check-label" for="typeinternal">
                                                     Internal Specification
                                                   </label>
                                                 </div>
                                                 <div class="form-check">
                                                   <input class="form-check-input" type="radio" name="docutypeinput" id="typesupplier" >
                                                   <label class="form-check-label" for="typesupplier">
                                                     Supplier Specification
                                                   </label>
                                                 </div>
                                                 <div class="form-check">
                                                   <input class="form-check-input" type="radio" name="docutypeinput" id="typewi" >
                                                   <label class="form-check-label" for="typewi">
                                                     Work instructions
                                                   </label>
                                                 </div>
                                           </div>
                                           <div class="mb-3">
                                               <label for="formFile" class="form-label">Select the file attachment</label>
                                               <input class="form-control" type="file" id="formFile">
                                             </div>

                                           <div class="mb-3">
                                               <button type="submit" class="btn btn-primary btn-lg mx-auto" type="button">Submit Document</button>
                                           </div>





                                         </form>
                                   </div>
                               </div>`;

    }