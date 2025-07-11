import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    where: {
      status: {
        not: "CANCELLED"
      }
    },
    include: {
      items: {
        include: {
          pizza: true
        }
      }
    }
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
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
            <Link href={`/orders/${order.id}`} className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              View Order
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
