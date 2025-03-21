const showOrderFormBtn = document.getElementById("show-order-add-form");
const addOrderBtn = document.getElementById("add-order-btn");
const closeOrderFormBtn = document.getElementById("close-order-add-form");
const addProductViewBtn = document.getElementById("view-order-btn");
const editOrderBtn = document.getElementById("edit-order-btn");
const orderProductCodeQty = document.getElementById("order-product-code-qty");
const addProductToOrderBtn = document.getElementById("add-product-to-order");

showOrderFormBtn.addEventListener("click", () => {
  toggleShowForm("show", showOrderFormBtn, clearOrderForm, "order");
  document.getElementById("view-order-btn").addEventListener("click", ()=>{
    viewOrder();
  });
  getCustomerNameOnBlur();
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
      <input type="number" class="form-control order-product-qty" placeholder="Qty" name="order-product-qty" onblur="checkProductQtyAndCode(event)">
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

})

editOrderBtn.addEventListener("click", ()=>{
  addOrder(true);
})

// catch data coming from cart
document.addEventListener("DOMContentLoaded", ()=>{
  const urlParams = new URLSearchParams(window.location.search);
  const cartDataParam = urlParams.get("cartData");

  let cartData = [];

  try {
    cartData = JSON.parse(cartDataParam);
  } catch (e) {
    console.error("Error parsing cart data:", e);
  }

  if (cartData && cartData.length > 0){
    
    console.log(cartData);
    toggleShowForm("show", showOrderFormBtn, clearOrderForm, "order");
  
    orderProductCodeQty.innerHTML='';
      cartData.forEach((item)=>{
        orderProductCodeQty.innerHTML+=`
        <div class="input-group mb-1">
          <label class="input-group-text">Product Code</label>
          <input type="text" class="form-control order-product-code" placeholder="Product Code"  name="order-product-code" value=${"B" + (+item.id+1000)}>
          <label class="input-group-text">Qty</label>
          <input type="number" class="form-control order-product-qty" placeholder="Qty" name="order-product-qty" value=${+item.qty} onblur="checkProductQtyAndCode(event)">
        </div>
      `;
    })
  }
  
})

function addOrder(isEditing=false){
  const productCodes = document.querySelectorAll('.order-product-code')
  const productQtys = document.querySelectorAll('.order-product-qty');
  const customerCode = document.getElementById("order-customer-code");
  const orderDate = document.getElementById("order-date");
  const orderStatus = document.getElementById("order-status");

  const productList = [];

  const dbCusCode = customerCode.value.substring(1) - 100;
  
  fetch("http://localhost:8080/customer/"+dbCusCode)
    .then((response) => response.json())
    .then((result) => {
      let index=0;
      let productCount=0;
      // add products to productList if customer exists
      productCodes.forEach((code)=>{
        if (code.value) {
          productList.push({
            productId: +productCodes[index].value.substring(1)-1000,
            qty: +productQtys[index].value
          })
          productCount+=productQtys[index].value;
        }
        index++;
      })
      
      // document.getElementById("order-id").value
      // validate inputs
      if(customerCode.value=="" || orderDate.value=="" || productCount==0){
          alert("Please fill all the fields");
      } else {
        let requestOptions = {};
        let url = "";
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const orderId = document.getElementById("order-id");

        if (!isEditing) {
          const order = {
            "customerId": dbCusCode,
            "orderDetails": productList,
            "orderDate": orderDate.value,
            "status": orderStatus.value    
          };

          requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(order),
            redirect: "follow"
          };

          url = "http://localhost:8080/orders/add";

        } else {
          const order = {
            "customerId": dbCusCode,
            "orderDetails": productList,
            "orderDate": orderDate.value,
            "status": orderStatus.value,
            "orderId": orderId.value    
          };

          requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(order),
            redirect: "follow"
          };

          url = "http://localhost:8080/orders/update/"+order.orderId;

        }

        // adds the order to the db
        fetch(url, requestOptions)
          .then((response) => response.text())
          .then(() => {
            clearOrderForm();
            updateProductQty(productList);
            showOrdersTable();
          })
          .catch((error) => console.error(error));
      }
    })
    .catch((error) => {
      console.error(error)
      console.log("unavailable customer");
    });
}

