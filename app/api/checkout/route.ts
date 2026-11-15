import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Clé STRIPE_SECRET_KEY manquante dans Vercel Environment Variables." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);
    const { items } = await req.json();

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: `${item.name}${item.size ? ` (Size: ${item.size})` : ""}`,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity) || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH", "LU", "DE", "IT", "ES", "NL", "GB", "US", "CA"],
      },
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: "required",
      success_url: "https://www.helmethautecouture.com/?order=success",
      cancel_url: "https://www.helmethautecouture.com/cart",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}