const filterContainer = document.querySelector(".gallery-filter"), 
  galleryItems = document.querySelectorAll(".gallery-item");

const filterContainer2 = document.querySelector(".gallery-filter2");
let currentFilter1 = "all";
let currentFilter2 = "all";

 filterContainer.addEventListener("click", (event) =>{
   if(event.target.classList.contains("filter-item")){
     // deactivate existing active 'filter-item'
     filterContainer.querySelector(".active").classList.remove("active");
     // activate new 'filter-item'
     event.target.classList.add("active");
     const filterValue = event.target.getAttribute("data-filter");
     currentFilter1 = filterValue;
     galleryItems.forEach((item) => {
      if(filterValue !== 'all') {
        if (currentFilter2 !== "all") {
          if((item.classList.contains(filterValue) && item.classList.contains(currentFilter2))){
            item.classList.remove("hide");
            item.classList.add("show");
          } else{
            item.classList.remove("show");
            item.classList.add("hide");
          }
        } else {
          if(item.classList.contains(filterValue)){
            item.classList.remove("hide");
            item.classList.add("show");
           }
           else{
            item.classList.remove("show");
            item.classList.add("hide");
           }
        }
      } else {
        if(filterValue === 'all' && item.classList.contains(currentFilter2) && currentFilter2 !== "all"){
          item.classList.remove("hide");
          item.classList.add("show");
         }
         else{
          if(filterValue === 'all' && currentFilter2 === "all"){
            item.classList.remove("hide");
            item.classList.add("show");
          }
          else {
            item.classList.remove("show");
            item.classList.add("hide");
          }
         }
      }
       
     });
   }

   
 });

 filterContainer2.addEventListener("click", (event) =>{
  if(event.target.classList.contains("filter-item")){
    // deactivate existing active 'filter-item'
    filterContainer2.querySelector(".active").classList.remove("active");
    // activate new 'filter-item'
    event.target.classList.add("active");
    const filterValue = event.target.getAttribute("data-filter");
    currentFilter2 = filterValue;
    galleryItems.forEach((item) => {
      if(filterValue !== 'all') {
        if (currentFilter1 !== "all") {
          if((item.classList.contains(filterValue) && item.classList.contains(currentFilter1))){
            item.classList.remove("hide");
            item.classList.add("show");
          } else{
            item.classList.remove("show");
            item.classList.add("hide");
          }
        } else {
          if(item.classList.contains(filterValue)){
            item.classList.remove("hide");
            item.classList.add("show");
           }
           else{
            item.classList.remove("show");
            item.classList.add("hide");
           }
        }
      } else {
        if(filterValue === 'all' && item.classList.contains(currentFilter1) && currentFilter1 !== "all"){
          item.classList.remove("hide");
          item.classList.add("show");
         }
         else{
            if(filterValue === 'all' && currentFilter1 === "all"){
              item.classList.remove("hide");
              item.classList.add("show");
            }
            else {
              item.classList.remove("show");
              item.classList.add("hide");
            }
         }
      }
    });
  }
});

