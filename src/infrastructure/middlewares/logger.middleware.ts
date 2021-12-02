import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common/services/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('Request...', {
      baseUrl: req.baseUrl,
      url: req.url,
      body: req.body,
    });
    next();
  }
}
