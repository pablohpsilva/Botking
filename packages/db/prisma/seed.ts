import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a sample user with better-auth structure
  const user = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice Doe",
      emailVerified: true,
      image: "https://github.com/github.png",
    },
  });
  console.log("✅ Created user:", user);

  // Create a sample post
  const post = await prisma.post.create({
    data: {
      title: "Getting Started with Better Auth",
      content:
        "This is a sample post demonstrating the integration with better-auth.",
      published: true,
      authorId: user.id,
    },
  });
  console.log("✅ Created post:", post);

  // Create a sample account (credential-based)
  const account = await prisma.account.create({
    data: {
      userId: user.id,
      providerId: "credential",
      accountId: user.email,
      password: "$2a$10$example.hashed.password", // This would be hashed by better-auth
    },
  });
  console.log("✅ Created account:", account);

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
