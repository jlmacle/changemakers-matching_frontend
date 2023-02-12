// npx @cypress/chrome-recorder %userprofile%/Desktop/Recording.json -o=cypress/tests/ui
// From Chrome recording to Cypress 

describe("Recording 2/12/2023 at 2:25:32 PM", () => {
it("tests Recording 2/12/2023 at 2:25:32 PM", () => {
  cy.viewport(611, 569);

  cy.visit("https://www.youtube.com/watch?v=-RJuZrq-wOk");

  cy.get("html > body > ytd-app > div:nth-child(7) > div > ytd-masthead > div:nth-child(5) > div:nth-child(2) > yt-icon-button > button > yt-icon").click();

  cy.get("html > body > ytd-app > div:nth-child(7) > div > ytd-masthead > div:nth-child(5) > div:nth-child(2) > ytd-searchbox > form > div.style-scope.ytd-searchbox > div.ytd-searchbox-spt > input").click();

  cy.get("html > body > ytd-app > div:nth-child(7) > div > ytd-masthead > div:nth-child(5) > div:nth-child(2) > ytd-searchbox > form > div.style-scope.ytd-searchbox > div.ytd-searchbox-spt > input").dblclick();

  cy.get("html > body > ytd-app > div:nth-child(7) > div > ytd-masthead > div:nth-child(5) > div:nth-child(2) > ytd-searchbox > form > div.style-scope.ytd-searchbox > div.ytd-searchbox-spt > input").click();

  cy.get("html > body > ytd-app > div:nth-child(7) > div > ytd-masthead > div:nth-child(5) > div:nth-child(1) > yt-icon-button:nth-child(1) > button > yt-icon").click();

  cy.get("html > body > ytd-app > div:nth-child(7) > div > ytd-masthead > div:nth-child(5) > div:nth-child(1) > yt-icon-button:nth-child(3) > button > yt-icon").click();

  });
});
