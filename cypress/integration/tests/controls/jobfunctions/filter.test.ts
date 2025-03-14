/// <reference types="cypress" />

import {
    login,
    clickByText,
    exists,
    applySearchFilter,
    hasToBeSkipped,
    createMultipleJobfunctions,
    deleteAllJobfunctions,
    selectUserPerspective,
} from "../../../../utils/utils";
import { navMenu, navTab } from "../../../views/menu.view";
import { controls, jobFunctions, button, name, clearAllFilters } from "../../../types/constants";

import { Jobfunctions } from "../../../models/jobfunctions";
import * as data from "../../../../utils/data_utils";

var jobfunctionsList: Array<Jobfunctions> = [];
var invalidSearchInput = String(data.getRandomNumber());

describe("Job function filter validations", { tags: "@tier2" }, function () {
    before("Login and Create Test Data", function () {
        // Prevent before hook from running, if the tag is excluded from run
        if (hasToBeSkipped("@tier2")) return;

        login();

        // Create multiple job functions
        jobfunctionsList = createMultipleJobfunctions(2);
    });

    after("Perform test data clean up", function () {
        // Prevent before hook from running, if the tag is excluded from run
        if (hasToBeSkipped("@tier2")) return;

        // Delete the job functions
        deleteAllJobfunctions();
    });

    it("Name filter validations", function () {
        selectUserPerspective("Developer");
        clickByText(navMenu, controls);
        clickByText(navTab, jobFunctions);

        // Enter an existing display name substring and assert
        var validSearchInput = jobfunctionsList[0].name.substring(0, 3);
        applySearchFilter(name, validSearchInput);
        exists(jobfunctionsList[0].name);
        clickByText(button, clearAllFilters);

        applySearchFilter(name, jobfunctionsList[1].name);
        exists(jobfunctionsList[1].name);
        clickByText(button, clearAllFilters);

        // Enter a non-existing display name substring and apply it as search filter
        applySearchFilter(name, invalidSearchInput);

        // Assert that no search results are found
        cy.get("h2").contains("No results found");

        clickByText(button, clearAllFilters);
    });
});
