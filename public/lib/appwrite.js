// lib/appwrite.js
import { Client, Account, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("694caf5700330567cf9b"); // Replace with your project ID

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
