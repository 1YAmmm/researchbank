// src/admin/getAllDocs.js
import { account, databases, storage } from "../lib/appwrite.js";

document.addEventListener("DOMContentLoaded", init);

// ================= GLOBAL STATE =================
let currentRejectDoc = null;

async function init() {
  // Get logged-in user
  const user = await account.get();

  // Map tabs
  const tabs = {
    pending: document.getElementById("pending"),
    approved: document.getElementById("approved"),
    rejected: document.getElementById("rejected"),
  };

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

  const createPlaceholder = (status) =>
    `<p class="text-gray-600">No ${status} papers yet.</p>`;

  // ================= Modal Handlers =================
  function openRejectModal(doc) {
    currentRejectDoc = doc;
    const modal = document.getElementById("reject-modal");
    const reasonInput = document.getElementById("reject-reason");
    if (!modal || !reasonInput) return;

    reasonInput.value = "";
    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.classList.add("opacity-100", "pointer-events-auto", "flex");
  }

  function closeRejectModal() {
    const modal = document.getElementById("reject-modal");
    if (!modal) return;

    modal.classList.add("opacity-0", "pointer-events-none");
    modal.classList.remove("opacity-100", "pointer-events-auto", "flex");
    currentRejectDoc = null;
  }

  // ================= Render Document =================
  const renderDocument = (doc) => {
    const status = doc.status || "pending";
    const container = tabs[status];
    if (!container) return;

    // Remove placeholder
    const placeholder = container.querySelector("p");
    if (placeholder) placeholder.remove();

    const formattedDate = formatDate(doc.date);

    const card = document.createElement("div");
    card.dataset.docId = doc.$id;
    card.className =
      "bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow flex flex-col justify-between";

    card.innerHTML = `
      <div>
        <h3 class="text-lg font-semibold text-gray-900">${doc.title}</h3>
        <div class="mt-3 text-gray-500 text-xs">
          <span>By ${doc.researchers || "Unknown"}</span> • 
          <span>${formattedDate}</span>
        </div>
        <p class="text-gray-600 text-sm mt-2 line-clamp-3">${doc.description}</p>
      </div>
      <div class="mt-4 flex items-center justify-between">
        <span class="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-600">
          ${doc.category || "Uncategorized"}
        </span>
        <div class="flex gap-3">
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
          <button class="approve-btn text-green-500 text-sm hover:underline">Approve</button>
          <button class="reject-btn text-red-500 text-sm hover:underline">Reject</button>
        </div>
      </div>
    `;

    // ================= Approve Handler =================
    card.querySelector(".approve-btn").addEventListener("click", async () => {
      if (!confirm("Are you sure you want to approve this paper?")) return;

      try {
        // Save to approvedocs
        await databases.createDocument(
          "69525e230018d989fc0b",
          "approvedocs",
          "unique()",
          {
            title: doc.title,
            description: doc.description,
            adviser: doc.adviser || "N/A",
            date: doc.date,
            category: doc.category,
            researchers: doc.researchers,
            pdfFileId: doc.pdfFileId || null,
            ownerId: doc.ownerId,
          }
        );

        // Delete from pending
        await databases.deleteDocument(
          "69525e230018d989fc0b",
          "pendingdocs",
          doc.$id
        );

        // Remove from UI
        card.remove();

        if (!container.querySelector("[data-doc-id]")) {
          container.innerHTML = createPlaceholder("pending");
        }

        alert("Paper approved successfully!");
      } catch (err) {
        console.error("Failed to approve paper:", err);
        alert("Failed to approve paper. Check console for details.");
      }
    });

    // ================= Reject modal open handler =================
    card.querySelector(".reject-btn").addEventListener("click", () => {
      openRejectModal(doc);
    });

    // Replace existing card or prepend
    const existing = container.querySelector(`[data-doc-id="${doc.$id}"]`);
    if (existing) {
      container.replaceChild(card, existing);
    } else {
      container.prepend(card);
    }
  };

  // ================= Reject Modal Submit =================
  const confirmRejectBtn = document.getElementById("confirm-reject-btn");
  if (confirmRejectBtn) {
    confirmRejectBtn.addEventListener("click", async () => {
      if (!currentRejectDoc) return;
      const reasonInput = document.getElementById("reject-reason");
      if (!reasonInput) return;

      if (!confirm("Are you sure you want to reject this paper?")) return;

      try {
        await databases.createDocument(
          "69525e230018d989fc0b",
          "rejectdocs",
          "unique()",
          {
            title: currentRejectDoc.title,
            description: currentRejectDoc.description,
            adviser: currentRejectDoc.adviser || "N/A",
            date: currentRejectDoc.date,
            category: currentRejectDoc.category,
            researchers: currentRejectDoc.researchers,
            pdfFileId: currentRejectDoc.pdfFileId || null,
            ownerId: currentRejectDoc.ownerId,
            reason: reasonInput.value || "No reason provided",
          }
        );

        await databases.deleteDocument(
          "69525e230018d989fc0b",
          "pendingdocs",
          currentRejectDoc.$id
        );

        // Remove card from DOM
        const card = document.querySelector(
          `[data-doc-id="${currentRejectDoc.$id}"]`
        );
        const container = card?.parentElement;
        if (card) card.remove();

        if (container && !container.querySelector("[data-doc-id]")) {
          container.innerHTML = createPlaceholder("pending");
        }

        closeRejectModal();
        alert("Paper rejected successfully!");
      } catch (err) {
        console.error("Failed to reject paper:", err);
        alert("Failed to reject paper. Check console for details.");
      }
    });
  }

  // ================= Initialize =================
  const loadAllDocuments = async () => {
    try {
      const result = await databases.listDocuments(
        "69525e230018d989fc0b",
        "pendingdocs"
      );

      // Add placeholders if empty
      Object.entries(tabs).forEach(([status, tab]) => {
        if (!tab.querySelector("[data-doc-id]")) {
          tab.innerHTML = createPlaceholder(status);
        }
      });

      // Render each document
      result.documents.forEach(renderDocument);
    } catch (err) {
      console.error("Failed to load documents:", err);
      Object.values(tabs).forEach((tab) => {
        tab.innerHTML = `<p class="text-red-500">Failed to load papers.</p>`;
      });
    }
  };

  loadAllDocuments();
}
