const showOrderFormBtn = document.getElementById("show-order-add-form");
const addOrderBtn = document.getElementById("add-order-btn");
const closeOrderFormBtn = document.getElementById("close-order-add-form");
const addProductViewBtn = document.getElementById("view-order-btn");
const changeOrderBtn = document.getElementById("edit-order-btn");
const orderProductCodeQty = document.getElementById("order-product-code-qty");
const addProductToOrderBtn = document.getElementById("add-product-to-order");

let orderIncrement=101;
let orderList = [];
let editingOrderId = "";

showOrderFormBtn.addEventListener("click", () => {
  toggleShowForm("show", showOrderFormBtn, clearCustomerForm, "order");
  document.getElementById("view-order-btn").addEventListener("click", ()=>{
    viewOrder();
  })
});
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

// addProductViewBtn.addEventListener("click", () =>{
//   viewOrder();
  
// });

changeOrderBtn.addEventListener("click", ()=>{
  changeOrder();
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

function setOrder(isEditing=false){
  const productCodes = document.querySelectorAll('.order-product-code')
  const customerCode = document.getElementById("order-customer-code");
  const orderDate = document.getElementById("order-date");
  const orderStatus = document.getElementById("order-status");
  // if (isEditing) {
  //   const orderID = document.getElementById("order-id").value;
  // } else {
  //   const orderID = "O" + orderIncrement;
  // }
  const orderID = isEditing ? editingOrderId : "O" + orderIncrement;

  let customerName = "";
  
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
        customerName=customer.name;
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
                name: product.name,
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
          customerName: customerName,
          products: products,
          orderGrossTotal: orderGrossTotal.toFixed(2),
          orderDiscount: orderDiscount.toFixed(2),
          orderNetTotal: orderNetTotal.toFixed(2),
          date:orderDate.value,
          status: orderStatus.value
        }
        // console.log("order.id in setOrder(): " + order.id);
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
    } else{
      console.log("addOrder else: " + setOrder().count);
      
    }
    console.log(orderList);

    addToTable(orderList, document.getElementById("table-body-order"), tableColumns.order, renderOrderTableButtons);
    closeOrderView();
}

function changeOrder(){
  // change order
    const order = setOrder(true);
    let index = 0;
    // console.log("before outer if changeOrder");
    if (order.products.length>0) {
      // console.log("outer if changeOrder");
      orderList.forEach(item => {
        console.log("order.id: " + order.id + " item.id: " + item.id);
        if(item.id==order.id){
          orderList[index]=order;
          // console.log("inner if changeOrder");
        }
        index++;
      })
      // orderIncrement++;
      clearOrderForm();
    } else{
      console.log("changeOrder else: " + order.count);
      
    }
    console.log(orderList);

    addToTable(orderList, document.getElementById("table-body-order"), tableColumns.order, renderOrderTableButtons);
    closeOrderView();
    toggleShowForm("close", showOrderFormBtn, clearOrderForm, "order");
}

function renderOrderTableButtons(element) {
  return `     
      <td width="200">
        <button type="button" class="btn btn-secondary" onclick="showEditOrder('${element.id}')">Edit</button>
        <button type="button" class="btn btn-danger" onclick="deleteForm('${element.id}', 'Order', deleteOrder)">Delete</button>
      </td>
  `;
  
}

function viewOrder(isEditing=false){
  let productRows = '';
  const order = isEditing ? setOrder(true) : setOrder();
  order.products.forEach(product=>{
    productRows+=`
      <tr>
        <td scope="col">${product.id}</td>
        <td scope="col">${product.name}</td>
        <td scope="col" align ="right">${product.qty}</td>
        <td scope="col" align ="right">${product.price.toFixed(2)}</td>
        <td scope="col" align ="right">${(product.price * product.qty).toFixed(2)}</td>
      </tr>
    `;
  })
  modalContainer.innerHTML=`
  <div class="position-absolute top-50 p-2 mt-2 bg-light bg-gradient shadow-lg rounded" style="width: 38rem;">
    <div>
      <h5 class="text-danger">Order: ${order.id} (${order.status})</h5>
      <hr>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Description</th>
            <th scope="col" align ="right">Qty</th>
            <th scope="col" align ="right">Unit Price</th>
            <th scope="col" align ="right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
        </tbody>
        <tfoot class="table-dark">
          <tr class="table-active">
            <td colspan="4">Gross Total</td>
            <td ="right" align ="right">${parseFloat(order.orderGrossTotal).toLocaleString()}</td>
          </tr>
          <tr>
            <td colspan="4">Discount</td>
            <td ="right" align ="right">${parseFloat(order.orderDiscount).toLocaleString()}</td>
          </tr>
          <tr class="table-active">
            <td colspan="4">Net Total</td>
            <td ="right" align ="right">${parseFloat(order.orderNetTotal).toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      <p>Do you want to add the order ?</p>
      <div class="d-flex justify-content-end gap-2">
        ${isEditing ? '<button class="btn btn-warning" id="#" onclick="changeOrder()">Change</button>' : '<button class="btn btn-success" id="#" onclick="addOrder()">Add</button>'}
        <button class="btn btn-secondary" id="close-order-btn" onclick="closeOrderView()">Close</button>
      </div>
    </div>
  </div>`;
}

