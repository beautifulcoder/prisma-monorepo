import Form from "next/form";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function OrderPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const orderId = parseInt(id, 10);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      items: {
        include: {
          pizza: true
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  const cancelOrder = async () => {
    "use server";
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED", updatedAt: new Date() }
    });
    revalidatePath("/orders/" + order.id);
    redirect("/orders/" + order.id);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
      <p>Ordered By: {order.user.name}</p>
      <p>Updated at: {new Date(order.updatedAt).toLocaleString()}</p>
      <p>Status: {order.status}</p>
      <ul className="mt-2 space-y-2">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>{item.quantity} x {item.pizza.name}</span>
            <span>${item.pizza.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 font-semibold">
        Total: $
        {order.items.reduce((total, item) => total + item.quantity * item.pizza.price, 0).toFixed(2)}
      </p>
      {order.status !== "CANCELLED" && (
        <Form action={cancelOrder}>
          <button
            type="submit"
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel Order
          </button>
        </Form>
      )}
    </div>
  );
}
