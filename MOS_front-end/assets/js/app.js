// const navMenu = document.getElementById("navbar-nav");
const productsSection = document.getElementById("products");
const ordersSection = document.getElementById("orders");
const customersSection = document.getElementById("customers");
const reportsSection = document.getElementById("reports");

const modalContainer = document.getElementById("modal-container");

const navMenuList = [ 
  {item:"Products", isActive: false, relatedSection:productsSection, redirectLink:"/pages/products.html"},
  {item:"Orders", isActive: false, relatedSection:ordersSection, redirectLink:"#"}, 
  {item:"Customers", isActive: false, relatedSection:customersSection, redirectLink:"#"}, 
  {item:"Reports", isActive: false, relatedSection:reportsSection, redirectLink:"#"}
];

const tableColumns = {
  product: ["id", "name", "price", "discount", "category"],
  customer: ["id", "name", "contact"],
  order: ["id", "customerName", "orderGrossTotal", "orderDiscount", "orderNetTotal"]
}

// view nav menu
// function renderNavMenu() {
//   let navMenuHTML = navMenuList.map(element => {
   
//     return `
//       <li class="${element.isActive ? "nav-item rounded shadow rounded" : "nav-item"}">
//         <a class="${element.isActive ? "nav-link active" : "nav-link"}" onclick="navHandler(event)" href=${element.redirectLink}>${element.item}</a>
//       </li>
//     `;
   
//   }).join(''); // Join the array into a single string
//   navMenu.innerHTML = navMenuHTML;
// }

// renderNavMenu();

// function navHandler(event){
//   const targetValue = event.target.textContent;
//   navMenuList.forEach(element=>{
//     if(targetValue==element.item){
//       element.isActive=true;
//       element.relatedSection.classList.remove("d-none");
//       element.relatedSection.classList.add("d-block");
//     } else {
//       element.isActive=false;
//       element.relatedSection.classList.remove("d-block");
//       element.relatedSection.classList.add("d-none");
//     }
//   })
//   renderNavMenu();
// }

function toggleShowForm(operation, showFormBtn, clearForm, item="product") {
  const form = document.getElementById(`add-${item}`);
  const addBtn = document.getElementById(`add-${item}-btn`);
  const editBtn = document.getElementById(`edit-${item}-btn`);
  if(operation=="show" || operation=="edit"){
    form.classList.remove("d-none");
    form.classList.add("d-block");
    showFormBtn.classList.add("d-none");
    if(operation=="show"){
      addBtn.classList.add("d-inline");
      addBtn.classList.remove("d-none");
      editBtn.classList.add("d-none");
    } else {
      editBtn.classList.add("d-inline");
      editBtn.classList.remove("d-none");
      addBtn.classList.add("d-none");
    }
  } else if (operation=="close"){
    form.classList.remove("d-block");
    form.classList.add("d-none");
    showFormBtn.classList.remove("d-none");
  }
  clearForm();
}

function addToTable(array, htmlEl, table, renderButtons){
  let tableRow = '';
  for (let index = array.length-1; index >= 0; index--) {
    tableRow +='<tr>';
    table.forEach(item => {
      tableRow += `<td>${array[index][item]}</td>`  
    });
    tableRow+= renderButtons(array[index])
    
    tableRow += '</tr>'
  }
  htmlEl.innerHTML = tableRow;  
}

function deleteForm(id, table, deleteItem){
  modalContainer.innerHTML=`
  <div class="position-absolute top-50 p-2 mt-2 bg-light bg-gradient shadow-lg rounded" style="width: 18rem;">
    <div>
      <h5 class="text-danger">Delete ${table}</h5>
      <hr>
      <p>Do you want to delete <b>${id}</b>?</p>
      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-success" id="cancel-btn">No</button>
        <button class="btn btn-danger" id="delete-btn">Yes</button>
      </div>
    </div>
  </div>`;

  // Delete product after confirmation
  document.getElementById("delete-btn").addEventListener("click", ()=>{
    deleteItem(id);   
  });
  
  document.getElementById("cancel-btn").addEventListener("click", ()=>{
    modalContainer.innerHTML="";
  });
}

