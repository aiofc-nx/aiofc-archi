import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * 用于创建一个包含基础租户字段的数据库表的通用函数
 *
 * @template T - 表的额外列定义的类型，必须是一个键值对对象
 * @param {string} tableName - 要创建的表名
 * @param {T} columns - 要添加到基础字段之外的额外列定义
 * @returns {ReturnType<typeof pgTable>} 返回一个 PostgreSQL 表定义
 *
 * @example
 * ```typescript
 * const userTable = createTenantTable('user', {
 *   name: text('name').notNull(),
 *   email: text('email').notNull()
 * });
 * ```
 */
export const createTenantTable = <T extends Record<string, any>>(
  tableName: string,
  columns: T = {} as T,
) => {
  return pgTable(tableName, {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    ...columns,
  });
};
