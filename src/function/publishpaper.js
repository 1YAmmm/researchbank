import { account, databases, storage } from "../lib/appwrite.js";
import { ID } from "appwrite";
document.addEventListener("DOMContentLoaded", () => {
  // ================= ELEMENTS =================
  const openPublishModalBtn = document.getElementById("open-publish-modal");
  const publishModal = document.getElementById("publish-modal");
  const closePublishModal = document.getElementById("close-publish-modal");

  const verifyModal = document.getElementById("verify-modal");
  const closeVerifyModal = document.getElementById("close-verify-modal");
  const buttonSentVerify = document.getElementById("button-verify");

  const publishForm = document.getElementById("publish-form");
  const addResearcherBtn = document.getElementById("add-researcher");
  const researchersContainer = document.getElementById("researchers-container");

  // ================= INITIAL STATE =================
  publishModal.classList.add("hidden");
  verifyModal.classList.add("hidden");

  // ================= OPEN MODALS =================
  openPublishModalBtn.addEventListener("click", async () => {
    try {
      const user = await account.get();
      if (!user.emailVerification) {
        verifyModal.classList.remove("hidden");
        return;
      }
      publishModal.classList.remove("hidden");
    } catch (err) {
      console.error(err);
      alert("You must be logged in.");
    }
  });

  closePublishModal.addEventListener("click", () =>
    publishModal.classList.add("hidden")
  );
  closeVerifyModal.addEventListener("click", () =>
    verifyModal.classList.add("hidden")
  );

  // ================= SEND VERIFICATION =================
  buttonSentVerify.addEventListener("click", async () => {
    try {
      buttonSentVerify.disabled = true;
      await account.createVerification(
        "https://researchbank-eta.vercel.app/verified-account.html"
      );
      buttonSentVerify.textContent = "Verification Sent!";
      buttonSentVerify.classList.replace("bg-blue-500", "bg-green-500");
      buttonSentVerify.classList.add("text-white");
    } catch (err) {
      console.error(err);
      alert(err.message || "Verification failed");
      buttonSentVerify.disabled = false;
    }
  });

  // ================= ADD RESEARCHER =================
  addResearcherBtn.addEventListener("click", () => {
    const wrapper = document.createElement("div");
    wrapper.className = "flex items-center gap-2 mt-2";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Researcher Name";
    input.required = true;
    input.className =
      "flex-1 w-full rounded-xl border px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "✕";
    removeBtn.className =
      "text-red-500 hover:text-red-700 font-bold text-sm p-1";
    removeBtn.addEventListener("click", () => wrapper.remove());

    wrapper.appendChild(input);
    wrapper.appendChild(removeBtn);
    researchersContainer.appendChild(wrapper);
  });

  // ================= SUBMIT FORM =================
  let isPublishing = false; // prevents double submit

  publishForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isPublishing) return;
    isPublishing = true;

    try {
      // Gather form values
      const title = document.getElementById("research-title").value.trim();
      const description = document
        .getElementById("research-description")
        .value.trim();
      const adviser = document.getElementById("research-adviser").value.trim();
      const date = document.getElementById("research-date").value;
      const category = document
        .getElementById("research-category")
        .value.trim();
      const fileInput = document.getElementById("research-file");

      if (!title || !description || !adviser || !date || !category) {
        alert("Please fill all fields.");
        return;
      }
      if (!fileInput.files.length) {
        alert("Please upload a PDF file.");
        return;
      }
      const file = fileInput.files[0];
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed.");
        return;
      }

      const user = await account.get();
      const ownerId = user.$id;

      // ================= UPLOAD FILE =================
      const fileId = ID.unique(); // generates new file ID every submission
      const uploadedFile = await storage.createFile(
        "6952637b00002e00f85d",
        fileId,
        file
      );

      // ================= COLLECT RESEARCHERS =================
      const researchers = Array.from(
        researchersContainer.querySelectorAll("input")
      )
        .map((i) => i.value.trim())
        .filter(Boolean)
        .join("|");

      // ================= CREATE DOCUMENT =================

      await databases.createDocument(
        "69525e230018d989fc0b", // Database ID
        "pendingdocs", // Collection ID
        "unique()", // Document ID
        {
          title,
          description,
          adviser,
          date,
          category,
          researchers,
          pdfFileId: uploadedFile.$id,
          ownerId,
        }
      );

      alert("Research paper published successfully!");

      // ================= RESET FORM =================
      publishForm.reset();
      researchersContainer.innerHTML = `
        <input
          type="text"
          placeholder="Researcher Name"
          class="w-full rounded-xl border px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          required
        />
      `;
      publishModal.classList.add("hidden");
    } catch (err) {
      console.error("Publish error:", err);
      alert(err.message || "Failed to publish");
    } finally {
      isPublishing = false; // ✅ ready for next submission
    }
  });
});
