
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

                                           <div class="mb-3">
                                               <button type="button" class="btn btn-primary btn-lg mx-auto" type="button" id="submitnewdoc" onclick="submitsnewdoc()">Submit Document</button>
                                           </div>





                                         </form>
                                   </div>
                               </div>`;
                          
    
    }

    function submitsnewdoc(){
      
       
      
            let form = document.getElementById('newdocform');
            let fileInput=document.querySelector("#formFile");
            let formData = new FormData(form);   
            let type;
            let article=document.querySelector("#articleinput").value;
            let revision=document.querySelector("#revinput").value.toUpperCase();
            let ppc=document.querySelector("#ppcinput").value;
            let active=document.querySelector("#activeinput").checked? "true" : "false";
            let assembly=document.querySelector("#assemblyinputfalse").checked? "false" : "true";
            if(document.querySelector("#typeinternal").checked) type="internal";
            else if(document.querySelector("#typesupplier").checked) type="supplier";
            else if(document.querySelector("#typewi").checked) type="wi";

            const url="/querydocs/new"
            if(article=="" || revision=="" || ppc=="" || fileInput.files.length ==0) return;


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
                if (response.ok) alert("New document created successfully!");
                renderspecifications();
            })
            .catch(error => { alert("Something went wrong with your request"); });

    }