function updateProductQty(productList){
 productList.forEach((item)=>{
  fetch("http://localhost:8080/product/"+item.productId)
  .then((response) => response.json())
  .then((result) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "id": item.productId,
      "name": result.name,
      "price": result.price,
      "discount": result.discount,
      "category": result.category,
      "imageUrl": result.imageUrl,
      "expiryDate": result.expiryDate,
      "qty": result.qty-item.qty
    });

    console.log(raw);
    
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:8080/product/update", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    console.log(result)
  })
  .catch((error) => console.error(error));
 })
}

function checkProductQtyAndCode(event){
  const qtyValue = event.target.value;
  const productCode = event.target.closest('.input-group').querySelector('.order-product-code').value;
  const orderDate = new Date(document.getElementById("order-date").value);
  console.log(orderDate);
  
  const parentContainer = event.target.closest('.input-group').parentElement;
  const existingWarning = parentContainer.querySelector('.text-danger');
  if (existingWarning) {
    existingWarning.remove();
  }

  const dbProductCode = productCode.substring(1)-1000

  if(dbProductCode>0 && qtyValue>0){
    console.log(`Product Code: ${productCode}, Qty: ${qtyValue}`);

    fetch("http://localhost:8080/product/" + dbProductCode)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      const remainingQty = result.qty-qtyValue;
      if (remainingQty<0) {
        const warningText = document.createElement('p');
        warningText.classList.add('text-danger');
        warningText.textContent = `Available Qty is only ${result.qty} for ${productCode}`;
        event.target.closest('.input-group').parentElement.insertAdjacentElement('beforeend', warningText);
        event.target.value='';
      } else if (remainingQty<4) {
        const warningText = document.createElement('p');
        warningText.classList.add('text-danger');
        warningText.textContent = remainingQty > 0 ? `Only ${remainingQty} ${result.name} (${productCode}) left once this order placed` : `No more ${result.name} (${productCode}) left once this order placed`;
        event.target.closest('.input-group').parentElement.insertAdjacentElement('beforeend', warningText);
      }



      if (orderDate>=new Date(result.expiryDate)) {
        const warningText = document.createElement('p');
        warningText.classList.add('text-danger');
        warningText.textContent = `${productCode} expire date : ${result.expiryDate}`;
        event.target.closest('.input-group').parentElement.insertAdjacentElement('beforeend', warningText);
        event.target.value='';
      }
      
    })
    .catch((error) => {
      console.error(error)
      const warningText = document.createElement('p');
      warningText.classList.add('text-danger');
      warningText.textContent = `${productCode} is not available`;
      event.target.closest('.input-group').parentElement.insertAdjacentElement('beforeend', warningText);
      event.target.value='';
    });
  }
}


function renderOrderTableButtons(element) {
  return `     
      <td width="200">
        <button type="button" class="btn btn-secondary" onclick="showEditOrder('${element.id}')">Edit</button>
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
        ${isEditing ? '<button class="btn btn-warning" id="#" onclick="editOrder()">Change</button>' : '<button class="btn btn-success" id="#" onclick="addOrder()">Add</button>'}
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
      <input type="number" class="form-control order-product-qty" placeholder="Qty" name="order-product-qty" onblur="checkProductQtyAndCode(event)">
    </div>
`;
  // clear customer name
  document.getElementById("order-customer-name").innerText="";
}

function closeOrderView() {
  modalContainer.innerHTML="";
}

