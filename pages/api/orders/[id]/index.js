//  /api/orders/:id
import Order from "@/models/Order";
import db from "@/utils/db";
import { getSession } from "next-auth/react";
const handler = async (req, res) => {
	const session = await getSession({ req });
	console.log("Index-session ", session);
	if (!session) {
		return res.status(401).send("signin required");
	}
	await db.connect();

	const order = await Order.findById(req.query.id);
	console.log("req.query.id ", req.query.id);
	console.log("order ", order);
	await db.disconnect();
	res.send(order);
};
export default handler;
