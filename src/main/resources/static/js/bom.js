
function renderboms(article,id){


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
    newTitle.innerHTML=`${article} Bill of Materials - <a href="#" onclick="renderproducts();">BACK TO PRODUCTS</a><br>
    <a href="#" onclick="rendernewbom(${article});">CREATE NEW BOM</a>`;
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

            if (response.status !== 200) {
                console.error('Request failed with status:', response.status);
                return ;
            }
            //POPULATE THE TABLE
            jsonResponse.forEach(obj => {
            document.querySelector(".grid-container").innerHTML+=`
                         <div class="grid-item ">${obj.comp_id}</div>
                         <div class="grid-item ">${obj.comp_description}</div>
                         <div class="grid-item ">${obj.qty}</div>
                         <div class="grid-item ">${obj.um}</div>
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












