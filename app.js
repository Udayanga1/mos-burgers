const navMenu = document.getElementById("navbar-nav");
const productsSection = document.getElementById("products");
const ordersSection = document.getElementById("orders");
const customersSection = document.getElementById("customers");
const reportsSection = document.getElementById("reports");

const showFormBtn = document.getElementById("show-product-add-form");
const addProductBtn = document.getElementById("add-product-btn");
const closeFormBtn = document.getElementById("close-product-add-form");
const changeProductBtn = document.getElementById("edit-product-btn");
const modalContainer = document.getElementById("modal-container");
let productIncrement=1000;
let productList = [];

const navMenuList = [ 
  {item:"Products", isActive: true, relatedSection:productsSection},
  {item:"Orders", isActive: false, relatedSection:ordersSection}, 
  {item:"Customers", isActive: false, relatedSection:customersSection}, 
  {item:"Reports", isActive: false, relatedSection:reportsSection}
];

// view nav menu
function renderNavMenu() {
  let navMenuHTML = navMenuList.map(element => {
    return `
      <li class="nav-item">
        <a class="${element.isActive ? "nav-link active" : "nav-link"}" onclick="navHandler(event)">${element.item}</a>
      </li>
    `;
  }).join(''); // Join the array into a single string
  navMenu.innerHTML = navMenuHTML;
}

renderNavMenu(); // Initially render the nav menu

function navHandler(event){
  const targetValue = event.target.textContent;
  navMenuList.forEach(element=>{
    if(targetValue==element.item){
      element.isActive=true;
      element.relatedSection.classList.remove("d-none");
      element.relatedSection.classList.add("d-block");
    } else {
      element.isActive=false;
      element.relatedSection.classList.remove("d-block");
      element.relatedSection.classList.add("d-none");
    }
  })
  renderNavMenu();
}
{/* <li class="nav-item">
            <a class="nav-link "  href="#">Products</a>
          </li>
          <li class="nav-item border rounded border-light">
            <a class="nav-link active"  href="#">Orders</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Customers</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Reports</a>
          </li> */}

showFormBtn.addEventListener("click", () => toggleShowForm("show"));
closeFormBtn.addEventListener("click", () => toggleShowForm("close"));
addProductBtn.addEventListener("click", () => addProduct());
changeProductBtn.addEventListener("click", ()=>{
  const productID = document.getElementById("product-id").value;
  changeProduct(productID);
});



function toggleShowForm(operation) {
  const form = document.getElementById("add-product");
  const addBtn = document.getElementById("add-product-btn");
  const editBtn = document.getElementById("edit-product-btn");
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
    clearProductForm();
  }
}

function addProduct(){
  productIncrement++;
  const productName = document.getElementById("product-name");
  const productPrice = document.getElementById("product-price");
  const productDiscount = document.getElementById("product-discount");
  const productID = "B" + productIncrement;
  let htmlEl=document.getElementById("table-body");
  
  const product = {
    id: productID,
    name: productName.value,
    price: productPrice.value,
    discount: productDiscount.value
  }
  productList.push(product);
  addProductToTable(productList, htmlEl);
  clearProductForm();
  
}

function addProductToTable(array, htmlEl){
  let tableContent = '';
  array.forEach(element => {
    tableContent += `
    <tr>
      <td>${element.id}</td>
      <td>${element.name}</td>
      <td>${element.price}</td>
      <td>${element.discount}</td>
      <td width="200">
        <button type="button" class="btn btn-secondary" onclick="showProductEditForm('${element.id}')">Edit</button>
        <button type="button" class="btn btn-danger" onclick="deleteProduct('${element.id}')">Delete</button></td>
    </tr>
  `;
  });
  htmlEl.innerHTML = tableContent;  
}

function showProductEditForm(id){
  console.log("showProductEditForm fired " + id);
  toggleShowForm("edit");
  const productID = document.getElementById("product-id");
  const productName = document.getElementById("product-name");
  const productPrice = document.getElementById("product-price");
  const productDiscount = document.getElementById("product-discount");

  productList.forEach(element=>{
    if(element.id==id){
      productID.value=element.id;
      productName.value=element.name;
      productPrice.value=element.price;
      productDiscount.value=element.discount;
    }
  })

}

function clearProductForm(){
  const productName = document.getElementById("product-name");
  const productPrice = document.getElementById("product-price");
  const productDiscount = document.getElementById("product-discount");

  productName.value="";
  productPrice.value="";
  productDiscount.value="";
}

function changeProduct(id){
  const productID = document.getElementById("product-id");
  const productName = document.getElementById("product-name");
  const productPrice = document.getElementById("product-price");
  const productDiscount = document.getElementById("product-discount");
  let htmlEl=document.getElementById("table-body");

  productList.forEach(element=>{
    if(element.id==id){
      element.id = productID.value;
      element.name = productName.value;
      element.price = productPrice.value;
      element.discount = productDiscount.value;
    }
  })
  addProductToTable(productList, htmlEl);
  clearProductForm();
  toggleShowForm("show");
}

function deleteProduct(id){
  modalContainer.innerHTML=`
  <div class="position-absolute top-50 p-2 mt-2 bg-light bg-gradient shadow-lg rounded" style="width: 18rem;">
    <div>
      <h5 class="text-danger">Delete Product</h5>
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
    productList = productList.filter(item => item.id !==id);
    let htmlEl = document.getElementById("table-body");
    addProductToTable(productList, htmlEl);
    clearProductForm();
    toggleShowForm("show");
    setTimeout(() => {
      modalContainer.innerHTML = `
        <div class="position-absolute top-50 p-2 mt-2 bg-danger text-white bg-gradient shadow-lg rounded" style="width: 18rem;">
          <div>
            <h5>Item ${id} Deleted successfully</h5>
            <hr>
          </div>
        </div>`;

      // Close the modal after a few milliseconds
      setTimeout(() => {
        modalContainer.innerHTML="";
      }, 2000);  // Close the modal after 2 seconds
    }, 100);
    
  });
  
  document.getElementById("cancel-btn").addEventListener("click", ()=>{
    modalContainer.innerHTML="";
  });


}


