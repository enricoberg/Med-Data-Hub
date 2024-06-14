function renderdashboard(){
    for (let i = 0; i < elementsToRemove.length; i++) {
        const elementToRemove = document.querySelector(elementsToRemove[i]);
        if(elementToRemove) elementToRemove.remove();
    }
    //HIDE AND EMPTY THE TABLE
    if(!document.querySelector(".tabledisplay").classList.contains("invisible")) document.querySelector(".tabledisplay").classList.add("invisible");
    let totalcolumns=5;    
    document.documentElement.style.setProperty('--columnsnumber', totalcolumns);
    const container=document.querySelector(".grid-container");
    while (document.querySelector(".grid-container").firstChild) {
        container.removeChild(container.firstChild);
    }
    //PREPARE THE DASHBOARD
    for(dashboard of document.querySelectorAll(".dashboard")) {
        dashboard.remove();
    }
    //CREATE A NEW DASHBOARD
        
    const searchcontainer=document.createElement("div");
    const referenceElement = document.body.children[1]; 
    document.body.insertBefore(searchcontainer, referenceElement);
    searchcontainer.classList.add("container");
    searchcontainer.classList.add("thin");
    searchcontainer.classList.add("invisible");
    searchcontainer.innerHTML=`<form action="" class="searchform">
    <input type="search" required class="searchinput">
    <i class="fa fa-search searchfa"></i>
    
  </form>`;


    const newDash = document.createElement("div");
    const referenceElement2 = document.body.children[2]; 
    document.body.insertBefore(newDash, referenceElement);
    newDash.classList.add("dashboard");
    newDash.classList.add("dash");
    newDash.classList.add("searchable");
    newDash.innerHTML=`
    

    <div class="dashelement btn-hover" onclick="redirectToTab('#specificationsection')">
    <img src="https://i.postimg.cc/J0nKNxyD/documents.png" alt="">
    <a href="#" class="colorchanging">QUERY ALL RELEASED PRODUCTION DOCUMENTS</a>

</div>
<div class="dashelement btn-hover" onclick="redirectToTab('#componentsection')">
    <img src="https://i.postimg.cc/j5vZnmjY/components.png" alt="" >
    <a href="#" class="colorchanging">QUERY ALL COMPONENTS AND PURCHASED ARTICLES</a>

</div>
<div class="dashelement btn-hover" onclick="redirectToTab('#productsection')">
    <img src="https://i.postimg.cc/PxdSxTTM/products.png" alt="" >
    <a href="#" class="colorchanging">QUERY ALL FINISHED PRODUCTS AND ASSEMBLIES</a>

</div>
<div class="dashelement btn-hover" onclick="redirectToTab('#materialsection')">
    <img src="https://i.postimg.cc/4mFpNhf6/compound.png" alt="">
    <a href="#" class="colorchanging">QUERY ALL RAW MATERIALS AND DATASHEETS</a>

</div>
<div class="dashelement btn-hover" onclick="redirectToTab('#suppliersection')">
    <img src="https://i.postimg.cc/d3x64CdW/suppliers.png" alt="">
    <a href="#" class="colorchanging">QUERY ALL QUALIFIED SUPPLIERS AND CONTRACTORS</a>

</div>

<div class="dashelement btn-hover" onclick="renderqueryadv1()">
    <img src="https://i.postimg.cc/tgFtLn9n/hierarchical-structure.png" alt="">
    <a href="#" class="colorchanging">SEARCH ASSEMBLIES CONTAINING A COMPONENT</a>

</div>

<div class="dashelement btn-hover" onclick="renderqueryadv2()">
    <img src="https://i.postimg.cc/4NZWLJHM/explosion.png" alt="">
    <a href="#" class="colorchanging">EXPLODE PARTS AND SUBASSEMBLIES CONTAINED IN A PRODUCT</a>

</div>

<div class="dashelement btn-hover" onclick="redirectToTab('#materialsection')">
    <img src="https://i.postimg.cc/fRMf6jH4/advanced.png" alt="">
    <a href="#" class="colorchanging">SEARCH ASSEMBLIES CONTAINING A MATERIAL</a>

</div>



`;
document.cookie= 'refreshcount=0';


}
function redirectToTab(id){
    const element=document.querySelector(id);
    element.click();
}
function stampaNomeUser(){
    alert(currentuser());
}



