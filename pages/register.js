import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import { Store } from "@/utils/Store";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function RegisterScreen() {
	const { state } = useContext(Store);
	const { darkMode } = state;
	const { data: session } = useSession();
	const router = useRouter();
	const { redirect } = router.query;
	useEffect(() => {
		if (session?.user) {
			router.push(redirect || "/");
		}
	}, [router, session, redirect]);
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm();
	const submitHandler = async ({ name, email, password }) => {
		try {
			await axios.post(`/api/auth/signup`, {
				name,
				email,
				password,
			});
			const result = await signIn("credentials", {
				redirect: false,
				email,
				password,
			});
			if (result.error) {
				toast.error(result.error);
			}
		} catch (err) {
			toast.error(getError(err));
		}
	};

	return (
		<Layout title="Create Account">
			<form
				className="mx-auto max-w-screen w-[100%] md:w-[30%]"
				onSubmit={handleSubmit(submitHandler)}
			>
				<h1 className="mb-4 text-3xl font-semibold text-blue-500 text-center">
					Create Your Account
				</h1>

				<div className="mb-4">
					<label htmlFor="email">
						<span className="text-red-500">*</span> Name
					</label>
					<input
						type="text"
						id="name"
						{...register("name", {
							required: "Please enter name",
						})}
						className={`w-full ${
							darkMode
								? "text-black bg-white"
								: "bg-gray-200 focus:bg-transparent"
						}`}
						autoFocus
					></input>
					{errors.name && (
						<div className="text-red-500">{errors.name.message}</div>
					)}
				</div>

				<div className="mb-4">
					<label htmlFor="email">
						<span className="text-red-500">*</span> Email
					</label>
					<input
						type="email"
						id="email"
						{...register("email", {
							required: "Please enter email",
							pattern: {
								value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
								message: "Pleasu enter valid email",
							},
						})}
						className={`w-full ${
							darkMode
								? "text-black bg-white"
								: "bg-gray-200 focus:bg-transparent"
						}`}
					></input>
					{errors.email && (
						<div className="text-red-500">{errors.email.message} </div>
					)}
				</div>
				<div className="mb-4">
					<label htmlFor="password">
						<span className="text-red-500">*</span> Password
					</label>
					<input
						type="password"
						id="password"
						{...register("password", {
							required: "Please enter password",
							minLength: { value: 6, message: "password is more than 5 chars" },
						})}
						className={`w-full ${
							darkMode
								? "text-black bg-white"
								: "bg-gray-200 focus:bg-transparent"
						}`}
						autoFocus
					></input>
					{errors.password && (
						<div className="text-red-500">{errors.password.message} </div>
					)}
				</div>

				<div className="mb-4">
					<label htmlFor="confirmPassword">
						<span className="text-red-500">*</span> Confirm Password
					</label>
					<input
						type="password"
						id="confirmPassword"
						{...register("confirmPassword", {
							required: "Please enter confirm password",
							validate: (value) => value === getValues("password"),
							minLength: {
								value: 6,
								message: "confirm password is more than 5 chars",
							},
						})}
						className={`w-full ${
							darkMode
								? "text-black bg-white"
								: "bg-gray-200 focus:bg-transparent"
						}`}
						autoFocus
					></input>
					{errors.confirmPassword && (
						<div className="text-red-500">
							{errors.confirmPassword.message}{" "}
						</div>
					)}
					{errors.confirmPassword &&
						errors.confirmPassword.type ===
							"validate"(
								<div className="text-red-500">
									{errors.confirmPassword.message}{" "}
								</div>
							)}
				</div>

				<div className="mb-4">
					<button className="primary-button w-full lg:w-auto  mx-auto">
						Create Account
					</button>
				</div>
				<div className="mb-4 ">
					Don&apos;t have an account? &nbsp;
					<Link href={`/register?redirect=${redirect || "/"}`}>Register</Link>
				</div>
			</form>
		</Layout>
	);
}
