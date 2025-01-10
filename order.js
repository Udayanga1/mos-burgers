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

  orderProductCodeQty.innerHTML+=`
    <div class="input-group mb-1">
      <label class="input-group-text">Product Code</label>
      <input type="text" class="form-control order-product-code" placeholder="Product Code"  name="order-product-code">
      <label class="input-group-text">Qty</label>
      <input type="number" class="form-control order-product-qty" placeholder="Qty" id="order-product-qty" name="order-product-qty">
    </div>
  `;

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

function getProductsCount(){
  const productCodes = document.querySelectorAll('.order-product-code');
  const productQtys = document.querySelectorAll('.order-product-qty');
  let index=0;
  let count=0;
  productCodes.forEach(productCode=>{
    const productQty = +productQtys[index].value // + converts to number
    if (productCode.value.length>0 && productQty>0) { 
      count++;
    } else {
      // console.log(productCode.value.length + " code or qty not available");
      // console.log(typeof(+productQtys[index].value));
      console.log("empty rows ignored");
      
      
    }
    index++;
  })
  return count;

}

function setOrder(){
  const productCodes = document.querySelectorAll('.order-product-code')
  const customerCode = document.getElementById("order-customer-code");
  const orderDate = document.getElementById("order-date");
  const orderID = "O" + orderIncrement;
  
  const productQtys = document.querySelectorAll('.order-product-qty');
  
  let index = 0;
  // let addToOrderList=false;
  let isValidCustomer = false;
  if(customerCode.value=="" || orderDate.value=="" || getProductsCount()==0){
    alert("Please fill all the fields");
  } 
  else {
    customerList.forEach(customer=>{
      if (customer.id==customerCode.value) {
        isValidCustomer = true;
      }
    })
    if (!isValidCustomer) {
      alert("Invalid customer code")
    } else {
        const products = [];
        let orderDiscount = 0;
        let orderGrossTotal = 0;
        let orderNetTotal = 0;
          productCodes.forEach(item => {
          productList.forEach(product=>{
            if(item.value==product.id) {
              const totalPerProduct = +product.price * +productQtys[index].value;
              orderGrossTotal+=totalPerProduct;
              orderDiscount+=totalPerProduct * (+product.discount/100);
              orderNetTotal = orderGrossTotal - orderDiscount;
              products.push({
                id: product.id,
                qty: +productQtys[index].value,
                price: +product.price,
                discount: +product.discount
              });
              console.log(customerCode.value);
              
              
            } else {
              console.log("invalid product: " + item.value);
              
            }
          })
          index++;
        });
      
        let htmlEl=document.getElementById("table-body-order");
        const order = {
          id: orderID,
          customerCode: customerCode.value,
          products: products,
          orderGrossTotal: orderGrossTotal,
          orderDiscount: orderDiscount,
          orderNetTotal: orderNetTotal
        }
    
        return order;
      } 
    }
}

function addOrder(){
  // Add order to list
    if (setOrder().products.length>0) {
      orderList.push(setOrder());
      orderIncrement++;
      clearOrderForm();
      // document.getElementById("order-customer-code").value="";
      // document.getElementById("order-date").value="";
    } else{
      console.log("addOrder else: " + setOrder().count);
      
    }
    console.log(orderList);

    return;
    addToTable(orderList, htmlEl, tableColumns.order, renderOrderTableButtons);
}

function clearOrderForm(){
  document.getElementById("order-customer-code").value="";
  document.getElementById("order-date").value="";
  orderProductCodeQty.innerHTML=`
  <div class="input-group mb-1">
    <label class="input-group-text">Product Code</label>
    <input type="text" class="form-control order-product-code" placeholder="Product Code"  name="order-product-code">
    <label class="input-group-text">Qty</label>
    <input type="number" class="form-control order-product-qty" placeholder="Qty" id="order-product-qty" name="order-product-qty">
  </div>
`;
}