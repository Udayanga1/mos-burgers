const showProductFormBtn = document.getElementById("show-product-add-form");
const addProductBtn = document.getElementById("add-product-btn");
const closeProductFormBtn = document.getElementById("close-product-add-form");
const changeProductBtn = document.getElementById("edit-product-btn");
const searchProductBtn = document.getElementById("search-product-btn");

let productIncrement=1001;


let fileName = "";
let imageUrl = "";
let fileExtension = "";

showProductFormBtn.addEventListener("click", () => {
  toggleShowForm("show", showProductFormBtn, clearProductForm);
  
  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  //set default expiry date
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 5);
  document.getElementById("expiry-date").value = formatDate(currentDate);
});


closeProductFormBtn.addEventListener("click", () => toggleShowForm("close", showProductFormBtn, clearProductForm));
addProductBtn.addEventListener("click", () => {
  addProduct()
});
changeProductBtn.addEventListener("click", ()=>{
  const productID = document.getElementById("product-id").value;
  console.log("id from edit form: " + productID);
  
  editProduct(productID);
});

searchProductBtn.addEventListener("click", (event) => {
  event.preventDefault();
  searchProducts();
});



// get image name of the product
document.getElementById("product-image").addEventListener("change", (event)=>{
  fileName = event.target.files[0];
  fileExtension = fileName.name.split('.').pop();

})


function addProduct(){  
  const name = document.getElementById("product-name");
  const price = document.getElementById("product-price");
  const discount = document.getElementById("product-discount");
  const category = document.getElementById("product-category");
  const qty = document.getElementById("product-qty");
  const expiryDate = document.getElementById("expiry-date");
  // const imageUrl = document.getElementById("product-image");

  const productID = "B" + productIncrement;
  
  // console.log(fileName);

  console.log("filename: " + (fileName ?  "true" : "false"));
  
  if(name.value=="" || price.value=="" || discount.value=="" || qty.value==""){
    alert("Please fill all the fields");
  } else {
    productIncrement++;
    // let htmlEl=document.getElementById("table-body");

    fetch("http://localhost:8080/product/all")
    .then((response) => response.json())
    .then((result) => {
      console.log(result.length);

      let lastIndex = result.length == 0 ? 0 : result.pop().id;
      
      if(!imageUrl){
        imageUrl=`/${category.value}-no-image.jpg`;
      }
      
      if (fileName) {
        imageUrl=`/${++lastIndex}.${fileExtension}`
      }
  
      console.log("image Url: " + imageUrl);
      
      
      const product = {
        id: productID,
        name: name.value,
        price: price.value,
        discount: discount.value,
        category: category.value,
        imageUrl: imageUrl,
        qty: qty.value,
        expiryDate: expiryDate.value
      }
      setImageName(lastIndex, fileName);
  
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      const raw = JSON.stringify({
        "name": product.name,
        "price": product.price,
        "discount": product.discount,
        "category": product.category,
        "imageUrl": product.imageUrl,
        "expiryDate": product.expiryDate,
        "qty": product.qty
      });
  
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
  
      fetch("http://localhost:8080/product/add", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          // console.log(result)
          showProductsInTable();
          })
          .catch((error) => console.error(error));
          
          imageUrl="";
          fileName="";
          
          // productList.push(product);
        clearProductForm();
        // console.log(lastIndex);
      })
      .catch((error) => console.error(error));
  }
}

function uploadImage(fileInput){
  const formdata = new FormData();
  formdata.append("file", fileInput);
  const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow"
  };

  fetch("http://localhost:8080/product/upload", requestOptions)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function setImageName(text, fileInput){
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "text": text
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("http://localhost:8080/product/get-product-code", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log("Server Response" , result);
      uploadImage(fileInput);
    })
    .catch((error) => console.error(error));
}


function renderProductTableButtons(element){
  return `     
      <td width="200">
        <button type="button" class="btn btn-secondary" id="edit-product-btn-table" onclick="showProductEditProduct('${element.id}')">Edit</button>
        <button type="button" class="btn btn-danger" id="delete-product-btn-table" onclick="getDeleteConfirmation(this)">Delete</button></td>
  `;
}

function clearProductForm(){
  document.getElementById("product-name").value="";
  document.getElementById("product-price").value="";
  document.getElementById("product-discount").value="";
  document.getElementById("product-category").value="Burgers";
  document.getElementById("product-qty").value="";
}

