import { Store } from "@/utils/Store";
import Head from "next/head";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

export default function Layout({ children, title }) {
	const { state } = useContext(Store);
	const { cart } = state;
	const [cartItemsCount, setCartItemsCount] = useState(0);
	useEffect(() => {
		setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
	}, [cart.cartItems]);

	return (
		<>
			<Head>
				<title>{title ? title + " - Amazona" : "Amazona"}</title>
				<meta name="description" content="Ecommerce Website" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="flex min-h-screen flex-col justify-between">
				<header>
					<nav className="flex h-12 justify-between items-center px-4 shadow-md">
						<Link href="/" className="text-lg font-bold">
							amazona
						</Link>
						<div>
							<Link href="/cart" className="p-3">
								{cartItemsCount > 0 && (
									<span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
										{cartItemsCount}
									</span>
								)}
								Cart
							</Link>
							<Link href="/login" className="p-3">
								Login
							</Link>
						</div>
					</nav>
				</header>
				<main className="container m-auto mt-4 px-4">{children}</main>
				<footer className="flex h-10 items-center justify-center shadow-inner bg-gray-100">
					<p>Copyright © 2022 Amazona</p>
				</footer>
			</div>
		</>
	);
}
