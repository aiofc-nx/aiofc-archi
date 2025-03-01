# Software Architecture

## 领域驱动开发

### DDD 的目录结构

DDD 的目录结构通常以领域为核心，强调领域模型的表达和限界上下文的划分。以下是一个典型的结构：

```md
src/
├── domain/                 # 领域层（核心业务逻辑）
│   ├── models/             # 领域模型（实体、值对象、聚合根）
│   │   └── User.ts
│   ├── services/           # 领域服务
│   │   └── UserService.ts
│   └── repositories/       # 领域仓库接口
│       └── UserRepository.ts
├── application/            # 应用层（协调领域逻辑）
│   ├── use-cases/          # 应用用例
│   │   └── CreateUser.ts
│   └── services/           # 应用服务
│       └── NotificationService.ts
├── infrastructure/         # 基础设施层（技术实现）
│   ├── repositories/       # 仓库实现
│   │   └── UserRepositoryImpl.ts
│   ├── services/           # 外部服务实现
│   │   └── EmailService.ts
│   └── database/           # 数据库连接
│       └── connection.ts
└── presentation/           # 表示层（用户界面或API）
    ├── controllers/        # 控制器
    │   └── UserController.ts
    └── dtos/               # 数据传输对象
        └── UserDTO.ts
```
