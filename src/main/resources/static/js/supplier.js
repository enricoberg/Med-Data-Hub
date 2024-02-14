
function rendersuppliers(){
    let totalcolumns=3;
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
    <div class="add_button invisible" onclick="rendernewsuppliers()"><i class="fa-regular fa-square-plus"></i>Create new</div>
    <form action="">
        <div class="input-group ">
            <input type="text" class="form-control documentcontrol" placeholder="Supplier Name" name="nameinput" >
            <input type="text" class="form-control documentcontrol" placeholder="Supplier's SAP Code" name="sapinput">
            <input type="text" class="form-control documentcontrol" placeholder="Supplier's Contacts" name="contactinput">
        </div>



        <div class="resultbanner">~  Found 0 results  ~</div>
     </form>`;

    updateSuppliersTable(totalcolumns);
    const controls=document.querySelectorAll(".documentcontrol");
    for (let control of controls){

            control.addEventListener("input", ()=>{
                    for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                        timeouts.push(setTimeout(updateSuppliersTable.bind(null, totalcolumns),800));
                    });

        }
        const selectcontrols=document.querySelectorAll(".selectcontrol");
        for (let control of selectcontrols){

                control.addEventListener("change", ()=>{
                        for(let i=0;i<timeouts.length;i++){ clearTimeout(timeouts[i]);}
                            timeouts.push(setTimeout(updateSuppliersTable.bind(null, totalcolumns),800));
                        });

            }

    }








async function updateSuppliersTable(totalcolumns){
    clearTable(totalcolumns);

    //CREATE HEADERS
    document.querySelector(".grid-container").innerHTML+=
            `<div class="grid-item tableheader">Supplier Name</div>
            <div class="grid-item tableheader">SAP Code</div>
            <div class="grid-item tableheader">Contact information</div>
            `;


    //GET THE QUERY PARAMETERS
    let name=document.getElementsByName("nameinput")[0].value;
    let sapcode=document.getElementsByName("sapinput")[0].value;
    let contact=document.getElementsByName("contactinput")[0].value;


    //SEND REQUEST TO THE REST API
    let url = '/querysup/';
    url+=`?name=${name}&sapcode=${sapcode}&contact=${contact}`;



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
            const check1= obj.contact==null ? "No contact information" : obj.contact
            document.querySelector(".grid-container").innerHTML+=
        `
        <div class="grid-item ">${obj.supplier_name}</div>
        <div class="grid-item ">${obj.sap_code}</div>
        <div class="grid-item ">${obj.contact}</div>
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



