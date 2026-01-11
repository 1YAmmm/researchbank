import { account, databases, storage } from "../lib/appwrite.js";
import { Query } from "appwrite";

document.addEventListener("DOMContentLoaded", init);

async function init() {
  // ---------- Get current user ----------
  const user = await account.get();
  const userId = user.$id;

  // Pending tab container
  const pendingTab = document.getElementById("pending");

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
    const placeholder = pendingTab.querySelector("p");
    if (placeholder) placeholder.remove();

    const formattedDate = formatDate(doc.date);
    const div = document.createElement("div");
    div.dataset.docId = doc.$id;

    div.className =
      "bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow flex flex-col justify-between";

    div.innerHTML = `
      <div>
        <h3 class="text-lg font-semibold text-gray-900">${doc.title}</h3>

        <div class="mt-3 text-gray-500 text-xs">
          <span>By ${doc.researchers || "Unknown"}</span> • 
          <span>${formattedDate}</span>
        </div>

        <p class="text-gray-600 text-sm mt-2 line-clamp-3">
          ${doc.description}
        </p>
          <div class="mt-4 flex items-center gap-3">
        <span class="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-600">
          ${doc.category || "Uncategorized"}
        </span>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <span class="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
          Pending
        </span>

        <div class="flex gap-3">
          <a href="${storage.getFileView(
            "6952637b00002e00f85d",
            doc.pdfFileId
          )}"
            target="_blank"
            class="text-indigo-500 text-sm font-medium hover:underline">
            View PDF
          </a>

          <button class="delete-btn text-red-500 text-sm hover:underline">
            Delete
          </button>
        </div>
      </div>
    `;
    //detete button event listener
    div.querySelector(".delete-btn").addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete this pending paper?"))
        return;

      try {
        const docId = div.dataset.docId;

        // Delete file if exists
        if (doc.pdfFileId) {
          try {
            await storage.deleteFile("6952637b00002e00f85d", doc.pdfFileId);
          } catch (fileErr) {
            console.warn("Failed to delete PDF file:", fileErr);
          }
        }

        // Delete the document from Appwrite
        await databases.deleteDocument(
          "69525e230018d989fc0b",
          "pendingdocs",
          docId
        );

        // Remove div from DOM
        div.remove();

        // Show placeholder if no pending papers left
        if (!pendingTab.querySelector("[data-doc-id]")) {
          pendingTab.innerHTML = `<p class="text-gray-600">No pending papers yet.</p>`;
        }

        alert("Pending paper deleted successfully.");
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete paper. Check console.");
      }
    });

    pendingTab.prepend(div);
  }

  // ---------- Load pending documents for current user ----------
  async function loadPendingDocuments() {
    try {
      // Fetch only current user's documents
      const result = await databases.listDocuments(
        "69525e230018d989fc0b",
        "pendingdocs",
        [Query.equal("ownerId", userId)]
      );

      pendingTab.innerHTML = "";

      // Filter for pending documents (or missing status)
      const pendingDocs = result.documents.filter(
        (doc) => !doc.status || doc.status.toLowerCase() === "pending"
      );

      if (pendingDocs.length === 0) {
        pendingTab.innerHTML = `<p class="text-gray-600">No pending papers yet.</p>`;
        return;
      }

      pendingDocs.forEach(renderDocument);
    } catch (err) {
      console.error("Failed to load pending documents:", err);
      pendingTab.innerHTML = `<p class="text-red-500">Error loading pending papers. Check console.</p>`;
    }
  }

  await loadPendingDocuments();
}
