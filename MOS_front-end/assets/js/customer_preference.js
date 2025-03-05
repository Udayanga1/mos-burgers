function showAddPreferenceForm(){
      modalContainer.innerHTML = `
        <div class="position-absolute top-50 p-2 mt-2 bg-light text-success bg-gradient shadow-lg rounded border border-success" style="width: 18rem;">
          <div>
            <h5>Add Preference</h5>
            <hr>
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Preference" name="preference" id="customer-preference">
            </div>
            <button type="button" class="btn btn-success mr-2" onclick="addPreference()">Add +</button>
            <button type="button" class="btn btn-secondary" onclick="closePreferenceForm()">Cancel</button>           
          </div>
        </div>`;

}

document.getElementById("show-preference-add-btn").addEventListener("click", ()=>{
  showAddPreferenceForm();
})


function closePreferenceForm(){
  modalContainer.innerHTML = '';
}

function addPreference(){
  const preference = document.getElementById("customer-preference")
  console.log(preference.value);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "preference": preference.value
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw
  };

  fetch("http://localhost:8080/customer-preference/add", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result)
      preference.value="";
    })
    .catch((error) => console.error(error));
}

function showSearchPreferenceForm(){
  modalContainer.innerHTML = `
    <div class="position-absolute top-50 p-2 mt-2 bg-light text-success bg-gradient shadow-lg rounded border border-success" style="width: 18rem;">
      <div>
        <h5>Search Preference</h5>
        <hr>
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Preference" name="preference" id="customer-preference">
        </div>
        <button type="button" class="btn btn-success mr-2" onclick="searchPreference()">Search</button>
        <button type="button" class="btn btn-secondary" onclick="closePreferenceForm()">Cancel</button>           
      </div>
    </div>`;

}

document.getElementById("show-preference-search-btn").addEventListener("click", ()=>{
  showSearchPreferenceForm();
})

function searchPreference(){
  const preference = document.getElementById("customer-preference");
  console.log(isNaN(preference.value));
 
  if (!isNaN(preference.value)){
    fetch("http://localhost:8080/customer-preference/" + preference.value)
      .then((response) => response.text())
      .then((result) => {
        if (!result) {
          console.log("id npt avail");
          preference.value="";
        } else{
          const parsedResult = JSON.parse(result);
          preference.value="";
          console.log(parsedResult.id)
          console.log(parsedResult.preference)
        }
      })
      .catch((error) => console.error(error));
  } else {
    fetch("http://localhost:8080/customer-preference/search/" + preference.value)
    .then((response) => response.json())
    .then((result) => {   
      if (result.length==0) {
        console.log("not available");
        preference.value="";
      } else{
        result.forEach(pref=>{
          console.log(pref.id)
          console.log(pref.preference)
        })
        preference.value="";
      }
    })
    .catch((error) => console.error(error));
  }

}