// function deleteOrder(id){
//   orderList = orderList.filter(item => item.id !==id);
//     // let htmlEl = document.getElementById("table-body");
//     addToTable(orderList, document.getElementById("table-body-order"), tableColumns.order, renderOrderTableButtons);
//     toggleShowForm("close", showOrderFormBtn, clearOrderForm, "order");
//     setTimeout(() => {
//       modalContainer.innerHTML = `
//         <div class="position-absolute top-50 p-2 mt-2 bg-danger text-white bg-gradient shadow-lg rounded" style="width: 18rem;">
//           <div>
//             <h5>Item ${id} Deleted successfully</h5>
//             <hr>
//           </div>
//         </div>`;

//       // Close the modal after a few milliseconds
//       setTimeout(() => {
//         modalContainer.innerHTML="";
//       }, 2000);  // Close the modal after 2 seconds
//     }, 100);
// }

function showEditOrder(id) {
  let productsArea = "";
  toggleShowForm("edit", showOrderFormBtn, clearOrderForm, "order");
  fetch("http://localhost:8080/orders/"+id)
  .then((response) => response.json())
  .then((result) => {
    console.log(result)

    const date = new Date(result.orderDate);
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    document.getElementById("order-date").value = `${year}-${month}-${day}`;

    document.getElementById("order-customer-code").value="C" + (result.customerId+100);
    document.getElementById("order-status").value=result.status;
    document.getElementById("order-id").value=result.orderId;

    orderProductCodeQty.innerHTML='';
    result.orderDetails.forEach((item)=>{
      orderProductCodeQty.innerHTML+=`
      <div class="input-group mb-1">
        <label class="input-group-text">Product Code</label>
        <input type="text" class="form-control order-product-code" placeholder="Product Code"  name="order-product-code" value=${"B" + (item.productId+1000)}>
        <label class="input-group-text">Qty</label>
        <input type="number" class="form-control order-product-qty" placeholder="Qty" name="order-product-qty" value=${item.quantity} onblur="checkProductQtyAndCode(event)">
      </div>
    `;
    })

  })
  .catch((error) => console.error(error));
  // orderList.forEach(order => {
  //   if (order.id==id) {
  //     order.products.forEach(product=>{
  //       productsArea+=`
  //         <div class="input-group mb-1">
  //           <label class="input-group-text">Product Code</label>
  //           <input type="text" class="form-control order-product-code" placeholder="Product Code"  name="order-product-code" value=${product.id}>
  //           <label class="input-group-text">Qty</label>
  //           <input type="number" class="form-control order-product-qty" placeholder="Qty" name="order-product-qty" onblur="checkProductQtyAndCode(event) value=${product.qty}>
  //         </div>
  //       `
  //     });
  //     document.getElementById("order-customer-code").value=order.customerCode;
  //     document.getElementById("order-date").value = order.date;
  //     document.getElementById("order-status").value = order.status;
  //     orderProductCodeQty.innerHTML=productsArea;

  //     editingOrderId=order.id;//this use as the id in setOrder(true);

  //     document.getElementById("view-order-btn").addEventListener("click", ()=>{
  //       viewOrder(true);
  //     })
  //     // clear previous order customer name
  //     document.getElementById("order-customer-name").innerText="";
  //   }
  // })
  // const adjacentHTML = document.getElementById("customer-code-adjacentHTML");
  // if (adjacentHTML) {
  //   adjacentHTML.remove();
  // }
}

function showOrdersTable(){
  // console.log("showOrdersTable works");
  let orderTableRows = '';

  fetch("http://localhost:8080/orders/all")
    .then((response) => response.json())
    .then((result) => {
      result.forEach(item=>{
        console.log(item);
        const row = {
          id: item.orderId,
          cusName: item.customerName,
          total: item.totalPrice,
          discount: calculateDiscount(item.orderDetails)
        }
        console.log(row);
        orderTableRows=`
        <tr>
            <td>O${row.id+100}</td>
            <td>${row.cusName}</td>
            <td>${row.total}</td>
            <td>${row.discount}</td>
            <td>${row.total-row.discount}</td>
            <td>
              <button type="button" class="btn btn-secondary" onclick="showEditOrder('${row.id}')">Edit</button>
            </td>
          </tr>
        ` + orderTableRows;
      })

    })
    .then(()=>{
      document.getElementById("table-body-order").innerHTML = orderTableRows;
    })
    .catch((error) => console.error(error));
}

