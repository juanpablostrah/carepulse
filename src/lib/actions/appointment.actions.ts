"use server";

import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import {
	APPOINTMENT_COLLECTION_ID,
	DATABASE_ID,
	databases,
} from "../appwrite.config";
import { Appointment } from "../../../types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (
	appointment: CreateAppointmentParams
) => {
	try {
		const newAppointment = await databases.createDocument(
			DATABASE_ID!,
			APPOINTMENT_COLLECTION_ID!,
			ID.unique(),
			appointment
		);
		return parseStringify(newAppointment);
	} catch (error: any) {
		console.log("error: ", error);
	}
};

export const getAppointment = async (appointmentId: string) => {
	try {
		const appointment = await databases.getDocument(
			DATABASE_ID!,
			APPOINTMENT_COLLECTION_ID!,
			appointmentId
		);

		return parseStringify(appointment);
	} catch (error) {
		console.error(
			"An error occurred while retrieving the existing patient:",
			error
		);
	}
};

export const getRecentAppointments = async () => {
	try {
		const appointments = await databases.listDocuments(
			DATABASE_ID!,
			APPOINTMENT_COLLECTION_ID!,
			[Query.orderAsc("$createdAt")]
		);

		const initialAccounts = {
			scheduledCount: 0,
			pendingCount: 0,
			cancelledCount: 0,
		};

		const counts = (appointments.documents as Appointment[]).reduce(
			(acc, appointment) => {
				if (appointment.status === "scheduled") {
					acc.scheduledCount++;
				} else if (appointment.status === "pending") {
					acc.pendingCount++;
				} else if (appointment.status === "cancelled") {
					acc.cancelledCount++;
				}
				return acc;
			},
			initialAccounts
		);

		const data = {
			totalCount: appointments.total,
			...counts,
			documents: appointments.documents,
		};
		return parseStringify(data);
	} catch (error) {
		console.log("error: ", error);
	}
};

export const updateAppointment = async ({
	appointmentId,
	userId,
	appointment,
	type,
}: UpdateAppointmentParams) => {
	try {
		const updatedAppointment = await databases.updateDocument(
			DATABASE_ID!,
			APPOINTMENT_COLLECTION_ID!,
			appointmentId,
			appointment
		);

		if (!updatedAppointment) {
			throw new Error("Appointment not found");
		}

		revalidatePath("/admin");
		return parseStringify(updatedAppointment);
	} catch (error) {
		console.log("error: ", error);
	}
};
