import Layout from "@/components/Layout";
import { Store } from "@/utils/Store";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { toast } from "react-toastify";

function CartScreen() {
	const { state, dispatch } = useContext(Store);
	const router = useRouter();

	const {
		cart: { cartItems },
		darkMode,
	} = state;

	const removeItemHandler = (item) => {
		dispatch({ type: "CART_REMOVE_ITEM", payload: item });
	};
	const updateCartHandler = async (item, qty) => {
		const quantity = Number(qty);
		const { data } = await axios.get(`api/products/${item._id}`);
		if (data.countInStock < quantity) {
			return toast.error("Sorry. Product is out of stock");
		}
		dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
		toast.success("Product updated to the cart");
	};
	return (
		<Layout title="Shopping Cart">
			<h1 className="mb-4 text-xl">Shopping Cart</h1>
			{cartItems.length === 0 ? (
				<div>
					Cart is empty. <Link href="/">Go shopping</Link>
				</div>
			) : (
				<div className="grid md:grid-cols-4 md:gap-5">
					<div className="overflow-x-auto md:col-span-3">
						<table className="min-w-full">
							<thead className="border-b">
								<tr>
									<th className="px-5 text-left">Image</th>
									<th className="px-5 text-left">Name</th>
									<th className="p-5 text-right">Quantity</th>
									<th className="p-5 text-right">Price</th>
									<th className="p-5">Action</th>
								</tr>
							</thead>
							<tbody>
								{cartItems.map((item) => (
									<tr key={item.slug} className="border-b">
										<td className="px-5 py-2">
											<Link
												href={`/product/${item.slug}`}
												className="flex items-center"
											>
												<Image
													src={item.image}
													alt={item.name}
													width={60}
													height={60}
												></Image>
											</Link>
										</td>
										<td className="px-5 py-2">
											<Link
												href={`/product/${item.slug}`}
												className={`hover:border-b-2 hover:border-blue-400 text-2xl ${
													darkMode && "text-white hover:text-white"
												}`}
											>
												{item.name}
											</Link>
										</td>
										<td
											className={`px-5 py-2 text-right ${
												darkMode && "text-black"
											}`}
										>
											<select
												value={item.quantity}
												onChange={(e) =>
													updateCartHandler(item, e.target.value)
												}
											>
												{[...Array(item.countInStock).keys()].map((x) => (
													<option key={x + 1} value={x + 1}>
														{x + 1}
													</option>
												))}
											</select>
										</td>
										<td className="px-5 py-2 text-right">${item.price}</td>
										<td className="px-5 py-2 text-center">
											<button
												onClick={() => removeItemHandler(item)}
												className={`bg-green-600 px-5 py-3 rounded-md shadow-md hover:bg-green-700 text-white`}
											>
												{/* <svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={1.5}
													stroke="currentColor"
													className="w-6 h-6"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
													/>
												</svg> */}
												X
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div
						className={`card p-5 ${
							darkMode ? "bg-[#373737]" : " border border-gray-200"
						}`}
					>
						<ul>
							<li>
								<div className="pb-3 text-xl">
									Subtotal ( {cartItems.reduce((a, c) => a + c.quantity, 0)} ) :
									$ {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
								</div>
							</li>
							<li>
								<button
									onClick={() => router.push("login?redirect=/shipping")}
									className="primary-button w-full"
								>
									Check Out
								</button>
							</li>
						</ul>
					</div>
				</div>
			)}
		</Layout>
	);
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
