import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (!token){
    router.createUrlTree(['/signin'])
  }
  try {
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    if (payload.role === 'member') {
      return true; 
    }
   
    return router.createUrlTree(['/signin']);

  } catch (error) {
    return router.createUrlTree(['/signin']);

  }



  // const router = inject(Router);
  // const token = localStorage.getItem('authToken');

  // if(token){
  //   return true;
  // }else{
  //   router.navigate(['/signin']);
  //   return false;
  // }

};
