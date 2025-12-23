import { Client, Account, ID } from "node-appwrite";

// ------------------- Read Input -------------------

const payload = JSON.parse(process.env.APPWRITE_FUNCTION_DATA || "{}");
const { name, email, password } = payload;

// ------------------- Appwrite Client -------------------
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT) // e.g., https://fra.cloud.appwrite.io/v1
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY); // API key stays secret in function

const account = new Account(client);

// ------------------- Function Logic -------------------
(async () => {
  try {
    if (!name || !email || !password) {
      console.log(
        JSON.stringify({ success: false, error: "All fields are required" })
      );
      process.exit(0);
    }

    const user = await account.create(ID.unique(), email, password, name);

    console.log(JSON.stringify({ success: true, user }));
  } catch (error) {
    console.log(JSON.stringify({ success: false, error: error.message }));
  }
})();
