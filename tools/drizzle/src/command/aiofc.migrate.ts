import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, connection } from '../lib/db';
import env from '../lib/env';

/**
 * 数据库迁移主函数
 *
 * 工作机制:
 * 1. 首先检查环境变量DB_MIGRATING是否为true,这是一个安全措施,
 *    防止在非预期情况下执行数据库迁移
 *
 * 2. 使用drizzle-orm提供的migrate函数执行迁移:
 *    - 读取migrationsFolder指定目录下的所有迁移文件
 *    - 按顺序执行这些SQL迁移脚本
 *    - 在数据库中记录已执行的迁移
 *
 * 3. 完成后关闭数据库连接
 */
async function main() {
  if (!env.DB_MIGRATING) {
    throw new Error('运行迁移时必须将 DB_MIGRATING 设置为"true"');
  }

  const migrationsFolder =
    process.env.MIGRATIONS_FOLDER || './drizzle/src/migrations';

  await migrate(db, {
    migrationsFolder,
    migrationsSchema: env.DB_SCHEMA, // 指定迁移表所在的schema
    // migrationsTable: '_drizzle_migrations', // 指定迁移表的名称
  });
  await connection.end();
}

/**
 * 执行迁移流程
 *
 * 错误处理机制:
 * - 如果迁移过程中发生错误,会被catch捕获
 * - 打印错误信息到控制台
 * - 使用非零状态码(1)退出程序,表示执行失败
 */
main().catch((err) => {
  console.error('迁移失败:', err);
  process.exit(1);
});
