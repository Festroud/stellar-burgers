// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Команда для установки моковых токенов авторизации
       * @example cy.setAuthTokens()
       */
      setAuthTokens(): Chainable<void>;
      /**
       * Команда для очистки токенов авторизации
       * @example cy.clearAuthTokens()
       */
      clearAuthTokens(): Chainable<void>;
      /**
       * Команда для перетаскивания ингредиента в конструктор
       * @param ingredientSelector - селектор ингредиента
       * @param targetSelector - селектор цели для drop
       * @example cy.dragIngredient('[data-cy=ingredient-bun]', '[data-cy=constructor]')
       */
      dragIngredient(ingredientSelector: string, targetSelector: string): Chainable<void>;
      /**
       * Команда для настройки всех перехватов API
       * @example cy.setupApiIntercepts()
       */
      setupApiIntercepts(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('setAuthTokens', () => {
  window.localStorage.setItem('refreshToken', 'test-refresh-token');
  cy.setCookie('accessToken', 'Bearer test-access-token');
});

Cypress.Commands.add('clearAuthTokens', () => {
  window.localStorage.removeItem('refreshToken');
  cy.clearCookie('accessToken');
});

Cypress.Commands.add('dragIngredient', (ingredientSelector: string, targetSelector: string) => {
  cy.get(ingredientSelector).trigger('dragstart');
  cy.get(targetSelector).trigger('drop');
});

Cypress.Commands.add('setupApiIntercepts', () => {
  // Перехват загрузки ингредиентов
  cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
  
  // Перехват получения данных пользователя  
  cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('getUser');
  
  // Перехват создания заказа
  cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as('createOrder');
  
  // Перехват получения ленты заказов
  cy.intercept('GET', '/api/orders/all', {
    success: true,
    orders: [],
    total: 0,
    totalToday: 0
  }).as('getFeed');
  
  // Перехват получения заказов пользователя
  cy.intercept('GET', '/api/orders', {
    success: true,
    orders: []
  }).as('getUserOrders');
  
  // Перехват токена обновления
  cy.intercept('POST', '/api/auth/token', {
    success: true,
    accessToken: 'Bearer test-access-token',
    refreshToken: 'test-refresh-token'
  }).as('refreshToken');
});

export {};
