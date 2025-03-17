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
  product: ["id", "name", "price", "discount", "category", "qty", "expDate"],
  customer: ["id", "name", "contact"],
  order: ["id", "customerName", "orderGrossTotal", "orderDiscount", "orderNetTotal"]
}

document.getElementById("cart-product").addEventListener("click", ()=>{
  viewCart();
})

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
const cart = [];

function showProductsOnLandingPage(){  
  let burgerList = "";  
  let submarineList = "";
  let friesList = "";
  let pastaList = "";
  let chickenList = "";
  let beverageList = "";

  const requestOptions = {
    method: "GET",
  };

  const baseImageUrl = "http://localhost:8080/product/download";

  fetch("http://localhost:8080/product/all", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // console.log(result)
      result.forEach(product=>{
        console.log(product);
        if (product.category=="Burgers") {
          burgerList+=`
            <div class="card swiper-slide bg-success" style="width: 18rem;">
                <img src=${baseImageUrl + product.imageUrl} class="card-img-top" alt="${product.name}">
                <div class="row g-0">
                  <div class="card-body col-7">
                    <h6 class="card-title text-light">${product.name}</h6>
                    <h6 class="text-warning"> Price : ${product.price}</h6>
                    <p class="text-warning"> Discount : ${product.discount}%</p>                 
                  </div>
                  <div class="card-body col-5 d-grid">
                  ${
                    new Date() >= new Date(Date.parse(product.expiryDate))
                      ? `<h6> <span class="badge text-bg-danger">Expired on <br> ${product.expiryDate}</span></h6>`
                      : `<input type="number" class="form-control product-qty" value="1" min="1">
                        <input type="number" class="form-control d-none product-id" value=${product.id}>
                        <input type="text" class="form-control d-none product-name" value="${product.name}">
                         <button type="button" class="btn btn-outline-warning mt-2 lh-sm p-1 add-to-cart-btn">
                          <small>Add to cart</small>
                         </button>`
                  }
                    
                  </div>
                </div>
            </div>
          `
        } else if(product.category == "Submarines"){
            submarineList+=`
            <div class="card swiper-slide bg-success" style="width: 18rem;">
                <img src=${baseImageUrl + product.imageUrl} class="card-img-top" alt="${product.name}">
                <div class="row g-0">
                  <div class="card-body col-7">
                    <h6 class="card-title text-light">${product.name}</h6>
                    <h6 class="text-warning"> Price : ${product.price}</h6>
                    <p class="text-warning"> Discount : ${product.discount}%</p>                 
                  </div>
                  <div class="card-body col-5 d-grid">
                    ${new Date()>=new Date(product.expiryDate) ? '<h6> <span class="badge text-bg-danger">Expired on <br>' + product.expiryDate + '</span></h6>' : '<input type="number" class="form-control" value=1 min="1"> <button type="button" class="btn btn-outline-warning mt-2 lh-sm p-1"><small>Add to cart</small></button>' }
                    
                  </div>
                </div>
            </div>
          `
        } else if(product.category == "Fries"){

          friesList+=`
            <div class="card swiper-slide bg-success" style="width: 18rem;">
                <img src=${baseImageUrl + product.imageUrl} class="card-img-top" alt="${product.name}">
                <div class="row g-0">
                  <div class="card-body col-7">
                    <h6 class="card-title text-light">${product.name}</h6>
                    <h6 class="text-warning"> Price : ${product.price}</h6>
                    <p class="text-warning"> Discount : ${product.discount}%</p>                 
                  </div>
                  <div class="card-body col-5 d-grid">
                    ${new Date()>=new Date(product.expiryDate) ? '<h6> <span class="badge text-bg-danger">Expired on <br>' + product.expiryDate + '</span></h6>' : '<input type="number" class="form-control" value=1 min="1"> <button type="button" class="btn btn-outline-warning mt-2 lh-sm p-1"><small>Add to cart</small></button>' }
                    
                  </div>
                </div>
            </div>
          `
        } else if(product.category == "Pasta"){

          pastaList+=`
            <div class="card swiper-slide bg-success" style="width: 18rem;">
                <img src=${baseImageUrl + product.imageUrl} class="card-img-top" alt="${product.name}">
                <div class="row g-0">
                  <div class="card-body col-7">
                    <h6 class="card-title text-light">${product.name}</h6>
                    <h6 class="text-warning"> Price : ${product.price}</h6>
                    <p class="text-warning"> Discount : ${product.discount}%</p>                 
                  </div>
                  <div class="card-body col-5 d-grid">
                    ${new Date()>=new Date(product.expiryDate) ? `<h6> <span class="badge text-bg-danger">Expired on <br>${product.expiryDate} </span></h6>` : `<input type="number" class="form-control" value=1 min="1"> <button type="button" class="btn btn-outline-warning mt-2 lh-sm p-1"><small>Add to cart</small></button>` }
                    
                  </div>
                </div>
            </div>
          `
        } else if(product.category == "Chicken"){

          chickenList+=`
            <div class="card swiper-slide bg-success" style="width: 18rem;">
                <img src=${baseImageUrl + product.imageUrl} class="card-img-top" alt="${product.name}">
                <div class="row g-0">
                  <div class="card-body col-7">
                    <h6 class="card-title text-light">${product.name}</h6>
                    <h6 class="text-warning"> Price : ${product.price}</h6>
                    <p class="text-warning"> Discount : ${product.discount}%</p>                 
                  </div>
                  <div class="card-body col-5 d-grid">
                    ${new Date()>=new Date(product.expiryDate) ? '<h6> <span class="badge text-bg-danger">Expired on <br>' + product.expiryDate + '</span></h6>' : '<input type="number" class="form-control" value=1 min="1"> <button type="button" class="btn btn-outline-warning mt-2 lh-sm p-1"><small>Add to cart</small></button>' }
                    
                  </div>
                </div>
            </div>
          `
        } else if(product.category == "Beverages"){

          beverageList+=`
            <div class="card swiper-slide bg-success" style="width: 18rem;">
                <img src=${baseImageUrl + product.imageUrl} class="card-img-top" alt="${product.name}">
                <div class="row g-0">
                  <div class="card-body col-7">
                    <h6 class="card-title text-light">${product.name}</h6>
                    <h6 class="text-warning"> Price : ${product.price}</h6>
                    <p class="text-warning"> Discount : ${product.discount}%</p>                 
                  </div>
                  <div class="card-body col-5 d-grid">
                    ${new Date()>=new Date(product.expiryDate) ? '<h6> <span class="badge text-bg-danger">Expired on <br>' + product.expiryDate + '</span></h6>' : '<input type="number" class="form-control" value=1 min="1"> <button type="button" class="btn btn-outline-warning mt-2 lh-sm p-1"><small>Add to cart</small></button>' }
                    
                  </div>
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
      
      document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", (event) => {
          cart.push({
            qty: event.target.closest('.card-body').querySelector('.product-qty').value,
            name: event.target.closest('.card-body').querySelector('.product-name').value,
            id: event.target.closest('.card-body').querySelector('.product-id').value
          })
          
          // update cart notification
          document.getElementById("cart-product-count-notification").textContent = cart.length;
          console.log(cart);
          
        });
      });
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
          // autoplay: {
          //   delay: 2500,
          //   disableOnInteraction: false,
          // }
        });
}

// function addToCart(product, qty) {
//   console.log(product);
//   cart.push({
//     id: product.id,
//     qty: qty
//   });
  
// }



// function viewCart(){
//   let modalContent = `
//   <div class="position-relative">
//     <table class="table position-absolute top-0 start-0">
//       <thead>
//         <tr>
//           <th scope="col">ID</th>
//           <th scope="col">Name</th>
//           <th scope="col">Qty</th>
//         </tr>
//       </thead>
//       <tbody>
//   `
//   if (cart.length>0) {
//     cart.forEach((item)=>{
//       console.log(item);
//       modalContent+=`
//         <tr>
//           <th>${item.id}</th>
//           <th>${item.name}</th>
//           <th>${item.qty}</th>
//         </tr>
//       `
//     })
//   }

//   modalContent+=`
//         </tbody>
//     </table>
//     <button type="button" class="btn btn-warning" id="clear-cart-btn">Clear</button>
//   </div>
//   <P class="text-white">Working</p>
//   `
//   console.log(modalContainer);
  
//   modalContainer.innerHTML = modalContainer;
  
//   // document.getElementById("clear-cart-btn").addEventListener("click", ()=>{
//   //   modalContainer.innerHTML='';
//   // })
// }

function viewCart(){
  let modalContent = `
  <div class="position-absolute top-50 p-2 mt-2 bg-light bg-gradient shadow-lg rounded" style="width: 30rem;">
    <h5>Shopping Cart</h5>
    <hr>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Qty</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  if (cart.length > 0) {
    cart.forEach((item) => {
      modalContent += `
        <tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.qty}</td>
        </tr>
      `;
    });
  } else {
    modalContent += `
        <tr>
          <td colspan="3" class="text-center">Your cart is empty</td>
        </tr>
    `;
  }

  modalContent += `
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-end gap-2">
      <button class="btn btn-secondary" id="close-cart-btn">Close</button>
      <button class="btn btn-warning" id="clear-cart-btn">Clear Cart</button>
      <button class="btn btn-success" id="submit-cart-btn">Place Order</button>
    </div>
  </div>
  `;
  
  modalContainer.innerHTML = modalContent;
  
  document.getElementById("clear-cart-btn").addEventListener("click", () => {
    cart.length = 0;
    document.getElementById("cart-product-count-notification").textContent = "0";
    
    // refresh cart after clearing
    viewCart();
  });
  
  document.getElementById("close-cart-btn").addEventListener("click", () => {
    modalContainer.innerHTML = "";
  });

  if (cart.length>0) {
    document.getElementById("submit-cart-btn").addEventListener("click", ()=>{
      // Create URL parameters
      let params = new URLSearchParams();
  
      params.append('cartData', JSON.stringify(cart));
  
      window.location.href = "pages/orders.html?" + params.toString();
    })
  }
}