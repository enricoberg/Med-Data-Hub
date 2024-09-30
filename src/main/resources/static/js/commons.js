function resetPage(exceptions=[]) {
    
    const body = document.body;
    const elements = Array.from(body.children);  
    elements.forEach(element => {
      const tagName = element.tagName.toLowerCase();
      if (tagName !== 'script' && tagName !== 'nav') {
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
    let increment=Math.floor(freespace / columns);
    for(item of allitems) item.style.width = (item.offsetWidth + increment) + 'px';        
    
    if(document.querySelector(".grid-container").classList.contains("thininvisible")) document.querySelector(".grid-container").classList.remove("thininvisible");
    
  }