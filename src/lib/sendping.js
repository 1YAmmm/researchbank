import { client } from "../appwrite.js";
import { AppwriteException } from "appwrite";
import "@appwrite.io/pink-icons";

document.addEventListener("DOMContentLoaded", () => {
  let logs = [];
  let status = "idle";
  let showLogs = false;

  const detailsRef = document.getElementById("logs-details");
  const main = document.getElementById("main");
  const statusMessage = document.getElementById("status-message");
  const statusDescription = document.getElementById("status-description");
  const pingButton = document.getElementById("ping-button");
  const loadingSpinner = document.getElementById("loading-spinner");
  const successIcon = document.getElementById("success-icon");
  const logCount = document.getElementById("log-count");
  const logCountValue = document.getElementById("log-count-value");
  const logTable = document.getElementById("log-table");

  const updateHeight = () => {
    if (detailsRef) {
      const height = detailsRef.clientHeight;
      main.style.marginBottom = `${height}px`;
    }
  };

  window.addEventListener("resize", updateHeight);

  detailsRef.addEventListener("toggle", updateHeight);

  async function sendPing() {
    if (status === "loading") return;
    status = "loading";
    statusMessage.textContent = "";
    statusDescription.textContent = "";
    pingButton.style.display = "none";
    loadingSpinner.style.display = "flex";

    try {
      const result = await client.ping();
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: 200,
        response: JSON.stringify(result),
      };
      logs.unshift(log);
      status = "success";
      statusMessage.textContent = "Congratulations!";
      statusDescription.textContent = "You connected your app successfully.";

      updateLogs();
    } catch (err) {
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: err instanceof AppwriteException ? err.code : 500,
        response:
          err instanceof AppwriteException
            ? err.message
            : "Something went wrong",
      };
      logs.unshift(log);
      status = "error";
      statusMessage.textContent = "Check connection";
      statusDescription.textContent = "Send a ping to verify the connection";
      updateLogs();
    }
    pingButton.style.display = "block";
    loadingSpinner.style.display = "none";
    successIcon.style.opacity = status === "success" ? "100" : "0";
    showLogs = true;
  }

  const updateLogs = () => {
    logTable.innerHTML = "";
    if (logs.length > 0) {
      logCount.style.display = "flex";
      logCountValue.textContent = logs.length;
      logs.forEach((log) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="py-2 pl-4 font-[Fira_Code]">${log.date.toLocaleString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          )}</td>
          <td>
            <div class="w-fit rounded-sm ${log.status > 400 ? "bg-[#FF453A3D] text-[#B31212]" : "bg-[#10B9813D] text-[#0A714F]"} px-1">
              ${log.status}
            </div>
          </td>
          <td>${log.method}</td>
          <td class="hidden lg:table-cell">${log.path}</td>
          <td class="hidden font-[Fira_Code] lg:table-cell">${log.response}</td>
        `;
        logTable.appendChild(row);
      });
    } else {
      logCount.style.display = "none";
      const row = document.createElement("tr");
      row.innerHTML = `<td class="py-2 pl-4 font-[Fira_Code]">There are no logs to show</td>`;
      logTable.appendChild(row);
    }
  };

  pingButton.addEventListener("click", sendPing);
  document.getElementById("project-endpoint").textContent =
    import.meta.env.VITE_APPWRITE_ENDPOINT;
  document.getElementById("project-id").textContent =
    import.meta.env.VITE_APPWRITE_PROJECT_ID;
  document.getElementById("project-name").textContent =
    import.meta.env.VITE_APPWRITE_PROJECT_NAME;
  updateHeight();
});
