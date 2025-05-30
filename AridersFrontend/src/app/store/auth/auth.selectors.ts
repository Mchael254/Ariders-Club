import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';


export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(selectAuthState, state => state.user);
export const selectIsAuthenticated = createSelector(selectAuthState, state => state.isAuthenticated);
export const selectAuthToken = createSelector(selectAuthState, state => state.token);
export const selectAuthError = createSelector(selectAuthState, state => state.error);
export const selectAuthLoading = createSelector(selectAuthState, state => state.loading);
export const selectAuthRole = createSelector(
    selectAuthState,
    state => state.role
  );