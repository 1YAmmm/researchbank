// =================== ADMIN PANEL SWITCH ===================

function showPanel(panel) {
  const panels = ["users", "approval"];

  // Hide all main panels
  panels.forEach((p) => {
    const el = document.getElementById(`${p}-panel`);
    if (el) el.classList.add("hidden");
  });

  // Show selected panel
  const activePanel = document.getElementById(`${panel}-panel`);
  if (activePanel) activePanel.classList.remove("hidden");

  // Sidebar active state
  panels.forEach((p) => {
    const btn = document.querySelector(`button[onclick="showPanel('${p}')"]`);
    if (!btn) return;

    if (p === panel) {
      btn.classList.add("bg-indigo-100", "font-semibold");
    } else {
      btn.classList.remove("bg-indigo-100", "font-semibold");
    }
  });

  // Show mypapers-panel only when approval is active
  const myPapersPanel = document.getElementById("mypapers-panel");
  if (myPapersPanel) {
    if (panel === "approval") {
      myPapersPanel.classList.remove("hidden");
    } else {
      myPapersPanel.classList.add("hidden");
    }
  }
}

// Make function available for inline onclick
window.showPanel = showPanel;

// =================== SIDEBAR TOGGLE (MOBILE) ===================

const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-sidebar-btn");

if (sidebar && toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full");
  });

  // Close sidebar when clicking outside (mobile)
  window.addEventListener("click", (e) => {
    if (
      window.innerWidth < 640 &&
      !sidebar.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      sidebar.classList.add("-translate-x-full");
    }
  });

  // Adjust sidebar on resize
  function adjustSidebar() {
    if (window.innerWidth >= 640) {
      sidebar.classList.remove("-translate-x-full");
    } else {
      sidebar.classList.add("-translate-x-full");
    }
  }

  window.addEventListener("resize", adjustSidebar);
  adjustSidebar();
}

// =================== RESEARCH APPROVAL TABS ===================

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  let activeTab = "pending";

  function switchTab(tabName) {
    activeTab = tabName;

    // Toggle content
    tabContents.forEach((content) => {
      content.classList.toggle("hidden", content.id !== tabName);
    });

    // Button styles
    tabButtons.forEach((btn) => {
      const isActive = btn.dataset.tab === tabName;

      btn.classList.toggle("text-indigo-500", isActive);
      btn.classList.toggle("border-indigo-500", isActive);
      btn.classList.toggle("border-b-2", isActive);

      btn.classList.toggle("text-gray-500", !isActive);
    });
  }

  // Attach handlers
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      switchTab(btn.dataset.tab);
    });
  });

  // Default tab
  switchTab(activeTab);
});

// Load Users panel by default
showPanel("users");
