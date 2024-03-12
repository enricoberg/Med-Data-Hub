const totalcomponentcolumns=10;
const totalproductcolumns=13;
const totalmaterialcolumns=5;
const totalsuppliercolumns=3;
const totaldocumentcolumns=5;

async function validateuser(){
    let jwt=getCookie("jwt");
    const url = '/app/auth/validate';
    let jwtheader=`Bearer ${jwt}`;
    const requestOptions = {
      method: 'POST',
      headers: {
          'Content-type':'application/json',
          'Authorization': jwtheader
      }
    }
    try {
        //FIRST VERIFY IF THE TOKEN IS VALID AF IF NOT, REFRESH IT
        if(isTokenExpired(jwt)){
            let refreshToken=getCookie("refresh")
            let refreshObject={token: refreshToken};
            fetch('/app/auth/refresh', {
               method: 'POST',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify(refreshObject)})
            .then(response => { if(response.ok) return response.json(); })
            .then(data=>{
               document.cookie = `jwt=${data.token}`;
               document.cookie = `refresh=${data.refreshToken}`;

               //RETURN TRUE IF THE RESPONSE FROM THE SERVER IS OK, OTHERWISE LOGIN NOT VALID AND RETURN FALSE
               fetch(url,requestOptions)
               .then(response=>{ if (response.status!=200) return false;
                                 return true; })
               .catch(error => { return false; })
               })
            .catch(error => { console.log("Error refreshing token");
            return false;
            });

        }
        else{
            //USE THE TOKEN
                    const response = await fetch(url,requestOptions);
                    //RETURN TRUE IF THE RESPONSE FROM THE SERVER IS OK, OTHERWISE LOGIN NOT VALID AND RETURN FALSE
                    if (response.status!=200) return false;
                    return true;

        }

      } catch (error) {
        return false;
      }
  }

  function isTokenExpired(token) {
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64));

      // Check if EXPIRATION claim exists in the payload
      if (payload && payload.exp) {
          const expirationTimeMs = payload.exp * 1000;
          const currentTimeMs = new Date().getTime();
          return currentTimeMs >= expirationTimeMs;
      } else {
          console.log("EXPIRED")
          return true;
      }
  }

    function expirationTimeLeft(token) {
        const [, payloadBase64] = token.split('.');
        const payload = JSON.parse(atob(payloadBase64));

        // Return the milliseconds left to expiration
        if (payload && payload.exp) {
            const expirationTimeMs = payload.exp * 1000;
            const currentTimeMs = new Date().getTime();
            return expirationTimeMs-currentTimeMs;
        }
    }

  function currentuser(){
    const token=getCookie("jwt")
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    if (payload && payload.sub) return payload.sub;
    return null;
  }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
function listenForDownloads(){
                      document.querySelectorAll('.pdfopener').forEach(function(item, index) {
                      item.addEventListener('click',()=>{
                        fetch(item.getAttribute('targetref'), {headers: {'Authorization': authenticationheader()}})
                                .then(response => {
                                              if (!response.ok) throw new Error('Document not found');
                                              return response.blob();
                                          })
                                .then(pdfBlob => {
                                  var pdfUrl = URL.createObjectURL(pdfBlob);
                                  var newTab = window.open();
                                  newTab.document.write('<object width="100%" height="100%" data="' + pdfUrl + '" type="application/pdf"></object>');
                                })
                                .catch(error => alert("The Document you are looking for does not exists"));
                            });


                      })
}
function sendRefresh(){
            let refreshToken=getCookie("refresh")
            let refreshObject={token: refreshToken};
            fetch('/app/auth/refresh', {
               method: 'POST',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify(refreshObject)})
            .then(response => { if(response.ok) return response.json(); })
            .then(data=>{
               document.cookie = `jwt=${data.token}`;
               document.cookie = `refresh=${data.refreshToken}`; } )
            .catch(error => { console.log("Error refreshing token");})
}
function extractDataFromTable(){
  let totalcolumns=document.querySelectorAll(".tableheader").length;
  let totalelements=document.querySelectorAll(".grid-item").length;
  let elements=document.querySelectorAll(".grid-item");
  let csv_content="";
  let counter=0;  
  for (let i=0;i<totalelements;i++){    
      try{
          csv_content+=elements[i].getElementsByTagName("a")[0].innerHTML; 
      }
      catch{
          csv_content+=elements[i].innerHTML;
      }
      
      csv_content+=";";
      counter+=1;
      if(counter==totalcolumns){
          csv_content+="\n";
          counter=0;
      }


  }
  return csv_content;
}



