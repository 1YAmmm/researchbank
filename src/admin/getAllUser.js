// Load users on page load
document.addEventListener("DOMContentLoaded", loadUsers);

async function loadUsers() {
  try {
    const res = await fetch("/api/users");
    const data = await res.json();

    const tbody = document.getElementById("users-tbody");
    tbody.innerHTML = "";

    data.users.forEach((user) => {
      const tr = document.createElement("tr");
      tr.classList.add("border-t");

      tr.innerHTML = `
        <td class="px-6 py-3">${user.name || "No name"}</td>
        <td class="px-6 py-3">${user.email}</td>
        <td class="px-6 py-3">
          ${
            user.labels?.length
              ? user.labels
                  .map(
                    (label) =>
                      `<span class="px-2 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full mr-1">${label}</span>`
                  )
                  .join("")
              : `<span class="px-2 py-1 text-xs bg-slate-200 rounded-full">user</span>`
          }
        </td>
        <td class="px-6 py-3 ${user.status ? "text-green-600" : "text-red-600"}">
          ${user.status ? "Active" : "Disabled"}
        </td>
        <td class="px-6 py-3 flex gap-2">
          ${
            user.status
              ? `<button onclick="deactivateUser('${user.id}')" class="px-3 py-1 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600">Deactivate</button>`
              : `<button onclick="activateUser('${user.id}')" class="px-3 py-1 rounded-lg bg-green-500 text-white text-xs hover:bg-green-600">Activate</button>`
          }
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Failed to load users:", error);
    alert("Failed to load users. Check console for details.");
  }
}

// =====================
// ACTIVATE USER
// =====================
async function activateUser(userId) {
  try {
    const response = await fetch(`/api/users/${userId}/activate`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      alert(`Failed to activate user: ${data.message || "Unknown error"}`);
      return;
    }

    // Find the table row for this user
    const row = document
      .querySelector(`button[onclick="activateUser('${userId}')"]`)
      ?.closest("tr");
    if (row) {
      // Update status cell
      const statusCell = row.querySelector("td:nth-child(4)");
      statusCell.textContent = "Active";
      statusCell.classList.remove("text-red-600");
      statusCell.classList.add("text-green-600");

      // Replace activate button with deactivate button
      const actionCell = row.querySelector("td:nth-child(5)");
      actionCell.innerHTML = `<button onclick="deactivateUser('${userId}')" class="px-3 py-1 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600">Deactivate</button>`;
    }

    alert(data.message);
  } catch (error) {
    console.error("Failed to activate user:", error);
    alert("An error occurred while activating the user.");
  }
}

// =====================
// DEACTIVATE USER
// =====================
async function deactivateUser(userId) {
  if (!confirm("Are you sure you want to deactivate this user?")) return;

  try {
    const response = await fetch(`/api/users/${userId}/deactivate`, {
      method: "PUT",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Unknown error");

    // Update the table row manually
    const row = document
      .querySelector(`button[onclick="deactivateUser('${userId}')"]`)
      .closest("tr");
    row.querySelector("td:nth-child(4)").textContent = "Disabled";
    row.querySelector("td:nth-child(4)").classList.remove("text-green-600");
    row.querySelector("td:nth-child(4)").classList.add("text-red-600");

    // Replace deactivate button with activate button
    const actionCell = row.querySelector("td:nth-child(5)");
    actionCell.innerHTML = `<button onclick="activateUser('${userId}')" class="px-3 py-1 rounded-lg bg-green-500 text-white text-xs hover:bg-green-600">Activate</button>`;

    alert(data.message);
  } catch (error) {
    console.error("Failed to deactivate user:", error);
    alert("An error occurred while deactivating the user.");
  }
}

// Expose functions for inline onclick
window.activateUser = activateUser;
window.deactivateUser = deactivateUser;
