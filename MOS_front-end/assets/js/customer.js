const showCustomerFormBtn = document.getElementById("show-customer-add-form");
const addCustomerBtn = document.getElementById("add-customer-btn");
const closeCustomerFormBtn = document.getElementById("close-customer-add-form");
const editCustomerBtn = document.getElementById("edit-customer-btn");

let customerIncrement=101;
let customerList = [];

showCustomerFormBtn.addEventListener("click", () => toggleShowForm("show", showCustomerFormBtn, clearCustomerForm, "customer"));
closeCustomerFormBtn.addEventListener("click", () => toggleShowForm("close", showCustomerFormBtn, clearCustomerForm, "customer"));

addCustomerBtn.addEventListener("click", () => addCustomer());
editCustomerBtn.addEventListener("click", ()=>{
  editCustomer();
});

function catchCustomerFormFields(){
  return {
    id: document.getElementById("customer-id"),
    name: document.getElementById("customer-name"),
    contact: document.getElementById("customer-contact"),
    preference: document.getElementById("preference-id"),
    points: document.getElementById("customer-points")
  }
}

function addCustomer(){
  const customer = catchCustomerFormFields();  
  
  if(catchCustomerFormFields().name.value=="" || catchCustomerFormFields().contact.value==""){
    alert("Please fill all the fields");
  } else {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "name": customer.name.value,
      "preferenceId": customer.preference.value,
      "contactNo": customer.contact.value,
      "points": customer.points.value
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:8080/customer/add", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        showCustomerTable();
      })
      .catch((error) => console.error(error));
  
    clearCustomerForm();
  }
}

function clearCustomerForm(){
  const customer = catchCustomerFormFields();
  customer.name.value="";
  customer.contact.value="";
  customer.preference.value="";
  customer.points.value="";
}

function showCustomerTable(){
  let rows = ``;
  fetch("http://localhost:8080/customer/all")
    .then((response) => response.json())
    .then((result) => {
      result.forEach((row)=>{
        rows=`
          <tr>
            <td>C${row.id+100}</td>
            <td>${row.name}</td>
            <td>${row.contactNo}</td>
            <td>${row.preferenceId}</td>
            <td>${row.points}</td>
            <td width="200">
            <button type="button" class="btn btn-secondary" onclick="showCustomerEditForm('${row.id}', 'customer', clearCustomerForm, customerList, showCustomerFormBtn)">Edit</button>
            <button type="button" class="btn btn-danger" onclick="deleteForm('C${row.id+100}', 'Customer', deleteCustomer)">Delete</button></td>
          </tr>
        ` + rows;
      })
    })
    .then(()=>{
      document.getElementById("table-body-customer").innerHTML=rows;
    })
    .catch((error) => console.error(error));
}

function showCustomerEditForm(id){
  toggleShowForm("edit", showCustomerFormBtn, clearCustomerForm, "customer");

  fetch("http://localhost:8080/customer/"+id)
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      const customer = catchCustomerFormFields();
      customer.name.value=result.name;
      customer.contact.value=result.contactNo;
      customer.preference.value=result.preferenceId;
      customer.id.value=result.id;
      customer.points.value=result.points;
    })
    .catch((error) => console.error(error));
}

function editCustomer(){
  const customer = catchCustomerFormFields();
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "id": customer.id.value,
    "name": customer.name.value,
    "contactNo": customer.contact.value,
    "preferenceId": customer.preference.value,
    "points": customer.points.value
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("http://localhost:8080/customer/update", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      showCustomerTable();
    })
    .catch((error) => console.error(error));

  toggleShowForm("close", showCustomerFormBtn, clearCustomerForm, "customer");
}

function deleteCustomer(id){
    const dbId = id.substring(1) - 100;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: "",
      redirect: "follow"
    };

    fetch("http://localhost:8080/customer/delete/"+dbId, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
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
        showCustomerTable();
      })
      .catch((error) => console.error(error));
}

document.getElementById("search-product-btn").addEventListener("click", (event) => {
  event.preventDefault();
  
  searchProducts();
});


