function renderdashboard(){
    
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
        
    const newDash = document.createElement("div");
    const referenceElement = document.body.children[1]; 
    document.body.insertBefore(newDash, referenceElement);
    newDash.classList.add("dashboard");
    newDash.classList.add("dash");
    newDash.innerHTML=`<div class="dashelement">
    <img src="https://i.postimg.cc/J0nKNxyD/documents.png" alt="">
    <a href="#" onclick="redirectToTab('#specificationsection')">QUERY ALL RELEASED PRODUCTION DOCUMENTS</a>

</div>
<div class="dashelement">
    <img src="https://i.postimg.cc/j5vZnmjY/components.png" alt="">
    <a href="#" onclick="redirectToTab('#componentsection')">QUERY ALL COMPONENTS AND PURCHASED ARTICLES</a>

</div>
<div class="dashelement">
    <img src="https://i.postimg.cc/PxdSxTTM/products.png" alt="">
    <a href="#" onclick="redirectToTab('#productsection')">QUERY ALL FINISHED PRODUCTS AND ASSEMBLIES</a>

</div>
<div class="dashelement">
    <img src="https://i.postimg.cc/4mFpNhf6/compound.png" alt="">
    <a href="#" onclick="redirectToTab('#materialsection')">QUERY ALL RAW MATERIALS AND DATASHEETS</a>

</div>
<div class="dashelement">
    <img src="https://i.postimg.cc/d3x64CdW/suppliers.png" alt="">
    <a href="#" onclick="redirectToTab('#suppliersection')">QUERY ALL QUALIFIED SUPPLIERS AND CONTRACTORS</a>

</div>



`;


}
function redirectToTab(id){
    const element=document.querySelector(id);
    element.click();
}




