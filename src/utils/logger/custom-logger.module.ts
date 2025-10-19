import { Injectable, LoggerService } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CustomLogger implements LoggerService {
  log(message: string, context?: string) {
    console.log(`[LOG] ${context || ''}: ${message}`);
  }

  error(message: string, trace: string, context?: string) {
    console.error(`[ERROR] ${context || ''}: ${message}`, trace);
  }

  warn(message: string, context?: string) {
    console.warn(`[WARN] ${context || ''}: ${message}`);
  }

  debug(message: string, context?: string) {
    console.debug(`[DEBUG] ${context || ''}: ${message}`);
  }

  verbose(message: string, context?: string) {
    console.log(`[VERBOSE] ${context || ''}: ${message}`);
  }

  logRequest(request: Request, context?: string) {
    const { method, url, query, body } = request;
    this.log(`Request: ${method} ${url}`, context);
    this.log(`Query: ${JSON.stringify(query)}`, context);
    this.log(`Body: ${JSON.stringify(body)}`, context);
  }
}
