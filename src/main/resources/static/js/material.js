
function rendermaterials(){
    let totalcolumns=5;
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
    newDash.classList.add("dashboard");
    newDash.classList.add("documents");
    newDash.innerHTML=`
    <div class="add_button invisible" onclick="rendernewmaterials()"><i class="fa-regular fa-square-plus"></i>Create new</div>
    <form action="">
        <div class="input-group ">
            <input type="text" class="form-control documentcontrol" placeholder="Brand Name" name="brandinput" >
            <input type="text" class="form-control documentcontrol" placeholder="Manufactured By" name="supplierinput">
            <input type="text" class="form-control documentcontrol" placeholder="Plasticizer" name="plasticizerinput">
        </div>
        <div class="selectcontainer" style="display:flex; justify-content:align-center; align-items:center; flex-wrap:wrap;">
        <div class="form-group ">
        <label for="family" class="control-label "> Material Type </label>
        <select id="ifamily" class="form-select form-select-sm selectcontrol" name="familyinput">
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
                      <option value="all" selected>Select All</option>
                    </select>
        </div>


        </div>


        <div class="resultbanner">~  Found 0 results  ~</div>
     </form>`;

    updateMaterialsTable(totalcolumns);
    const controls=document.querySelectorAll(".documentcontrol");
    for (let control of controls){

            control.addEventListener("input", ()=>{
                    for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                        timeouts.push(setTimeout(updateMaterialsTable.bind(null, totalcolumns),800));
                    });

        }
        const selectcontrols=document.querySelectorAll(".selectcontrol");
        for (let control of selectcontrols){

                control.addEventListener("change", ()=>{
                        for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                            timeouts.push(setTimeout(updateMaterialsTable.bind(null, totalcolumns),800));
                        });

            }

    }








async function updateMaterialsTable(totalcolumns){
    clearTable(totalcolumns);

    //CREATE HEADERS
    document.querySelector(".grid-container").innerHTML+=
            `<div class="grid-item tableheader">Brand Name</div>
            <div class="grid-item tableheader">Manufactured By</div>
            <div class="grid-item tableheader">Material Type</div>
            <div class="grid-item tableheader">Plasticizer</div>
            <div class="grid-item tableheader">Datasheet</div>


            `;


    //GET THE QUERY PARAMETERS

    let family=document.getElementsByName("familyinput")[0].value;
    let brand=document.getElementsByName("brandinput")[0].value;
    let plasticizer=document.getElementsByName("plasticizerinput")[0].value;
    let supplier=document.getElementsByName("supplierinput")[0].value;

    //SEND REQUEST TO THE REST API
    let url = '/querymat/';
    url+=`?brand=${brand}&family=${family}&plasticizer=${plasticizer}&supplier=${supplier}`;



    const requestOptions = {
      method: 'GET',
      headers: {
          'Content-type':'application/json',
          'Authorization': authenticationheader()
      }
    }
    try {
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();

        //UNHIDE THE ADD BUTTON IF THE USER HAS THE AUTHORITY (API IS BLOCKED BY SERVER IF NOT ALLOWED ANYWAY)
                fetch(`/aux/getrole?email=${currentuser()}`,{
                                    method: 'GET',
                                    headers: {'Authorization': authenticationheader() }})
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok: ' + response.statusText);
                                    }
                                    return response.text();
                                })
                                .then(data => {
                                    if(data=="SUPERUSER" || data=="ADMIN") document.querySelector(".add_button").classList.remove("invisible");
                                })
                                .catch(error => {
                                    console.error('Error during fetch:', error);
                                });

        if (response.status !== 200) {
            console.error('Request failed with status:', response.status);
            return ;
        }


        //POPULATE THE TABLE
        jsonResponse.forEach(obj => {
        let checknull1= obj.family==null ? "" : obj.family;
        let checknull2= obj.plasticizer==null ? "" : obj.plasticizer;
            document.querySelector(".grid-container").innerHTML+=
        `

        <div class="grid-item ">${obj.brandname}</div>
        <div class="grid-item ">${obj.supplier}</div>
        <div class="grid-item ">${checknull1}</div>
        <div class="grid-item ">${checknull2}</div>
        <div class="grid-item "><a href="/download/?filename=TDS_${obj.id}">TDS</a> ---
        <a href="/download/?filename=SDS_${obj.id}">SDS</a></div>
        `;
        });

        //UPDATE NUMBER OF RESULTS
        document.querySelector(".resultbanner").innerHTML=`~  Found ${jsonResponse.length} results  ~`;
        //SHOW THE TABLE
        activeCellColoring(totalcolumns);
        if(document.querySelector(".tabledisplay").classList.contains("invisible")) document.querySelector(".tabledisplay").classList.remove("invisible");

        return ;
    } catch (error) {
        console.error('Error during fetch:', error);
        return ;
    }

}



