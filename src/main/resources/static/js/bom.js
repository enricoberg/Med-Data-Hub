
function renderboms(article,id){

    id=parseInt(id);
    let totalcolumns=4;
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
    newTitle.innerHTML=`<div >${article} Bill of Materials - <a href="#" onclick="renderproducts();">BACK TO PRODUCTS</a> </div>
    <div class="mt-3" style="position:relative;"><a href="#" onclick="rendernewbom(${article});" class="addheader invisible">ADD NEW ITEMS TO BOM</a>
    <div class="csvbutton hover-message" title="Download CSV File" onclick="downloadFile()"><img class="btnsmall" alt="Download CSV file" src="https://i.postimg.cc/28Sp2V64/download.png"></img></div>
    <div class="clipboardbutton hover-message" title="Copy to clipboard" onclick="copyTableToClipboard()"><img alt="Copy content of the table" class="btnsmall" src="https://i.postimg.cc/gj4V1S6V/copy.png"></img></div>
    </div>`;
    updateBomsTable(totalcolumns,id)


    }



    async function updateBomsTable(totalcolumns,id){
        clearTable(totalcolumns);
        //CREATE HEADERS
        document.querySelector(".grid-container").innerHTML+=`
                    <div class="grid-item tableheader">Article number</div>
                    <div class="grid-item tableheader">Description</div>
                    <div class="grid-item tableheader">Qty</div>
                    <div class="grid-item tableheader">Unit</div>
                    `;

        //SEND REQUEST TO THE REST API
        let url = '/queryboms/';
        url+=`?article=${id}`;
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
            document.querySelector(".grid-container").innerHTML+=`            
                         <div class="grid-item "><a class="pdfopener" targetref="/download/activespec?article=${obj.comp_id}">${obj.comp_id}</a></div>
                         <div class="grid-item ">${obj.comp_description}</div>
                         <div class="grid-item ">${obj.qty}</div>
                         <div class="grid-item ">${obj.um}</div>
                         `;

            });
            listenForDownloads();
            //SHOW THE TABLE
            activeCellColoring(totalcolumns);
            if(document.querySelector(".tabledisplay").classList.contains("invisible")) document.querySelector(".tabledisplay").classList.remove("invisible");
            return ;
        } catch (error) {
            console.error('Error during fetch:', error);
            return ;
        }

    }












