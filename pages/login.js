import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Img from "../public/images/amazon.png";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Image from "next/image";
import { Store } from "@/utils/Store";
import { useContext } from "react";

export default function LoginScreen() {
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
		formState: { errors },
	} = useForm();
	const submitHandler = async ({ email, password }) => {
		try {
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
		<Layout title="Login">
			<form
				className="mx-auto max-w-screen w-[100%] md:w-[30%]"
				onSubmit={handleSubmit(submitHandler)}
			>
				<Image src={Img} alt="" height={120} className="mx-auto -mt-5" />
				<h1 className="mb-4 text-4xl">Login</h1>
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
						autoFocus
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
					<button className="primary-button uppercase w-full">Login</button>
				</div>
				<div className="mb-4">
					Don&apos;t have an account? &nbsp;
					<Link
						href={`/register?redirect=${redirect || "/"}`}
						className="text-blue-500 hover:border-b-2 hover:border-blue-500"
					>
						Register
					</Link>
				</div>
				<div className="mt-20">
					<div
						className={`w-full h-[1px] -mb-[14px] ${
							darkMode ? "bg-white" : "bg-black"
						}`}
					></div>
					<div
						className={`mx-auto w-[50%] text-center ${
							darkMode ? "bg-[#211f1f]" : "bg-white"
						}  `}
					>
						New to Amazon?
					</div>
					<Link href={`/register?redirect=${redirect || "/"}`}>
						<button
							className={`border rounded-md p-2 w-full shadow-md mt-3 ${
								darkMode
									? "hover:bg-yellow-200 hover:text-gray-800"
									: "hover:bg-gray-200"
							}`}
						>
							Create your Amazon account
						</button>
					</Link>
				</div>
			</form>
		</Layout>
	);
}
