import { PrismaClient, Prisma } from "./app/generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: "xyz@abc.io",
    name: "Clark Kent",
    updatedAt: new Date(),

    orders: {
      create: [
        {
          updatedAt: new Date(),

          items: {
            create: [
              {
                quantity: 2,
                updatedAt: new Date(),

                pizza: {
                  create: {
                    name: "Pepperoni",
                    price: 12.99,
                    updatedAt: new Date()
                  }
                }
              },
              {
                quantity: 1,
                updatedAt: new Date(),

                pizza: {
                  create: {
                    name: "Cheese",
                    price: 10.99,
                    updatedAt: new Date()
                  }
                }
              }
            ]
          }
        }
      ]
    }
  }
];

async function main() {
  console.log("Start seeding ...");
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
