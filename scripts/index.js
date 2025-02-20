document.addEventListener("DOMContentLoaded", async () => {
  const BASE_URL = "http://localhost:3000";

  async function fetchData(endpoint) {
      try {
          const response = await fetch(`${BASE_URL}/${endpoint}`);
          if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
          return await response.json();
      } catch (error) {
          console.error(error);
          alert(`Error loading ${endpoint}`);
          return [];
      }
  }

  async function loadData() {
      const employees = await fetchData("employees");
      const domains = await fetchData("domains");
      const teams = await fetchData("teams");
      console.log(teams);
      const courses = await fetchData("courses");
      const trainers = await fetchData("trainers");

      // Load Employees Table
      const employeesTable = document.getElementById("employeesTable");
      employeesTable.innerHTML = employees.map(emp => {
        console.log(emp.team_id);
          const domain = domains.find(d => d.domain_id === emp.domain_id)?.domain_name || "N/A";
          const team = teams.find(t => t.team_id === emp.team_id);
          console.log(team);

          return `
              <tr>
                  <td>${emp.emp_id}</td>
                  <td>${emp.emp_fname}</td>
                  <td>${emp.email}</td>
                  <td>${emp.contact}</td>
                  <td>${domain}</td>
                  <td>${team.team_name}</td>
              </tr>
          `;
      }).join("");

      // Load Teams Table
      const teamsTable = document.getElementById("teamsTable");
      teamsTable.innerHTML = teams.map(team => {
          const members = employees
              .filter(emp => emp.team_id === team.team_id)
              .map(emp => emp.emp_fname)
              .join(", ") || "No members";

          return `
              <tr>
                  <td>${team.team_id}</td>
                  <td>${team.team_name}</td>
                  <td>${members}</td>
              </tr>
          `;
      }).join("");

      // Load Domains Table
      const domainsTable = document.getElementById("domainsTable");
      domainsTable.innerHTML = domains.map(domain => `
          <tr>
              <td>${domain.domain_id}</td>
              <td>${domain.domain_name}</td>
          </tr>
      `).join("");

      // Load Courses Table
      const coursesTable = document.getElementById("coursesTable");
      coursesTable.innerHTML = courses.map(course => {
          const domain = domains.find(d => d.domain_id === course.domain_id)?.domain_name || "N/A";

          return `
              <tr>
                  <td>${course.course_id}</td>
                  <td>${course.course_name}</td>
                  <td>${course.duration}</td>
                  <td>${domain}</td>
              </tr>
          `;
      }).join("");

      // Load Trainers Table
      const trainersTable = document.getElementById("trainersTable");
      trainersTable.innerHTML = trainers.map(trainer => {
          const domain = domains.find(d => d.domain_id === trainer.domain_id)?.domain_name || "N/A";

          return `
              <tr>
                  <td>${trainer.trainer_id}</td>
                  <td>${trainer.trainer_fname}</td>
                  <td>${trainer.email}</td>
                  <td>${domain}</td>
              </tr>
          `;
      }).join("");
  }

  await loadData();
});
