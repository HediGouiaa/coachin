import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string; timestamp: string } {
    return {
      message: '🚀 Professional Coaching Platform API v1.0',
      timestamp: new Date().toISOString(),
    };
  }

  healthCheck(): { status: string } {
    return {
      status: 'ok',
    };
  }
}