function calculateDiscount(orderDetails){
  let discount=0;
  orderDetails.forEach(row=>{
    discount+=(row.productPrice*row.quantity*row.productDiscount/100)
  })
  return discount;
}

// load orders from orders.json
// fetch('../data/orders.json')
//   .then(response => response.json())
//   .then(data => {
//     data.forEach(item=>{

//       // get customer name from customerList
//       let customerName = "";
//       customerList.forEach(customer=>{
//         if (item.customerCode==customer.id) {
//           customerName=customer.name;
//         }
        
//       });
      
//       let orderTotal=0;
//       let orderDiscount=0;
      
//       const products = [];
//       item.products.forEach(line => {
        
//         productList.forEach(product=>{
          
//           if(product.id==line.itemCode){
//             products.push({
//               id: line.itemCode,
//               name: product.name,
//               qty: +line.qty,
//               price: +product.price,
//               discount: +product.discount
//             });
//             orderTotal+=+product.price * +line.qty;
//             orderDiscount+=product.price * +line.qty * (+product.discount/100);
//           }
//         })
//       })
//       const order = {
//         id: "O" + orderIncrement++,
//         customerCode: item.customerCode,
//         customerName: customerName,
//         products: products,
//         orderGrossTotal: orderTotal.toFixed(2),
//         orderDiscount: orderDiscount.toFixed(2),
//         orderNetTotal: (orderTotal - orderDiscount).toFixed(2),
//         date:item.date,
//         status: item.status
//       }
//       orderList.push(order);
//     });
//     addToTable(orderList, document.getElementById("table-body-order"), tableColumns.order, renderOrderTableButtons);
//   })
//   .catch(error => console.error('Error loading the data:', error));

// validate customer when focus is away from the customer code input
function getCustomerNameOnBlur() { 
  const customerCodeInOrder = document.getElementById("order-customer-code");

  customerCodeInOrder.addEventListener("blur", () => {
    document.getElementById("order-customer-name").innerText = "";
    const dbCusCode = customerCodeInOrder.value.substring(1) - 100;

    fetch("http://localhost:8080/customer/" + dbCusCode)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const adjacentHTML = document.getElementById("customer-code-adjacentHTML");
        if (adjacentHTML) {
          adjacentHTML.remove();
        }

        document.getElementById("order-customer-name").innerText = result.name;

        fetch("http://localhost:8080/customer-preference/" + result.preferenceId)
          .then((response) => response.json())
          .then((result) => {
            // Remove old preference div before inserting new one
            const oldPreference = document.getElementById("customer-preference");
            if (oldPreference) {
              oldPreference.remove();
            }

            if (result.preference) {
              document.getElementById("order-customer-code-container").insertAdjacentHTML("afterend",
                `<div class="input-group mb-1" id="customer-preference">
                  <input type="text" class="form-control bg-warning" name="order-product-code" disabled value="${result.preference}">
                </div>`
              );
            }

          })
          .catch((error) => console.error(error));

      })
      .catch((error) => {
        console.error(error);
        console.log("unavailable customer");

        const oldPreference = document.getElementById("customer-preference");
        if (oldPreference) {
          oldPreference.remove();
        }

        const adjacentHTML = document.getElementById("customer-code-adjacentHTML");
        if (adjacentHTML) {
          adjacentHTML.remove();
        }

        document.getElementById("order-customer-code-container").insertAdjacentHTML("afterend",
          `<p class="text-danger pl-1" id="customer-code-adjacentHTML">
            <small>Customer code: ${customerCodeInOrder.value} is not available</small>
          </p>`
        );
      });  
  });
}

