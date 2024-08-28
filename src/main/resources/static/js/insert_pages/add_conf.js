
function rendernewconf(product_id){
    let totalcolumns=9;
    clearbomtitles();
    clearTable(totalcolumns);
    //PREPARE THE DASHBOARD
    for(dashboard of document.querySelectorAll(".dashboard")) {
        dashboard.remove();
    }
    //CREATE THE BOM IN LOCALSTORAGE
    const emptyArray = [];
    localStorage.setItem('confs', JSON.stringify(emptyArray));
    //CREATE A NEW DASHBOARD
    const newTitle = document.createElement("h3");
        const referenceElement = document.body.children[1];
        document.body.insertBefore(newTitle, referenceElement);
        newTitle.classList.add("bomtitle");
        newTitle.classList.add("mt-5");
        newTitle.innerHTML=`CONFIGURATIONS FOR COMPONENT ${product_id} - <a href="#" onclick="rendercomponents();">BACK TO COMPONENTS</a>`;
    const newDash = document.createElement("div");
    const referenceElement2 = document.body.children[2];
    document.body.insertBefore(newDash, referenceElement2);
    newDash.classList.add("container");
    newDash.classList.add("coloredsection");
    newDash.classList.add("boms");
    newDash.classList.add("addbom");
    newDash.innerHTML=`
    <form action="">
        <div class=" pl-2 pt-4 pb-3">
                            <span class="ml-5">Supplier: </span>
                            <input list="supplierinput" style="width:200px; height: 36px; display:inline-block;" class="mr-2" id="supinput">
                            <datalist id="supplierinput" class="datalistsuppliers">
                            </datalist>



                            <input type="text" class="form-control documentcontrol mr-2" style="width:200px; display:inline-block;" placeholder="Supplier component code" name="supcodeinput" id="supcodeinput">
                            <span class="ml-2">Material:</span>
                            <input list="materialinput" style="width:200px; height: 36px; display:inline-block;" class="mr-2" id="matinput">
                            <datalist id="materialinput" class="datalistmaterials">
                            </datalist>

                            <button type="button" class="btn btn-danger mr-2" style="width:40px; height: 36px;" onclick="removeElementConf()">-</button>
                            <button type="button" class="btn btn-primary mr-2" style="width:40px; height: 36px;" onclick="addElementConf()">+</button>
                            <button type="button" class="btn btn-success mr-2" style="width:40px; height: 36px;" onclick="getIntegerofComponent('${product_id}')">&#10003;</button>
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

        //POPULATE THE SUPPLIER INPUT
        sup_options=document.querySelector(".datalistsuppliers");
        fetch('/aux/getsuppliers',{
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
                sup_options.innerHTML+=`<option value="${element.id}">${element.supplier_name}</option>`;
            });
        })
        .catch(error => {
            console.error('Error during fetch:', error);
        });
        //POPULATE THE MATERIAL INPUT
        mat_options=document.querySelector(".datalistmaterials");
        fetch('/aux/getmaterials',{
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
                mat_options.innerHTML+=`<option value="${element.id}">${element.brandname}</option>`;
            });
        })
        .catch(error => {
            console.error('Error during fetch:', error);
        });



    }

 function addElementConf(){
    let supplier=document.querySelector("#supinput").value;
    let material=document.querySelector("#matinput").value;
    let supcode=document.querySelector("#supcodeinput").value;

    let suppliername="";
    let materialname="";
    if (supplier=="" || supcode=="" || material=="")   return;
    document.querySelector("#supinput").value="";
    document.querySelector("#matinput").value="";
    document.querySelector("#supcodeinput").value="";
    //RETRIEVE SUPPLIER AND MATERIAL NAME
    fetch(`/querysup/byid?id=${supplier}`,{
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
            suppliername=data.supplier_name;
            fetch(`/querymat/byid?id=${material}`,{
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
                materialname=data.brandname;
                let element = {
                            supplier: supplier,
                            material: material,
                            supcode: supcode,
                            materialname: materialname,
                            suppliername: suppliername
                    };
                    let bom=getConfs();
                    bom.push(element);
                    setConfs(bom);
                    updateconfbox();

                })
                .catch(error => {
                    console.error('Error during fetch:', error);
                });


        })
        .catch(error => {
            console.error('Error during fetch:', error);
        });






 }

 function removeElementConf(){

    let bom=getConfs();
    if (bom.length==0) return;
    bom.pop();
    setConfs(bom);
    updateconfbox();
 }

 function getConfs(){
    const bomItem = localStorage.getItem('confs');
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

 function setConfs(bomArray) {
      const bomItem = JSON.stringify(bomArray);
      localStorage.setItem('confs', bomItem);

  }

  function updateconfbox(){
    let bom=getConfs();
    let bombox=document.querySelector(".bomcontainer");
    bombox.innerHTML="";
    bom.forEach(item => {
        bombox.innerHTML+=`<span>${item.supcode} ( Supplied by ${item.suppliername} ) - Material:  ${item.materialname}</span><br>`;
    });

  }

function getIntegerofComponent(product_id){
      if(!confirm("Do you confirm you want to insert this set of configurations?")) return;

      createCustomAlert('Attention:','Do you confirm you want to insert this set of configurations?', 'yesno')
      .then((result) => {     
        if(!result) return;
        else{
            fetch(`/querycomp/byname?id=${product_id}`,{
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
             sendconftoserver(data.id)
           })
           .catch(error => {
             console.error('There was a problem with the fetch operation:', error);
           });
        }
       });

      
}

function sendconftoserver(product_id){
    let bom=getConfs();
    let requestObj = [];
    bom.forEach(item => {
        //FETCH API TO ADD ROW IN THE CONFIGS TABLE FOR EACH OBJECT IN THE LOCAL STORAGE
        requestObj.push({
            compid: parseInt(product_id),
            matid:  parseInt(item.material),
            supid:  parseInt(item.supplier),
            supcompcode: item.supcode

        });
    });
    fetch('/queryconfigs/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authenticationheader()
      },
      body: JSON.stringify(requestObj)
    })
    .then(response => {
      if (!response.ok)  throw new Error('Network response was not ok');      
      createCustomAlert('Great!','Configurations Inserted Successfully!', 'ok');
      rendercomponents();
    })
    .catch(error => {
      createCustomAlert('Oops!','Your request is invalid or you do not have permission to perform it.', 'ok');      
    });



}