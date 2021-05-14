/// <reference types="cypress" />

import { login, clickByText, inputText, submitForm } from "../../../../utils/utils";
import { navMenu, navTab } from "../../../views/menu.view";
import {
    controls,
    stakeholdergroups,
    button,
    nameUniqueWarning,
    nameLeastChars,
    nameMaxChars,
    descriptionMaxChars,
    createNewButton,
} from "../../../types/constants";
import {
    stakeholdergroupNameInput,
    stakeholdergroupNameHelper,
    stakeholdergroupDescriptionInput,
    stakeholdergroupDescriptionHelper,
} from "../../../views/stakeholdergroups.view";
import { Stakeholdergroups } from "../../../models/stakeholdergroups";

import * as commonView from "../../../../integration/views/commoncontrols.view";
import * as faker from "faker";

describe("Basic checks while creating stakeholder groups", () => {
    const stakeholdergroup = new Stakeholdergroups();

    beforeEach("Login", function () {
        // Perform login
        login();
    });

    it("Stakeholder name and description contraints check", function () {
        // Navigate to "New stakeholder group" page
        clickByText(navMenu, controls);
        clickByText(navTab, stakeholdergroups);
        clickByText(button, createNewButton);
        // Check "Create" and "Cancel" button status
        cy.get(commonView.submitButton).should("be.disabled");
        cy.get(commonView.cancelButton).should("not.be.disabled");

        // Name constraints
        inputText(stakeholdergroupNameInput, "te");
        cy.get(stakeholdergroupNameHelper).should("contain", nameLeastChars);
        inputText(stakeholdergroupNameInput, faker.random.words(50));
        cy.get(stakeholdergroupNameHelper).should("contain", nameMaxChars);
        inputText(stakeholdergroupNameInput, "test");
        cy.get(commonView.submitButton).should("not.be.disabled");

        // Description constraints
        inputText(stakeholdergroupDescriptionInput, faker.random.words(120));
        cy.get(stakeholdergroupDescriptionHelper).should("contain", descriptionMaxChars);
    });

    it("Cancel and close on stakholder group creation", function () {
        // Navigate to "New stakeholder group" page
        clickByText(navMenu, controls);
        clickByText(navTab, stakeholdergroups);
        clickByText(button, createNewButton);
        // Cancel creating stakeholder group
        cy.get(commonView.cancelButton).click();
        cy.wait(100);

        clickByText(button, createNewButton);

        // Close create stakeholder group page
        cy.get(commonView.closeButton).click();
        cy.wait(100);

        // Asserting stakholder groups page
        cy.contains(button, createNewButton).should("exist");
    });

    it("Stakeholder group name must unique", function () {
        stakeholdergroup.create();

        // Navigate to "New stakeholder group" page
        clickByText(button, createNewButton);

        // Check Name duplication
        inputText(stakeholdergroupNameInput, stakeholdergroup.stakeholdergroupName);

        submitForm();

        cy.get(commonView.duplicateNameWarning).should("contain.text", nameUniqueWarning);

        // Delete created stakeholder group
        cy.get(commonView.closeButton).click();
        stakeholdergroup.delete();
    });
});