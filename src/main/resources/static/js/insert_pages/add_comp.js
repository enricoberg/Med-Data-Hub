
function rendernewcomponents(){
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
    newTitle.innerHTML=`NEW COMPONENT FORM - <a href="#" onclick="rendercomponents();">BACK TO COMPONENTS</a>`;
    const newDash = document.createElement("div");
    const referenceElement2 = document.body.children[2];
    document.body.insertBefore(newDash, referenceElement2);
    newDash.classList.add("container");
    newDash.classList.add("mt-5");
    newDash.classList.add("addcomponent");
    newDash.innerHTML=`<div class="row">
                                  <div class="col-8 mx-auto mt-3">

                                      <form id="newcompform">
                                          <div class="mb-3">
                                            <label for="articleinput" class="form-label">Article Number</label>
                                            <input type="text" class="form-control" id="articleinput" name="articleinput">
                                          </div>
                                          <div class="mb-3">
                                              <label for="revinput" class="form-label">Description</label>
                                              <input type="text" class="form-control" id="descriptioninput" name="descriptioninput">
                                          </div>
                                          <div class="mb-3 form-check ">
                                            <input type="checkbox" class="form-check-input" id="intercompanyinput" name="intercompanyinput" >
                                            <label class="form-check-label" for="activeinput">Intercompany Component</label>
                                          </div>
                                          <div class="mb-3 form-check ">
                                              <input type="checkbox" class="form-check-input" id="packaginginput" name="packaginginput" >
                                              <label class="form-check-label" for="activeinput">Packaging Material</label>
                                          </div>
                                          <div class="mb-3 form-check ">
                                              <input type="checkbox" class="form-check-input" id="contactinput" name="contactinput" >
                                              <label class="form-check-label" for="activeinput">Component In-Contact</label>
                                          </div>
                                          <div class="mb-3 form-check ">
                                              <input type="checkbox" class="form-check-input" id="ca65input" name="ca65input" >
                                              <label class="form-check-label" for="activeinput">California 65 In Scope</label>
                                          </div>
                                          <div class="mb-3 form-check ">
                                              <input type="checkbox" class="form-check-input" id="baimoldinput" name="baimoldinput" >
                                              <label class="form-check-label" for="activeinput">Mold owned by BAI</label>
                                          </div>
                                          <div class="mb-3 coloredsection pl-2 pt-3 pb-1">
                                              <span>Family of the component: </span>
                                              <select class="form-select form-select-lg mb-3" aria-label="Large select example" id="familyinput">                                                  
                                                  <option value="ADJUVANTS" selected>Adjuvants</option>
                                                  <option value="BAGS" selected>Bags</option>
                                                  <option value="CAPS">Caps</option>
                                                  <option value="CARTONS" selected>Boxes</option>
                                                  <option value="CHAMBERS" selected>Drip Chambers</option>
                                                  <option value="CLAMPS" selected>Clamps</option>
                                                  <option value="CONNECTORS" selected>Connectors</option>
                                                  <option value="CONICALCONNECTORS" selected>Conical Connectors</option>
                                                  <option value="COVERS" selected>Covers</option>
                                                  <option value="ELECTRODES" selected>Electrodes & Accessories</option>
                                                  <option value="FILTERS" selected>Filters</option>
                                                  <option value="FILMS" selected>Films</option>
                                                  <option value="HOTSTAMPING" selected>Hot stamping</option>
                                                  <option value="IFU" selected>IFU-Instructions for use</option>
                                                  <option value="INJECTIONPOINTS" selected>Injection Points</option>
                                                  <option value="LABELS" selected>Labels</option>
                                                  <option value="HARDWARE" selected>Machine Components</option>
                                                  <option value="MATERIALS" selected>Raw materials</option>
                                                  
                                                  <option value="POUCHES" selected>Pouches</option>
                                                  <option value="SFTUBES" selected>Semifinished tubes</option>
                                                  <option value="SFVARIOUS" selected>Various semifinished goods</option>
                                                  <option value="SPIKES" selected>Spikes</option>
                                                  <option value="TRANSDUCERS" selected>Transducers</option>
                                                  <option value="TUBES" selected>Tubes</option>
                                                  <option value="VARIOUS" selected>Various components</option>
                                                  <option value="INWORK" selected>In Work</option>
                                                </select>
                                          </div>
                                          <div class="mb-3 coloredsection pl-2 pt-1 pb-1">
                                              <div class="form-check">
                                                  <input class="form-check-input" type="radio" name="standardinput" id="typeenfit" >
                                                  <label class="form-check-label" for="ttypeenfit">
                                                    ENfit standard
                                                  </label>
                                                </div>
                                                <div class="form-check">
                                                  <input class="form-check-input" type="radio" name="standardinput" id="typeluer" >
                                                  <label class="form-check-label" for="typeluer">
                                                    Luer Lock standard
                                                  </label>
                                                </div>
                                                <div class="form-check">
                                                  <input class="form-check-input" type="radio" name="standardinput" id="typetpn" >
                                                  <label class="form-check-label" for="typetpn">
                                                    TPN-Lock standard
                                                  </label>
                                                </div>
                                                <div class="form-check">
                                                  <input class="form-check-input" type="radio" name="standardinput" id="typenone" checked >
                                                  <label class="form-check-label" for="typenone">
                                                    No standard applicable
                                                  </label>
                                                </div>
                                          </div>

                                          <div class="errormessage text-danger invisible mb-2" id="pwerror"></div>
                                          <div class="mb-3 w-100 text-center">
                                          <button type="button" class="btn btn-primary btn-lg mx-auto" type="button" id="submitnewcomp" onclick="submitsnewcomp()">Submit Component</button>
                                          </div>





                                        </form>
                                  </div>
                              </div>`;
                              document.querySelector("#familyinput").selectedIndex=-1;
                        

    }

    
    function submitsnewcomp(){
      
      //RETRIEVE DATA FROM THE FORM
      let type;
      let form = document.getElementById('newcompform');
      let formData = new FormData(form); 
      let article=document.querySelector("#articleinput").value;
      let description=document.querySelector("#descriptioninput").value;  
      let intercompany=document.querySelector("#intercompanyinput").checked? "true" : "false";
      let packaging=document.querySelector("#packaginginput").checked? "true" : "false";
      let contact=document.querySelector("#contactinput").checked? "true" : "false";
      let ca65=document.querySelector("#ca65input").checked? "true" : "false";
      let baimold=document.querySelector("#baimoldinput").checked? "true" : "false";
      if(document.querySelector("#typeenfit").checked) type="ENFIT";
      else if(document.querySelector("#typeluer").checked) type="LUERLOCK";
      else if(document.querySelector("#typetpn").checked) type="TPNLOCK";
      else if(document.querySelector("#typenone").checked) type="none";
      let family=document.querySelector("#familyinput").value;
      let errormessage=document.querySelector(".errormessage");



      if(article=="" || description=="" || document.querySelector("#familyinput").selectedIndex==-1) {
      if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
      errormessage.innerHTML="Attention, fields article, description and material family are necessary to submit the request";
      return;
      }
      if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");

      //SEND CONFIRMATION MESSAGE BEFORE SUBMITTING      

      createCustomAlert('Attention:','Are you sure you want to insert this component?', 'yesno')
      .then((result) => { if(!result) return;
        else{
          const url="/querycomp/new"
          formData.append('article', article);
          formData.append('description', description);
          formData.append('intercompany', intercompany);
          formData.append('packaging', packaging);
          formData.append('contact', contact);
          formData.append('ca65', ca65); 
          formData.append('baimold', baimold);  
          formData.append('standard', type);  
          formData.append('family', family);                  
    
    
          fetch(url, {
              method: 'POST',
              body: formData,
              headers: {'Authorization': authenticationheader() }
          })
          .then(response => {
              if(response.status==502){
                errormessage.innerHTML="Component already exists!";
                throw new Error('Network response was not ok');
              }
              if (!response.ok)  throw new Error('Network response was not ok');
              createCustomAlert('Great!','New component created successfully!', 'ok');
              
              rendercomponents();
    
    
          })
          .catch(error => { createCustomAlert('Oops!','Your request is invalid or you do not have permission to perform it.', 'ok'); });
        }  
        });

      

}