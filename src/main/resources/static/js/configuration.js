
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
    <div class="csvbutton hover-message" title="Download CSV File" onclick="downloadFile()"><img class="btnsmall" alt="Download CSV file" src="https://i.postimg.cc/28Sp2V64/download.png"></img></div>
    <div class="clipboardbutton hover-message" title="Copy to clipboard" onclick="copyTableToClipboard()"><img alt="Copy content of the table" class="btnsmall" src="https://i.postimg.cc/gj4V1S6V/copy.png"></img></div>
    </div>`;
    updateConfigurationsTable(totalcolumns,article);

    }








async function updateConfigurationsTable(totalcolumns,article){
    //clearTable(totalcolumns);

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


        //POPULATE THE TABLE
        jsonResponse.forEach(obj => {


                document.querySelector(".grid-container").innerHTML+=
                            `
                            <div class="grid-item ">${obj.supplier}</div>
                            <div class="grid-item ">${obj.suppliercode}</div>
                            <div class="grid-item ">${obj.brandname}</div>
                            <div class="grid-item ">${obj.family}</div>
                            <div class="grid-item ">${obj.materialsupplier}</div>
                            `;


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



