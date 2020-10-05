/**
 * A simple pass-thru error handler
 */
import { ErrorHandler } from '@angular/core';

export class AppErrorHandler implements ErrorHandler {
    handleError(error: any): void {
        throw error;
    }
}
