// src/admin/getAllDocs.js
import { account, databases, storage } from "../lib/appwrite.js";

document.addEventListener("DOMContentLoaded", init);

async function init() {
  // Get logged-in user
  const user = await account.get();

  // Approved tab
  const approvedTab = document.getElementById("approved");

  // ================= Helpers =================
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("T")[0].split("-");
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const createPlaceholder = () =>
    `<p class="text-gray-600">No approved papers yet.</p>`;

  // ================= Render Document =================
  const renderDocument = (doc) => {
    if (!approvedTab) return;

    // Remove placeholder
    const placeholder = approvedTab.querySelector("p");
    if (placeholder) placeholder.remove();

    const formattedDate = formatDate(doc.date);

    // ================= Create Card =================
    const card = document.createElement("div"); // <-- create the card element
    card.className =
      "bg-green-50 border border-green-200 rounded-2xl p-5 hover:shadow-lg transition-shadow flex flex-col justify-between";

    card.innerHTML = `
    <!-- Card Header -->
    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-semibold text-gray-900">${doc.title}</h3>
      <div class="flex flex-wrap items-center text-gray-500 text-xs gap-2">
        <span>By ${doc.researchers || "Unknown"}</span>
        <span>•</span>
        <span>${formattedDate}</span>
      </div>
    </div>

    <!-- Card Description -->
    <p class="text-gray-700 text-sm mt-3 line-clamp-3">
      ${doc.description}
    </p>

    <!-- Badges and PDF -->
    <div class="mt-4 flex flex-wrap items-center gap-3">
      <!-- Category Badge -->
      <span class="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-600">
        ${doc.category || "Uncategorized"}
      </span>

      <!-- PDF Link -->
      ${
        doc.pdfFileId
          ? `<a href="${storage.getFileView(
              "6952637b00002e00f85d",
              doc.pdfFileId
            )}" target="_blank" class="text-indigo-500 text-sm font-medium hover:underline">
              View PDF
            </a>`
          : ""
      }

      <!-- Approved Badge -->
      <span class="ml-auto rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
        Approved
      </span>
    </div>
  `;

    // ================= Add Card to Tab =================
    approvedTab.prepend(card);
  };

  // ================= Load Approved Documents =================
  const loadApprovedDocuments = async () => {
    try {
      const result = await databases.listDocuments(
        "69525e230018d989fc0b",
        "approvedocs"
      );

      // Add placeholder if empty
      if (result.documents.length === 0 && approvedTab) {
        approvedTab.innerHTML = createPlaceholder();
      }

      // Render each document
      result.documents.forEach(renderDocument);
    } catch (err) {
      console.error("Failed to load approved documents:", err);
      if (approvedTab) {
        approvedTab.innerHTML = `<p class="text-red-500">Failed to load approved papers.</p>`;
      }
    }
  };

  loadApprovedDocuments();
}
