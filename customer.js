const showCustomerFormBtn = document.getElementById("show-customer-add-form");
const addCustomerBtn = document.getElementById("add-customer-btn");
const closeCustomerFormBtn = document.getElementById("close-customer-add-form");
const changeCustomerBtn = document.getElementById("edit-customer-btn");

let customerIncrement=100;
let customerList = [];

showCustomerFormBtn.addEventListener("click", () => toggleShowForm("show", showCustomerFormBtn, clearCustomerForm, "customer"));
closeCustomerFormBtn.addEventListener("click", () => toggleShowForm("close", showCustomerFormBtn, clearCustomerForm, "customer"));

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
    addProductToTable(customerList, htmlEl);
    clearProductForm();
  }
}



function clearCustomerForm(){
  document.getElementById("customer-name").value="";
  document.getElementById("customer-contact").value="";
}