const navMenu = document.getElementById("navbar-nav");
const productsSection = document.getElementById("products");
const ordersSection = document.getElementById("orders");
const customersSection = document.getElementById("customers");
const reportsSection = document.getElementById("reports");

const modalContainer = document.getElementById("modal-container");


const navMenuList = [ 
  {item:"Products", isActive: true, relatedSection:productsSection},
  {item:"Orders", isActive: false, relatedSection:ordersSection}, 
  {item:"Customers", isActive: false, relatedSection:customersSection}, 
  {item:"Reports", isActive: false, relatedSection:reportsSection}
];

const tableColumns = {
  product: ["id", "name", "price", "discount", "category"],
  customer: ["id", "name", "contact"],
  order: ["id", "customerName", "orderGrossTotal", "orderDiscount", "orderNetTotal"]
}

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

renderNavMenu();

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