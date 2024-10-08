

async function renderqueryadv1(){
    event.preventDefault();
    resetPage();


    const newTitle = document.createElement("h3");    
    newTitle.classList.add("bomtitle");
    
    newTitle.innerHTML=`SEARCH USAGE OF COMPONENT / SEMIFINISHED GOOD- <a href="#" onclick="renderdashboard();">BACK TO DASHBOARD</a>`;
    const newDash = document.createElement("div");   
    
    document.body.insertBefore(newDash, document.body.firstChild);
    document.body.insertBefore(newTitle, document.body.firstChild);
    newDash.classList.add("formcontainer");    
    newDash.classList.add("addsupplier");
    newDash.classList.add("queryadv1");
    newDash.classList.add("container");
    newDash.innerHTML=`<div class="row">
                                   <div class="col-8 mx-auto mt-3">

                                       <form id="formadvanced1">
                                           <div class="mb-3">
                                             <label for="articleinput" class="form-label">Article Number</label>
                                             <input type="text" class="form-control" id="articleinput" name="articleinput">
                                           </div>
                                           <div class="errormessage text-danger invisible  mb-2" id="pwerror">Code not found</div>
                                           <div class="mb-3" style="justify-content: center">
                                               <button type="button" class="btn btn-primary btn-lg mx-auto"  id="startquery1" >Start Usage Analysis</button>
                                           </div>
                                         </form>
                                         <div class="mb-3 coloredsection  pl-2 pt-1 pb-1" id="queryresultbox"><br><br><br><br>
                                         
                                         </div>
                                   </div>
                               </div>`;
            
        document.querySelector("#startquery1").addEventListener("click",()=>{renderresultsadv1(document.querySelector("#articleinput").value)});
        document.querySelector("#articleinput").addEventListener("keypress",function(event) {
            if(event.keyCode === 13) {
                renderresultsadv1(document.querySelector("#articleinput").value);
               event.preventDefault();
            }
           });


        document.querySelector("#articleinput").addEventListener("input",()=>{ 
            document.querySelector("#articleinput").value=document.querySelector("#articleinput").value.toUpperCase();
            if(!document.querySelector(".errormessage").classList.contains("invisible")) document.querySelector(".errormessage").classList.add("invisible");
        });
    }


    function renderresultsadv1(code){
        let errormessage=document.querySelector(".errormessage");
        if(code=="") {
            if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                  errormessage.innerHTML="You must insert a value before starting the query";
                  return;
        }
        document.querySelector("#queryresultbox").innerHTML="<br><br><br><br>";
        bufferTimeoutStart();
        
            fetch(`/queryboms/componentusage?article=${code}`,{method: 'GET',headers: {'Authorization': authenticationheader() }})
            .then(response => { if(response.ok) return response.text(); 
                if (response.status === 403) throw new Error('Forbidden: Access denied');
               })
            .then(data=>{            
                
                
                    
                    
                bufferTimeoutStop();
                if(data===undefined || data ===null) document.querySelector("#queryresultbox").innerHTML=`Sorry there was an error performing this query`;
                
                
                createCustomAlert('Download output','Do you want to save the extraction to a file?\nBy pressing No you will only visualize the results in the browser', 'yesno').then((result) => {     
                    if(result) downloadExtraction1(data);
                    data=data.replaceAll('<>', '&nbsp;&nbsp;');
                    document.querySelector("#queryresultbox").innerHTML=`<p>${data}</p>`;

                    
                  });
            } )            
            .catch(error => { 
                if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                errormessage.innerHTML="Sorry could not find any result";
            })
        


    }

    function downloadExtraction1(data){     
        
        data=data.replaceAll('<>', ';');
        // data=data.replaceAll('&nbsp;&nbsp;', '\t');
        data=data.replaceAll('<br>', '\n');
        
        let urlData = 'data:text/csv;charset=UTF-8,' + encodeURIComponent(data);
        let fileName = "usage.csv";
        let aLink = document.createElement('a');
        aLink.download = fileName;
        aLink.href = urlData;
        let event = new MouseEvent('click');
        aLink.dispatchEvent(event);
    }