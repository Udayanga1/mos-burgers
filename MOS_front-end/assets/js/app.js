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

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

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

  uploadProductsIfNotExists();
  addCustomerPreferencesIfNotExists();
  addCustomersIfNotExists();
  addOrdersIfNotExists();

  const baseImageUrl = "http://localhost:8080/product-image/download";

  fetch("http://localhost:8080/product/all", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // console.log(result)
      result.forEach(product=>{
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
          const productId = event.target.closest('.card-body').querySelector('.product-id').value;
          const productQty = event.target.closest('.card-body').querySelector('.product-qty').value;

          fetch("http://localhost:8080/product/"+productId)
          .then((response) => response.json())
          .then((result) => {
            if (productQty<=result.qty) {
              cart.push({
                qty: productQty,
                name: event.target.closest('.card-body').querySelector('.product-name').value,
                id: productId
              })
              
              // update cart notification
              document.getElementById("cart-product-count-notification").textContent = cart.length;
              console.log(cart);
            } else {
              alert("available qty is only: " + result.qty);
            }          
          })
          .catch((error) => console.error(error));          
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
        });
}

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

document.getElementById("search-product-btn").addEventListener("click", (event) => {
  event.preventDefault();
  
  searchProducts();
});

function searchProducts() {
  const searchInput = document.getElementById("search-product-input").value;

  const searchResults = [];
  let productRows='';
  let htmlEl="";

  console.log(searchInput);

  document.getElementById("modal-container").innerHTML= `
  <div class="position-absolute top-50 end-0 p-2 mt-2 bg-light bg-gradient shadow-lg rounded" style="width: 28rem;">
    <div class="d-flex justify-content-end">
      <button type="button" class="btn-close my-1" aria-label="Close" align="right" onclick="closeSearchView()"></button>
    </div>
    <div>
      <h5 class="text-danger">No results found</h5>
    </div>
  </div>
  `
  
  if(searchInput.charAt(0).toUpperCase()=="B" && !isNaN(searchInput.substring(1)) && searchInput.length>4){
    // search by Id
    fetch("http://localhost:8080/product/"+(+searchInput.substring(1)-1000))
    .then((response) => response.json())
    .then((result) => {
      document.getElementById("modal-container").innerHTML= `
        <div class="position-absolute top-50 end-0 p-2 mt-2 bg-light bg-gradient shadow-lg rounded overflow-auto" style="width: 28rem; height: 38rem;">
          <div class="d-flex justify-content-between">
            <h5 class="text-success">Search results</h5>
            <button type="button" class="btn-close my-1" aria-label="Close" align="right" onclick="closeSearchView()"></button>
          </div>
          <div>
            <table class="table table-striped table-success">
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Product</th>
                </tr>
              </thead>
              <tbody class="table-warning">
              <td>B${result.id+1000}</td>
              <td>${result.name}</td>
            </tbody>
          </table>
        </div>
      </div>`
    })
    .catch((error) => console.error(error));
  } else {
    // search by name
    fetch("http://localhost:8080/product/search/"+searchInput)
    .then((response) => response.json())
    .then((result) => {
      let table = `
      <div class="position-absolute top-50 end-0 p-2 mt-2 bg-light bg-gradient shadow-lg rounded overflow-auto" style="width: 28rem; height: 38rem;">
        <div class="d-flex justify-content-between">
          <h5 class="text-success">Search results</h5>
          <button type="button" class="btn-close my-1" aria-label="Close" align="right" onclick="closeSearchView()"></button>
        </div>
        <div>
          <table class="table table-striped table-success">
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Product</th>
              </tr>
            </thead>
            <tbody class="table-warning">`
      result.forEach((product)=>{
        console.log(product)
        table+=`
          <tr>
            <td>B${product.id+1000}</td>
            <td>${product.name}</td>
          </tr>
        `
      })
      table+=`
        </tbody>
          </table>
        </div>
      </div>`
      document.getElementById("modal-container").innerHTML=table;

    })
    .catch((error) => console.error(error));
  }  
}

function closeSearchView() {
  document.getElementById("modal-container").innerHTML="";
  document.getElementById("search-product-input").value="";  
}


