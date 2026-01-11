// Sidebar toggle
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
//tab inside the my papers panel
const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active style from all tabs
    tabs.forEach((t) => {
      t.classList.remove("text-indigo-500", "border-b-2");
      t.classList.add("text-gray-500");
    });

    // Hide all contents
    contents.forEach((c) => c.classList.add("hidden"));

    // Activate clicked tab
    tab.classList.add("text-indigo-500", "border-b-2", "border-indigo-500");
    tab.classList.remove("text-gray-500");

    const target = tab.getAttribute("data-tab");
    document.getElementById(target).classList.remove("hidden");
  });
});
