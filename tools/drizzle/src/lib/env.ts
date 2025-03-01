import { expand } from 'dotenv-expand';

import { ZodError, z } from 'zod';
import { config } from 'dotenv';
/**
 * 字符串布尔值转换器
 *
 * 工作机制:
 * 1. 使用z.coerce.string()将输入强制转换为字符串
 * 2. 通过transform将"true"字符串转换为true布尔值
 * 3. 如果未提供值,默认为"false"
 */
const stringBoolean = z.coerce
  .string()
  .transform((val) => {
    return val === 'true';
  })
  .default('false');

/**
 * 环境变量验证模式
 *
 * 定义了所需的环境变量及其类型:
 * - NODE_ENV: 运行环境,默认为development
 * - DB_*: 数据库连接相关配置
 * - DATABASE_URL: 完整的数据库连接URL
 * - DB_MIGRATING/DB_SEEDING: 控制数据库迁移和种子数据填充的标志
 */
const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_SCHEMA: z.string().default('tenant_default'),
  DB_PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  DB_MIGRATING: stringBoolean,
  MIGRATIONS_FOLDER: z.string(),
  DB_SEEDING: stringBoolean,
});

/**
 * 导出环境变量类型定义
 */
export type EnvSchema = z.infer<typeof EnvSchema>;

/**
 * 加载并展开环境变量
 * 使用dotenv-expand支持环境变量间的引用
 */
/**
 * 环境变量验证
 *
 * 错误处理机制:
 * 1. 如果是Zod验证错误,生成缺失环境变量的清晰提示
 * 2. 其他错误直接输出到控制台
 */
try {
  // 指定要加载的环境变量文件路径
  // config({ path: './drizzle/.env.drizzle.local' });
  expand(config({ path: './tools/drizzle/.env.drizzle.local' }));
  EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    let message = '.env 中缺少必需的值:\n';
    error.issues.forEach((issue) => {
      message += issue.path[0] + '\n';
    });
    const e = new Error(message);
    e.stack = '';
    throw e;
  } else {
    console.error(error);
  }
}

/**
 * 导出经过验证的环境变量对象
 */
export default EnvSchema.parse(process.env);