function showProductsOnLandingPage(){
  let productList = "";
  
  let burgerList = "";  
  let submarineList = "";
  let friesList = "";
  let pastaList = "";
  let chickenList = "";
  let beverageList = "";

  const requestOptions = {
    method: "GET",
  };

  fetch("http://localhost:8080/product/all", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // console.log(result)
      result.forEach(product=>{
        console.log(product);
        if (product.category=="Burgers") {
          burgerList+=`
            <div class="card swiper-slide" style="width: 18rem;">
                <img src=${product.imageUrl} class="card-img-top" alt="${product.name}">
                <div class="card-body">
                  <h4 class="card-title">${product.name}</h4>
                  <h6> Price : ${product.price}</h6>
                  <h6> Price : ${product.discount}</h6>
                </div>
            </div>
          `
        } else if(product.category == "Submarines"){
            submarineList+=`
            <div class="card swiper-slide" style="width: 18rem;">
                <img src=${product.imageUrl} class="card-img-top" alt="${product.name}">
                <div class="card-body">
                  <h4 class="card-title">${product.name}</h4>
                  <h6> Price : ${product.price}</h6>
                  <h6> Price : ${product.discount}</h6>
                </div>
            </div>
          `
        } else if(product.category == "Fries"){

          friesList+=`
            <div class="card swiper-slide" style="width: 18rem;">
                <img src=${product.imageUrl} class="card-img-top" alt="${product.name}">
                <div class="card-body">
                  <h4 class="card-title">${product.name}</h4>
                  <h6> Price : ${product.price}</h6>
                  <h6> Price : ${product.discount}</h6>
                </div>
            </div>
          `
        } else if(product.category == "Pasta"){

          pastaList+=`
            <div class="card swiper-slide" style="width: 18rem;">
                <img src=${product.imageUrl} class="card-img-top" alt="${product.name}">
                <div class="card-body">
                  <h4 class="card-title">${product.name}</h4>
                  <h6> Price : ${product.price}</h6>
                  <h6> Price : ${product.discount}</h6>
                </div>
            </div>
          `
        } else if(product.category == "Chicken"){

          chickenList+=`
            <div class="card swiper-slide" style="width: 18rem;">
                <img src=${product.imageUrl} class="card-img-top" alt="${product.name}">
                <div class="card-body">
                  <h4 class="card-title">${product.name}</h4>
                  <h6> Price : ${product.price}</h6>
                  <h6> Price : ${product.discount}</h6>
                </div>
            </div>
          `
        } else if(product.category == "Beverages"){

          beverageList+=`
            <div class="card swiper-slide" style="width: 18rem;">
                <img src=${product.imageUrl} class="card-img-top" alt="${product.name}">
                <div class="card-body">
                  <h4 class="card-title">${product.name}</h4>
                  <h6> Price : ${product.price}</h6>
                  <h6> Price : ${product.discount}</h6>
                </div>
            </div>
          `
        } 

      });
      loadSwiper(burgerList, "mos-landing-burgers");
      loadSwiper(submarineList, "mos-landing-submarines");
      loadSwiper(friesList, "mos-landing-fries");
      loadSwiper(pastaList, "mos-landing-pasta");
      loadSwiper(chickenList, "mos-landing-chicken");
      loadSwiper(beverageList, "mos-landing-beverage");
    })
    .catch((error) => console.error(error));
}

function loadSwiper(list, htmlId){
  document.getElementById(htmlId).innerHTML = `
          <div class="swiper">
            <!-- Additional required wrapper -->
            <div class="swiper-wrapper">
                <!-- Slides -->
                ${list}              
            </div>
  
            <!-- If we need pagination -->
            <div class="swiper-pagination"></div>
            
            <!-- If we need navigation buttons -->
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          </div> 
          
        `;
        var swiper = new Swiper('.swiper', {
          slidesPerView: 3,
          spaceBetween: 10,
          loop: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          autoplay: {
            delay: 2500,
            disableOnInteraction: false,
          }
        });
}