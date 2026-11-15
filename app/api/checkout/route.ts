import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Ajoute ta clé STRIPE_SECRET_KEY dans Vercel -> Settings -> Environment Variables" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);
    const { items, customer } = await req.json();

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: `${item.name || item.title || "HELMET Piece"}${item.size ? ` — Size ${item.size}` : ""}`,
          description: customer?.address
            ? `Ship to: ${customer.firstName} ${customer.lastName}, ${customer.address}, ${customer.postalCode} ${customer.city}, ${customer.country}`
            : undefined,
        },
        unit_amount: Math.round(
          Number(String(item.price).replace(/[^0-9.]/g, "")) * 100
        ),
      },
      quantity: Number(item.quantity) || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      customer_email: customer?.email || undefined,
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH", "LU", "DE", "IT", "ES", "NL", "GB", "US", "CA"],
      },
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: "required",
      success_url: "https://www.helmethautecouture.com/cart?success=true",
      cancel_url: "https://www.helmethautecouture.com/cart?canceled=true",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}