function uploadProductsIfNotExists() {

  fetch("http://localhost:8080/product/all")
  .then((response)=>response.text())
  .then((result)=>{
    // console.log(JSON.parse(result).length);
    if(JSON.parse(result).length==0){
  
       //set default expiry date
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 5);
    
      const expiryDate = formatDate(currentDate);
      
      let indexForImage = 0;
      
      
      fetch("../data/products.json")
      .then((response)=> response.json())
      .then(result => {
        result.forEach(product => {
    
          indexForImage++;
          
          const raw = JSON.stringify({
            "name": product.itemName,
            "price": product.priceLKR,
            "discount": product.discount,
            "category": product.category,
            "imageUrl": "/" + indexForImage + ".jpg",
            "expiryDate": expiryDate,
            "qty": product.qty
          });
      
          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          };
    
          console.log(raw);
          
    
          fetch("http://localhost:8080/product/add", requestOptions)
            .then((response) => response.text())
            .then((text) => console.log(text))
            .catch((error) => console.error(error));
    
        })
        .catch((error) => console.error(error));
      })
  
    }
  })
  .catch((error) => console.error(error));
  
 

}

function addCustomerPreferencesIfNotExists(){
  fetch("http://localhost:8080/customer-preference/all")
  .then(response=>response.json())
  .then((result)=>{
    if(result.length==0){
      const customerPreferences = [
        "Customer: Allergy to nuts",
        "Customer: Prefers gluten-free options",
        "Customer: Vegan - no animal products",
        "Customer: Low-sodium diet",
        "Customer: Likes extra spicy food",
        "Customer: Lactose intolerant - no dairy",
        "Customer: Prefers contactless delivery",
        "Customer: Requests eco-friendly packaging",
        "Customer: Avoids artificial sweeteners",
        "Customer: Requires detailed nutritional info"
      ];
    
      customerPreferences.forEach(preference=>{
        console.log(preference);
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({"preference": preference})
        };

        fetch("http://localhost:8080/customer-preference/add", requestOptions)
        .then((response) => response.text())
        .then((text) => console.log(text))
        .catch((error) => console.error(error));
      })       
    }
  })
  .catch(error=>console.log(error));
}


function addCustomersIfNotExists(){
  fetch("http://localhost:8080/customer/all")
  .then(response=>response.json())
  .then(result=>{
    if (result.length==0) {
      fetch("../data/customers.json")
      .then(response=>response.json())
      .then(result=>{
        result.forEach(customer=>{
          
          console.log(customer);
          const raw = JSON.stringify({
            "name": customer.name,
            "preferenceId": Math.floor(Math.random() * 10) + 1,
            "contactNo": customer.contact,
            "points": 0
          });

          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          };
      
          fetch("http://localhost:8080/customer/add", requestOptions)
            .then((response) => response.text())
            .then((text) => console.log(text)
            )
            .catch((error) => console.error(error));
        })
        
      })
      .catch(error=>console.log(error)
      );
            
    }
  })
}

function addOrdersIfNotExists(){
  fetch("http://localhost:8080/orders/all")
  .then(response=>response.json())
  .then(result=>{
    if (result.length==0) {
      console.log("add order");
      fetch("../data/orders.json")
      .then(response=>response.json())
      .then(result=>{
        result.forEach(order=>{
          const productList = [];
          order.products.forEach(product=>{
            productList.push({
              productId: product.itemCode.substring(1)-1000,
              qty: product.qty
            });
          })

          const orderAdding = {
            "customerId": order.customerCode.substring(1)-100,
            "orderDetails": productList,
            "orderDate": order.date,
            "status": order.status    
          };

          requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(orderAdding),
            redirect: "follow"
          };

          fetch("http://localhost:8080/orders/add", requestOptions)
          .then(response=>response.text())
          .then(text=>console.log(text))
          .catch(error=>console.log(error))

          // console.log(order);
          // console.log(orderAdding);
        })       
      })
      .catch(error=>console.log(error))
    }
  })

  .catch(error=>console.log(error))
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}






  
      