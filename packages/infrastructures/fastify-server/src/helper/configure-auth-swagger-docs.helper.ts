import type { ISwaggerConfig } from '@aiofc/config';
import { INestApplication } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

export function configureAuthSwaggerDocs(
  app: INestApplication,
  config: ISwaggerConfig
) {
  const apiDocumentationCredentials = {
    user: config.user,
    password: config.password,
  };
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.use(
    config.path,
    (req: FastifyRequest, res: FastifyReply, next: () => void) => {
      function parseAuthHeader(input: string): {
        user: string;
        password: string;
      } {
        const [, encodedPart] = input.split(' ');
        const buff = Buffer.from(encodedPart, 'base64');
        const text = buff.toString('ascii');
        const [user, password] = text.split(':');
        return { user, password };
      }

      function unauthorizedResponse(): void {
        res.status(401).header('WWW-Authenticate', 'Basic').send();
        next();
      }

      if (!req.headers.authorization) {
        return unauthorizedResponse();
      }

      const credentials = parseAuthHeader(req.headers.authorization);

      if (
        credentials?.user !== apiDocumentationCredentials.user ||
        credentials?.password !== apiDocumentationCredentials.password
      ) {
        return unauthorizedResponse();
      }

      next();
    }
  );
}
