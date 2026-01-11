// src/admin/getAllDocs.js
import { account, databases, storage } from "../lib/appwrite.js";

document.addEventListener("DOMContentLoaded", init);

async function init() {
  // Get logged-in user
  const user = await account.get();

  // Rejected tab
  const rejectedTab = document.getElementById("rejected");

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
    `<p class="text-gray-600">No rejected papers yet.</p>`;

  // ================= Render Document =================
  const renderDocument = (doc) => {
    if (!rejectedTab) return;

    // Remove placeholder
    const placeholder = rejectedTab.querySelector("p");
    if (placeholder) placeholder.remove();

    const formattedDate = formatDate(doc.date);

    const card = document.createElement("div");
    card.className =
      "bg-red-50 border border-red-200 rounded-2xl p-5 hover:shadow-lg transition-shadow flex flex-col justify-between";

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

    <!-- Rejected Badge -->
    <span class="ml-auto rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
      Rejected
    </span>
  </div>

  <!-- Rejection Reason -->
  <div class="mt-3 text-gray-600 text-sm">
    <strong>Reason:</strong> ${doc.reason || "No reason provided"}
  </div>
`;

    rejectedTab.prepend(card);
  };

  // ================= Load Rejected Documents =================
  const loadRejectedDocuments = async () => {
    try {
      const result = await databases.listDocuments(
        "69525e230018d989fc0b",
        "rejectdocs"
      );

      // Add placeholder if empty
      if (result.documents.length === 0 && rejectedTab) {
        rejectedTab.innerHTML = createPlaceholder();
      }

      // Render each document
      result.documents.forEach(renderDocument);
    } catch (err) {
      console.error("Failed to load rejected documents:", err);
      if (rejectedTab) {
        rejectedTab.innerHTML = `<p class="text-red-500">Failed to load rejected papers.</p>`;
      }
    }
  };

  loadRejectedDocuments();
}
