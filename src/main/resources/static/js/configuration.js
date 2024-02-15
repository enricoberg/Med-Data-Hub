
function renderconfigurations(article){
    let totalcolumns=5;
    clearbomtitles();
    clearTable(totalcolumns);
    //PREPARE THE DASHBOARD
    for(dashboard of document.querySelectorAll(".dashboard")) {
        dashboard.remove();
    }
    const newTitle = document.createElement("h3");
    const referenceElement = document.body.children[1];
    document.body.insertBefore(newTitle, referenceElement);
    newTitle.classList.add("bomtitle");
    newTitle.innerHTML=`<div>${article} List of Configurations - <a href="#" onclick="rendercomponents();">BACK TO COMPONENTS</a></div>
    <div class="mt-3" style="position:relative;"><a href="#" onclick="rendernewconf('${article}');" class="addheader invisible">ADD NEW CONFIGURATIONS</a>
    <div class="csvbutton" onclick="downloadFile()"><img class="btnsmall" src="https://i.postimg.cc/28Sp2V64/download.png"></img></div>
    <div class="clipboardbutton" onclick="copyTableToClipboard()"><img class="btnsmall" src="https://i.postimg.cc/RCR57cMS/copy.png"></img></div>
    </div>`;
    updateConfigurationsTable(totalcolumns,article);

    }








async function updateConfigurationsTable(totalcolumns,article){
    clearTable(totalcolumns);

    //CREATE HEADERS
    document.querySelector(".grid-container").innerHTML+=
            `<div class="grid-item tableheader">Supplier</div>
            <div class="grid-item tableheader">Supplier Component Number</div>
            <div class="grid-item tableheader">Material Name</div>
            <div class="grid-item tableheader">Material Family</div>
            <div class="grid-item tableheader">Material Supplier</div>

            `;


    
    //SEND REQUEST TO THE REST API
    let url = '/queryconfigs/';
    url+=`?article=${article}`;
    const requestOptions = {
      method: 'GET',
      headers: {
          'Content-type':'application/json',
          'Authorization': authenticationheader()
      }
    }
    try {
    console.log(url)
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
                                        if(data=="SUPERUSER" || data=="ADMIN") document.querySelector(".addheader").classList.remove("invisible");
                                    })
                                    .catch(error => {
                                        console.error('Error during fetch:', error);
                                    });

        if (response.status !== 200) {
            console.error('Request failed with status:', response.status);
            return ;
        }

        console.log(response.body)
        //POPULATE THE TABLE
        jsonResponse.forEach(obj => {
            const numberofmaterials=obj.materials.length;
            for (let i=0;i<numberofmaterials;i++){

                document.querySelector(".grid-container").innerHTML+=
                            `
                            <div class="grid-item ">${obj.supplier.supplier_name}</div>
                            <div class="grid-item ">${obj.suppliercompnumber}</div>
                            <div class="grid-item ">${obj.materials[i].brandname}</div>
                            <div class="grid-item ">${obj.materials[i].family}</div>
                            <div class="grid-item ">${obj.materials[i].supplier}</div>
                            `;
            }

            });

        
        //SHOW THE TABLE
        activeCellColoring(totalcolumns);
        if(document.querySelector(".tabledisplay").classList.contains("invisible")) document.querySelector(".tabledisplay").classList.remove("invisible");

        return ;
    } catch (error) {
        console.error('Error during fetch:', error);
        return ;
    }

}



