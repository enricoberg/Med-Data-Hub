
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
    newTitle.innerHTML=`${article} List of Configurations - <a href="#" onclick="rendercomponents();">BACK TO COMPONENTS</a>`;
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
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();


        if (response.status !== 200) {
            console.error('Request failed with status:', response.status);
            return ;
        }


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



