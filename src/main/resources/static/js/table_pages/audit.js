function renderaudit(){
    localStorage.setItem("currentsection","audit");
    resetPage();


    const newTitle = document.createElement("h3");    
    newTitle.classList.add("bomtitle");
    
    newTitle.innerHTML=`AUDIT TRAIL - <a href="#" onclick="renderdashboard();">BACK TO HOME</a>`;
    const newDash = document.createElement("div");   
    
    document.body.insertBefore(newDash, document.body.firstChild);
    document.body.insertBefore(newTitle, document.body.firstChild);
    newDash.classList.add("formcontainer");    
    newDash.classList.add("addsupplier");
    newDash.classList.add("queryadv1");
    newDash.classList.add("addcertificate");



    newDash.innerHTML=`<div class="row">
                                   <div class="col-8 mx-auto mt-3">
                                          <div class="mb-3" style="justify-content: center; margin-top: 50px;">
                                            <label for="articleinput" class="form-label">Please select the time range of the log report you want to generate:</label>                                            
                                          </div>
                                          <div class="mb-3" style="justify-content: center; ">
                                            <label for="articleinput" class="form-label">From:</label>                                            
                                          </div>
                                          <div class="mb-3" style="justify-content: center">                                            
                                            <input type="datetime-local" class="form-control" id="startinput" name="startinput" style="width: 60%; height: 25px; text-align: center;">
                                          </div>
                                          <div class="mb-3" style="justify-content: center">
                                              <label for="revinput" class="form-label">To:</label>                                              
                                          </div>  
                                          <div class="mb-3" style="justify-content: center; margin-bottom: 50px;">                                              
                                              <input type="datetime-local" class="form-control" id="endinput" name="endinput" style="width: 60%; height: 25px; text-align: center;">
                                          </div>                                        
                                          <div class="errormessage text-danger invisible mb-2" id="pwerror"></div>
                                          <div class="mb-3 " style="justify-content: center; ">
                                          <button type="button" class="btn btn-primary btn-lg mx-auto" type="button" id="submitaudit" onclick="downloadAudit()">Download Report</button>
                                          </div>
                                        </form>
                                   </div>
                               </div>`;
}

function downloadAudit(){
 const startinput = document.getElementById("startinput").value;
 const endinput = document.getElementById("endinput").value;
 const errormessage=document.querySelector(".errormessage"); 
 if(!errormessage.classList.contains("invisible")) errormessage.classList.add("invisible");
 if(startinput=="" || endinput==""){
  errormessage.innerHTML="Error: both dates are mandatory to proceed with the request";
   if(errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
   return;
 }
 
 const currentDate = new Date();
 if( new Date(startinput) > currentDate || new Date(endinput) > currentDate) {
   errormessage.innerHTML="Error: can not use a date in the future";
   if(errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
   return;
 }
 if( new Date(startinput) >  new Date(endinput)) {
  errormessage.innerHTML="Error: starting date is after the ending date";
  if(errormessage.classList.contains("invisible")) errormessage.classList.remove("invisible");
  return;
}
 let downloadName=`MDH_Audit_Trail_${getCurrentDateTimeAsString()}.pdf`;
 let url=`/download/customlog?startdate=${startinput}&enddate=${endinput}`;
 console.log(url)
 fetch(url, {headers: {'Authorization': authenticationheader()}})
 .then(response => {
               if (!response.ok) throw new Error('Document not found');
               return response.blob();
           })
 .then(pdfBlob => {

        const fileURL = window.URL.createObjectURL(pdfBlob);            
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;            
            fileLink.setAttribute('download', downloadName);            
            document.body.appendChild(fileLink);
            fileLink.click();            
            document.body.removeChild(fileLink);
 })
 .catch(error =>{console.log("document does not exist")});


 



}

function getCurrentDateTimeAsString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');  
  
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2,  
   '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;  
  
  }