/// <reference types="cypress" />
/// <reference types="cypress-xpath" />

import { applicationName, risk } from "../../types/constants";
import * as commonView from "../../views/common.view";
import { itemsPerPageMenu, itemsPerPageToggleButton } from "../../views/reports.view";

export function selectItemsPerPageAdoptionCandidate(items: number): void {
    cy.get(itemsPerPageMenu)
        .find(itemsPerPageToggleButton)
        .then(($toggleBtn) => {
            if (!$toggleBtn.eq(0).is(":disabled")) {
                $toggleBtn.eq(0).trigger("click");
                cy.get(commonView.itemsPerPageMenuOptions);
                cy.get(`li > button[data-action="per-page-${items}"]`).click();
                cy.wait(2000);
            }
        });
    cy.wait(2000);
}

export function selectItemsPerPageIdentifiedRisks(items: number): void {
    cy.get(itemsPerPageMenu)
        .find(itemsPerPageToggleButton)
        .then(($toggleBtn) => {
            if (!$toggleBtn.eq(1).is(":disabled")) {
                $toggleBtn.eq(1).trigger("click");
                cy.wait(1000);
                cy.get(commonView.itemsPerPageMenuOptions);
                cy.get(`li > button[data-action="per-page-${items}"]`).click();
                cy.wait(2000);
            }
        });
}

export function expandArticle(name: string): void {
    let value: number;
    if (name === "Suggested adoption plan") {
        value = 2;
    } else {
        value = 3;
    }
    cy.wait(2000);
    // Workaround to make sure if table is displayed or not.
    // If not then click on expand toggle
    cy.get("div.pf-l-stack__item > article")
        .eq(value)
        .then(($article) => {
            if (!$article.hasClass("pf-c-card pf-m-expanded")) {
                cy.wait(2000);
                cy.xpath(
                    `//h3[contains(text(), '${name}')]//ancestor::article//div[@class='pf-c-card__header-toggle']//button/span`
                ).click({ force: true });
            }
        });
}

export function verifyApplicationRisk(risktype: string, appName: string): void {
    // Verifies particular application's risk type
    selectItemsPerPageAdoptionCandidate(100);
    cy.wait(4000);
    cy.get(".pf-c-table > tbody > tr")
        .not(".pf-c-table__expandable-row")
        .each(($ele) => {
            if ($ele.find(`td[data-label="${applicationName}"]`).text() == appName) {
                expect($ele.find(`td[data-label="${risk}"]`).text().toLowerCase()).to.equal(
                    risktype
                );
            }
        });
}
