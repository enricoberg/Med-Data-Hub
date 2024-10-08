


async function renderqueryadv3(materialid){
    event.preventDefault();
    resetPage();


    const newTitle = document.createElement("h3");    
    newTitle.classList.add("bomtitle");
    
    newTitle.innerHTML=`MATERIAL USAGE ANALYSIS - <a href="#" onclick="rendermaterials();">BACK TO MATERIALS</a>`;
    const newDash = document.createElement("div");   
    
    document.body.insertBefore(newDash, document.body.firstChild);
    document.body.insertBefore(newTitle, document.body.firstChild);
    newDash.classList.add("formcontainer");    
    newDash.classList.add("addsupplier");
    newDash.classList.add("queryadv1");
    newDash.classList.add("container");
    newDash.innerHTML=`<div class="row">
                                   <div class="col-8 mx-auto mt-3">

                                         <div class="errormessage text-danger invisible  mb-2" id="pwerror">Code not found</div>
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
            if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
            errormessage.innerHTML="Please wait while I am searching for the results, it may take some minutes...";
            bufferTimeoutStart();
            fetch(`/querymat/inproduct?id=${code}`,{method: 'GET',headers: {'Authorization': authenticationheader() }})
            .then(response => { if(response.ok) return response.text(); 
                if (response.status === 403) throw new Error('Forbidden: Access denied');
               })
            .then(data=>{            
                
                
                    
                    
                bufferTimeoutStop();
                if (!errormessage.classList.contains("invisible")) errormessage.classList.add("invisible");
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