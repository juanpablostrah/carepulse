"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { use, useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";

export enum FormFieldType {
	INPUT = "input",
	TEXTAREA = "textarea",
	PHONE_INPUT = "phoneInput",
	CHECKBOX = "checkbox",
	DATE_PICKER = "datePicker",
	SELECT = "select",
	SKELETON = "skeleton",
	PHONE = "PHONE",
}

const PatientForm = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	// Define the form
	const form = useForm<z.infer<typeof UserFormValidation>>({
		resolver: zodResolver(UserFormValidation),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
		},
	});

	const onSubmit = async ({
		name,
		email,
		phone,
	}: z.infer<typeof UserFormValidation>) => {
		setIsLoading(true);
		try {
			const userData = { name, email, phone };
			const user = await createUser(userData);
			if (user) {
				router.push(`/patients/${user.$id}/register`);
			}
		} catch (error) {
			console.log("error: ", error);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
				<section className="space-y-4 mb-12">
					<h1 className="header">Hi there 👋</h1>
					<p className="text-dark-700">Schedule your first appointment.</p>
				</section>
				<CustomFormField
					fieldType={FormFieldType.INPUT}
					control={form.control}
					name="name"
					label="full name"
					placeholder="John"
					iconSrc="/assets/icons/user.svg"
					iconAlt="user"
				/>
				<CustomFormField
					fieldType={FormFieldType.INPUT}
					control={form.control}
					name="email"
					label="Email"
					placeholder="example@gmail.com"
					iconSrc="/assets/icons/email.svg"
					iconAlt="email"
				/>
				<CustomFormField
					fieldType={FormFieldType.PHONE_INPUT}
					control={form.control}
					name="phone"
					label="Phone"
					placeholder="11 1111 1111"
				/>
				<SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
			</form>
		</Form>
	);
};

export default PatientForm;
