import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (!token){
    router.createUrlTree(['/signin'])
  }
  try {
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    if (payload.role === 'admin') {
      return true; 
    }
   
    return router.createUrlTree(['/signin']);

  } catch (error) {
    return router.createUrlTree(['/signin']);

  }

};
