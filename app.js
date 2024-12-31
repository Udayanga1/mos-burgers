const showFormBtn = document.getElementById("show-product-add-form");
const addProductBtn = document.getElementById("add-product-btn");
const closeFormBtn = document.getElementById("close-product-add-form");
const changeProductBtn = document.getElementById("edit-product-btn");
let productIncrement=1000;
let productList = [];

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
      <td width="200"><button type="button" class="btn btn-secondary" onclick="showProductEditForm('${element.id}')">Edit</button> <button type="button" class="btn btn-danger" onclick="deleteProduct('${element.id}')">Delete</button></td>
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
  console.log("Delete btn clicked : " + id);
  const editedList = productList.filter(product => product.id !==id);

  if (confirm("Do you want to delete " + id)) {
    productList=editedList;
    let htmlEl = document.getElementById("table-body");
    addProductToTable(productList, htmlEl);
    clearProductForm();
    toggleShowForm("show");
  } 


}