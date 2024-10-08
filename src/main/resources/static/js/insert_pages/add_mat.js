
function rendernewmaterials(){
    event.preventDefault();
    resetPage();


    const newTitle = document.createElement("h3");    
    newTitle.classList.add("bomtitle");
    
    newTitle.innerHTML=`NEW MATERIAL FORM - <a href="#" onclick="rendermaterials();">BACK TO MATERIALS</a>`;
    const newDash = document.createElement("div");   
    
    document.body.insertBefore(newDash, document.body.firstChild);
    document.body.insertBefore(newTitle, document.body.firstChild);
    newDash.classList.add("formcontainer");    
    newDash.classList.add("addmaterial");


    
    newDash.innerHTML=`<div class="row">
                                  <div class="col-8 mx-auto mt-3">

                                      <form id="newmatform">
                                          <div class="mb-3">
                                            <label for="brandnameinput" class="form-label">Brand Name of the material</label>
                                            <input type="text" class="form-control" id="brandnameinput" name="brandnameinput">
                                          </div>
                                          <div class="mb-3">
                                              <label for="supplierinput" class="form-label">Material Manufacturer</label>
                                              <input type="text" class="form-control" id="supplierinput" name="supplierinput">
                                          </div>
                                          <div class="mb-3">
                                              <label for="splasticizerinput" class="form-label">Plasticizer</label>
                                              <input type="text" class="form-control" id="plasticizerinput" name="plasticizerinput">
                                          </div>
                                          
                                          <div class="mb-3 coloredsection pl-2 pt-3 pb-1">
                                              <span>Type of material: </span>
                                              <select class="form-select form-select-lg mb-3 text-center" aria-label="Large select example" id="familyinput">
                                                    <option value="ABS">ABS</option>
                                                    <option value="ADDITIVE">Additives</option>
                                                    <option value="ADHESIVEPAPER">Adhesive Paper</option>
                                                    <option value="ADHESIVETAPE">Adhesive Tape</option>
                                                    <option value="ADHESIVE">Adhesives</option>
                                                    <option value="ALUMINUM">Aluminium</option>
                                                    <option value="BRASS">Brass</option>
                                                    <option value="CARTONBOX">Cartonbox</option>
                                                    <option value="CIIR">CIIR (Chlorobutyl)</option>
                                                    <option value="COLORANT">Colorants</option>                        
                                                    <option value="COP">COP</option>
                                                    <option value="EVA">EVA</option>
                                                    <option value="HDPE">HDPE</option>
                                                    <option value="HIPS">HIPS</option>
                                                    <option value="INK">Inks</option>
                                                    <option value="IR">IR</option>
                                                    <option value="LDPE">LDPE</option>
                                                    <option value="MABS">MABS</option>
                                                    <option value="MEDICALPAPER">Medical Paper</option>
                                                    <option value="MULTIMATERIAL">Multimaterial</option>        
                                                    <option value="NITINOL">Nitinol</option>
                                                    <option value="PA">PA</option>
                                                    <option value="PAPE">PA/PE</option>
                                                    <option value="PAPER">Paper</option>
                                                    <option value="PC">PC</option>
                                                    <option value="PCABS">PC/ABS</option>
                                                    <option value="PE">PE</option>
                                                    <option value="PEEVA">PE/EVA</option>
                                                    <option value="PES">PES</option>
                                                    <option value="PET">PET</option>
                                                    <option value="PETPE">PET/PE</option>
                                                    <option value="PETPP">PET/PP</option>
                                                    <option value="PMMA">PMMA</option>
                                                    <option value="PO">PO</option>
                                                    <option value="POM">POM</option>
                                                    <option value="PP">PP</option>
                                                    <option value="PPPE">PP/PE</option>
                                                    <option value="PPC">PPC</option>
                                                    <option value="PPE">PPE</option>
                                                    <option value="PPH">PPH</option>
                                                    <option value="PS">PS</option>
                                                    <option value="PSU">PSU</option>
                                                    <option value="PTFE">PTFE</option>
                                                    <option value="PUR">PUR</option>
                                                    <option value="PVC">PVC</option>
                                                    <option value="PVP">PVP</option>
                                                    <option value="SAN">SAN</option>
                                                    <option value="SBC">SBC</option>
                                                    <option value="SEBS">SEBS</option>
                                                    <option value="SI">Silicone</option>
                                                    <option value="SOLVENT">Solvents</option>
                                                    <option value="SST">SST</option>
                                                    <option value="SUBSTANCES">Substances</option>
                                                    <option value="SULFATE">Sulfates</option>
                                                    <option value="TPE">TPE</option>
                                                    <option value="TPU">TPU</option>
                                                    <option value="TUNGSTEN>Tungsten</option>
                                                    <option value="UNKNOWN">N/A - Not applicable</option>
                                                  
                                                </select>
                                          </div>
                                          
                                          
                                          <div class="errormessage text-danger invisible mb-2" id="pwerror">Passwords are not matching</div>
                                          <div class="mb-3 w-100 text-center" style="justify-content: center">
                                          <button type="button" class="btn btn-primary btn-lg mx-auto" type="button" id="submitnewmat" onclick="submitsnewmat()">Submit Material</button>
                                          </div>





                                        </form>
                                  </div>
                              </div>`;

    }

    
    function submitsnewmat(){
      
       
      //RETRIEVE ALL THE DATA FROM THE FORM
      let form = document.getElementById('newmatform');
      let errormessage=document.querySelector(".errormessage");
      let formData = new FormData(form); 
      let name=document.querySelector("#brandnameinput").value;
      let supplier=document.querySelector("#supplierinput").value;  
      let plasticizer=document.querySelector("#plasticizerinput").value; 
      let family=document.querySelector("#familyinput").value;           


      if(name=="") {
        if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
        errormessage.innerHTML="Attention, brandname is a mandatory field";
        return;
      }
      if (!errormessage.classList.contains("invisible")) errormessage.classList.add("invisible");
      //SEND CONFIRMATION MESSAGE BEFORE SUBMITTING     

      createCustomAlert('Attention:','Are you sure you want to insert this material?', 'yesno')
      .then((result) => {     
        if(!result) return;
        else{
            const url="/querymat/new"
            formData.append('name', name);
            formData.append('supplier', supplier);
            formData.append('plasticizer', plasticizer);
            formData.append('family', family);
                             
      
      
            fetch(url, {
                method: 'POST',
                body: formData,
                headers: {'Authorization': authenticationheader() }
            })
            .then(response => {
                if (!response.ok)  throw new Error('Network response was not ok');
                createCustomAlert('Great!','New material created successfully!', 'ok');          
                rendermaterials();
            })
            .catch(error => { createCustomAlert('Oops!','Your request is invalid or you do not have permission to perform it.', 'ok');  });
        }
       });



      

}