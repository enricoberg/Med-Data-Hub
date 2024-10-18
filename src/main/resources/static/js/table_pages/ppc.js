function renderchanges(){
    localStorage.setItem("currentsection","changes");
    localStorage.setItem("editmode","false");
    resetPage();

    //CREATE A NEW DASHBOARD

    const newDash = document.createElement("div");
    document.body.insertBefore(newDash, document.body.firstChild);
    newDash.classList.add("dashboard");
    newDash.classList.add("components");
    newDash.innerHTML=`
    <div class="pagelabel">PAGE 1/1</div>
    <div class="rainbowtext sectiontitle">POST PRODUCTION CHANGES</div>
    <div class="prevbutton hover-message" title="Previous Page" onclick="changePageComponents(-1)"><img class="btnsmall" alt="Previous page" src="https://i.postimg.cc/zXN62Tk8/prev.png"></img></div>
    <div class="nextbutton hover-message" title="Next Page" onclick="changePageComponents(1)"><img class="btnsmall" alt="Next page" src="https://i.postimg.cc/FsxqM1Pc/next.png"></img></div>
    <div class="editbutton hover-message " title="Toggle edit mode" onclick="toggleEditMode(['ENGINEER'])"><img class="btnsmall" alt="Edit selection" src="https://i.postimg.cc/xCjY1RdG/write.png"></img></div>
    <div class="csvbutton hover-message" title="Download CSV File" onclick="downloadFile()"><img class="btnsmall" alt="Download CSV file" src="../../css/download.png"></img></div>
    <div class="flopbutton hover-message" style="right:75px;" title="Save edits" onclick="saveComponentsModifications()"><img class="btnsmall" alt="Save edits" src="../../css/diskette.png"></img></div>
    <div class="clipboardbutton hover-message" title="Copy to clipboard" onclick="copyTableToClipboard()"><img alt="Copy content of the table" class="btnsmall" src="../../css/copy.png"></img></div>
    <div class="newrecbutton hover-message" title="New record" onclick="rendernewcomponents()"><img alt="New record" class="btnsmall" src="../../css/add.png"></img></div>
    <form action="">
        <div class="input-group ">
            <input type="text" id="componentarticleinput" class="form-control documentcontrol" placeholder="Article number" name="codeinput" >
            <input type="text" id="componentdescriptioninput" class="form-control documentcontrol" placeholder="Description" name="descriptioninput">
        </div>
        <div class="selectcontainer" style="display:flex; justify-content:align-center; align-items:center; flex-wrap:wrap;">
        <div class="form-group ">
        <label for="intercompany" class="control-label "> Intercompany </label>
        <select id="intercompany" class="form-select form-select-sm selectcontrol" name="intercompany">
                      <option value="true">Intercompany</option>
                      <option value="false">Non-intercompany</option>
                      <option value="all" selected>See All</option>
                    </select>
        </div>
        <div class="form-group ">
        <label for="family" class="control-label">Component Family </label>
            <select id="family" class="form-select form-select-sm selectcontrol compfamilyinput" name="family" ><option value="all" selected >See All</option></select>
        </div>
        <div class="form-group ">
        <label for="standard" class="control-label">Conical Standard</label>
            <select id="standard" class="form-select form-select-sm selectcontrol" name="standard"><option value="all" selected >See All</option></select>
        </div>
        <div class="form-group ">
        <label for="packaging" class="control-label">Packaging Material</label>
            <select id="packaging" class="form-select form-select-sm selectcontrol" name="packaging">
              <option value="true">Packaging material</option>
              <option value="false">Non-packaging material</option>
              <option value="all" selected>See All</option>
            </select>
        </div>

        <div class="form-group ">
        <label for="contact" class="control-label">In Contact</label>
            <select id="contact" class="form-select form-select-sm selectcontrol" name="contact">
              <option value="true">In Contact</option>
              <option value="false">No Contact</option>
              <option value="all" selected>See All</option>
            </select>
        </div>

        <div class="form-group ">
        <label for="ca65" class="control-label">California 65</label>
            <select id="ca65" class="form-select form-select-sm selectcontrol" name="ca65">
              <option value="true">California65 In Scope</option>
              <option value="false">CA65 Non in Scope</option>
              <option value="all" selected>See All</option>
            </select>
        </div>
        <div class="form-group ">
        <label for="baimold" class="control-label">BAI Mold</label>
            <select id="baimold" class="form-select form-select-sm selectcontrol" name="baimold">
              <option value="true">Mold of BAI property</option>
              <option value="false">Commercial component</option>
              <option value="all" selected>See All</option>
            </select>
        </div>
        <div class="form-group ">
        <label for="materialinput" class="control-label">Contains Material:</label>
            <select id="materialinput" class="form-select form-select-sm selectcontrol" name="materialinput"> 
            <option value="all" selected >See All</option>             
            </select>
        </div>
        <div class="form-group ">
        <label for="supplierinput" class="control-label">Supplied by:</label>
            <select id="supplierinput" class="form-select form-select-sm selectcontrol" name="supplierinput"> 
            <option value="all" selected >See All</option>             
            </select>
        </div>
        </div>


        
     </form>
     <div class="resultbanner mt-4">~  Found 50 results  ~</div>
     `;

     updateChangesTable();

}


async function updateChangesTable(){
    // setTimeout(() => {
    //     startBuffering();
    // }, 25);
    
    resetPage(["dashboard"]);


    const gridContainer = document.createElement("div");    
    gridContainer.classList.add("containertable");
    // gridContainer.classList.add("thininvisible");
    document.body.insertBefore(gridContainer, document.body.lastChild);  

    //CREATE HEADERS
    gridContainer.innerHTML=`<div class=" mx-auto" id="targettable"></div>`;
    document.querySelector("#targettable").innerHTML=`<div class="row headerrow">                    
    <div class="col cw150 text-center etheader border ">
        <h3>PPC Nr.</h3>
    </div> 
    <div class="col cw150  text-center etheader border   ">
        <h3>Change Owner</h3>
    </div>
    <div class="col cw200  text-center etheader border ">
        <h3>Product Family</h3>
    </div>
    <div class="col cw400  text-center etheader border ">
        <h3>Change Description</h3>
    </div>
    <div class="col cw100  text-center etheader border ">
        <h3>Status</h3>
    </div>
    <div class="col cw150 text-center etheader border ">
        <h3>Start Date</h3>
    </div>
    <div class="col cw150 text-center etheader border ">
        <h3>End Date</h3>
    </div>
    <div class="col cw150  text-center etheader border ">
        <h3>Impact Date</h3>
    </div>
    <div class="col cw150 text-center etheader border ">
        <h3>Requestor</h3>
    </div>    
    <div class="col cw250 text-center etheader border  ">
        <h3>Action</h3>
    </div>      
</div>
`;

    
    
    
}