
function renderproducts(){
    let totalcolumns=13;
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
        newDash.classList.add("products");
        newDash.innerHTML=`
        <div class="add_button" onclick="rendernewproduct()"><i class="fa-regular fa-square-plus"></i>Create new</div>
        <form action="">
            <div class="input-group ">
                <input type="text" class="form-control documentcontrol" placeholder="Article number" name="articleinput">
                <input type="text" class="form-control documentcontrol" placeholder="Description" name="descriptioninput">
                <input type="text" class="form-control documentcontrol" placeholder="DHF number" name="dhfinput">
                <input type="text" class="form-control documentcontrol" placeholder="RMF" name="rmfinput" >
                <input type="text" class="form-control documentcontrol" placeholder="BUDI" name="budiinput" >
                <input type="text" class="form-control documentcontrol" placeholder="Sterilization Site" name="sterisiteinput" >
                <input type="text" class="form-control documentcontrol" placeholder="Shelf life (months)" name="shelflifeinput" >
            </div>

            <div class=" pl-2 pt-4 ">
                                <span >Family of the product: </span>
                                <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="familyinput" >
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
                                    <option value="all" selected>See All</option>
                                  </select>
                                  <span class="ml-3">SAP STATUS: </span>
                                <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="sapstatusinput">
                                    <option value="M1V1" selected>M1/V1</option>
                                    <option value="M2V1" >M2/V1</option>
                                    <option value="M2V2" >M2/V2</option>
                                    <option value="M3V3" >M3/V3</option>
                                    <option value="M4V4" >M4/V4</option>
                                    <option value="all" selected >See All</option>

                                  </select>
                                  <span class="ml-3">Sterilization Method: </span>
                                <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="sterimethodinput">
                                    <option value="S1XETO21" selected>1 x ETO 21</option>
                                    <option value="S2XETO21" >2 x ETO 21</option>
                                    <option value="S1XETO22" >1 x ETO 22</option>
                                    <option value="S2XETO22" >2 x ETO 22</option>
                                    <option value="GAMMA" >Raggi Gamma</option>
                                    <option value="BETA" >Raggi Beta</option>
                                    <option value="BULK" >Bulk / Non sterile</option>
                                    <option value="all" selected >See All</option>

                                  </select>


            </div>
            <div class=" pl-2">
                                  <span class="ml-3">Intercompany: </span>
                                  <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="intercompanyinput">
                                      <option value="true" >Intercompany</option>
                                      <option value="false" >Non Intercompany</option>
                                      <option value="all" selected>See All</option>
                                   </select>
                                   <span class="ml-3">Semifinished: </span>
                                   <select class="form-select form-select-lg mb-3 selectcontrol" aria-label="Large select example" name="semiinput">
                                     <option value="true" >Semifinished good</option>
                                     <option value="false" >Products</option>
                                     <option value="all" selected>See All</option>
                                   </select>
            </div>

            <div class="resultbanner">~  Found 0 results  ~</div>
         </form>`;

    updateProductsTable(totalcolumns);
    const controls=document.querySelectorAll(".documentcontrol");
    for (let control of controls){

            control.addEventListener("input", ()=>{
                    for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                        timeouts.push(setTimeout(updateProductsTable.bind(null, totalcolumns),800));
                    });

        }
        const selectcontrols=document.querySelectorAll(".selectcontrol");
        for (let control of selectcontrols){

                control.addEventListener("change", ()=>{
                        for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                            timeouts.push(setTimeout(updateProductsTable.bind(null, totalcolumns),800));
                        });

            }

    }








async function updateProductsTable(totalcolumns){
    clearTable(totalcolumns);

    //CREATE HEADERS
    document.querySelector(".grid-container").innerHTML+=
        `<div class="grid-item tableheader">Article Number</div>
        <div class="grid-item tableheader">Description</div>
        <div class="grid-item tableheader">SAP Status</div>
        <div class="grid-item tableheader">Product Family</div>
        <div class="grid-item tableheader">Intercompany</div>
        <div class="grid-item tableheader">Semifinished</div>
        <div class="grid-item tableheader">DHF</div>
        <div class="grid-item tableheader">RMF</div>
        <div class="grid-item tableheader">BUDI</div>
        <div class="grid-item tableheader">Sterilization Method</div>
        <div class="grid-item tableheader">Sterilization Site</div>
        <div class="grid-item tableheader">Shelf Life</div>
        <div class="grid-item tableheader">Bill of materials</div>
        `;


    //GET THE QUERY PARAMETERS
    let article=document.getElementsByName("articleinput")[0].value;
    let description=document.getElementsByName("descriptioninput")[0].value;
    let intercompany=document.getElementsByName("intercompanyinput")[0].value;
    let family=document.getElementsByName("familyinput")[0].value;
    let sapstatus=document.getElementsByName("sapstatusinput")[0].value;
    let semifinished=document.getElementsByName("semiinput")[0].value;
    let dhf=document.getElementsByName("dhfinput")[0].value;
    let rmf=document.getElementsByName("rmfinput")[0].value;
    let budi=document.getElementsByName("budiinput")[0].value;
    let sterimethod=document.getElementsByName("sterimethodinput")[0].value;
    let sterisite=document.getElementsByName("sterisiteinput")[0].value!=""? document.getElementsByName("sterisiteinput")[0].value : "all";
    let shelflife= document.getElementsByName("shelflifeinput")[0].value;


    //SEND REQUEST TO THE REST API

    let url = '/queryprod/';
    url+=`?description=${description}&article=${article}&intercompany=${intercompany}&family=${family}&sapstatus=${sapstatus}&semifinished=${semifinished}&dhf=${dhf}&rmf=${rmf}&budi=${budi}&sterimethod=${sterimethod}&sterisite=${sterisite}&shelflife=${shelflife}`;

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



        if (response.status !== 200) {
            console.error('Request failed with status:', response.status);
            return ;
        }


        //POPULATE THE TABLE
        jsonResponse.forEach(obj => {
        const check1= obj.intercompany==true ? "&#10003;" : "";
        const check2= obj.semifinished==true ? "&#10003;" : "";
        const check3= obj.dhf!=null ? obj.dhf : "";
        const check4= obj.rmf!=null ? obj.rmf : "";
        const check5= obj.budi!=null ? obj.budi : "";
        const check6= obj.sterilizationsite!=null ? obj.sterilizationsite : "";
        const check7= obj.shelflife!=null ? obj.shelflife : "";
            document.querySelector(".grid-container").innerHTML+=
        `

        <div class="grid-item ">${obj.code}</div>
        <div class="grid-item ">${obj.description}</div>
        <div class="grid-item ">${obj.sapstatus}</div>
        <div class="grid-item ">${obj.family}</div>
        <div class="grid-item ">${check1}</div>
        <div class="grid-item ">${check2}</div>
        <div class="grid-item ">${check3}</div>
        <div class="grid-item ">${check4}</div>
        <div class="grid-item ">${check5}</div>
        <div class="grid-item ">${obj.sterilizationcycle}</div>
        <div class="grid-item ">${check6}</div>
        <div class="grid-item ">${check7}</div>
        <div class="grid-item "><a class="bomlink" onclick="renderboms(${obj.code},${obj.id});">See BOM</a></div>
        `;});


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