function downloadFile() {
  const b=document.querySelector(".csvbutton");
  b.classList.add("rotating");
  b.setAttribute("title","");
  setTimeout(()=>{
    b.classList.remove("rotating");
    b.setAttribute("title","Download CSV File");
},2000);
  let csvData = extractDataFromTable();     
  let urlData = 'data:text/csv;charset=UTF-8,' + encodeURIComponent(csvData);
  let fileName = "export.csv";
  let aLink = document.createElement('a');
  aLink.download = fileName;
  aLink.href = urlData;
  let event = new MouseEvent('click');
  aLink.dispatchEvent(event);
  
}
async function copyTableToClipboard() {  
  try{
    let text=extractDataFromTable();
    text=text.replace(/;/g,'\t');
    copyTextToClipboard(text);
    const b=document.querySelector(".clipboardbutton");
    b.classList.add("rotating");
    b.setAttribute("title","");
    setTimeout(()=>{b.classList.remove("rotating");
                    b.setAttribute("title","Copy to clipboard");
  },2000);
  }
  catch(err){
    console.log(err);
  }




}
function fallbackCopyTextToClipboard(text) {
  let textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    let successful = document.execCommand('copy');
    let msg = successful ? 'successful' : 'unsuccessful';    
  } catch (err) {
    ;
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {    
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

function quickSearch(searchstring){
  if(searchstring==null || searchstring.length<=2) return;
  document.querySelector("#searchstring").value="";
  // renderpage("components");
  fetch(`/aux/getquicklink?search=${searchstring}`,{headers: {'Authorization': authenticationheader()}})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text(); 
  })
  .then(data => {
    switch(data){
      case "COMPART":        
        document.querySelector("#componentsection").click();
        setTimeout(()=>{document.querySelector("#componentarticleinput").value=searchstring;
        updateComponentsTable(totalcomponentcolumns);
      },400);        
      break;
      case "COMPDESC":        
        document.querySelector("#componentsection").click();
        setTimeout(()=>{document.querySelector("#componentdescriptioninput").value=searchstring;
        updateComponentsTable(totalcomponentcolumns);
      },400);        
      break;
      case "PRODART":        
        document.querySelector("#productsection").click();
        setTimeout(()=>{document.querySelector("#productarticleinput").value=searchstring;
        updateProductsTable(totalproductcolumns);
      },400);        
      break;
      case "PRODDESC":        
        document.querySelector("#productsection").click();
        setTimeout(()=>{document.querySelector("#productdescriptioninput").value=searchstring;
        updateProductsTable(totalproductcolumns);
      },400);        
      break;
      case "MATERIAL":        
        document.querySelector("#materialsection").click();
        setTimeout(()=>{document.querySelector("#materialnameinput").value=searchstring;
        updateMaterialsTable(totalmaterialcolumns);
      },400);        
      break;
      case "SUPPLIER":        
        document.querySelector("#suppliersection").click();
        setTimeout(()=>{document.querySelector("#suppliernameinput").value=searchstring;
        updateSuppliersTable(totalsuppliercolumns);
      },400);        
      break;
      default:
        alert("Sorry there is no result matching your request");
    }

  })
  .catch(error => {    console.error('There was a problem with the fetch operation:', error);  });


}