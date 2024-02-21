
function rendernewbom(product_id){
    let totalcolumns=9;
    clearbomtitles();
    clearTable(totalcolumns);
    //PREPARE THE DASHBOARD
    for(dashboard of document.querySelectorAll(".dashboard")) {
        dashboard.remove();
    }
    //CREATE THE BOM IN LOCALSTORAGE    
    const emptyArray = [];
    localStorage.setItem('bom', JSON.stringify(emptyArray));        
    //CREATE A NEW DASHBOARD
    const newTitle = document.createElement("h3");
        const referenceElement = document.body.children[1];
        document.body.insertBefore(newTitle, referenceElement);
        newTitle.classList.add("bomtitle");
        newTitle.classList.add("mt-5");
        newTitle.innerHTML=`BOM FOR PRODUCT ${product_id} - <a href="#" onclick="renderproducts();">BACK TO PRODUCTS</a>`;
    const newDash = document.createElement("div");
    const referenceElement2 = document.body.children[2];
    document.body.insertBefore(newDash, referenceElement2);
    newDash.classList.add("container");
    newDash.classList.add("coloredsection");
    newDash.classList.add("boms");
    newDash.classList.add("addbom");
    newDash.innerHTML=`
    <form action="">      
        <div class=" pl-2 pt-4 ">
                            <span class="ml-5">Component article number: </span>
                            


                            <select  style="width:200px; height: 36px; display:inline-block;" class="mr-2 datalistcomponents" id="artinput"></select>
                            



                            <input type="text" class="form-control documentcontrol mr-2" style="width:100px; display:inline-block;" placeholder="Quantity" name="qtyinput" id="qtyinput">                        
                            
                            <select  class="form-select form-select-lg mb-3 selectcontrol mr-2 text-center" aria-label="Large select example" name="uminput" style="width:100px; display:inline-block; height: 36px;" id="uminput">
                                <option value="PZ" selected>PCS (pieces)</option>
                                <option value="KG" >Kg (kilogram)</option>
                                <option value="M" >m (meter)</option>
                                <option value="M2" >m&sup2; (square meter)</option>
                                <option value="PAC" >PAC (package)</option>
                                
                            </select>  
                            
                            <button type="button" class="btn btn-danger mr-2" style="width:40px; height: 36px;" onclick="removeElementBom()">-</button>
                            <button type="button" class="btn btn-primary mr-2" style="width:40px; height: 36px;" onclick="addElementBom()">+</button>
                            <button type="button" class="btn btn-success mr-2" style="width:40px; height: 36px;" onclick="getIntegerofProductBom(${product_id})">&#10003;</button>
        </div>        
     </form>     
     `;
     const bomContainer = document.createElement("div");
     const referenceElement3 = document.body.children[3];
     document.body.insertBefore(bomContainer, referenceElement3);
     bomContainer.classList.add("bomcontainer");
     bomContainer.classList.add("mx-auto");
     bomContainer.classList.add("mt-4");
     bomContainer.classList.add("pt-3");
     bomContainer.classList.add("pl-3");
     bomContainer.classList.add("pr-3");
     bomContainer.classList.add("text-light");
     bomContainer.innerHTML+=" ";


        comp_options=document.querySelector(".datalistcomponents");
        fetch('/aux/getcomponents',{
            method: 'GET',            
            headers: {'Authorization': authenticationheader() }})
        .then(response => {            
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }            
            return response.json();
        })
        .then(data => {            
            data.forEach(element => {                
                comp_options.innerHTML+=`<option value="${element.id}" assembly=false code="${element.comp_id}">${element.comp_id}</option>`;
            });
            fetch('/aux/getsemifinished',{
                        method: 'GET',
                        headers: {'Authorization': authenticationheader() }})
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok: ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        data.forEach(element => {
                            comp_options.innerHTML+=`<option value="${element.id}" assembly=true code="${element.code}">${element.code}</option>`;
                        });
                    })
                    .catch(error => {
                        console.error('Error during fetch:', error);
                    });



        })
        .catch(error => {            
            console.error('Error during fetch:', error);
        });
        
    }

 function addElementBom(){
    let id=document.querySelector("#artinput").value;


    let selectElement = document.getElementById('artinput');
    let selectedIndex = selectElement.selectedIndex;
    let selectedOption = selectElement.options[selectedIndex];

    let assembly=selectedOption.getAttribute("assembly");
    assembly = (assembly=="true")? true : false;
    let qty=document.querySelector("#qtyinput").value;
    let um=document.querySelector("#uminput").value;
    let floatValue = parseFloat(qty);   
    
    if (isNaN(floatValue) || id=="")   return;
    document.querySelector("#qtyinput").value="";
    document.querySelector("#artinput").value="";

    if(!assembly){
        fetch(`/querycomp/byid?article=${id}`,{
            method: 'GET',            
            headers: {'Authorization': authenticationheader() }
            })
        .then(response => {            
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }            
            return response.json();
        })
        .then(data => {            
            let description=data.description;
            let article=data.comp_id;   
            let element = {
                um: um, 
                qty: qty,     
                id: id,
                description: description ,
                article: article,
                assembly: false
              };
            let bom=getBom();
            bom.push(element);
            setBom(bom); 
            updatebombox();             
            
        })
        .catch(error => {            
            console.error('Error during fetch:', error);
        });
  }
  else{
        fetch(`/queryprod/byidint?article=${id}`,{
          method: 'GET',            
          headers: {'Authorization': authenticationheader() }
          })
      .then(response => {            
          if (!response.ok) {
              throw new Error('Network response was not ok: ' + response.statusText);
          }            
          return response.json();
      })
      .then(data => {            
          let description=data.description;
          let article=data.code;   
          let element = {
              um: um, 
              qty: qty,     
              id: id,
              description: description ,
              article: article,
              assembly: true
            };
          let bom=getBom();
          bom.push(element);
          setBom(bom); 
          updatebombox();             
          
      })
      .catch(error => {            
          console.error('Error during fetch:', error);
      });
  }
 }

 function removeElementBom(){
    
    let bom=getBom();
    if (bom.length==0) return;
    bom.pop();
    setBom(bom);   
    updatebombox();
 }

 function getBom(){
    const bomItem = localStorage.getItem('bom');
    if (bomItem) {
      try {
        const bomArray = JSON.parse(bomItem);
        return Array.isArray(bomArray) ? bomArray : [];
      } catch (error) {
        console.error('Error parsing localStorage item:', error);
        return [];
      }
    } else {
      console.warn('No localStorage item with key "bom" found.');
      return [];
    }
 }

 function setBom(bomArray) {    
      const bomItem = JSON.stringify(bomArray);
      localStorage.setItem('bom', bomItem);
    
  }

  function updatebombox(){
    let bom=getBom();
    let bombox=document.querySelector(".bomcontainer");
    bombox.innerHTML="";
    bom.forEach(item => {
        bombox.innerHTML+=`<span>${item.qty} ${item.um}  -  ${item.article} ( ${item.description} )</span><br>`;
    });

  }

function getIntegerofProductBom(product_id){
      if(!confirm("Do you confirm you want to insert this BOM?")) return;
      fetch(`/queryprod/byid?article=${product_id}`,{
           method: 'GET',
           headers: {'Authorization': authenticationheader() }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        sendbomtoserver(data)
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
}

function sendbomtoserver(product_id){
    let bom=getBom();
    let requestObj = [];
    bom.forEach(item => {
        //FETCH API TO ADD ROW IN THE BOM TABLE FOR EACH OBJECT IN THE LOCAL STORAGE
        requestObj.push({
            prodid: parseInt(product_id),
            compid: parseInt(item.id),
            qty: parseFloat(item.qty.replace(",", ".")),
            um: item.um,
            assembly: item.assembly
        });
    });

    fetch('/queryboms/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authenticationheader()
      },
      body: JSON.stringify(requestObj)
    })
    .then(response => {
      if (!response.ok)  throw new Error('Network response was not ok');

      alert("BOM Inserted Successfully!");
      renderproducts();
    })
    .catch(error => {
      alert("Your request is invalid or you do not have permission to perform it");
    });



}




