const domainUrl = "http://localhost:4001/domain";
const trainerUrl = "http://localhost:4001/trainer";

document.addEventListener("DOMContentLoaded", () => {
    const trainerForm = document.getElementById("trainerForm");

    function populateDomainDropdown() {
        fetch(domainUrl)
            .then((response) => response.json())
            .then((data) => {
                const domainDropdown = document.getElementById("domain_id");
                if (!domainDropdown) throw new Error("Domain dropdown element not found!");
                domainDropdown.innerHTML = '<option value="">Select a domain</option>';
                data.forEach((domain) => {
                    const option = document.createElement("option");
                    option.value = domain.domain_id;
                    option.textContent = `${domain.domain_name} (ID: ${domain.domain_id})`;
                    domainDropdown.appendChild(option);
                });
            })
            .catch((error) => {
                console.error("Error fetching domains:", error);
                alert("Failed to load domains.");
            });
    }

    function insertTrainer(trainerData) {
        fetch(trainerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(trainerData),
        })
            .then((response) => {
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                return response.json();
            })
            .then(() => {
                alert("Trainer data saved successfully!");
                populateTrainerTable();
            })
            .catch((error) => {
                console.error("Error saving trainer data:", error);
                alert("Failed to save trainer data.");
            });
    }

   
    function deleteTrainer(id) {
        const deleteUrl = trainerUrl + "/" + id;
        fetch(deleteUrl, {
            method: "DELETE"
        })
        .then((response) => {
            if (!response.ok) throw new Error("Failed to delete trainer.");
            return response.json();
        })
        .then((data) => {
            populateTrainerTable();
        })
        .catch((error) => {
            console.error("Error deleting trainer:", error);
            alert("Failed to delete trainer.");
        });
    }

    

    function populateTrainerTable() {
        fetch(trainerUrl)
            .then((response) => response.json())
            .then((data) => {
                const tableBody = document.getElementById("trainerTableBody");
                if (!tableBody) throw new Error("Table body element not found!");
                tableBody.innerHTML = '';
                data.forEach((trainer) => {
                    const row = document.createElement("tr");
                    const trainerIdCell = document.createElement("td");
                    trainerIdCell.textContent = trainer.trainer_id;
                    row.appendChild(trainerIdCell);

                    const trainerNameCell = document.createElement("td");
                    trainerNameCell.textContent = trainer.trainer_name;
                    row.appendChild(trainerNameCell);

                    const contactCell = document.createElement("td");
                    contactCell.textContent = trainer.contact;
                    row.appendChild(contactCell);

                    const emailCell = document.createElement("td");
                    emailCell.textContent = trainer.email;
                    row.appendChild(emailCell);

                    const domainIdCell = document.createElement("td");
                    domainIdCell.textContent = trainer.domain_id;
                    row.appendChild(domainIdCell);

                    const editButtonCell = document.createElement("td");
                    const editButton = document.createElement("button");
                    editButton.textContent = "Edit";
                    editButton.onclick = function () {
                        console.log("Editing Trainer ID:", trainer.id); // Debugging
                        getTrainer(trainer.id);
                    };
                    
                    editButtonCell.appendChild(editButton);
                    row.appendChild(editButtonCell);

                    const deleteButtonCell = document.createElement("td");
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.onclick = function () {
                        if (confirm("Are you sure you want to delete this trainer?")) {
                            deleteTrainer(trainer.id);
                        }
                    };
                    deleteButtonCell.appendChild(deleteButton);
                    row.appendChild(deleteButtonCell);

                    tableBody.appendChild(row);
                });
            })
            .catch((error) => {
                console.error("Error fetching trainer data:", error);
                alert("Failed to load trainer data.");
            });
    }

     

    document.getElementById("updateButton").addEventListener("click", updateTrainer);

    function updateTrainer() {
        const id = document.getElementById("id").value; // Ensure correct ID is used
    
        if (!id) {
            alert("Trainer ID is missing!");
            return;
        }
    
        const trainerData = {
            trainer_id : document.getElementById("trainer_id").value,
            trainer_name: document.getElementById("trainer_name").value,
            contact: document.getElementById("contact").value,
            email: document.getElementById("email").value,
            domain_id: document.getElementById("domain_id").value
        };
    
        console.log("Updating Trainer ID:", id);
        
        fetch(trainerUrl+"/"+id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(trainerData),
        })
        .then((response) => {
            if (!response.ok) throw new Error(`Error! status: ${response.status}`);
            return response.json();
        })
        .then(() => {
            alert("Trainer updated successfully!");
            populateTrainerTable();
            document.getElementById("trainerForm").reset();
            document.getElementById("updateButton").disabled = true;
            document.getElementById("submitbtn").disabled = false;
        })
        .catch((error) => {
            console.error("Error updating trainer:", error);
            alert("Failed to update trainer.");
        });
    }
    
 


function getTrainer(id) {
    fetch(`${trainerUrl}/${id}`)
        .then((response) => {
            if (!response.ok) throw new Error(`Error! status: ${response.status}`);
            return response.json();
        })
        .then((data) => {
            console.log("Fetched Trainer:", data);
            document.getElementById("id").value = data.id;
            document.getElementById("trainer_id").value = data.trainer_id;
            document.getElementById("trainer_name").value = data.trainer_name;
            document.getElementById("email").value = data.email;
            document.getElementById("contact").value = data.contact;
            document.getElementById("domain_id").value = data.domain_id;

            document.getElementById("submitbtn").disabled = true;
            document.getElementById("updateButton").disabled = false;
        })
        .catch((error) => console.error("Error fetching trainer:", error));
}

   

    trainerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const trainerData = {
            trainer_id: document.getElementById("trainer_id").value,
            trainer_name: document.getElementById("trainer_name").value,
            contact: document.getElementById("contact").value,
            email: document.getElementById("email").value,
            domain_id: document.getElementById("domain_id").value,
        };
        insertTrainer(trainerData);
    });

    populateDomainDropdown();
    populateTrainerTable();
});
