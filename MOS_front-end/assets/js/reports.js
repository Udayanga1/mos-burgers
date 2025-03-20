const monthlySalesReportsBtn = document.getElementById("monthly-sales-reports-btn");
const annualSalesReportsBtn = document.getElementById("annual-sales-reports-btn");
const customerReportsBtn = document.getElementById("customer-reports-btn");

const orderList = [];

monthlySalesReportsBtn.addEventListener("click", () => {
  monthlySalesReportView();
});
annualSalesReportsBtn.addEventListener("click", () => {
  annualSalesReportView();
  
});

customerReportsBtn.addEventListener("click", ()=>{
  customerReportView();
  
})

function monthlySalesReportView() {
  console.log("monthlySalesReportView()");
  console.log(orderList);
  
  modalContainer.innerHTML=`
  <div class="position-absolute top-50 p-2 mt-2 bg-light bg-gradient shadow-lg rounded" style="width: 38rem;">
    <div>
      <h5 class="text-danger">Monthly Sales Report</h5>
      <div class="input-group mb-3">
        <label class="input-group-text" for="inputGroupYear">Year</label>
        <select class="form-select" id="inputGroupYear">
          <option selected>Choose Year</option>
          ${showYearsAsList()}
        </select>
        <label class="input-group-text" for="inputGroupMonth">Month</label>
        <select class="form-select" id="inputGroupMonth">
          <option selected>Choose Month</option>
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
          <option value="3">April</option>
          <option value="4">May</option>
          <option value="5">June</option>
          <option value="6">July</option>
          <option value="7">August</option>
          <option value="8">September</option>
          <option value="9">October</option>
          <option value="10">November</option>
          <option value="11">December</option>
        </select>
      </div>
      <div class="d-flex justify-content-end gap-2 my-2">
        <button class="btn btn-success d-none" id="view-report-top-btn" onclick="viewMonthlySalesReport()">View Report</button>
      </div>
      <div id="report-view-container"></div>

      <div class="d-flex justify-content-between gap-2">
        <div>
          <button class="btn btn-warning d-none" id="view-detailed-report-btn">View Detailed Report</button>
        </div>
        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-success" id="view-report-bottom-btn" onclick="viewMonthlySalesReport()">View Report</button>
          <button class="btn btn-secondary" id="" onclick="closeReportsView()">Close</button>
        </div>
      </div>

      <div id="report-detailed-view-container" class="">
        
      </div>
    </div>
  </div>`;

}

function viewMonthlySalesReport() {
  const reportYear = document.getElementById("inputGroupYear").value;
  const reportMonth = document.getElementById("inputGroupMonth").value;
  const monthOrders = findMonthOrders(reportYear, reportMonth);
  const detailedReportBtn = document.getElementById("report-detailed-view-container");

  console.log(orderList);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  if (reportYear=="Choose Year" || reportMonth=="Choose Month") {
    document.getElementById("report-view-container").innerHTML=`
      <h4 class="text-warning">Please select year and month</h4>
    `;
    return;
  }

  document.getElementById("report-view-container").innerHTML=`
    <hr>
    <h4 class="text-success">Sales : ${reportYear} ${monthNames[reportMonth]}</h4>
    <table class="table table-striped" id="report-table" >
      <tbody class="table-dark">
        <tr class="table-active">
          <td colspan="3">Total Orders</td>
          <td ="right" align ="right">${(monthOrders.totalPendingOrderValue + monthOrders.totalCompletedOrderValue + monthOrders.totalCancelledOrderValue).toLocaleString('en-US')}</td>
        </tr>
        <tr class="table-active">
          <td colspan="3">Less: Cancelled Orders</td>
          <td ="right" align ="right">${(-monthOrders.totalCancelledOrderValue).toLocaleString('en-US')}</td>
        </tr>
        <tr class="table-active">
          <td colspan="3">Total Sales</td>
          <td ="right" align ="right">${(monthOrders.totalPendingOrderValue + monthOrders.totalCompletedOrderValue).toLocaleString('en-US')}</td>
        </tr>
      </tbody>
      <br>
      <tfoot class="table">
        <tr class="table-light ">
          <td colspan="3">Completed Orders</td>
          <td ="right" align ="right">${(monthOrders.totalCompletedOrderValue).toLocaleString('en-US')}</td>
        </tr>
        <tr class="table-light table-borderless">
          <td colspan="3">Pending Orders</td>
          <td ="right" align ="right">${(monthOrders.totalPendingOrderValue).toLocaleString('en-US')}</td>
        </tr>
      </tfoot>
    </table>
  `
  document.getElementById("view-report-bottom-btn").classList.add("d-none");
  document.getElementById("view-report-top-btn").classList.remove("d-none");
  
  detailedReportBtn.classList.add("d-none");


  const viewDetailedSalesReportBtn = document.getElementById("view-detailed-report-btn");
  viewDetailedSalesReportBtn.classList.remove("d-none");
  viewDetailedSalesReportBtn.addEventListener("click", () => {
    detailedReportBtn.classList.remove("d-none");
  });

  let htmlEl = `
    <hr>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Order No</th>
              <th scope="col" align ="right">Value</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
  `;
  monthOrders.monthOrdersCompleted.forEach(order=>{
    htmlEl+=`
      <tr class="table-success">
        <td scope="col">${order.orderDate}</td>
        <td scope="col">${order.orderId}</td>
        <td scope="col" align ="right">${order.orderNetTotal}</td>
        <td scope="col">${order.status}</td>
      </tr>
    `;
    
  });
  monthOrders.monthOrdersPending.forEach(order=>{
    htmlEl+=`
      <tr class="table-warning">
        <td scope="col">${order.orderDate}</td>
        <td scope="col">${order.orderId}</td>
        <td scope="col" align ="right">${order.orderNetTotal}</td>
        <td scope="col">${order.status}</td>
      </tr>
    `;
    
  });
  monthOrders.monthOrdersCancelled.forEach(order=>{
    htmlEl+=`
      <tr class="table-secondary">
        <td scope="col">${order.orderDate}</td>
        <td scope="col">${order.orderId}</td>
        <td scope="col" align ="right">${order.orderNetTotal}</td>
        <td scope="col">${order.status}</td>
      </tr>
    `;
    
  });

  detailedReportBtn.innerHTML=htmlEl + `</tbody>
  </table>`
}


