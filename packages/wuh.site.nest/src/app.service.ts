import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getHealth() {
    const db = this.connection.db;
    const mongoState = this.connection.readyState;
    const stateMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return {
      status: mongoState === 1 ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      mongodb: {
        state: stateMap[mongoState] || 'unknown',
        readyState: mongoState,
        database: db?.databaseName || 'unknown',
        host: this.connection.host || 'unknown',
        port: this.connection.port || 'unknown',
      },
    };
  }
}
