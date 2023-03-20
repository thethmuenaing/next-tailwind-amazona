import Layout from "@/components/Layout";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";

export default function LoginScreen() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const submitHandler = ({ email, password }) => {
		console.log({ email, password });
	};

	return (
		<Layout title="Login">
			<form
				className="mx-auto max-w-screen"
				onSubmit={handleSubmit(submitHandler)}
			>
				<h1 className="mb-4 text-xl">Login</h1>
				<div className="mb-4">
					<label htmlFor="email">Email</label>
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
						className="w-full"
						autoFocus
					></input>
					{errors.email && (
						<div className="text-red-500">{errors.email.message} </div>
					)}
				</div>
				<div className="mb-4">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						{...register("password", {
							required: "Please enter password",
							minLength: { value: 6, message: "password is more than 5 chars" },
						})}
						className="w-full"
						autoFocus
					></input>
					{errors.password && (
						<div className="text-red-500">{errors.password.message} </div>
					)}
				</div>
				<div className="mb-4">
					<button className="primary-button">Login</button>
				</div>
				<div className="mb-4">
					Don&apos;t have an account? &nbsp;
					<Link href="register">Register</Link>
				</div>
			</form>
		</Layout>
	);
}
