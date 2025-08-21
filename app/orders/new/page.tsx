import Form from "next/form";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function NewOrderPage() {
  const pizzas = await prisma.pizza.findMany();

  const createOrder = async (formData: FormData) => {
    "use server";
    const items = formData.getAll("items") as string[];
    const quantities = formData.getAll("quantities") as string[];

    const orderItems = items.map((item, index) => ({
      pizzaId: parseInt(item, 10),
      quantity: parseInt(quantities[index], 10),
      updatedAt: new Date(),
    }));

    await prisma.order.create({
      data: {
        userId: 1,
        items: {
          create: orderItems,
        },
        updatedAt: new Date(),
      },
    });

    try {
      await prisma.$accelerate.invalidate({
        tags: ["orders"]
      });
    } catch (error) {
      if (error.code === "P6003") {
        console.error("The cache invalidation rate limit has been reached in your account. Please try again later.");
      } else {
        throw error;
      }
    }

    revalidatePath("/orders");
    redirect("/orders");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create New Order</h1>
      <Form action={createOrder} className="space-y-4">
        {pizzas.map((pizza) => (
          <div key={pizza.id} className="flex items-center space-x-4">
            <input
              type="checkbox"
              name="items"
              value={pizza.id}
              className="h-5 w-5"
            />
            <label className="flex-1">{pizza.name} - ${pizza.price.toFixed(2)}</label>
            <input
              type="number"
              name="quantities"
              defaultValue={1}
              min={1}
              max={5}
              className="w-16 border rounded px-2 py-1"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Order
        </button>
      </Form>
    </div>
  );
}