function getYearsFromOrders(){
  const years = [];
  orderList.forEach(order=>{
    if (!years.includes(new Date(order.orderDate).getFullYear())) {
      years.push(new Date(order.orderDate).getFullYear());
    }
  });
  return years;
}

function showYearsAsList(){
  let htmlEl="";
  getYearsFromOrders().forEach(year=>{
    htmlEl+=`<option value=${year}>${year}</option>`;
  })
  return htmlEl;
}

function findMonthOrders(year, month){
  const monthOrdersPending=[];
  const monthOrdersCompleted = [];
  const monthOrdersCancelled = [];
  let totalPendingOrderValue=0;
  let totalCompletedOrderValue=0;
  let totalCancelledOrderValue=0;
  orderList.forEach(order=>{
    if(new Date(order.orderDate).getFullYear()==year && 
      new Date(order.orderDate).getMonth()==month) {
      if (order.status=="Pending") {
        totalPendingOrderValue+=+order.orderNetTotal;
        monthOrdersPending.push(order);
      } else if (order.status=="Completed") {
        totalCompletedOrderValue+=+order.orderNetTotal;
        monthOrdersCompleted.push(order);
      } else if (order.status=="Cancelled") {
        totalCancelledOrderValue+=+order.orderNetTotal
        monthOrdersCancelled.push(order);
      }
    } 
  });
  return {
    monthOrdersPending, //pending orders array
    monthOrdersCompleted,
    monthOrdersCancelled,
    totalPendingOrderValue, //pending orders total value
    totalCompletedOrderValue,
    totalCancelledOrderValue
  }
  
}

function annualSalesReportView() {
  modalContainer.innerHTML=`
  <div class="position-absolute top-50 p-2 mt-2 bg-light bg-gradient shadow-lg rounded" style="width: 38rem;">
    <div>
      <h5 class="text-danger">Annual Sales Report</h5>
      <div class="input-group mb-3">
        <label class="input-group-text" for="inputGroupYear">Year</label>
        <select class="form-select" id="inputGroupYear">
          <option selected>Choose Year</option>
          ${showYearsAsList()}
        </select>
      </div>
      <div class="d-flex justify-content-end gap-2 my-2">
        <button class="btn btn-success d-none" id="view-report-top-btn" onclick="viewAnnualSalesReport()">View Report</button>
      </div>
      <div id="report-view-container"></div>

      <div class="d-flex justify-content-between gap-2">
        <div>
          <button class="btn btn-warning d-none" id="view-detailed-report-btn">View Detailed Report</button>
        </div>
        <div class="d-flex justify-content-end gap-2 mb-3">
          <button class="btn btn-success" id="view-report-bottom-btn" onclick="viewAnnualSalesReport()">View Report</button>
          <button class="btn btn-secondary" id="n" onclick="closeReportsView()">Close</button>
        </div>
      </div>

      <div id="report-detailed-view-container" class="">
        
      </div>
    </div>
  </div>`;
}