function clearOrderForm(){
  document.getElementById("order-customer-code").value="";
  document.getElementById("order-date").value="";
  document.getElementById("order-status").value ="Pending"
  orderProductCodeQty.innerHTML=`
  <div class="input-group mb-1">
    <label class="input-group-text">Product Code</label>
    <input type="text" class="form-control order-product-code" placeholder="Product Code"  name="order-product-code">
    <label class="input-group-text">Qty</label>
    <input type="number" class="form-control order-product-qty" placeholder="Qty" id="order-product-qty" name="order-product-qty">
  </div>
`;
}

function closeOrderView() {
  modalContainer.innerHTML="";
}

function deleteOrder(id){
  orderList = orderList.filter(item => item.id !==id);
    // let htmlEl = document.getElementById("table-body");
    addToTable(orderList, document.getElementById("table-body-order"), tableColumns.order, renderOrderTableButtons);
    toggleShowForm("close", showOrderFormBtn, clearOrderForm, "order");
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

function showEditOrder(id) {
  let productsArea = "";
  toggleShowForm("edit", showOrderFormBtn, clearCustomerForm, "order");
  orderList.forEach(order => {
    if (order.id==id) {
      order.products.forEach(product=>{
        productsArea+=`
          <div class="input-group mb-1">
            <label class="input-group-text">Product Code</label>
            <input type="text" class="form-control order-product-code" placeholder="Product Code"  name="order-product-code" value=${product.id}>
            <label class="input-group-text">Qty</label>
            <input type="number" class="form-control order-product-qty" placeholder="Qty" id="order-product-qty" name="order-product-qty" value=${product.qty}>
          </div>
        `
      });
      document.getElementById("order-customer-code").value=order.customerCode;
      document.getElementById("order-date").value = order.date;
      document.getElementById("order-status").value = order.status;
      orderProductCodeQty.innerHTML=productsArea;

      editingOrderId=order.id;//this use as the id in setOrder(true);

      document.getElementById("view-order-btn").addEventListener("click", ()=>{
        viewOrder(true);
      })
    }
  })
}

// load orders from orders.json
fetch('data/orders.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(item=>{

      // get customer name from customerList
      let customerName = "";
      customerList.forEach(customer=>{
        if (item.customerCode==customer.id) {
          customerName=customer.name;
        }
        
      });
      
      let orderTotal=0;
      let orderDiscount=0;
      
      const products = [];
      item.products.forEach(line => {
        
        productList.forEach(product=>{
          
          if(product.id==line.itemCode){
            products.push({
              id: line.itemCode,
              name: product.name,
              qty: +line.qty,
              price: +product.price,
              discount: +product.discount
            });
            orderTotal+=+product.price * +line.qty;
            orderDiscount+=product.price * +line.qty * (+product.discount/100);
          }
        })
      })
      const order = {
        id: "O" + orderIncrement++,
        customerCode: item.customerCode,
        customerName: customerName,
        products: products,
        orderGrossTotal: orderTotal.toFixed(2),
        orderDiscount: orderDiscount.toFixed(2),
        orderNetTotal: (orderTotal - orderDiscount).toFixed(2),
        date:item.date,
        status: item.status
      }
      orderList.push(order);
    });
    addToTable(orderList, document.getElementById("table-body-order"), tableColumns.order, renderOrderTableButtons);
  })
  .catch(error => console.error('Error loading the data:', error));
