import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import { Store } from "@/utils/Store";
import { useRouter } from "next/router";

export default function ShippingScreen() {
	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
	} = useForm();
	const { state, dispatch } = useContext(Store);
	const { cart, darkMode } = state;
	const { shippingAddress } = cart;
	const router = useRouter();

	useEffect(() => {
		setValue("fullName", shippingAddress.fullName);
		setValue("address", shippingAddress.address);
		setValue("city", shippingAddress.city);
		setValue("postalCode", shippingAddress.postalCode);
		setValue("country", shippingAddress.country);
	}, [setValue, shippingAddress]);

	const submitHandler = ({ fullName, address, city, postalCode, country }) => {
		dispatch({
			type: "SAVE_SHIPPING_ADDRESS",
			payload: { fullName, address, city, postalCode, country },
		});
		Cookies.set(
			"cart",
			JSON.stringify({
				...cart,
				shippingAddress: {
					fullName,
					address,
					city,
					postalCode,
					country,
				},
			})
		);
		router.push("/payment");
	};

	return (
		<Layout title="Shipping Address">
			<CheckoutWizard activeStep={1} />
			<form
				className="mx-auto max-w-screen-md"
				onSubmit={handleSubmit(submitHandler)}
			>
				<h1 className="mb-4 text-xl">Shipping Adderss</h1>
				<div className="mb-4">
					<label htmlFor="fullName">
						<span className="text-red-500">*</span> Full Name
					</label>
					<input
						className={`w-full ${
							darkMode
								? "text-black bg-white"
								: "bg-gray-200 focus:bg-transparent"
						}`}
						id="fullName"
						autoFocus
						{...register("fullName", { required: "Please enter full name" })}
					/>
					{errors.fullName && (
						<div className="text-red-500">{errors.fullName.message}</div>
					)}
				</div>
				<div className="mb-4">
					<label htmlFor="address">
						<span className="text-red-500">*</span> Address
					</label>
					<input
						className={`w-full ${
							darkMode
								? "text-black bg-white"
								: "bg-gray-200 focus:bg-transparent"
						}`}
						id="address"
						{...register("address", {
							required: "Please enter address",
							minLength: { value: 3, message: "Address is more than 2 chars" },
						})}
					/>
					{errors.address && (
						<div className="text-red-500">{errors.address.message}</div>
					)}
				</div>
				<div className="mb-4">
					<label htmlFor="city">
						<span className="text-red-500">*</span> City
					</label>
					<input
						className={`w-full ${
							darkMode
								? "text-black bg-white"
								: "bg-gray-200 focus:bg-transparent"
						}`}
						id="city"
						{...register("city", {
							required: "Please enter city",
						})}
					/>
					{errors.city && (
						<div className="text-red-500">{errors.city.message}</div>
					)}
				</div>
				<div className="mb-4">
					<label htmlFor="postalCode">
						<span className="text-red-500">*</span> Postal Code
					</label>
					<input
						className={`w-full ${
							darkMode
								? "text-black bg-white"
								: "bg-gray-200 focus:bg-transparent"
						}`}
						id="postalCode"
						{...register("postalCode", {
							required: "Please enter postal code",
						})}
					/>
					{errors.postalCode && (
						<div className="text-red-500">{errors.postalCode.message} </div>
					)}
				</div>
				<div className="mb-4">
					<label htmlFor="postalCode">
						<span className="text-red-500">*</span> Country
					</label>
					<input
						className={`w-full ${
							darkMode
								? "text-black bg-white"
								: "bg-gray-200 focus:bg-transparent"
						}`}
						id="country"
						{...register("country", {
							required: "Please enter country",
						})}
					/>
					{errors.country && (
						<div className="text-red-500">{errors.country.message} </div>
					)}
				</div>
				<div className="mb-4 flex justify-between">
					<button className="primary-button">Next</button>
				</div>
			</form>
		</Layout>
	);
}

ShippingScreen.auth = true;
