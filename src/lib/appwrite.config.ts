import * as sdk from "node-appwrite";

export const {
	NEXT_PUBLIC_ENDPOINT: ENDPOINT,
	PROJECT_ID,
	API_KEY,
	DATABASE_ID,
	PATIENT_COLLECTION_ID,
	DOCTOR_COLLECTION_ID,
	APPOINTMENT_COLLECTION_ID,
	NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

const client = new sdk.Client();

client
	.setEndpoint("https://cloud.appwrite.io/v1")
	.setProject("66b3774400067c3292e9")
	.setKey(
		"0964e41bcc5a4bdbdac837a0d9d007c6d19edda786060e9a49fbe9efe68a60f030978e100892ca42899da2e8b3f9c47a4207222303fdc1dc3e26e80a4cb93decfa9d37038753881d6674ce51738586b1cf7ee39699f2fc6b643f448ca280eb2a9ceb04810a63aa046b0d468e2db6c7e75386302cae6d5ff88a19c2761a057d4c"
	);

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);
