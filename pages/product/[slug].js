import Layout from "@/components/Layout";
import Product from "@/models/Product";
// import data from "@/utils/data";
import db from "@/utils/db";
import { Store } from "@/utils/Store";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { toast } from "react-toastify";

export default function ProdictScreen(props) {
	const { product } = props;
	const { state, dispatch } = useContext(Store);
	const { darkMode } = state;
	const router = useRouter();

	// const { query } = useRouter();
	// const { slug } = query;
	// const product = data.products.find((x) => x.slug === slug);
	if (!product) {
		return <Layout title="Product Not Found">Product Not Found</Layout>;
	}
	const addToCartHandler = async () => {
		const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${product._id}`);
		if (data.countInStock < quantity) {
			return toast.error("Sorry, Product is out of stock");
		}
		dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
		router.push("/cart");
	};
	return (
		<Layout title={product.name}>
			<div className="py-2">
				<Link href="/">back to products</Link>
			</div>
			<div className="grid md:grid-cols-4 md:gap-3">
				<div className="md:col-span-2 rounded-md overflow-hidden">
					<Image
						src={product.image}
						alt={product.name}
						width={640}
						height={640}
						// layout="responsive"
					></Image>
				</div>
				<div>
					<ul className="space-y-2">
						<li>
							<h1 className="text-[3rem]">{product.name}</h1>
						</li>
						<li className="text-xl">
							Category:{" "}
							<span className="font-semibold">{product.category}</span>
						</li>
						<li className="text-xl">
							Brand: <span className="font-semibold">{product.brand}</span>
						</li>
						<li className="text-xl">
							Rating:{" "}
							<span className="font-semibold">
								{product.rating} stars ({product.numReviews} reviews)
							</span>
						</li>
						<li className="text-xl">
							Description:{" "}
							<span className="font-semibold">{product.description}</span>
						</li>
					</ul>
				</div>
				<div>
					<div
						className={`card p-5 ${
							darkMode ? "bg-[#373737]" : " border border-gray-200"
						}`}
					>
						<div className="mb-2 flex justify-between">
							<div>Price</div>
							<div>${product.price}</div>
						</div>
						<div className="mb-2 flex justify-between">
							<div>Status</div>
							<div>{product.countInStock > 0 ? "In stock" : "Unavailable"}</div>
						</div>
						<button
							className={`primary-button w-full uppercase font-semibold ${
								darkMode ? "text-black" : ""
							}`}
							onClick={addToCartHandler}
						>
							Add to cart
						</button>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const { params } = context;
	const { slug } = params;

	await db.connect();
	const product = await Product.findOne({ slug }).lean();
	await db.disconnect();
	return {
		props: {
			product: product ? db.convertDocToObj(product) : null,
		},
	};
}
