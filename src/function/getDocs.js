import { account, databases, storage } from "../lib/appwrite.js";
import { Query } from "appwrite";

document.addEventListener("DOMContentLoaded", init);

async function init() {
  // Dashboard tab container
  const dashboardTab = document.getElementById("Publish-paper-dashboard");

  // ---------- Format date ----------
  function formatDate(isoDate) {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("T")[0].split("-");
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // ---------- Render a single document ----------
  function renderDocument(doc) {
    // Remove placeholder
    const placeholder = dashboardTab.querySelector("p");
    if (placeholder) placeholder.remove();

    const formattedDate = formatDate(doc.date);
    const div = document.createElement("div");
    div.dataset.docId = doc.$id;

    div.className =
      "bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between space-y-4 border border-gray-100";

    div.innerHTML = `
  <!-- Header -->
  <div class="flex flex-col gap-2">
    <h3 class="text-xl font-semibold text-gray-900">${doc.title}</h3>
    <p class="text-sm text-gray-500">
      By ${doc.researchers || "Unknown"} · ${formattedDate}
    </p>
    ${
      doc.researchAdvisor
        ? `<p class="text-sm text-gray-400">Advisor: ${doc.researchAdvisor}</p>`
        : ""
    }
  </div>

  <!-- Description -->
  <p class="text-gray-700 text-sm line-clamp-3">
    ${doc.description || "No description provided."}
  </p>

  <!-- Footer -->
  <div class="flex items-center justify-between mt-4">
    <span class="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600">
      ${doc.category || "Uncategorized"}
    </span>
    ${
      doc.pdfFileId
        ? `<a href="${storage.getFileView(
            "6952637b00002e00f85d",
            doc.pdfFileId
          )}" target="_blank" class="text-sm font-medium text-indigo-600 hover:underline">
            View PDF
          </a>`
        : `<span class="text-sm text-gray-400">No PDF</span>`
    }
  </div>
`;

    dashboardTab.prepend(div);
  }

  // ---------- Load all approvedocs ----------
  async function loadDocuments() {
    try {
      const result = await databases.listDocuments(
        "69525e230018d989fc0b", // Database ID
        "approvedocs" // Collection ID
        // No query filter → retrieves ALL documents
      );

      dashboardTab.innerHTML = "";

      if (result.documents.length === 0) {
        dashboardTab.innerHTML = `<p class="text-gray-600">No approved papers yet.</p>`;
        return;
      }

      // Render each document
      result.documents.forEach(renderDocument);
    } catch (err) {
      console.error("Failed to load documents:", err);
      dashboardTab.innerHTML = `<p class="text-red-500">Error loading papers. Check console.</p>`;
    }
  }

  // Load on init
  await loadDocuments();
}
