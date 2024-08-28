function createCustomAlert(title,message, type) {
    const modalElements = document.querySelectorAll('.modalbackground');
    modalElements.forEach(modal => {
    modal.remove();
    });
    // Create the modal element
    const modal = document.createElement('div');
    modal.classList.add('modalbackground');
    document.body.appendChild(modal);
    // Create the modal content
    if (type === 'yesno'){ //CASE OF CONFIRMATION BOX WITH YES AND NO BUTTONS
        modal.innerHTML=`<div class="modalwindow">
                            <div class="img"><img src="https://i.postimg.cc/RV9sG6Jd/robomodal.webp" alt=""></div>
                            <div class="modalcontainer">
                                <h1>${title}</h1>
                                <p>${message}</p>
                                <div class="buttoncontainer">
                                    <button class="yes-button">Yes</button>
                                    <button class="no-button">No</button>
                                </div>
                                
                            </div>
                        </div>`;
      const noButton = document.querySelector('.no-button');   
      const yesButton= document.querySelector('.yes-button');
      return new Promise((resolve) => {
        yesButton.addEventListener('click', () => {modal.style.display = 'none'; resolve(true);});
        noButton.addEventListener('click', () => {modal.style.display = 'none'; resolve(false);});
      });
       
    }
    else{ //CASE OF SIMPLE ALERT
        modal.innerHTML=`<div class="modalwindow">
                            <div class="img"><img src="https://i.postimg.cc/RV9sG6Jd/robomodal.webp" alt=""></div>
                            <div class="modalcontainer">
                                <h1>${title}</h1>
                                <p>${message}</p>
                                <div class="buttoncontainer">
                                    <button class="ok-button">OK</button>                                    
                                </div>
                                
                            </div>
                        </div>`;
        document.querySelector('.ok-button').addEventListener('click', () => {modal.style.display = 'none';});
    }
  }
  
  // Example usage:
//   createCustomAlert('Title','This is a simple alert with an OK button', 'ok');
//   createCustomAlert('Title','Do you want to proceed?', 'yesno').then((result) => {     console.log(result)  });