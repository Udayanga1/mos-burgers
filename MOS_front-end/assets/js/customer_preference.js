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
            <button type="button" class="btn btn-secondary" onclick="closeAddPreferenceForm()">Cancel</button>           
          </div>
        </div>`;

}

document.getElementById("show-preference-add-btn").addEventListener("click", ()=>{
  showAddPreferenceForm();
})


function closeAddPreferenceForm(){
  modalContainer.innerHTML = '';
}

function addPreference(){
  const preference = document.getElementById("customer-preference")
  console.log(preference.value);
  preference.value="";
}