function viewAnnualSalesReport() {
  const reportYear = document.getElementById("inputGroupYear").value;
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const annualOrderValues = [];
  for (let i = 0; i < monthNames.length; i++) {
    const monthOrders = findMonthlyOrdersForYearReport(reportYear,i);
    annualOrderValues.push(
      {
        pendingOrderValue: monthOrders.totalPendingOrderValue,
        completedOrderValue: monthOrders.totalCompletedOrderValue,
        cancelledOrderValue: monthOrders.totalCancelledOrderValue
      }
    );
  }

  let annualPendingOrderValue = 0;
  let annualCompletedOrderValue = 0;
  let annualCancelledOrderValue = 0;
  
  let table="";
  let monthIndex=0;
  annualOrderValues.forEach(month=>{
    annualPendingOrderValue+=month.pendingOrderValue;
    annualCompletedOrderValue+=month.completedOrderValue;
    annualCancelledOrderValue+=month.cancelledOrderValue;
    table += `
    <table class="table table-striped" id="report-table" >
      <thead>
        <tr class="table-dark table-borderless">
          <td colspan="4">${reportYear} ${monthNames[monthIndex]}</td>
        </tr>
      </thead>
      <tbody class="table-dark">
        <tr class="table-light table-borderless">
          <td colspan="3">Completed Orders</td>
          <td ="right" align ="right">${(month.completedOrderValue).toLocaleString('en-US')}</td>
        </tr>
        <tr class="table-light table-borderless">
          <td colspan="3">Pending Orders</td>
          <td ="right" align ="right">${(month.pendingOrderValue).toLocaleString('en-US')}</td>
        </tr>
        <tr class="table-light table-borderless">
          <td colspan="3">Cancelled Orders</td>
          <td ="right" align ="right">${(month.cancelledOrderValue).toLocaleString('en-US')}</td>
        </tr>
      </tbody>
    </table>
    `
    monthIndex++;
  });
  
  const detailedReportBtn = document.getElementById("report-detailed-view-container");
  if (reportYear=="Choose Year") {
    document.getElementById("report-view-container").innerHTML=`
      <h4 class="text-warning">Please select a year</h4>
    `;
    return;
  }

  document.getElementById("report-view-container").innerHTML=`
  <hr>
  <h4 class="text-success">Sales : ${reportYear}</h4> 
  <table class="table table-striped" id="report-table" >
  <tbody class="table-dark">
  <tr class="table-active">
  <td colspan="3">Total Orders</td>
  <td ="right" align ="right">${(annualPendingOrderValue + annualCompletedOrderValue + annualCancelledOrderValue).toLocaleString('en-US')}</td>
  </tr>
  <tr class="table-active">
  <td colspan="3">Less: Cancelled Orders</td>
  <td ="right" align ="right">${annualCancelledOrderValue.toLocaleString('en-US')}</td>
  </tr>
  <tr class="table-active">
  <td colspan="3">Total Sales</td>
          <td ="right" align ="right">${(annualPendingOrderValue + annualCompletedOrderValue).toLocaleString('en-US')}</td>
        </tr>
      </tbody>
      <br>
      <tfoot class="table">
        <tr class="table-light ">
          <td colspan="3">Completed Orders</td>
          <td ="right" align ="right">${annualCompletedOrderValue.toLocaleString('en-US')}</td>
        </tr>
        <tr class="table-light table-borderless">
          <td colspan="3">Pending Orders</td>
          <td ="right" align ="right">${annualPendingOrderValue.toLocaleString('en-US')}</td>
        </tr>
      </tfoot>
    </table>
  `
  document.getElementById("view-report-bottom-btn").classList.add("d-none");
  document.getElementById("view-report-top-btn").classList.remove("d-none");
  
  detailedReportBtn.classList.add("d-none");
  

  const viewDetailedSalesReportBtn = document.getElementById("view-detailed-report-btn");
  viewDetailedSalesReportBtn.classList.remove("d-none");
  viewDetailedSalesReportBtn.addEventListener("click", () => {
    detailedReportBtn.classList.remove("d-none");
  });

  
  annualOrderValues.forEach(month=>{
    
  })

  detailedReportBtn.innerHTML=table;
}

