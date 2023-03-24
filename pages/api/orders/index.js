import Order from "@/models/Order";
import User from "@/models/User";
import db from "@/utils/db";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
	const session = await getSession({ req });
	if (!session) {
		return res.status(401).send("signin required");
	}

	const { user } = session;
	await db.connect();
	const userId = await User.findOne({ email: user.email });
	const newOrder = new Order({
		...req.body,
		user: userId._id,
	});

	const order = await newOrder.save();
	res.status(201).send(order);
};
export default handler;
