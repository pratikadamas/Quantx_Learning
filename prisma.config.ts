const prismaConfig = {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env["DATABASE_URL"],
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
};

export default prismaConfig;
