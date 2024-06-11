function colorRowAndColumn(row, col, numColumns) {
    
    const  gridContainer = document.querySelector('.grid-container');    
    let gridItems = gridContainer.querySelectorAll('.grid-item');
    let numRows = gridItems.length / numColumns;  
    
    for (let i = 0; i < gridItems.length; i++) {
        gridItems[i].style.backgroundColor = '';
    }    
    let rowStartIndex = (row ) * numColumns;
    let rowEndIndex = rowStartIndex + numColumns;
    
    for (let i = rowStartIndex; i < rowEndIndex; i++) {
        gridItems[i].style.backgroundColor ='rgba(106, 198, 226, 0.2)';
        // gridItems[i].style.backgroundColor ='rgba(43, 43, 193,0.1)';
    }  
    let columnStartIndex=  col+numColumns
    // for (let i = columnStartIndex; i < gridItems.length; i += numColumns) {
    //     gridItems[i].style.backgroundColor ='rgba(43, 43, 193,0.1)'; gridItems[i].style.backgroundColor ='rgba(43, 43, 193,0.1)';
        
    // }
    // gridItems[col+row*numColumns].style.backgroundColor='rgba(43, 43, 193,0.6)';
    gridItems[col+row*numColumns].style.backgroundColor='rgba(13, 110, 253, 1)';
    gridItems[col+row*numColumns].style.color="white";
    let all_links_in_cell=gridItems[col+row*numColumns].querySelectorAll("a");
    for(let i=0;i<all_links_in_cell.length;i++){all_links_in_cell[i].style.color="white";}
    
}



function activeCellColoring(numbercolumns){
    let gridItemsWithoutHeader = document.querySelectorAll('.grid-item:not(.tableheader)');
for(let element of gridItemsWithoutHeader){  
    element.addEventListener("mouseover",()=>{
        let position = Array.from(element.parentNode.children).indexOf(element);
        row=Math.floor(position/numbercolumns);
        column=position-row*numbercolumns;        
        colorRowAndColumn(row, column, numbercolumns);
    });
    element.addEventListener("mouseout",()=>{
        for(let j of document.querySelectorAll('.grid-item:not(.tableheader)')) j.style.color="#656565";
        for(let j of document.querySelectorAll('.grid-item:not(.tableheader)')) j.style.backgroundColor="";
        for(let j of document.querySelectorAll('.grid-item:not(.tableheader) a')) j.style.color="#007bff";

        
    });    
}
}

