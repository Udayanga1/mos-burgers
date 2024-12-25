const showFormBtn = document.getElementById("show-product-add-form");
const addProductBtn = document.getElementById("add-product-btn");
const closeFormBtn = document.getElementById("close-product-add-form");

showFormBtn.addEventListener("click", () => toggleShowForm("show"));
closeFormBtn.addEventListener("click", () => toggleShowForm("close"));
addProductBtn.addEventListener("click", () => console.log("clicked"))

function toggleShowForm(operation) {
  const form = document.getElementById("add-product");
  if(operation=="show"){
    form.classList.remove("d-none");
    form.classList.add("d-block");
    showFormBtn.classList.add("d-none");
  } else if (operation=="close"){
    form.classList.remove("d-block");
    form.classList.add("d-none");
    showFormBtn.classList.remove("d-none");
  }
}