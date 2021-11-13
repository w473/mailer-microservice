import { Logger as TypeOrmLoggerInterface } from 'typeorm';
import { LoggerService } from '@nestjs/common';

enum TypeOrmLogLevel {
  LOG = 'log',
  INFO = 'info',
  WARN = 'warn',
}

enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
}

export class CustomTypeOrmLogger implements TypeOrmLoggerInterface {
  private static severityMap: Record<TypeOrmLogLevel, LogLevel> = {
    [TypeOrmLogLevel.LOG]: LogLevel.DEBUG,
    [TypeOrmLogLevel.INFO]: LogLevel.INFO,
    [TypeOrmLogLevel.WARN]: LogLevel.WARNING,
  };

  public constructor(private readonly logger: LoggerService) {}

  public logQuery(query: string, parameters?: unknown[]): void {
    this.logger.debug('Executing query', { query, parameters });
  }

  public logQueryError(error: string | Error, query: string, parameters?: unknown[]): void {
    if (typeof error === 'string') {
      this.logger.warn('Error while executing query', { query, parameters, error });
    } else {
      this.logger
        .warn('Error while executing query', { query, parameters, error });
    }
  }

  public logQuerySlow(time: number, query: string, parameters?: unknown[]): void {
    this.logger.warn('Slow query detected', { query, time, parameters });
  }

  public logSchemaBuild(message: string): void {
    this.logger.verbose(message);
  }

  public logMigration(message: string): void {
    this.logger.verbose(message);
  }

  public log(level: TypeOrmLogLevel, message: unknown): void {
    const severity = this.getSeverity(level);
    console.log(severity);
    let msg = '';
    let optional: any = null;
    if (typeof message === 'string') {
      msg = message;
    } else if (message instanceof Error) {
      msg = message.message;
      optional = message;
    } else {
      msg = `${JSON.stringify(message)}`;
      optional = (message as Record<string, any>);
    }
    switch (severity) {
      case LogLevel.DEBUG:
        this.logger.debug(msg, optional);
        break;
      case LogLevel.INFO:
        this.logger.verbose(msg, optional);
        break;
      case LogLevel.WARNING:
        this.logger.warn(msg, optional);
        break;
      default:
        this.logger.log(msg, optional);
        break;
    }
  }

  private getSeverity(level: TypeOrmLogLevel): LogLevel {
    return CustomTypeOrmLogger.severityMap[level] || LogLevel.WARNING;
  }
}
