import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { selectUser } from '../store/auth/auth.selectors';

export const roleGuard: CanActivateFn = (route) => {
  const store = inject(Store);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as string[];

  return store.select(selectUser).pipe(
    take(1),
    map(user => {
      const userRole = user?.user_metadata?.['role'];

      if (userRole && allowedRoles.includes(userRole)) {
        return true;
      } else {
        router.navigate(['/home']);
        return false;
      }
    })
  );
};