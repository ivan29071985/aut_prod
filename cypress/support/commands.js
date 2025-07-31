Cypress.Commands.add('setupAndLogin', (email = 'ivan.santos+1@amorsaude.com', password = 'Iv@n198529') => {
  const sessionVersion = 'v3';
  
  // ✅ SOLUÇÃO: ID fixo baseado apenas no email e versão
  const sessionId = `login_${email}_${sessionVersion}`;

  const environment = Cypress.env('environment') || Cypress.env('CYPRESS_ENV');
  const baseUrlConfig = Cypress.env('baseUrl');
  
  if (!baseUrlConfig) {
    throw new Error('Configuração baseUrl não encontrada no cypress.env.json');
  }
  
  const baseUrl = environment === 'staging'
    ? baseUrlConfig.staging
    : environment === 'producao' || environment === 'prod'
      ? baseUrlConfig.producao
      : baseUrlConfig.homologacao;

  Cypress.env('currentBaseUrl', baseUrl);

  cy.session(sessionId, () => {
    cy.visit(baseUrl);
    cy.get('#E-mail').type(email, { timeout: 30000 });
    cy.get('#Senha').type(password, { log: false, timeout: 30000 });
    cy.contains('Entrar', { timeout: 1000 }).click();
    cy.wait(500);

    //cy.contains('span', /Automação (Staging|Homolog|Prod)/, { timeout: 10000 }).click({ force: true });
    cy.contains('span', ' AmorSaúde Ribeirão Preto ').click()
    cy.contains('button', ' Entrar ', { timeout: 10000 }).click();
    cy.wait(500);

    cy.get('body').then($body => {
      if ($body.text().includes('Você não tem permissão')) {
        cy.contains('button', 'Ok').click();
      }
      if ($body.text().includes('Você não tem permissão para a rota Home')) {
        cy.contains('button', 'Ok').click();
        cy.log('Mensagem de erro de permissão tratada com sucesso');
      }
    });

    cy.get('#schedule', { timeout: 10000 }).should('exist');
  }, {
    validate: () => {
      cy.window().then(win => {
        const isLoggedIn = Boolean(win.localStorage.getItem('user') || win.localStorage.getItem('auth_token'));
        expect(isLoggedIn).to.be.true;
      });
    },
    cacheAcrossSpecs: true // ✅ Mudei para true para reutilizar entre specs
  });
});

Cypress.Commands.add('loginDrBarros', () => {
  
  // ✅ SOLUÇÃO: ID fixo
  const sessionId = 'sessao_drbarros';

  const environment = Cypress.env('environment') || Cypress.env('CYPRESS_ENV');
  const baseUrlConfig = Cypress.env('baseUrl');
  
  const baseUrl = environment === 'staging'
    ? baseUrlConfig.staging
    : environment === 'producao' || environment === 'prod'
      ? baseUrlConfig.producao
      : baseUrlConfig.homologacao;

  Cypress.env('currentBaseUrl', baseUrl);

  cy.session(sessionId, () => {
    cy.visit(baseUrl);
    cy.get('#E-mail').type('ivan.santos+drbarros@amorsaude.com');
    cy.get('#Senha').type('Iv@n198529', { log: false });
    cy.contains('Entrar', { timeout: 1000 }).click();
    cy.contains('span', /Automação (Staging|Homolog|Prod)/, { timeout: 10000 }).click({ force: true });
    cy.contains('button', ' Entrar ', { timeout: 10000 }).click();

    cy.get('body').then($body => {
      if ($body.text().includes('Você não tem permissão')) {
        cy.contains('button', 'Ok').click();
      }
      if ($body.text().includes('Você não tem permissão para a rota Home')) {
        cy.contains('button', 'Ok').click();
        cy.log('Mensagem de erro de permissão tratada com sucesso');
      }
    });
  }, {
    cacheAcrossSpecs: true // ✅ Reutiliza entre specs
  });
});