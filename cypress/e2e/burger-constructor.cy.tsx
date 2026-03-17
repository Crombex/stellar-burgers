beforeEach(() => {
  cy.viewport(1280, 800)

  cy.intercept('GET', '**/api/ingredients', {
    fixture: 'ingredients.json'
  }).as('requestIngredients')

  cy.intercept('GET', '**/api/auth/user', {
    fixture: 'user.json'
  }).as('requestUser')

  cy.intercept('POST', '**/api/orders', {
    fixture: 'order.json'
  }).as('createOrder')

  cy.visit('/')
})

describe('Проверка модального окна', () => {
  it('Открываем и закрываем модальное окно с ингредиентом по кнопке', () => {
    cy.get('[data-testid^="ingredient"]')
    .contains('Краторная булка N-200i')
    .click()

    cy.get('[data-testid=modal]')
    .should('be.visible').and('contain', 'Краторная булка N-200i')

    cy.get('[data-testid=modal-close-button]')
    .click()

    cy.get('[data-testid=modal]')
    .should('not.exist')
  })

  it('Открываем и закрываем модальное окно с ингредиентом по оверлею', () => {
    cy.get('[data-testid^="ingredient"]')
    .contains('Краторная булка N-200i')
    .click()

    cy.get('[data-testid=modal]')
    .should('be.visible').and('contain', 'Краторная булка N-200i')

    cy.get('body')
    .click(0, 0)

    cy.get('[data-testid=modal]')
    .should('not.exist')
  })
})

describe('Процесс сборки бургера с последующим оформлением заказа', () => {
  before(() => {
    cy.setCookie('accessToken', 'testAccessToken')
    window.localStorage.setItem('refreshToken', 'testRefreshToken')
  })

  after(() => {
    cy.clearCookie('accessToken')
    window.localStorage.removeItem('refreshToken')
  })

  it('Загружаем ингредиенты и отображаем их', () => {
    cy.wait('@requestIngredients')

    cy.get('[data-testid^="ingredient"]')
      .should('have.length.greaterThan', 0)
  })

  it('Собираем бургер и отправляем заказ', () => {
    cy.get('[data-testid^="ingredient-bun"]')
    .first()
    .contains('button', 'Добавить')
    .click()

    cy.get('[data-testid^="ingredient-main"]')
    .first()
    .contains('button', 'Добавить')
    .click()

    cy.get('[data-testid^="ingredient-sauce"]')
    .first()
    .contains('button', 'Добавить')
    .click()

    cy.get('.constructor-element_pos_top')
    .should('exist')

    cy.get('.constructor-element_pos_bottom')
    .should('exist')

    cy.get('[data-testid=burger-filling] li')
    .should('have.length', 2)

    cy.wait('@requestUser')

    cy.get('[data-testid=constructor-submit-button] button')
    .click()

    cy.wait('@createOrder').then((interception) => {
      cy.get('[data-testid=modal]')
      .should('be.visible')
      .should('contain', interception.response!.body.order.number)
    })

    cy.get('[data-testid=modal-close-button]')
    .click()

    cy.get('[data-testid=modal]')
    .should('not.exist')

    cy.get('.constructor-element')
    .should('have.length', 0)
  })

})  







