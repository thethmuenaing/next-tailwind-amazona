import { getSession } from "next-auth/react";
import Order from "@/models/Order";
import db from "@/utils/db";
import User from "@/models/User";

const handler = async (req, res) => {
	const session = await getSession({ req });
	if (!session) {
		return res.status(401).send({ message: "signin required" });
	}
	const { user } = session;
	console.log("user ", user);
	const userId = await User.findOne({ email: user.email });
	console.log("userId ", userId);
	await db.connect();
	const orders = await Order.find({ user: userId._id });
	console.log("orders ", orders);
	await db.disconnect();
	res.send(orders);
};
export default handler;
