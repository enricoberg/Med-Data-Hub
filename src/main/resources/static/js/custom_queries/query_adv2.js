
async function renderqueryadv2(){
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
            newTitle.innerHTML=`MULTILEVEL EXPLOSION OF BOM - <a href="#" onclick="renderdashboard();">BACK TO DASHBOARD</a>`;
    const newDash = document.createElement("div");
    const referenceElement2 = document.body.children[2];
    document.body.insertBefore(newDash, referenceElement2);
    newDash.classList.add("container");
    newDash.classList.add("mt-5");
    newDash.classList.add("queryadv1");
    newDash.innerHTML=`<div class="row">
                                   <div class="col-8 mx-auto mt-3">

                                       <form id="formadvanced1">
                                           <div class="mb-3">
                                             <label for="articleinput" class="form-label">Article Number</label>
                                             <input type="text" class="form-control" id="articleinput" name="articleinput">
                                           </div>
                                           <div class="errormessage text-danger invisible  mb-2" id="pwerror">Code not found</div>
                                           <div class="mb-3">
                                               <button type="button" class="btn btn-primary btn-lg mx-auto"  id="startquery1" >Explode BOM</button>
                                           </div>
                                         </form>
                                         <div class="mb-3 coloredsection  pl-2 pt-1 pb-1" id="queryresultbox"><br><br><br><br>
                                         
                                         </div>
                                   </div>
                               </div>`;
            
        document.querySelector("#startquery1").addEventListener("click",()=>{renderresultsadv2(document.querySelector("#articleinput").value)});
        document.querySelector("#articleinput").addEventListener("input",()=>{ 
            document.querySelector("#articleinput").value=document.querySelector("#articleinput").value.toUpperCase();
            if(!document.querySelector(".errormessage").classList.contains("invisible")) document.querySelector(".errormessage").classList.add("invisible");
        });
    }


    function renderresultsadv2(code){
        let errormessage=document.querySelector(".errormessage");
        if(code=="") {
            if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                  errormessage.innerHTML="You must insert a value before starting the query";
                  return;
        }
        document.querySelector("#queryresultbox").innerHTML="<br><br><br><br>";
        
        
            fetch(`/queryboms/multilevelbom?article=${code}`,{method: 'GET',headers: {'Authorization': authenticationheader() }})
            .then(response => { if(response.ok) return response.text(); 
                if (response.status === 403) throw new Error('Forbidden: Access denied');
               })
            .then(data=>{            
                
                
                    
                    
            
                document.querySelector("#queryresultbox").innerHTML=`<p>${data}</p>`;
                
                createCustomAlert('Download Output','Do you want to save the extraction to a file?\nBy pressing Cancel you will only visualize the results in the browser', 'yesno').then((result) => {     if(result) downloadExtraction2(data);  });
                
            } )
            .catch(error => { 
                if (errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
                errormessage.innerHTML="Sorry could not find any result";
            })
        


    }

    function downloadExtraction2(data){     
        
        
        data=data.replaceAll('&nbsp;&nbsp;', '\t');
        data=data.replaceAll('<br>', '\n');
        console.log(data)
        let urlData = 'data:text/csv;charset=UTF-8,' + encodeURIComponent(data);
        let fileName = "explosion.csv";
        let aLink = document.createElement('a');
        aLink.download = fileName;
        aLink.href = urlData;
        let event = new MouseEvent('click');
        aLink.dispatchEvent(event);
    }