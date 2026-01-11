import { account, databases, storage } from "../lib/appwrite.js";
import { Query } from "appwrite";

document.addEventListener("DOMContentLoaded", init);

async function init() {
  // ---------- Get current user ----------
  const user = await account.get();
  const userId = user.$id;

  // Approved tab container
  const approvedTab = document.getElementById("approved");

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
    const placeholder = approvedTab.querySelector("p");
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
        <span class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
          Approved
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
        </div>
      </div>
    `;

    approvedTab.prepend(div);
  }

  // ---------- Load documents for current user ----------
  async function loadDocuments() {
    try {
      // Fetch documents owned by current user
      const result = await databases.listDocuments(
        "69525e230018d989fc0b", // Database ID
        "approvedocs", // Collection ID
        [Query.equal("ownerId", userId)]
      );

      approvedTab.innerHTML = "";

      if (result.documents.length === 0) {
        approvedTab.innerHTML = `<p class="text-gray-600">No papers yet.</p>`;
        return;
      }

      // Render each document
      result.documents.forEach(renderDocument);
    } catch (err) {
      console.error("Failed to load documents:", err);
      approvedTab.innerHTML = `<p class="text-red-500">Error loading papers. Check console.</p>`;
    }
  }

  // Load on init
  await loadDocuments();
}
