import { account, databases, storage } from "../lib/appwrite.js";
import { Query } from "appwrite";

document.addEventListener("DOMContentLoaded", init);

async function init() {
  // ---------- Get current user ----------
  const user = await account.get();
  const userId = user.$id;

  // Rejected tab container
  const rejectTab = document.getElementById("rejected");

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
    const placeholder = rejectTab.querySelector("p");
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
        ${doc.description || "No description provided."}
      </p>

      <div class="mt-4 flex items-center gap-3">
        <span class="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-600">
          ${doc.category || "Uncategorized"}
        </span>
      </div>
    </div>

    <!-- Status + Actions -->
    <div class="mt-4 flex items-center justify-between">
      <span class="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
        Rejected
      </span>

      <div class="flex gap-3">
        <a href="${storage.getFileView("6952637b00002e00f85d", doc.pdfFileId)}"
           target="_blank"
           class="text-indigo-500 text-sm font-medium hover:underline">
          View PDF
        </a>

        <button class="delete-btn text-red-500 text-sm hover:underline">
          Delete
        </button>
      </div>
    </div>

    <!-- Reason at the bottom -->
    <div class="mt-2 text-gray-600 text-sm">
      <strong>Reason:</strong> ${doc.reason || "No reason provided"}
    </div>

`;

    // ---------- Delete button handler ----------
    div.querySelector(".delete-btn").addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete this rejected paper?"))
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
          "rejectdocs",
          docId
        );

        // Remove div from DOM
        div.remove();

        // Show placeholder if no rejected papers left
        if (!rejectTab.querySelector("[data-doc-id]")) {
          rejectTab.innerHTML = `<p class="text-gray-600">No rejected papers yet.</p>`;
        }

        alert("Rejected paper deleted successfully.");
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete paper. Check console.");
      }
    });

    rejectTab.prepend(div);
  }

  // ---------- Load rejected documents for current user ----------
  async function loadDocuments() {
    try {
      const result = await databases.listDocuments(
        "69525e230018d989fc0b", // Database ID
        "rejectdocs", // Collection ID
        [Query.equal("ownerId", userId)]
      );

      rejectTab.innerHTML = "";

      if (result.documents.length === 0) {
        rejectTab.innerHTML = `<p class="text-gray-600">No rejected papers yet.</p>`;
        return;
      }

      result.documents.forEach(renderDocument);
    } catch (err) {
      console.error("Failed to load documents:", err);
      rejectTab.innerHTML = `<p class="text-red-500">Error loading papers. Check console.</p>`;
    }
  }

  // Load on init
  await loadDocuments();
}
