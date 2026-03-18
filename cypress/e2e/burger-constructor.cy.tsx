import type { TTabMode } from '@utils-types';

const modal = '[data-testid=modal]';
const burgerIngredient = '[data-testid=filling]';
const burgerBun = '[data-testid=bun]';
const burgerIngredientDefault = '[data-testid=default-filling]';
const burgerBunDefault = '[data-testid=default-bun]';
const modalCloseButton = '[data-testid=modal-close-button]';
const burgerConstructorSubmitButton =
  '[data-testid=constructor-submit-button] button';
const ingredient = (type?: TTabMode) => {
  if (type) {
    return `[data-testid^="ingredient-${type}"]`;
  }
  return '[data-testid^=ingredient]';
};

beforeEach(() => {
  cy.viewport(1280, 800);

  cy.intercept('GET', '**/api/ingredients', {
    fixture: 'ingredients.json'
  }).as('requestIngredients');

  cy.intercept('GET', '**/api/auth/user', {
    fixture: 'user.json'
  }).as('requestUser');

  cy.intercept('POST', '**/api/orders', {
    fixture: 'order.json'
  }).as('createOrder');

  cy.visit('/');
});

describe('Проверка модального окна', () => {
  it('Открываем и закрываем модальное окно с ингредиентом по кнопке', () => {
    cy.get(ingredient()).contains('Краторная булка N-200i').click();

    cy.get(modal).should('be.visible').and('contain', 'Краторная булка N-200i');

    cy.get(modalCloseButton).click();

    cy.get(modal).should('not.exist');
  });

  it('Открываем и закрываем модальное окно с ингредиентом по оверлею', () => {
    cy.get(ingredient()).contains('Краторная булка N-200i').click();

    cy.get(modal).should('be.visible').and('contain', 'Краторная булка N-200i');

    cy.get('body').click(0, 0);

    cy.get(modal).should('not.exist');
  });
});

it('Процесс сборки бургера с последующим оформлением заказа', () => {
  cy.setCookie('accessToken', 'testAccessToken');
  window.localStorage.setItem('refreshToken', 'testRefreshToken');

  cy.wait('@requestIngredients');

  cy.get(ingredient()).should('have.length.greaterThan', 0);

  cy.get(ingredient('bun')).first().contains('button', 'Добавить').click();

  cy.get(ingredient('main')).first().contains('button', 'Добавить').click();

  cy.get(ingredient('sauce')).first().contains('button', 'Добавить').click();

  cy.get(burgerBun).should('have.length', 2);

  cy.get(burgerIngredient).should('have.length', 2);

  cy.wait('@requestUser');

  cy.get(burgerConstructorSubmitButton).click();

  cy.wait('@createOrder').then((interception) => {
    cy.get(modal)
      .should('be.visible')
      .should('contain', interception.response!.body.order.number);
  });

  cy.get(modalCloseButton).click();

  cy.get(modal).should('not.exist');

  cy.get(burgerIngredient).should('not.exist');

  cy.get(burgerBun).should('not.exist');

  cy.get(burgerBunDefault).should('have.length', 2);

  cy.get(burgerIngredientDefault).should('exist');
  
  cy.clearCookie('accessToken');
  window.localStorage.removeItem('refreshToken');
});
