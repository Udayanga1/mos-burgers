const showCustomerFormBtn = document.getElementById("show-customer-add-form");
const addCustomerBtn = document.getElementById("add-customer-btn");
const closeCustomerFormBtn = document.getElementById("close-customer-add-form");
const changeCustomerBtn = document.getElementById("edit-customer-btn");

let customerIncrement=101;
let customerList = [];

showCustomerFormBtn.addEventListener("click", () => toggleShowForm("show", showCustomerFormBtn, clearCustomerForm, "customer"));
closeCustomerFormBtn.addEventListener("click", () => toggleShowForm("close", showCustomerFormBtn, clearCustomerForm, "customer"));

addCustomerBtn.addEventListener("click", () => addCustomer());

function addCustomer(){
  const customerName = document.getElementById("customer-name");
  const contact = document.getElementById("customer-contact");
  const customerID = "C" + customerIncrement;
  
  if(customerName.value=="" || contact.value==""){
    alert("Please fill all the fields");
  } else {
    customerIncrement++;
    let htmlEl=document.getElementById("table-body-customer");
    
    const customer = {
      id: customerID,
      name: customerName.value,
      contact: contact.value
    }
  
    customerList.push(customer);
    addToTable(customerList, htmlEl, tableColumns.customer, renderCustomerTableButtons);
    clearCustomerForm();
  }
}

function clearCustomerForm(){
  document.getElementById("customer-name").value="";
  document.getElementById("customer-contact").value="";
}

function renderCustomerTableButtons(element){
  return `     
      <td width="200">
        <button type="button" class="btn btn-secondary" onclick="showEditForm('${element.id}', 'customer', clearCustomerForm, customerList, showCustomerFormBtn)">Edit</button>
        <button type="button" class="btn btn-danger" onclick="deleteForm('${element.id}', 'Customer', deleteCustomer)">Delete</button></td>
  `;
}

changeCustomerBtn.addEventListener("click", ()=>{
  const customerID = document.getElementById("customer-id").value;
  changeCustomer(customerID);
});

function changeCustomer(id){
  let htmlEl=document.getElementById("table-body-customer");

  customerList.forEach(element=>{
    if(element.id==id){
      element.id = document.getElementById("customer-id").value;
      element.name = document.getElementById("customer-name").value;
      element.contact = document.getElementById("customer-contact").value;
    }
  })
  addToTable(customerList, htmlEl, tableColumns.customer, renderCustomerTableButtons);
  toggleShowForm("close", showCustomerFormBtn, clearCustomerForm, "customer");
}

function deleteCustomer(id){
  customerList = customerList.filter(item => item.id !==id);
    let htmlEl = document.getElementById("table-body-customer");
    addToTable(customerList, htmlEl, tableColumns.customer, renderCustomerTableButtons);
    toggleShowForm("close", showCustomerFormBtn, clearCustomerForm, "customer");
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
