const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
});

// Panels
const dashboardLink = document.getElementById("dashboard-link");
const myPapersLink = document.getElementById("mypapers-link");
const accountLink = document.getElementById("account-link");

const dashboardPanel = document.getElementById("dashboard-panel");
const myPapersPanel = document.getElementById("mypapers-panel");
const accountPanel = document.getElementById("account-panel");

function showPanel(panel, link) {
  // Hide all panels
  dashboardPanel.classList.add("hidden");
  myPapersPanel.classList.add("hidden");
  accountPanel.classList.add("hidden");

  // Remove active state from links
  dashboardLink.classList.remove("bg-indigo-50", "text-indigo-600");
  myPapersLink.classList.remove("bg-indigo-50", "text-indigo-600");
  accountLink.classList.remove("bg-indigo-50", "text-indigo-600");

  // Show selected panel
  panel.classList.remove("hidden");

  // Highlight selected link
  link.classList.add("bg-indigo-50", "text-indigo-600");
}

dashboardLink.addEventListener("click", () =>
  showPanel(dashboardPanel, dashboardLink)
);
myPapersLink.addEventListener("click", () =>
  showPanel(myPapersPanel, myPapersLink)
);
accountLink.addEventListener("click", () =>
  showPanel(accountPanel, accountLink)
);

// Publish modal
const publishBtn = document.getElementById("publishpaper-button");
const publishModal = document.getElementById("publish-modal");
const closePublishModal = document.getElementById("close-publish-modal");
const addResearcherBtn = document.getElementById("add-researcher");
const researchersContainer = document.getElementById("researchers-container");

// Show modal
publishBtn.addEventListener("click", () => {
  publishModal.classList.remove("hidden");
});

// Close modal
closePublishModal.addEventListener("click", () => {
  publishModal.classList.add("hidden");
});

// Add more researcher input
addResearcherBtn.addEventListener("click", () => {
  const wrapper = document.createElement("div");
  wrapper.className = "flex items-center gap-2";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Researcher Name";
  input.className =
    "flex-1 w-full rounded-xl border px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none";
  input.required = true;

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "✕";
  removeBtn.className =
    "text-red-500 hover:text-red-700 font-bold text-sm p-1 rounded transition";

  // Remove researcher input on click
  removeBtn.addEventListener("click", () => {
    wrapper.remove();
  });

  wrapper.appendChild(input);
  wrapper.appendChild(removeBtn);
  researchersContainer.appendChild(wrapper);
});

// Close modal when clicking outside
publishModal.addEventListener("click", (e) => {
  if (e.target === publishModal) {
    publishModal.classList.add("hidden");
  }
});
