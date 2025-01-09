const showOrderFormBtn = document.getElementById("show-order-add-form");
const addOrderBtn = document.getElementById("add-order-btn");
const closeOrderFormBtn = document.getElementById("close-order-add-form");
const changeOrderBtn = document.getElementById("edit-order-btn");
const orderProductCodeQty = document.getElementById("order-product-code-qty");
const addProductToOrderBtn = document.getElementById("add-product-to-order");

let orderIncrement=101;
let orderList = [];

showOrderFormBtn.addEventListener("click", () => toggleShowForm("show", showOrderFormBtn, clearCustomerForm, "order"));
closeOrderFormBtn.addEventListener("click", () => toggleShowForm("close", showOrderFormBtn, clearOrderForm, "order"));

addOrderBtn.addEventListener("click", () => addOrder());

addProductToOrderBtn.addEventListener("click", () => {
  
  // save existing product details when adding a new product input row
  const orderCodes = document.querySelectorAll('.order-product-code');
  const orderQtys = document.querySelectorAll('.order-product-qty');
  const codesList = [];
  const qtyList = [];
  orderCodes.forEach(element => {
    codesList.push(element.value);
  })
  orderQtys.forEach(element => {
    qtyList.push(element.value);
  })

  const htmlEl = `
    <div class="input-group mb-1">
      <label class="input-group-text">Product Code</label>
      <input type="text" class="form-control order-product-code" placeholder="Product Code"  name="order-product-code">
      <label class="input-group-text">Qty</label>
      <input type="number" class="form-control order-product-qty" placeholder="Qty" id="order-product-qty" name="order-product-qty">
    </div>
  `;
  orderProductCodeQty.innerHTML+=htmlEl;

  // copy earlier copied values
  const newOrderCodes = document.querySelectorAll('.order-product-code');
  const newOrderQtys = document.querySelectorAll('.order-product-qty');
  let index=0;
  newOrderCodes.forEach(element=>{
    if(index < codesList.length) {
      element.value=codesList[index];
      newOrderQtys[index].value=qtyList[index];
      index++;
    }
  })
  
  // document.querySelectorAll('.order-product-code').forEach(element => console.log(element.value));
})

function getOrderTotal(){
  const productCodes = document.querySelectorAll('.order-product-code');
  const productQtys = document.querySelectorAll('.order-product-qty');
  let index=0;
  let total=0;
  productCodes.forEach(productCode=>{
    const productQty = +productQtys[index].value // +is for convert to number
    if (productCode.value.length>0 && productQty>0) { 
      total+=productQty;
    } else {
      console.log(productCode.value.length + " code or qty not available");
      console.log(typeof(+productQtys[index].value));
      
    }
    index++;
  })
  return total;

}

function addOrder(){
  const customerCode = document.getElementById("order-customer-code");
  const orderDate = document.getElementById("order-date");
  const orderID = "O" + orderIncrement;

  

  const productList = [];

  // console.log("getOrderTotal in addOrder(): " + getOrderTotal());
  // return;
  
  
  if(customerCode.value=="" || orderDate.value=="" || getOrderTotal()==0){
    alert("Please fill all the fields");
  } else {
    orderIncrement++;
    let htmlEl=document.getElementById("table-body-order");
    
    const order = {
      id: orderID,
      name: orderName.value,
      contact: contact.value
    }
  
    orderList.push(order);
    addToTable(orderList, htmlEl, tableColumns.order, renderOrderTableButtons);
    clearOrderForm();
  }
}

function clearOrderForm(){
  document.getElementById("customer-name").value="";
  document.getElementById("customer-contact").value="";
}