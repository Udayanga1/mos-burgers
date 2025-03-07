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
      <div id="search-preference-results">
      </div>
    </div>`;

}

document.getElementById("show-preference-search-btn").addEventListener("click", ()=>{
  showSearchPreferenceForm();
})

function searchPreference(){
  const preference = document.getElementById("customer-preference");
  const resultsContainer = document.getElementById("search-preference-results");

  resultsContainer.innerHTML=`<h6 class="mt-4">Search Results</h6>`
  console.log(isNaN(preference.value));
 
  if (!isNaN(preference.value)){
    fetch("http://localhost:8080/customer-preference/" + preference.value)
      .then((response) => response.text())
      .then((result) => {
        if (!result) {
          console.log("id not available");
          preference.value="";
          resultsContainer.innerHTML+=`<h6 class="mt-1 text-warning">No results found</h6>`;
        } else{
          const parsedResult = JSON.parse(result);
          preference.value="";
          console.log(parsedResult.id)
          console.log(parsedResult.preference)
          resultsContainer.innerHTML+=`
            <table class="table table-striped table-bordered mt-1">
              <tbody class="">
                <tr>
                  <td class="text-success">ID ${parsedResult.id}</td>
                  <td class="text-success">${parsedResult.preference}</td>
                </tr>
              </tbody>
            </table>
          `
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
        resultsContainer.innerHTML+=`<h6 class="mt-1 text-warning">No results found</h6>`;
      } else{
        let prefRows=``;
        result.forEach(pref=>{
          console.log(pref.id)
          console.log(pref.preference)
          prefRows+=`
            <tr>
              <td class="text-success">ID ${pref.id}</td>
              <td class="text-success">${pref.preference}</td>
            </tr>
          `
        })
        resultsContainer.innerHTML+=`
        <table class="table table-striped table-bordered mt-1">
          <tbody class="">
            ${prefRows}
          </tbody>
        </table>
        `
        preference.value="";
      }
    })
    .catch((error) => console.error(error));
  }
}