function findMonthlyOrdersForYearReport(year, month){
  let totalPendingOrderValue=0;
  let totalCompletedOrderValue=0;
  let totalCancelledOrderValue=0;
  orderList.forEach(order=>{
    if(new Date(order.date).getFullYear()==year && 
      new Date(order.date).getMonth()==month) {
      if (order.status=="Pending") {
        totalPendingOrderValue+=+order.orderNetTotal;
      } else if (order.status=="Completed") {
        totalCompletedOrderValue+=+order.orderNetTotal;
      } else if (order.status=="Cancelled") {
        totalCancelledOrderValue+=+order.orderNetTotal
      }
    } 
  });
  return {
    totalPendingOrderValue, //pending orders total value
    totalCompletedOrderValue,
    totalCancelledOrderValue
  }
  
}

function customerReportView() {
  modalContainer.innerHTML=`
  <div class="position-absolute top-50 p-2 mt-2 bg-light bg-gradient shadow-lg rounded" style="width: 38rem;">
    <div>
      <h5 class="text-danger">Customer Reports</h5>
      <div class="input-group mb-3">
        <label class="input-group-text" for="inputGroupYear">Year</label>
        <select class="form-select" id="inputGroupYear">
          <option selected>Choose Year</option>
          ${showYearsAsList()}
        </select>
        <label class="input-group-text" for="inputGroupMonth">Month</label>
        <select class="form-select" id="inputGroupMonth">
          <option selected>Choose Month</option>
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
          <option value="3">April</option>
          <option value="4">May</option>
          <option value="5">June</option>
          <option value="6">July</option>
          <option value="7">August</option>
          <option value="8">September</option>
          <option value="9">October</option>
          <option value="10">November</option>
          <option value="11">December</option>
        </select>
      </div>
      <div class="d-flex justify-content-end gap-2 my-2">
        <button class="btn btn-success d-none" id="view-report-top-btn" onclick="viewMonthlyCustomerReport()">View Reports</button>
      </div>
      <div id="report-view-container"></div>

      <div class="d-flex justify-content-between gap-2">
        <div>
          <button class="btn btn-warning d-none" id="view-detailed-report-btn">View Detailed Report</button>
        </div>
        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-success" id="view-report-bottom-btn" onclick="viewMonthlyCustomerReport()">View Reports</button>
          <button class="btn btn-secondary" id="n" onclick="closeReportsView()">Close</button>
        </div>
      </div>

      <div id="report-detailed-view-container" class="">
        
      </div>
    </div>
  </div>`;
}


function viewMonthlyCustomerReport() {
  const reportYear = document.getElementById("inputGroupYear").value;
  const reportMonth = document.getElementById("inputGroupMonth").value;
  const monthOrders = findMonthOrdersByCustomer(reportYear, reportMonth);
  const detailedReportBtn = document.getElementById("report-detailed-view-container");

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  if (reportYear=="Choose Year" || reportMonth=="Choose Month") {
    document.getElementById("report-view-container").innerHTML=`
      <h4 class="text-warning">Please select year and month</h4>
    `;
    return;
  }

  if (monthOrders.emptyList) {
    document.getElementById("report-view-container").innerHTML=`
      <h5 class="text-danger">No records available for ${reportYear} ${monthNames[reportMonth]}</h5>
    `;
    return;
  }

  
  document.getElementById("report-view-container").innerHTML=`
    <hr>
    ${reportYear=="Choose Year" || reportMonth=="Choose Month" ? "<h4 class="+"text-warning" + ">Please select year and month</h4>" : "<h4 class="+"text-success" + ">Customer Reports : " + reportYear +" " + monthNames[reportMonth] +"</h4>"} 
    <table class="table table-striped" id="report-table" >
      <thead class="table-dark">
        <tr class="table-active">
          <td colspan="4">Customer : Highest Rate of Orders</td>
        </tr>
        
      </thead>
      <tbody class="table-light">
        <tr class="table-active">
          <td colspan="2">Name</td>
          <td colspan="2">${monthOrders.highestOrderRateCustomer.name}</td>
        </tr>
        <tr class="table-active">
          <td colspan="2">No. of Orders</td>
          <td colspan="2">${monthOrders.highestOrderRateCustomer.noOfOrders}</td>
        </tr>
        <tr class="table-active">
          <td colspan="2">Value of Orders</td>
          <td colspan="2">${(monthOrders.highestOrderRateCustomer.orderValue).toLocaleString('en-US')}</td>
        </tr>
      </tbody>
      <thead class="table-dark my-3">
        <tr class="table-active">
          <td colspan="4">Customer : Highest Value of Orders</td>
        </tr>
        
      </thead>
      <tbody class="table-light">
        <tr class="table-active">
          <td colspan="2">Name</td>
          <td colspan="2">${monthOrders.highestOrderValueCustomer.name}</td>
        </tr>
        <tr class="table-active">
          <td colspan="2">No. of Orders</td>
          <td colspan="2">${monthOrders.highestOrderValueCustomer.noOfOrders}</td>
        </tr>
        <tr class="table-active">
          <td colspan="2">Value of Orders</td>
          <td colspan="2">${(monthOrders.highestOrderValueCustomer.orderValue).toLocaleString('en-US')}</td>
        </tr>
      </tbody>
      
    </table>
  `
  document.getElementById("view-report-bottom-btn").classList.add("d-none");
  document.getElementById("view-report-top-btn").classList.remove("d-none");
  
  detailedReportBtn.classList.add("d-none");

  const viewDetailedSalesReportBtn = document.getElementById("view-detailed-report-btn");
  viewDetailedSalesReportBtn.classList.remove("d-none");
  viewDetailedSalesReportBtn.addEventListener("click", () => {
    detailedReportBtn.classList.remove("d-none");
  });

  let htmlEl = `
    <hr>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">No of Orders</th>
              <th scope="col" align ="right">Value of Orders</th>
            </tr>
          </thead>
          <tbody>
  `;
  monthOrders.customerListForReport.forEach(customer=>{
    htmlEl+=`
      <tr class="table-active">
        <td scope="col">${customer.id}</td>
        <td scope="col">${customer.name}</td>
        <td scope="col" align ="center">${customer.noOfOrders}</td>
        <td scope="col" align ="right">${(customer.orderValue).toLocaleString('en-US')}</td>
      </tr>
    `;
  });

  detailedReportBtn.innerHTML=htmlEl + `</tbody>
  </table>`
  return;
}

