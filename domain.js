const url = "http://localhost:3000/domain"; // Replace with your actual backend URL

// Function to add a new domain
function addDomain() {
  const domain = {
    domain_id: document.getElementById("domain_id").value,
    domain_name: document.getElementById("domain_name").value,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(domain),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Domain added:", data);
      getAllDomains();
      clearForm();
    })
    .catch((error) => console.error("Error adding domain:", error));
}

// Function to clear the input form
function clearForm() {
  document.getElementById("domain_id").value = "";
  document.getElementById("domain_name").value = "";
  document.getElementById("btnSubmit").disabled = false;
  document.getElementById("btnupdate").disabled = true;
}

// Function to fetch and display all domains
function getAllDomains() {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Domains:", data);
      displayDomains(data);
    })
    .catch((error) => console.error("Error fetching domains:", error));
}

// Function to render domains in the table
function displayDomains(domain) {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  domain.forEach((domain) => {
    const row = tbody.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);

    cell1.textContent = domain.domain_id;
    cell2.textContent = domain.domain_name;
    cell3.innerHTML = `
      <button class="btn btn-sm btn-primary" onclick="getDomain('${domain.id}')">Edit</button>
      <button class="btn btn-sm btn-danger" onclick="deleteDomain('${domain.id}')">Delete</button>
    `;
  });
}

// Function to fetch a single domain for editing
function getDomain(id) {
  fetch(`${url}/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched domain:", data);

      document.getElementById("id").value = data.id;
      document.getElementById("domain_id").value = data.domain_id;
      document.getElementById("domain_name").value = data.domain_name;
      document.getElementById("btnSubmit").disabled = true;
      document.getElementById("btnupdate").disabled = false;
    })
    .catch((error) => console.error("Error fetching domain:", error));
}

// Function to update a domain
function updateDomain() {
    var domain = {id: document.getElementById("id").value,
    domain_id: document.getElementById("domain_id").value,
    domain_name: document.getElementById("domain_name").value,
  };

  fetch(url+"/"+domain.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(domain),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Domain updated:", data);
      getAllDomains();
      clearForm();
    })
    .catch((error) => console.error("Error updating domain:", error));
}

// Function to delete a domain
function deleteDomain(id) {
  if (confirm("Are you sure you want to delete this domain?")) 
    {

    fetch(`${url}/${id}`,
    {
      
      method: "DELETE",
    })
      .then((response) => {
        console.log(id);
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }
        console.log("Domain deleted successfully.");
        getAllDomains();
      })
      .catch((error) => console.error("Error deleting domain:", error));
  }
}

// Initialize the form and load data on page load
getAllDomains();
document.getElementById("btnupdate").disabled = true;
