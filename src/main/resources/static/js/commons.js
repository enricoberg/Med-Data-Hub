function resetPage(exceptions=[]) {
    
    const body = document.body;
    const elements = Array.from(body.children);  
    elements.forEach(element => {
      const tagName = element.tagName.toLowerCase();
      
      if (tagName !== 'script' && tagName !== 'nav' && !element.classList.contains("assistantcontainer")) {
        if (exceptions==[]) body.removeChild(element);
        else{
            
            toRemove=true;
            for(let i=0;i<exceptions.length;i++){
                
                
                if(element.classList.contains(exceptions[i])) toRemove=false;
            }
            if(toRemove) body.removeChild(element);
        }
      }
    });
  }
  function adjustTableCSS() {
    const headers = document.querySelectorAll('.tableheader');
    const columns=headers.length;    
    document.querySelector('.grid-container').classList.add(`columnsnumber${columns}`);
    let allitems=document.querySelectorAll('.grid-item');
    let totallength=0;
    
    totallength=0;
    for(let i=0;i<headers.length;i++)totallength+=headers[i].offsetWidth;     
    let freespace=(screen.width*0.9 -totallength);
    
    if(freespace>0){
      let increment=Math.floor(freespace / columns);
      if(increment>10)  for(item of allitems) item.style.width = (item.offsetWidth + increment) + 'px';      
      
       
    }
         
    
    if(document.querySelector(".grid-container").classList.contains("thininvisible")) document.querySelector(".grid-container").classList.remove("thininvisible");
    
  }



  async function retrieveOptions(listname){
    try{
    const response= await axios.get(`/aux/getoptions?listname=${listname}`,{ headers: { 'Authorization': authenticationheader()}});
    if(response.status != 200) throw new Error('Error retrieving options');
    let options="";
    for(const obj of response.data) options+=`<option value="${obj.value}">${obj.label}</option>`;        
    return options;
    }
    catch(error){
        console.error(error);
        throw new Error('Error retrieving options');
    }
    
  }
  
  async function retrieveText(txtname) {
    return axios.get(`/aux/gettext?filename=${txtname}`, { headers: { 'Authorization': authenticationheader() } })
      .then((response) => {
        if (response.status !== 200) throw new Error('Error retrieving options');
        return response.data;
      });
  }