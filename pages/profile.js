import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import { Store } from "@/utils/Store";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function ProfileScreen() {
	const { state } = useContext(Store);
	const { darkMode } = state;
	const { data: session } = useSession();
	const {
		handleSubmit,
		register,
		getValues,
		setValue,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		setValue("name", session.user.name);
		setValue("email", session.user.email);
	}, [session.user, setValue]);

	const submitHandler = async ({ name, email, password }) => {
		try {
			await axios.put(`/api/auth/update`, {
				name,
				email,
				password,
			});
			const result = await signIn("credentials", {
				redirect: false,
				email,
				password,
			});
			toast.success("Profile updated successfully");
			if (result.error) {
				toast.error(result.error);
			}
		} catch (err) {
			toast.error(getError(err));
		}
	};
	return (
		<Layout title="Profile">
			<form
				className="mx-auto max-w-screen-md"
				onSubmit={handleSubmit(submitHandler)}
			>
				<h1 className="mb-4 text-xl">Update Profile</h1>

				<div className="mb-4">
					<label htmlFor="name">Name</label>
					<input
						type="name"
						id="name"
						className={`w-full ${
							darkMode
								? "text-black bg-white"
								: "bg-gray-200 focus:bg-transparent"
						}`}
						autoFocus
						{...register("name", {
							required: "Please enter name",
						})}
					/>
					{errors.name && (
						<div className="text-red-500">{errors.name.message}</div>
					)}
				</div>

				<div className="mb-4">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						className={`w-full ${
							darkMode
								? "text-black bg-white"
								: "bg-gray-200 focus:bg-transparent"
						}`}
						{...register("email", {
							required: "Please enter email",
							pattern: {
								value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
								message: "Please enter valid email",
							},
						})}
					/>
					{errors.email && (
						<div className="text-red-500">{errors.email.message}</div>
					)}
				</div>

				<div className="mb-4">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						className={`w-full ${
							darkMode
								? "text-black bg-white"
								: "bg-gray-200 focus:bg-transparent"
						}`}
						{...register("password", {
							minLength: { value: 6, message: "password is more than 5 chars" },
						})}
					/>
					{errors.password && (
						<div className="text-red-500">{errors.password.message}</div>
					)}
				</div>

				<div className="mb-4">
					<label htmlFor="confirmPassword">Confirm Password</label>
					<input
						type="password"
						id="confirmPassword"
						className={`w-full ${
							darkMode
								? "text-black bg-white"
								: "bg-gray-200 focus:bg-transparent"
						}`}
						{...register("confirmPassword", {
							validate: (value) => value === getValues("password"),
							minLength: { value: 6, message: "password is more than 5 chars" },
						})}
					/>
					{errors.confirmPassword && (
						<div className="text-red-500">{errors.confirmPassword.message}</div>
					)}
					{errors.confirmPassword &&
						errors.confirmPassword.type ===
							"validate"(
								<div className="text-red-500">Password do not match</div>
							)}
				</div>

				<div className="mb-4">
					<button className="primary-button">Update Profile</button>
				</div>
			</form>
		</Layout>
	);
}

ProfileScreen.auth = true;
