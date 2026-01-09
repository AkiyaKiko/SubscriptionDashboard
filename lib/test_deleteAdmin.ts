import { prisma } from "@/lib/prisma";

async function main() {
  // 删除所有 admin（只允许一个也没关系）
  const result = await prisma.admin.deleteMany();
  console.log("✅ Deleted admins:", result.count);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });