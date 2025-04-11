import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ResponsesService {

  constructor(private sb: MatSnackBar) { }

   //success and error messages
   showError(message: string, action = 'Close', duration = 2000) {
    this.sb.open(message, action, {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']

    })

  }

  showSuccess(message:string, action = 'Close',duration=2000){
    this.sb.open(message,action,{
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']

    })

  }
}
