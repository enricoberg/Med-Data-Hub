
function rendernewproduct(){
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
        newTitle.innerHTML=`NEW PRODUCT FORM - <a href="#" onclick="renderproducts();">BACK TO PRODUCTS</a>`;
    const newDash = document.createElement("div");
    const referenceElement2 = document.body.children[2];
    document.body.insertBefore(newDash, referenceElement2);
    newDash.classList.add("container");
    newDash.classList.add("mt-5");
    newDash.classList.add("addproduct");
    newDash.innerHTML=`<div class="row">
                                  <div class="col-8 mx-auto mt-3">

                                      <form id="newprodform">
                                          <div class="mb-3">
                                            <label for="articleinput" class="form-label">Article Number</label>
                                            <input type="text" class="form-control" id="articleinput" name="articleinput">
                                          </div>
                                          <div class="mb-3">
                                              <label for="revinput" class="form-label">Description</label>
                                              <input type="text" class="form-control" id="descriptioninput" name="descriptioninput">
                                          </div>
                                          <div class="mb-3">
                                              <label for="dhfinput" class="form-label">DHF</label>
                                              <input type="text" class="form-control" id="dhfinput" name="dhfinput">
                                          </div>
                                          <div class="mb-3">
                                              <label for="rmfinput" class="form-label">RMF</label>
                                              <input type="text" class="form-control" id="rmfinput" name="rmfinput">
                                          </div>
                                          <div class="mb-3">
                                              <label for="budiinput" class="form-label">BUDI</label>
                                              <input type="text" class="form-control" id="budiinput" name="budiinput">
                                          </div>
                                          <div class="mb-3">
                                              <label for="shelfinput" class="form-label">Shelf Life (months)</label>
                                              <input type="text" class="form-control" id="shelfinput" name="shelfinput">
                                          </div>
                                          
                                          <div class="mb-3 form-check ">
                                            <input type="checkbox" class="form-check-input" id="intercompanyinput" name="intercompanyinput" >
                                            <label class="form-check-label" for="activeinput">Intercompany</label>
                                          </div>
                                          <div class="mb-3 form-check ">
                                              <input type="checkbox" class="form-check-input" id="semifinishedinput" name="semifinishedinput" >
                                              <label class="form-check-label" for="semifinishedinput">Semifinished Good</label>
                                          </div>
                                          


                                          <div class="mb-3 coloredsection pl-2 pt-3 pb-1">
                                              <span>Supplier: </span>
                                              <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="supplierinput" id="supplierinput">                                                                                                                                                
                                            </select>
                                          </div>

                                          <div class="mb-3 coloredsection pl-2 pt-3 pb-1">
                                              <span>Family of the product: </span>
                                              <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="familyinput" id="familyinput">
                                                <option value="AV" selected>A/V SYSTEMS</option>
                                                <option value="BAGS" >TPN BAGS & ACCESSORIES</option>
                                                <option value="EC" >EMPTY CONTAINERS</option>
                                                <option value="AA" >ACUTE & APHERESIS</option>
                                                <option value="ENT" >ENTERAL NUTRITION & ACCESSORIES</option>
                                                <option value="OEM" >OEM</option>
                                                <option value="IU" >IRRIGATION / UROLOGY</option>
                                                <option value="ACCD" >ACID CONCENTRATE FOR CHRONIC DIALYSIS</option>
                                                <option value="HW" >HARDWARE</option>
                                                <option value="CATH" >CATHETERS & ACCESSORIES</option>
                                                <option value="COMP" >COMPONENTS - VARIOUS</option>
                                                <option value="PFG" >PURCHASED FINISHED GOODS</option>                                                
                                            </select>
                                          </div>

                                          <div class="mb-3 coloredsection pl-2 pt-3 pb-1">
                                              <span>Sterilization Method: </span>
                                              <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="sterimethodinput" id="sterimethodinput" >
                                                    <option value="S1XETO21" selected>1 x ETO 21</option>
                                                    <option value="S2XETO21" >2 x ETO 21</option>
                                                    <option value="S1XETO22" >1 x ETO 22</option>
                                                    <option value="S2XETO22" >2 x ETO 22</option>
                                                    <option value="GAMMA" >Raggi Gamma</option>
                                                    <option value="BETA" >Raggi Beta</option>
                                                    <option value="BULK" >Bulk / Non sterile</option>                                               
                                            </select>
                                          </div>

                                          

                                          <div class="mb-3 coloredsection pl-2 pt-3 pb-1">
                                              <span>Sterilization Site: </span>
                                              <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="sterisiteinput" id="sterisiteinput" >
                                                    <option value="BAI" selected>BBraun Avitum Italy</option>
                                                    <option value="Sterilverona" >Sterilverona</option>
                                                                                                  
                                            </select>
                                          </div>

                                          <div class="mb-3 coloredsection pl-2 pt-3 pb-1">
                                              <span>SAP Status: </span>
                                              <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="sapinput" id="sapinput">
                                                    <option value="M1V1" >M1/V1</option>
                                                    <option value="M2V1" >M2/V1</option>
                                                    <option value="M2V2" selected>M2/V2</option>
                                                    <option value="M3V3" >M3/V3</option>
                                                    <option value="M4V4" >M4/V4</option>                                              
                                            </select>
                                          </div>




                                         

                                          <div class="mb-3">
                                          <button type="button" class="btn btn-primary btn-lg mx-auto" type="button" id="submitnewprod" onclick="submitsnewprod()">Submit Product</button>
                                          </div>





                                        </form>
                                  </div>
                              </div>`;
        sup_options=document.querySelector("#supplierinput");
        fetch('/aux/getsuppliers',{
            method: 'GET',            
            headers: {'Authorization': authenticationheader() }})
        .then(response => {            
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }            
            return response.json();
        })
        .then(data => {            
            data.forEach(element => {                
                sup_options.innerHTML+=`<option value="${element.id}" selected>${element.supplier_name}</option>`;                   
            });
        })
        .catch(error => {            
            console.error('Error during fetch:', error);
        });
  

    }

    
    function submitsnewprod(){
      
       
      let type;
      let form = document.getElementById('newprodform');

      let formData = new FormData(form); 
      let article=document.querySelector("#articleinput").value;
      let description=document.querySelector("#descriptioninput").value;  
      let dhf=document.querySelector("#dhfinput").value;
      let rmf=document.querySelector("#rmfinput").value;
      let budi=document.querySelector("#budiinput").value;
      let shelflife=document.querySelector("#shelfinput").value;   
      let intercompany=document.querySelector("#intercompanyinput").checked? "true" : "false";
      let semifinished=document.querySelector("#semifinishedinput").checked? "true" : "false";
      let family=document.querySelector("#familyinput").value;   
      let sterimethod=document.querySelector("#sterimethodinput").value;   
      let sterisite=document.querySelector("#sterisiteinput").value;   
      let sap=document.querySelector("#sapinput").value;   
      let supplier=document.querySelector("#supplierinput").value;   
      

      const url="/queryprod/new"
      if(article=="" || description=="") return;


      formData.append('article', article);
      formData.append('description', description);
      formData.append('dhf', dhf);
      formData.append('rmf', rmf);
      formData.append('budi', budi);
      formData.append('shelf', shelflife);
      formData.append('semifinished', semifinished);
      formData.append('sterimethod', sterimethod);
      formData.append('sterisite', sterisite);
      formData.append('sap', sap);
      formData.append('intercompany', intercompany);       
      formData.append('family', family);     
      formData.append('supplier', supplier);                 


      fetch(url, {
          method: 'POST',
          body: formData,
          headers: {'Authorization': authenticationheader() }
      })
      .then(response => {
          if (response.ok) alert("New product created successfully!");
          renderproducts();
      })
      .catch(error => { alert("Your request is invalid or you do not have permission to perform it"); });

}