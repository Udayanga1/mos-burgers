const navMenu = document.getElementById("navbar-nav");
const productsSection = document.getElementById("products");
const ordersSection = document.getElementById("orders");
const customersSection = document.getElementById("customers");
const reportsSection = document.getElementById("reports");

const showProductFormBtn = document.getElementById("show-product-add-form");
const addProductBtn = document.getElementById("add-product-btn");
const closeProductFormBtn = document.getElementById("close-product-add-form");
const changeProductBtn = document.getElementById("edit-product-btn");
const modalContainer = document.getElementById("modal-container");
let productIncrement=1001;
let productList = [];

const navMenuList = [ 
  {item:"Products", isActive: true, relatedSection:productsSection},
  {item:"Orders", isActive: false, relatedSection:ordersSection}, 
  {item:"Customers", isActive: false, relatedSection:customersSection}, 
  {item:"Reports", isActive: false, relatedSection:reportsSection}
];

const tableColumns = {
  product: ["id", "name", "price", "discount"],
  customer: ["id", "name", "contact"]
}
// "id", "name", "contact"

// view nav menu
function renderNavMenu() {
  let navMenuHTML = navMenuList.map(element => {
    return `
      <li class="${element.isActive ? "nav-item rounded shadow rounded" : "nav-item"}">
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

showProductFormBtn.addEventListener("click", () => toggleShowForm("show", showProductFormBtn, clearProductForm));
closeProductFormBtn.addEventListener("click", () => toggleShowForm("close", showProductFormBtn, clearProductForm));
addProductBtn.addEventListener("click", () => addProduct());
changeProductBtn.addEventListener("click", ()=>{
  const productID = document.getElementById("product-id").value;
  changeProduct(productID);
});



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

function addProduct(){
  const productName = document.getElementById("product-name");
  const productPrice = document.getElementById("product-price");
  const productDiscount = document.getElementById("product-discount");
  const productID = "B" + productIncrement;
  
  // console.log(productName.value=="");
  if(productName.value=="" || productPrice.value=="" || productDiscount.value==""){
    alert("Please fill all the fields");
  } else {
    productIncrement++;
    let htmlEl=document.getElementById("table-body");
    
    const product = {
      id: productID,
      name: productName.value,
      price: productPrice.value,
      discount: productDiscount.value
    }
  
    productList.push(product);
    addToTable(productList, htmlEl, tableColumns.product, renderProductTableButtons);
    clearProductForm();
  }
  
  
}

function addToTable(array, htmlEl, table, renderButtons){
  let tableRow = '';
  array.forEach(element => {
    tableRow +='<tr>';
    table.forEach(item => {
      tableRow += `<td>${element[item]}</td>`  
    });

    tableRow+= renderButtons(element)
    
  tableRow += '</tr>'
  });
  htmlEl.innerHTML = tableRow;  
}

function renderProductTableButtons(element){
  return `     
      <td width="200">
        <button type="button" class="btn btn-secondary" onclick="showEditForm('${element.id}', 'product', clearProductForm, productList, showProductFormBtn)">Edit</button>
        <button type="button" class="btn btn-danger" onclick="deleteProduct('${element.id}')">Delete</button></td>
  `;
}

// clearProductForm productList showProductFormBtn
function showEditForm(id, table, clearForm, array, showFormBtn){
  console.log("showEditForm fired " + id);
  toggleShowForm("edit", showFormBtn, clearForm);

  array.forEach(element=>{
    if(element.id==id){
      console.log("element.id outer loop : " + element.id);
      tableColumns[table].forEach(col =>{
        document.getElementById(`${table}-${col}`).value=element[col];
        
      })
      // document.getElementById(`${table}-id`).value=element.id;
      // document.getElementById(`${table}-name`).value=element.name;
      // document.getElementById(`${table}-price`).value=element.price;
      // document.getElementById(`${table}-discount`).value=element.discount;
    }
  })

}

function clearProductForm(){
  document.getElementById("product-name").value="";
  document.getElementById("product-price").value="";
  document.getElementById("product-discount").value="";
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
  addToTable(productList, htmlEl, tableColumns.product, renderProductTableButtons);
  toggleShowForm("close", showProductFormBtn, clearProductForm);
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
    addToTable(productList, htmlEl, tableColumns.product, renderProductTableButtons);
    toggleShowForm("close", showProductFormBtn, clearProductForm);
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






