import { NextApiRequest , NextApiResponse  } from "next";
import { StoreProducts } from "../../../type";
import Stripe from "stripe";




const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface Item {
  image: string;
  // add other properties if needed
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { items, email } = req.body;
  const modifiedItems = items.map((item: StoreProducts) => ({
    quantity: item.quantity,
    price_data: {
      currency: "usd",
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        description: item.description,
        images: [item.image],
      },
    },
  }));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["BD", "US", "OM", "CA", "GB"],
    },
    line_items: modifiedItems,
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
    metadata: {
      email,
      images: JSON.stringify(items.map((item: Item) => item.image)),
    },
  });
  res.status(200).json({
    id: session.id,
  });
}