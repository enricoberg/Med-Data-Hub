async function renderdashboard(){
    const logged = await validateuser();    
    if(!logged) window.location.replace("/app/");
    axios.get(`/user/logaccess`,{ headers: { 'Authorization': authenticationheader()}});
                        
    resetPage();
    document.cookie= 'refreshcount=0';
    const newTitle = document.createElement("div");
    newTitle.classList.add("titlecontainer");

    newTitle.innerHTML=`
    <div class="wrapper">
    <div class="typing-demo rainbowtext">
      Med Data Hub
    </div>
    
    </div>
    <div class="statscontainer fadein" >
      <span class="envtext" style="letter-spacing: 0.35px;">👥&emsp;Nr. Active Users:&ensp;108</span>
      <span class="envtext" style="letter-spacing: 0.8px;">👀&emsp;Nr. Today views:&ensp;55</span>
      <span class="envtext" style="letter-spacing: 0.6px;">📈&emsp;Last month PPC:&ensp;14</span>
      <span class="envtext" style="letter-spacing: 1px;">📊&emsp;Last year PPC:&ensp;162</span>
      <span class="envtext" style="letter-spacing: 0.49px;">📚&emsp;Last month docs:&ensp;61</span>
    </div  ">

    <div class="envcontainer fadein">
      <img class="logorainbow" src="../../css/logobbraunwhite.svg">
      <span class="envtext">&#127757; Your environment:</span>
      <span class="envtext">B.Braun Avitum Italy</span>
    </div  ">
   
    
    `;

    const mainPage= document.createElement("div");
    mainPage.classList.add("fadein");
    mainPage.classList.add("mainpage");
    
    mainPage.innerHTML=
    ` 
    <h1 style="margin: 0 0 115px 25px; color: darkgrey;">Leading Innovation in Medical Devices Data Management.</h1>  
    <div style="width: 100%; display: flex; justify-content: space-evenly;">
      <div class="newsbox" id="bigbox1"></div>
      <div class="newsbox" id="bigbox2"></div>
    </div>`;
    
    document.body.insertBefore(mainPage, document.body.firstChild);
    document.body.insertBefore(newTitle, document.body.firstChild);  
    // POPULATE THE TWO MAIN BOXES FROM THE TXT FILES IN THE SERVER 
    const news= await retrieveText("news").then(retrievedText => {
      document.querySelector("#bigbox1").innerHTML=retrievedText;
    })
    .catch(error => {
      console.error('Error during retrieval:', error);
    });
    const updates= await retrieveText("updates").then(retrievedText => {
      document.querySelector("#bigbox2").innerHTML=retrievedText;
    })
    .catch(error => {
      console.error('Error during retrieval:', error);
    });

}



