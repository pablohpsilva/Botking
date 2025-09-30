import { PrismaClient } from "@prisma/client";
import { createPackageLogger } from "@botking/logger";

const prisma = new PrismaClient();
const logger = createPackageLogger("db");

async function main() {
  logger.info("Starting database seeding", { action: "seed_start" });

  // Create a sample user with better-auth structure
  const user = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice Doe",
      emailVerified: true,
      image: "https://github.com/github.png",
    },
  });
  logger.info("Created user", {
    userId: user.id,
    name: user.name,
    action: "user_created",
  });

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
  logger.info("Created post", {
    postId: post.id,
    title: post.title,
    action: "post_created",
  });

  // Create a sample account (credential-based)
  const account = await prisma.account.create({
    data: {
      userId: user.id,
      providerId: "credential",
      accountId: user.email,
      password: "$2a$10$example.hashed.password", // This would be hashed by better-auth
    },
  });
  logger.info("Created account", {
    accountId: account.id,
    providerId: account.providerId,
    action: "account_created",
  });

  logger.info("Database seeded successfully", { action: "seed_complete" });
}

main()
  .catch((e) => {
    logger.error(
      "Error seeding database",
      { action: "seed_failed" },
      e instanceof Error ? e : new Error(String(e))
    );
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
