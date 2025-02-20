document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "http://localhost:3000"; 
  
    const teamForm = document.getElementById("teamForm");
    const employeeSelect = document.getElementById("employeeSelect");
    const teamMembersList = document.getElementById("teamMembersList");
    const addMemberButton = document.getElementById("addMemberButton");
    const teamsTableBody = document.getElementById("teamsTableBody");
    const submitButton = document.getElementById("submitButton");
    
    let teamMembers = [];
    let editingTeamId = null;
  
    async function fetchData(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}`);
            if (!response.ok) throw new Error(`Error fetching ${endpoint}`);
            return await response.json();
        } catch (error) {
            console.error(error);
            alert(`Failed to fetch ${endpoint}. Please check the server.`);
            return [];
        }
    }
  
    async function sendData(endpoint, data, method = "POST") {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}`, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error(`Error with ${method} request`);
            return await response.json();
        } catch (error) {
            console.error(error);
            alert(`Failed to process request. Please try again.`);
        }
    }
  
    async function updateEmployeeTeam(employeeId, teamId) {
        await sendData(`employees/${employeeId}`, { team_id: teamId }, "PATCH");
    }
  
    async function loadEmployees() {
        const employees = await fetchData("employees");
        if (employees) {
            employees.forEach((employee) => {
                const option = document.createElement("option");
                option.value = employee.emp_id;
                option.textContent = `${employee.emp_fname} (${employee.emp_id})`;
                employeeSelect.appendChild(option);
            });
        }
    }
  
    async function loadTeams() {
        const teams = await fetchData("teams");
        teamsTableBody.innerHTML = "";
  
        teams.forEach((team) => {
            const row = document.createElement("tr");
  
            row.innerHTML = `
                <td>${team.team_id}</td>
                <td>${team.team_name}</td>
                <td>${team.members.join(", ")}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${team.team_id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${team.team_id}">Delete</button>
                </td>
            `;
  
            teamsTableBody.appendChild(row);
        });
  
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", () => editTeam(button.dataset.id));
        });
  
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", () => deleteTeam(button.dataset.id));
        });
    }
  
    addMemberButton.addEventListener("click", () => {
        const selectedEmployeeId = employeeSelect.value;
        const selectedEmployeeText = employeeSelect.options[employeeSelect.selectedIndex].text;
  
        if (selectedEmployeeId && !teamMembers.includes(selectedEmployeeId)) {
            teamMembers.push(selectedEmployeeId);
  
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.textContent = selectedEmployeeText;
  
            const removeButton = document.createElement("button");
            removeButton.className = "btn btn-danger btn-sm";
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", () => {
                teamMembers = teamMembers.filter((id) => id !== selectedEmployeeId);
                listItem.remove();
            });
  
            listItem.appendChild(removeButton);
            teamMembersList.appendChild(listItem);
        } else {
            alert("Please select a valid employee or avoid adding duplicates.");
        }
    });
  
    teamForm.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const teamId = document.getElementById("teamId").value;
        const teamName = document.getElementById("teamName").value;
  
        if (teamMembers.length === 0) {
            alert("Please add at least one team member.");
            return;
        }
  
        const teamData = {
            team_id: parseInt(teamId),
            team_name: teamName,
            members: teamMembers.map((id) => parseInt(id)),
        };
  
        if (editingTeamId) {
            await sendData(`teams/${editingTeamId}`, teamData, "PUT");
            alert("Team updated successfully!");
  
            for (let empId of teamMembers) {
                await updateEmployeeTeam(empId, teamId);
            }
  
            editingTeamId = null;
            submitButton.textContent = "Create Team";
        } else {
            await sendData("teams", teamData, "POST");
            alert("Team created successfully!");
  
            for (let empId of teamMembers) {
                await updateEmployeeTeam(empId, teamId);
            }
        }
  
        teamForm.reset();
        teamMembersList.innerHTML = "";
        teamMembers = [];
        loadTeams();
        loadEmployees();
    });
  
    async function editTeam(teamId) {
        const teams = await fetchData("teams");
        const team = teams.find(t => t.team_id == teamId);
  
        if (!team) {
            alert("Team not found!");
            return;
        }
  
        document.getElementById("teamId").value = team.team_id;
        document.getElementById("teamName").value = team.team_name;
  
        teamMembersList.innerHTML = "";
        teamMembers = [...team.members];
  
        team.members.forEach(async (memberId) => {
            const employees = await fetchData("employees");
            const employee = employees.find(e => e.emp_id == memberId);
            if (employee) {
                const listItem = document.createElement("li");
                listItem.className = "list-group-item d-flex justify-content-between align-items-center";
                listItem.textContent = `${employee.emp_fname} (${employee.emp_id})`;
  
                const removeButton = document.createElement("button");
                removeButton.className = "btn btn-danger btn-sm";
                removeButton.textContent = "Remove";
                removeButton.addEventListener("click", () => {
                    teamMembers = teamMembers.filter((id) => id !== memberId);
                    listItem.remove();
                });
  
                listItem.appendChild(removeButton);
                teamMembersList.appendChild(listItem);
            }
        });
  
        editingTeamId = team.team_id;
        submitButton.textContent = "Update Team";
    }
  
    async function deleteTeam(teamId) {
        const teams = await fetchData("teams");
        const team = teams.find(t => t.team_id == teamId);
  
        if (!team) {
            alert("Team not found!");
            return;
        }
  
        if (confirm(`Are you sure you want to delete team: ${team.team_name}?`)) {
            await sendData(`teams/${team.team_id}`, {}, "DELETE");
  
            for (let empId of team.members) {
                await updateEmployeeTeam(empId, null);
            }
  
            alert("Team deleted successfully!");
            loadTeams();
            loadEmployees();
        }
    }
  
    loadEmployees();
    loadTeams();
  });
  