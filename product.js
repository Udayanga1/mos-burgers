const showProductFormBtn = document.getElementById("show-product-add-form");
const addProductBtn = document.getElementById("add-product-btn");
const closeProductFormBtn = document.getElementById("close-product-add-form");
const changeProductBtn = document.getElementById("edit-product-btn");

let productIncrement=1001;
let productList = [];

showProductFormBtn.addEventListener("click", () => toggleShowForm("show", showProductFormBtn, clearProductForm));
closeProductFormBtn.addEventListener("click", () => toggleShowForm("close", showProductFormBtn, clearProductForm));
addProductBtn.addEventListener("click", () => addProduct());
changeProductBtn.addEventListener("click", ()=>{
  const productID = document.getElementById("product-id").value;
  changeProduct(productID);
});

// load products from products.json
fetch('data/products.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(item=>{
      const product = {
        id: item.itemCode,
        name: item.itemName,
        price: item.priceLKR,
        discount: item.discount,
        category: item.category 
      }
      productIncrement++;
      productList.push(product);
    });
    addToTable(productList, document.getElementById("table-body"), tableColumns.product, renderProductTableButtons);
  })
  .catch(error => console.error('Error loading the data:', error));

function addProduct(){
  const productName = document.getElementById("product-name");
  const productPrice = document.getElementById("product-price");
  const productDiscount = document.getElementById("product-discount");
  const productCategory = document.getElementById("product-category");
  const productID = "B" + productIncrement;
  
  if(productName.value=="" || productPrice.value=="" || productDiscount.value==""){
    alert("Please fill all the fields");
  } else {
    productIncrement++;
    let htmlEl=document.getElementById("table-body");
    
    const product = {
      id: productID,
      name: productName.value,
      price: productPrice.value,
      discount: productDiscount.value,
      category: productCategory.value
    }
    
    productList.push(product);
    addToTable(productList, htmlEl, tableColumns.product, renderProductTableButtons);
    clearProductForm();
  }
}

function renderProductTableButtons(element){
  return `     
      <td width="200">
        <button type="button" class="btn btn-secondary" onclick="showEditForm('${element.id}', 'product', clearProductForm, productList, showProductFormBtn)">Edit</button>
        <button type="button" class="btn btn-danger" onclick="deleteForm('${element.id}', 'Product', deleteProduct)">Delete</button></td>
  `;
}

// clearProductForm productList showProductFormBtn
function showEditForm(id, table, clearForm, array, showFormBtn){
  toggleShowForm("edit", showFormBtn, clearForm, table);

  array.forEach(element=>{
    if(element.id==id){
      tableColumns[table].forEach(col =>{
        document.getElementById(`${table}-${col}`).value=element[col];
        
      })
    }
  });
}

function clearProductForm(){
  document.getElementById("product-name").value="";
  document.getElementById("product-price").value="";
  document.getElementById("product-discount").value="";
  document.getElementById("product-category").value="Burgers";
}

function changeProduct(id){
  const productID = document.getElementById("product-id");
  const productName = document.getElementById("product-name");
  const productPrice = document.getElementById("product-price");
  const productDiscount = document.getElementById("product-discount");
  const productCategory = document.getElementById("product-category");
  let htmlEl=document.getElementById("table-body");

  productList.forEach(element=>{
    if(element.id==id){
      element.id = productID.value;
      element.name = productName.value;
      element.price = productPrice.value;
      element.discount = productDiscount.value;
      element.category = productCategory.value;
    }
  })
  addToTable(productList, htmlEl, tableColumns.product, renderProductTableButtons);
  toggleShowForm("close", showProductFormBtn, clearProductForm);
}


function deleteProduct(id){
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
}






