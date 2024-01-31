
function rendernewcomponents(){
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
                                              <select class="form-select form-select-lg mb-3" aria-label="Large select example">
                                                  <option value="MATERIALS" selected>Raw materials</option>
                                                  <option value="CAPS">Caps</option>
                                                  <option value="CONNECTORS" selected>Connectors</option>
                                                  <option value="CONICALCONNECTORS" selected>Conical Connectors</option>
                                                  <option value="INJECTIONPOINTS" selected>Injection Points</option>
                                                  <option value="FILTERS" selected>Filters</option>
                                                  <option value="CLAMPS" selected>Clamps</option>
                                                  <option value="SPIKES" selected>Spikes</option>
                                                  <option value="CHAMBERS" selected>Drip Chambers</option>
                                                  <option value="COVERS" selected>Covers</option>
                                                  <option value="TUBES" selected>Tubes</option>
                                                  <option value="VARIOUS" selected>Various components</option>
                                                  <option value="BAGS" selected>Bags</option>
                                                  <option value="BOXES" selected>Boxes</option>
                                                  <option value="POUCHES" selected>Pouches</option>
                                                  <option value="ADJUVANTS" selected>Adjuvants</option>
                                                  <option value="LABELS" selected>Labels</option>
                                                  <option value="SFTUBES" selected>Semifinished tubes</option>
                                                  <option value="SFVARIOUS" selected>Various semifinished goods</option>
                                                  <option value="SFSPECIALBAGS" selected>Special Bags/option>
                                                  <option value="SFBAGS150" selected>Semifinished bags 150mL</option>
                                                  <option value="SFBAGS250" selected>Semifinished bags 250mL</option>
                                                  <option value="SFBAGS500" selected>Semifinished bags 500mL</option>
                                                  <option value="SFBAGS1500" selected>Semifinished bags 1000-1500mL</option>
                                                  <option value="SFBAGS2500" selected>Semifinished bags 2000-2500mL</option>
                                                  <option value="SFBAGS3500" selected>Semifinished bags 3000-3500mL</option>
                                                  <option value="SFBAGS4500" selected>Semifinished bags 4000-4500mL</option>
                                                  <option  value="SFBAGS7000" selected>Semifinished bags 7000mL</option>
                                                  <option  value="PFG" selected>Purchased Finished Goods</option>
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


                                          <div class="mb-3">
                                              <button type="submit" class="btn btn-primary btn-lg mx-auto" type="button">Submit Component</button>
                                          </div>





                                        </form>
                                  </div>
                              </div>`;

    }