function findMonthOrdersByCustomer(year, month) {
  let customerListForReport = [];
  const monthCompletedAndPendingOrderList = [];
  let emptyList=true;

  // Get monthly orders
  orderList.forEach(order => {
    if (new Date(order.date).getFullYear() == year &&
      new Date(order.date).getMonth() == month) {
      if (order.status == "Pending" || order.status == "Completed") {
        monthCompletedAndPendingOrderList.push(order);
        emptyList=false;
      }
    }
  });

  monthCompletedAndPendingOrderList.forEach(order => {
    const customer = customerListForReport.find(customer => customer.id == order.customerCode);

    if (customer) {
      customer.orderValue += +order.orderNetTotal;
      customer.noOfOrders++;
      customer.orders.push(order);
    } else {
      customerListForReport.push({
        id: order.customerCode,
        name: order.customerName,
        orderValue: +order.orderNetTotal,
        noOfOrders: 1,
        orders: [order]
      });
    }
  });
  
  // find customer with the highest order rate
  let highestOrderRateCustomer=customerListForReport[0];
  customerListForReport.forEach(customer=>{
    if (customer.noOfOrders > highestOrderRateCustomer.noOfOrders) {
      highestOrderRateCustomer=customer;
    }
  });
  
  // find customer with the highest order value
  let highestOrderValueCustomer=customerListForReport[0];
  customerListForReport.forEach(customer=>{
    if (customer.orderValue > highestOrderValueCustomer.orderValue) {
      highestOrderValueCustomer=customer;
    }
  });
    
  return {
    highestOrderRateCustomer,
    highestOrderValueCustomer,
    customerListForReport,
    emptyList
  };
}

function closeReportsView() {
  modalContainer.innerHTML="";
}

document.getElementById("search-product-btn").addEventListener("click", (event) => {
  event.preventDefault();
  
  searchProducts();
});

function loadOrders() {
  console.log("loadOrders()");
  fetch("http://localhost:8080/orders/all")
    .then((response) => response.json())
    .then((result) => {
      // let orderList = [];

      result.forEach((item) => {
        let orderDiscount = 0;

        item.orderDetails.forEach((product) => {
          let productDiscount = product.productDiscount || 0;
          orderDiscount += (product.productPrice * product.quantity * productDiscount) / 100;
        });

        // Add net total to the item
        item.orderNetTotal = item.totalPrice - orderDiscount;
        orderList.push(item);
      });

      console.log("Updated Order List:", orderList);
    })
    .catch((error) => console.error("Error loading orders:", error));
}


