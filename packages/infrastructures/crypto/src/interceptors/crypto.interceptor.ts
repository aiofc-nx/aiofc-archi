import { ApiRes } from '@aiofc/rest';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// import { ApiRes } from '@lib/infra/rest/res.response';

import {
  CRYPTO_HEADER,
  CRYPTO_METHOD_METADATA,
  CRYPTO_OPTIONS_METADATA,
  CRYPTO_DIRECTION_METADATA,
  CryptoMethod,
  CryptoDirection,
  CryptoConfig,
} from '../constants/crypto.constant';
import { CryptoService } from '../services/crypto.service';

@Injectable()
export class CryptoInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CryptoInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly cryptoService: CryptoService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const cryptoConfig = this.getCryptoConfig(context);

    // 如果没有加密配置，直接返回
    if (!cryptoConfig) {
      return next.handle();
    }

    // 处理请求解密
    if (this.shouldDecrypt(cryptoConfig.direction)) {
      this.decryptRequest(request, cryptoConfig);
    }

    // 处理响应加密
    return next.handle().pipe(
      map((data: unknown) => {
        if (!this.shouldEncrypt(cryptoConfig.direction)) {
          return data;
        }
        return this.encryptResponse(data, cryptoConfig);
      })
    );
  }

  /**
   * 获取加密配置
   */
  private getCryptoConfig(
    context: ExecutionContext
  ): Partial<CryptoConfig> | null {
    const handler = context.getHandler();
    const cryptoHeader = context.switchToHttp().getRequest().headers[
      CRYPTO_HEADER
    ];

    // 获取装饰器配置
    const method = this.reflector.get<CryptoMethod>(
      CRYPTO_METHOD_METADATA,
      handler
    );
    const options = this.reflector.get<Partial<CryptoConfig>>(
      CRYPTO_OPTIONS_METADATA,
      handler
    );
    const direction = this.reflector.get<CryptoDirection>(
      CRYPTO_DIRECTION_METADATA,
      handler
    );

    // 如果既没有请求头也没有装饰器，则不处理
    if (!cryptoHeader && !method) {
      return null;
    }

    // 如果有请求头但没有装饰器，使用默认配置
    const defaultConfig: Partial<CryptoConfig> = {
      method: CryptoMethod.AES,
      direction: CryptoDirection.BOTH,
    };

    const config: Partial<CryptoConfig> = method
      ? {
          method,
          direction,
          ...(method === CryptoMethod.AES
            ? { aes: options?.aes }
            : { rsa: options?.rsa }),
        }
      : defaultConfig;

    this.logger.debug(
      `Crypto config - Method: ${config.method}, Direction: ${
        config.direction
      }, Options: ${JSON.stringify(options)}`
    );

    return config;
  }

  /**
   * 是否需要解密
   */
  private shouldDecrypt(direction?: CryptoDirection): boolean {
    return (
      direction === CryptoDirection.DECRYPT ||
      direction === CryptoDirection.BOTH
    );
  }

  /**
   * 是否需要加密
   */
  private shouldEncrypt(direction?: CryptoDirection): boolean {
    return (
      direction === CryptoDirection.ENCRYPT ||
      direction === CryptoDirection.BOTH
    );
  }

  /**
   * 解密请求
   */
  private decryptRequest(
    request: FastifyRequest,
    config: Partial<CryptoConfig>
  ): void {
    try {
      // 如果请求体为空，则不进行解密
      if (!request.body) {
        this.logger.debug('Request body is empty, skipping decryption');
        return;
      }

      // 确保 request.body 是字符串
      const bodyString =
        typeof request.body === 'string'
          ? request.body
          : JSON.stringify(request.body); // 将对象序列化为字符串

      request.body = this.cryptoService.decrypt(bodyString, config);
      this.logger.debug(`Request body decrypted: ${request.body}`);
    } catch (error: unknown) {
      this.logger.error(
        `Failed to decrypt request body: ${(error as Error).message}`
      );
      throw error;
    }
  }

  /**
   * 加密响应
   */
  private encryptResponse(
    data: unknown,
    config: Partial<CryptoConfig>
  ): string | ApiRes<unknown> {
    try {
      // 如果是 ApiRes 格式，只加密 data 字段
      if (this.isApiResponse(data)) {
        const encrypted = this.cryptoService.encrypt(data.data, config);
        this.logger.debug(
          `Response data encrypted: ${encrypted}, Original: ${JSON.stringify(
            data.data
          )}`
        );
        return {
          ...data,
          data: encrypted,
        };
      }

      // 否则加密整个响应
      const encrypted = this.cryptoService.encrypt(data, config);
      this.logger.debug(
        `Full response encrypted: ${encrypted}, Original: ${JSON.stringify(
          data
        )}`
      );
      return encrypted;
    } catch (error: unknown) {
      this.logger.error(
        `Failed to encrypt response: ${(error as Error).message}`
      );
      throw error;
    }
  }

  /**
   * 判断是否为 ApiRes 格式
   */
  private isApiResponse(data: unknown): data is ApiRes<unknown> {
    return (
      data !== null &&
      typeof data === 'object' &&
      'code' in data &&
      'message' in data &&
      'data' in data
    );
  }
}
