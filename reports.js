// function logOrderDate() {
//   orderList.forEach(order=>{
//     // const date = new Date(order.date);
//     console.log(order.date);
    
//     console.log(new Date(order.date).getMonth() + 1);
//     console.log(new Date(order.date).getFullYear());
//     console.log(new Date(order.date).getDate());
    
//   })
// }

const monthlySalesReporsBtn = document.getElementById("monthly-sales-reports-btn");

monthlySalesReporsBtn.addEventListener("click", () => {
  monthlySalesReportView();
});

function monthlySalesReportView() {
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
      <div id="report-view-container"></div>

      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-warning" id="#" onclick="viewMonthlySalesReport()" id="#" >Add</button>
        <button class="btn btn-secondary" id="n" onclick="closeReportsView()">Close</button>
      </div>
    </div>
  </div>`;
}

function viewMonthlySalesReport() {
  // console.log(document.getElementById("inputGroupYear").value);
  // console.log(document.getElementById("inputGroupMonth").value);
  const monthOrders = findMonthOrders(document.getElementById("inputGroupYear").value, document.getElementById("inputGroupMonth").value);
  console.log(monthOrders.totalCompletedOrderValue);
  document.getElementById("report-view-container").innerHTML=`
    <hr>
    <table class="table table-borderless" id="report-table" >
      <tbody>
      </tbody>
      <tfoot class="table-dark">
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
        <tr class="table-light table-borderless"><td></td></tr>
        <tr class="table-light table-borderless">
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
  console.log(monthOrders);
  
}
// totalPendingOrderValue,
//     totalCompletedOrderValue,
//     totalCancelledOrderValue

function getYearsFromOrders(){
  const years = [];
  orderList.forEach(order=>{
    if (!years.includes(new Date(order.date).getFullYear())) {
      years.push(new Date(order.date).getFullYear());
    }
  });
  // console.log(years);
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
  const monthOrders=[];
  let totalPendingOrderValue=0;
  let totalCompletedOrderValue=0;
  let totalCancelledOrderValue=0;
  orderList.forEach(order=>{
    if(new Date(order.date).getFullYear()==year && 
      new Date(order.date).getMonth()==month) {
      monthOrders.push(order);
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
    monthOrders,
    totalPendingOrderValue,
    totalCompletedOrderValue,
    totalCancelledOrderValue
  }
}

function closeReportsView() {
  modalContainer.innerHTML="";
}