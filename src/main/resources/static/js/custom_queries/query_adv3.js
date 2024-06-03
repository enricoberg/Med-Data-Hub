
async function renderqueryadv3(materialid){
    const curr_role= await fetch(`/aux/getrole?email=${currentuser()}`,{
        method: 'GET',
        headers: {'Authorization': authenticationheader() }})
    .then(response => {
        if (response.ok) return response.text();
    })    
    .catch(error => {
        console.error('Error during fetch:', error);
    });
    if(curr_role=="USER") {
        document.querySelector("#dashboardsection").click();
        return;
    }
    
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
            newTitle.innerHTML=`MATERIAL USAGE ANALYSIS - <a href="#" onclick="renderdashboard();">BACK TO DASHBOARD</a>`;
    const newDash = document.createElement("div");
    const referenceElement2 = document.body.children[2];
    document.body.insertBefore(newDash, referenceElement2);
    newDash.classList.add("container");
    newDash.classList.add("mt-5");
    newDash.classList.add("queryadv1");
    newDash.innerHTML=`<div class="row">
                                   <div class="col-8 mx-auto mt-3">

                                       
                                         <div class="mb-3 coloredsection  pl-2 pt-1 pb-1" id="queryresultbox"><br><br><br><br>
                                         
                                         </div>
                                   </div>
                               </div>`;
            
        renderresultsadv3(materialid);
        
    }


    function renderresultsadv3(code){
        let errormessage=document.querySelector(".errormessage");
        if(code=="") {
            if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                  errormessage.innerHTML="You must insert a value before starting the query";
                  return;
        }
        document.querySelector("#queryresultbox").innerHTML="<br><br><br><br>";
        
        
            fetch(`/querymat/inproduct?id=${code}`,{method: 'GET',headers: {'Authorization': authenticationheader() }})
            .then(response => { if(response.ok) return response.text(); 
                if (response.status === 403) throw new Error('Forbidden: Access denied');
               })
            .then(data=>{            
                
                
                    
                    
            
                document.querySelector("#queryresultbox").innerHTML=`<p>${data}</p>`;
                // if(confirm("Do you want to save the extraction to a file?\nBy pressing Cancel you will only visualize the results in the browser")) downloadExtraction3(data);
                
            } )
            .catch(error => { 
                alert("Sorry could not find any result");
            })
        


    }

    function downloadExtraction3(data){     
        
        
        data=data.replaceAll('&nbsp;&nbsp;', '\t');
        data=data.replaceAll('<br>', '\n');
        console.log(data)
        let urlData = 'data:text/csv;charset=UTF-8,' + encodeURIComponent(data);
        let fileName = "usage.csv";
        let aLink = document.createElement('a');
        aLink.download = fileName;
        aLink.href = urlData;
        let event = new MouseEvent('click');
        aLink.dispatchEvent(event);
    }