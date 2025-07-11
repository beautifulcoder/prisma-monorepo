import prisma from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany();
  const pizzas = await prisma.pizza.findMany();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
            <p>Email: {user.email}</p>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">Pizzas</h2>
      <ul className="space-y-4">
        {pizzas.map((pizza) => (
          <li key={pizza.id} className="border p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">{pizza.name}</h3>
            <p>Price: ${pizza.price.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
