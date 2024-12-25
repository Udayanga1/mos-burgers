const showFormBtn = document.getElementById("show-product-add-form");
const addProductBtn = document.getElementById("add-product-btn");
const closeFormBtn = document.getElementById("close-product-add-form");
let productIncrement=1000;
let productList = [];

showFormBtn.addEventListener("click", () => toggleShowForm("show"));
closeFormBtn.addEventListener("click", () => toggleShowForm("close"));
addProductBtn.addEventListener("click", () => addProduct());

function toggleShowForm(operation) {
  const form = document.getElementById("add-product");
  if(operation=="show"){
    form.classList.remove("d-none");
    form.classList.add("d-block");
    showFormBtn.classList.add("d-none");
  } else if (operation=="close"){
    form.classList.remove("d-block");
    form.classList.add("d-none");
    showFormBtn.classList.remove("d-none");
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
  
  productName.value="";
  productPrice.value="";
  productDiscount.value="";
  
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
    </tr>
  `;
  });
  htmlEl.innerHTML = tableContent;  
}