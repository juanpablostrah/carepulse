import { ID, Query } from "node-appwrite";
//@ts-ignore
import { InputFile } from "node-appwrite/file";
import {
	BUCKET_ID,
	DATABASE_ID,
	databases,
	ENDPOINT,
	PATIENT_COLLECTION_ID,
	PROJECT_ID,
	storage,
	users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
	try {
		const newUser = await users.create(
			ID.unique(),
			user.email,
			user.phone,
			undefined,
			user.name
		);
		return parseStringify(newUser);
	} catch (error: any) {
		console.log("error: ", error);
		if (error && error?.code === 409) {
			const documents = await users.list([Query.equal("email", [user.email])]);
			return documents?.users[0];
		}
	}
};

export const getUser = async (userId: string) => {
	try {
		const user = await users.get(userId);
		return parseStringify(user);
	} catch (error) {
		console.log("error: ", error);
	}
};

export const getPatient = async (userId: string) => {
	try {
		const patients = await databases.listDocuments(
			"66b3781f001d85f775e1",
			"66b3784f001cd85af78f",
			[Query.equal("userId", userId)]
		);
		return parseStringify(patients.documents[0]);
	} catch (error) {
		console.log("error: ", error);
	}
};

export const registerPatient = async ({
	identificationDocument,
	...patient
}: RegisterUserParams) => {
	try {
		let file;
		if (identificationDocument) {
			const inputFile = InputFile.fromBuffer(
				identificationDocument?.get("blobFile") as Blob,
				identificationDocument?.get("fileName") as string
			);
			file = await storage.createFile(
				"66b3790300129acadbe4",
				ID.unique(),
				inputFile
			);
		}

		const newPatient = await databases.createDocument(
			"66b3781f001d85f775e1",
			"66b3784f001cd85af78f",
			ID.unique(),
			{
				identificationDocumentId: file?.$id || null,
				identificationDocumentUrl: `https://cloud.appwrite.io/v1/storage/buckets/66b3790300129acadbe4/files/${file?.$id}/view?project=66b3774400067c3292e9`,
				...patient,
			}
		);

		return parseStringify(newPatient);
	} catch (error) {
		console.log("error: ", error);
	}
};
