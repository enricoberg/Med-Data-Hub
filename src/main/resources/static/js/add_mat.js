
function rendernewmaterials(){
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
        newTitle.innerHTML=`NEW MATERIAL FORM - <a href="#" onclick="rendermaterials();">BACK TO MATERIALS</a>`;
    const newDash = document.createElement("div");
    const referenceElement2 = document.body.children[2];
    document.body.insertBefore(newDash, referenceElement2);
    newDash.classList.add("container");
    newDash.classList.add("mt-5");
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
                                              <select class="form-select form-select-lg mb-3" aria-label="Large select example" id="familyinput">
                                                    <option value="ABS">ABS</option>
                                                    <option value="ACRYLIC">ACRYLIC</option>
                                                    <option value="ADHESIVE">ADHESIVE</option>
                                                    <option value="ADHESIVETPAPER">ADHESIVETPAPER</option>
                                                    <option value="ADHESIVETAPE">ADHESIVETAPE</option>
                                                    <option value="ALUMINIUM">ALUMINIUM</option>
                                                    <option value="CARDBOARD">CARDBOARD</option>
                                                    <option value="COATING">COATING</option>
                                                    <option value="COLORANT">COLORANT</option>
                                                    <option value="ETPU">ETPU</option>
                                                    <option value="FILM">FILM</option>
                                                    <option value="HDPE">HPE</option>
                                                    <option value="HIPS">HIPS</option>
                                                    <option value="INK">INK</option>
                                                    <option value="LDPE">LDPE</option>
                                                    <option value="MABS">MABS</option>
                                                    <option value="MEDICALPAPER">MEDICALPAPER</option>
                                                    <option value="MEMBRANE">MEMBRANE</option>
                                                    <option value="PA">PA</option>
                                                    <option value="PC">PC</option>
                                                    <option value="PES">PES</option>
                                                    <option value="PET">PET</option>
                                                    <option value="PETG">PETG</option>
                                                    <option value="PMMA">PMMA</option>
                                                    <option value="PP">PP</option>
                                                    <option value="PPE">PPE</option>
                                                    <option value="PRIMER">PRIMER</option>
                                                    <option value="PS">PS</option>
                                                    <option value="PSU">PSU</option>
                                                    <option value="PTFE">PTFE</option>
                                                    <option value="PU">PU</option>
                                                    <option value="PUR">PUR</option>
                                                    <option value="PVC">PVC</option>
                                                    <option value="PVCDEHPFREE">PVCDEHPFREE</option>
                                                    <option value="SAN">SAN</option>
                                                    <option value="SEBS">SEBS</option>
                                                    <option value="SILICONE">SILICONE</option>
                                                    <option value="SOLVENT">SOLVENT</option>
                                                    <option value="STEEL">STEEL</option>
                                                    <option value="TPE">TPE</option>
                                                    <option value="TYVEK">TYVEK</option>
                                                    <option value="VARIOUS">VARIOUS</option>
                                                  
                                                </select>
                                          </div>
                                          
                                          

                                          <div class="mb-3">
                                          <button type="button" class="btn btn-primary btn-lg mx-auto" type="button" id="submitnewmat" onclick="submitsnewmat()">Submit Material</button>
                                          </div>





                                        </form>
                                  </div>
                              </div>`;

    }

    
    function submitsnewmat(){
      
       
      
      let form = document.getElementById('newmatform');

      let formData = new FormData(form); 
      let name=document.querySelector("#brandnameinput").value;
      let supplier=document.querySelector("#supplierinput").value;  
      let plasticizer=document.querySelector("#plasticizerinput").value; 
      let family=document.querySelector("#familyinput").value;           

      const url="/querymat/new"
      if(name=="" || supplier=="") return;


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
          if (response.ok) alert("New material created successfully!");
          rendermaterials();
      })
      .catch(error => { alert("Something went wrong with your request"); });

}