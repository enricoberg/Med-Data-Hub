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
    <img src="https://i.postimg.cc/4mFpNhf6/compound.png" alt="">
    <a href="#">QUERY COMPONENTS CONTAINING A MATERIAL</a>
</div>
<div class="dashelement">
    <img src="https://i.postimg.cc/ftZ9gcCN/query.png" alt="">
    <a href="#">QUERY PRODUCTS CONTAINING A COMPONENT</a>
</div>

<div class="dashelement">
    <img src="https://i.postimg.cc/136kQwwD/search-material.png" alt="">
    <a href="#">QUERY PRODUCTS CONTAING A MATERIAL</a>
</div>
<div class="dashelement">
    <img src="https://i.postimg.cc/CR3DbTfd/multilevel.png" alt="">
    <a href="#">MULTILEVEL PRODUCT'S BILL OF MATERIALS</a>
</div>

<div class="dashelement">
    <img src="https://i.postimg.cc/qt2KLb8w/magic.png" alt="">
    <a href="#">OTHER CUSTOM QUERY 1</a>
</div>
<div class="dashelement">
    <img src="https://i.postimg.cc/qt2KLb8w/magic.png" alt="">
    <a href="#">OTHER CUSTOM QUERY 2</a>
</div>
`;


}