function showProductEditProduct(id){
  const dbId = (id.substring(1)) - 1000;
  
  fetch("http://localhost:8080/product/" + dbId)
    .then((response) => response.json())
    .then((result) => {
      toggleShowForm("edit", document.getElementById("show-product-add-form"), clearProductForm);
      document.getElementById("product-id").value=result.id;
      document.getElementById("product-name").value=result.name;
      document.getElementById("product-price").value=result.price;
      document.getElementById("product-discount").value=result.discount;
      document.getElementById("product-category").value=result.category;
      document.getElementById("product-qty").value=result.qty;
      
      console.log(result.expiryDate);
      const date = new Date(result.expiryDate);
      const day = String(date.getDate()).padStart(2, '0'); 
      const month = String(date.getMonth() + 1).padStart(2, '0');  // Month is 0-indexed (therefore, add 1)
      const year = date.getFullYear();

      document.getElementById("expiry-date").value = `${year}-${month}-${day}`;
    })
    .catch((error) => console.error(error));
  
}

function editProduct(id){
  const productID = document.getElementById("product-id").value;
  const productName = document.getElementById("product-name").value;
  const productPrice = document.getElementById("product-price").value;
  const productDiscount = document.getElementById("product-discount").value;
  const productCategory = document.getElementById("product-category").value;
  const productQty = document.getElementById("product-qty").value;
  const expiryDate = document.getElementById("expiry-date").value;

  if(!imageUrl){
    imageUrl=`/${productCategory}-no-image.jpg`;
  }
  
  if (fileName) {
    imageUrl=`/${productID}.${fileExtension}`
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "id": productID,
    "name": productName,
    "price": productPrice,
    "discount": productDiscount,
    "category": productCategory,
    "imageUrl": imageUrl,
    "expiryDate": expiryDate,
    "qty": productQty
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("http://localhost:8080/product/update", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      setImageName(productID, fileName);
      showProductsInTable();
    })
    .catch((error) => console.error(error));

  toggleShowForm("close", showProductFormBtn, clearProductForm);
}

function getDeleteConfirmation(buttonEl){
  const id = buttonEl.closest("tr").querySelector("td").textContent.trim();
  // console.log(id);
  const dbId = (id.substring(1)) - 1000;
  deleteForm(dbId, "Product", deleteProduct);
}

function deleteProduct(id){
  const requestOptions = {
    method: "DELETE",
    redirect: "follow"
  };
  
  fetch("http://localhost:8080/product/delete/"+id, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      showProductsInTable();
      console.log(result)
    })
    .catch((error) => console.error(error));
  
  toggleShowForm("close", showProductFormBtn, clearProductForm);
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

function searchProducts() {
  const searchInput = document.getElementById("search-product-input");

  const searchResults = [];
  let productRows='';
  let htmlEl="";

  productList.forEach(product=>{
    if(product.name.toUpperCase().search(searchInput.value.toUpperCase())!=-1){
      searchResults.push({
        id: product.id,
        name: product.name
      });
    }
  });
  searchResults.forEach(result=>{
    productRows+=`
      <tr>
        <td scope="col">${result.id}</td>
        <td scope="col">${result.name}</td>
      </tr>
    `;
  });
  
  document.getElementById("modal-container").innerHTML= searchResults.length==0 ? `
  <div class="position-absolute top-50 end-0 p-2 mt-2 bg-light bg-gradient shadow-lg rounded" style="width: 28rem;">
    <div class="d-flex justify-content-end">
      <button type="button" class="btn-close my-1" aria-label="Close" align="right" onclick="closeSearchView()"></button>
    </div>
    <div>
      <h5 class="text-danger">No results found</h5>
    </div>
  </div>
  ` : `
  <div class="position-absolute top-50 end-0 p-2 mt-2 bg-light bg-gradient shadow-lg rounded overflow-auto" style="width: 28rem; height: 38rem;">
    <div class="d-flex justify-content-between">
      <h5 class="text-success">Search results</h5>
      <button type="button" class="btn-close my-1" aria-label="Close" align="right" onclick="closeSearchView()"></button>
    </div>
    <div>
      <table class="table table-striped table-success">
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Product</th>
          </tr>
        </thead>
        <tbody class="table-warning">
          ${productRows}
        </tbody>
      </table>
    </div>
  </div>`;
  
}

function closeSearchView() {
  document.getElementById("modal-container").innerHTML="";
  document.getElementById("search-product-input").value="";
}

function showProductsInTable(){
  let productList = [];
  fetch("http://localhost:8080/product/all")
    .then((response) => response.json())
    .then((result) => {
      // console.log(result)
      result.forEach(product=>{
        console.log(product);
        
        const row = {
          id: "B" + (product.id+1000),
          name: product.name,
          price: product.price,
          discount: product.discount,
          category: product.category,
          qty: product.qty,
          expDate: product.expiryDate 
        }
        // console.log(product);
        productList.push(row);
      });
      addToTable(productList, document.getElementById("table-body-products"), tableColumns.product, renderProductTableButtons);
    })
    .catch((error) => console.error(error));
}



