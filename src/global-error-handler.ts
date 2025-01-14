import {Application} from '@loopback/core';

export function setupGlobalErrorHandling(app: Application): void {
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // You can add custom logic here, such as logging the error to an external service
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // You can add custom logic here, such as logging the error to an external service
    // Optionally, you can exit the process if needed
    // process.exit(1);
  });
}
