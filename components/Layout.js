import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Menu, Switch } from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
import { Store } from "@/utils/Store";
import Cookies from "js-cookie";
// import DropdownLink from "./DropdownLink";

export default function Layout({ children, title }) {
	const { status, data: session } = useSession();

	const { state, dispatch } = useContext(Store);
	const { cart, darkMode } = state;
	const [cartItemsCount, setCartItemsCount] = useState(0);
	useEffect(() => {
		setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
	}, [cart.cartItems]);
	const logoutClickHandler = () => {
		Cookies.remove("cart");
		dispatch({ type: "CART_RESET" });
		signOut({ callbackUrl: "/login" });
	};

	const darkModeChangeHandler = () => {
		dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
		const newDarkMode = !darkMode;
		Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");
	};

	return (
		<>
			<Head>
				<title>{title ? title + " - Amazona" : "Amazona"}</title>
				<meta name="description" content="Ecommerce Website" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<ToastContainer position="bottom-center" limit={1} />
			<div
				className={`flex min-h-screen flex-col justify-between shadow-md relative ${
					darkMode ? "bg-[#211f1f] text-white" : "bg-white"
				}`}
			>
				<header>
					<nav className="flex h-25 justify-between items-center px-4 shadow-md bg-[#203040]">
						<Link
							href="/"
							className="text-[3rem] text-blue-600 font-bold mb-[5px]"
						>
							amazona
						</Link>
						<div className="flex items-center">
							<Switch
								className={`${darkMode ? "bg-teal-900" : "bg-teal-700"}
								 relative inline-flex h-[34px] w-[70px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
								checked={darkMode}
								onChange={darkModeChangeHandler}
							>
								<span
									aria-hidden="true"
									className={`${
										darkMode
											? "translate-x-9 bg-black"
											: "translate-x-0 bg-white"
									}
								pointer-events-none inline-block h-[30px] w-[30px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
								/>
							</Switch>
							<Link
								href="/cart"
								className="p-3 text-blue-600 text-2xl relative mx-2"
							>
								Cart
								{cartItemsCount > 0 && (
									<span className="ml-1 rounded-full bg-green-600 px-2 py-1 text-xs font-bold text-white absolute -right-2 top-0 flex items-center justify-center">
										{cartItemsCount}
									</span>
								)}
							</Link>

							{status === "loading" ? (
								"Loading"
							) : session?.user ? (
								<Menu as="div" className="relative inline-block py-2">
									<Menu.Button className="text-blue-600 text-2xl">
										{session.user.name}
									</Menu.Button>
									<Menu.Items
										className={`absolute right-0 w-56 origin-top-right ${
											darkMode ? "bg-gray-400" : "bg-gray-50"
										} shadow-lg rounded-md overflow-hidden`}
									>
										<Menu.Item>
											<Link
												className={`dropdown-link ${
													darkMode && "hover:text-black"
												}`}
												href="/profile"
											>
												Profile
											</Link>
										</Menu.Item>
										<Menu.Item>
											<Link
												className={`dropdown-link ${
													darkMode && "hover:text-black"
												}`}
												href="/order-history"
											>
												Order History
											</Link>
										</Menu.Item>
										<Menu.Item>
											<a
												className={`dropdown-link ${
													darkMode && "hover:text-black"
												}`}
												href="#"
												onClick={logoutClickHandler}
											>
												Logout
											</a>
										</Menu.Item>
									</Menu.Items>
								</Menu>
							) : (
								<Link href="/login" className="p-3 text-blue-600 text-2xl">
									Login
								</Link>
							)}
						</div>
					</nav>
				</header>
				<main className="container min-h-[80vh] m-auto mt-4 px-4">
					{children}
				</main>
				<footer
					className={`flex h-10 items-center justify-center shadow-inner ${
						darkMode ? "bg-black text-white" : "bg-gray-100"
					}`}
				>
					<p>Copyright © 2022 Amazona</p>
				</footer>
			</div>
		</>
	);
}
