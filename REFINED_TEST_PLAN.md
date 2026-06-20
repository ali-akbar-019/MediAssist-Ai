# MediAssist AI Testing Improvement Plan

## Goal

Improve the existing Selenium POM test suite so the tests:

- use real page navigation instead of bypassing the app flow
- validate UI form behavior, not just URL changes
- use stable selectors such as `data-testid`
- cover login and registration validation rules properly
- align with the current frontend pages and fields
- keep the POM structure intact while fixing brittle locators and empty test files

## Current state

- Frontend pages exist in `frontend/src/pages` for `Login` and `Register`
- Existing Selenium tests are in `D:\eclipse-workspace\MediAssistAi\src\test\java`
- `LoginPage.java` and `RegisterPage.java` are partially implemented
- Many test classes are empty
- Registration flow depends on placeholder-based selectors and weak assertions
- Login tests allow invalid logins to pass due to missing field validation checks
- Some test cases use `Thread.sleep(...)` instead of robust waits

## Plan

### 1. Add stable selectors to the frontend

Add `data-testid` attributes to the login/register forms and interactive elements in `frontend/src/pages`:

- Login page:
  - `data-testid="login-email"`
  - `data-testid="login-password"`
  - `data-testid="login-submit"`
  - `data-testid="login-error"`
- Register page step 1:
  - `data-testid="register-name"`
  - `data-testid="register-email"`
  - `data-testid="register-password"`
  - `data-testid="register-continue"`
- Register page step 2:
  - `data-testid="register-age"`
  - `data-testid="register-gender-trigger"`
  - `data-testid="register-bloodgroup-trigger"`
  - `data-testid="register-create"`
  - `data-testid="register-step-error"` (if validation appears)
- Ensure the `Select` dropdown options also include stable `data-testid` values:
  - `data-testid="gender-option-Male"`
  - `data-testid="gender-option-Female"`
  - `data-testid="gender-option-Other"`
  - `data-testid="bloodgroup-option-O+"`
  - other blood groups as needed

### 2. Improve page objects in the test suite

Update the current page object classes to use the new test IDs and reduce brittle XPath selectors.

- Use `@FindBy(css = "[data-testid='...']")` where possible
- Keep methods expressive and reusable:
  - `enterEmail`, `enterPassword`, `clickLogin`
  - `enterName`, `enterEmail`, `enterPassword`, `clickContinue`
  - `selectGender`, `selectBloodGroup`, `clickCreateAccount`
- Add methods to explicitly open real pages when needed:
  - `navigateToLoginPage()`
  - `navigateToRegisterPage()`

### 3. Make validation tests explicit and real

Refine login and registration test cases to assert actual validation behavior and field errors.

- Login tests should verify:
  - missing email shows `Email is required`
  - invalid email shows `Please enter a valid email`
  - missing password shows `Password is required`
  - invalid credentials show an error alert and do not go to dashboard
  - valid credentials navigate to `/dashboard`
- Register tests should verify:
  - missing name/email/password stays on registration step 1 and shows proper errors
  - invalid email does not continue to step 2
  - weak password does not continue to step 2
  - numeric-only or too-short name does not continue
  - valid input continues to step 2
  - optional profile data can be filled or skipped correctly
  - after successful create account, user moves away from `/register`
- Add assertions that actual validation messages appear on the page.

### 4. Add missing test case classes and page objects

Complete the empty test files in `src/test/java/testCases`:

- `TC_003_SymptomAnalyzerTest.java`
- `TC_004_ChatTest.java`
- `TC_005_MedicineTest.java`
- `TC_006_HospitalTest.java`
- `TC_007_ReportTest.java`

These should at minimum:

- instantiate page objects
- navigate to the correct frontend route
- assert key page elements or feature behavior
- be built using the same POM pattern as login/register

### 5. Replace brittle waits with explicit synchronization

Remove or reduce `Thread.sleep()` from tests.

- Use explicit waits or Selenium `WebDriverWait` for:
  - error message visibility
  - button clickability
  - URL changes
  - page element presence
- Keep `BaseClass` unchanged except for possible utility additions if needed

### 6. Ensure real page flow in tests

Tests must navigate through actual pages, not bypass them.

- Use the URL from `config.properties` and the application route paths
- For login tests: open login page, fill login form, submit, assert result
- For register tests: open registration page, complete step 1 and/or step 2, assert navigation
- If the app uses React Router, use routes like `/login`, `/register`, `/dashboard` explicitly in tests

### 7. Validate data assumptions and real user constraints

Because this is a medical application, tests must not use obviously invalid data like `123` for name/email.

- Use realistic test data for name, email, and password
- Use strong password values that match frontend validation
- Make sure `Test@12345` is treated as valid by validation rules
- Add negative tests for incorrect formats and weak credentials

### 8. Document selector and route mapping

Create a stable selector reference in the test plan or code comments so future testers understand the POM mapping.

- Example mapping:
  - `LoginPage.emailInput = [data-testid='login-email']`
  - `RegisterPage.nameInput = [data-testid='register-name']`

## Deliverables

1. `REFINED_TEST_PLAN.md` (this document) in the `mediassist-ai` root folder
2. Updated frontend `Login.tsx` and `Register.tsx` with stable `data-testid` values
3. Updated `LoginPage.java` and `RegisterPage.java` using `data-testid` selectors
4. Completed `TC_003_*` through `TC_007_*` test classes with real page navigation and validation assertions
5. Reduced or removed `Thread.sleep()` in favor of explicit waits
6. Improved test coverage for login and registration form validation

## Next steps

1. Update frontend elements with `data-testid`
2. Update page objects to use those selectors
3. Refactor login/register tests to validate error messages and page flow
4. Complete the empty feature test classes with a minimum smoke coverage
5. Run the full test suite and fix any selector or navigation issues

## Notes

- Keep the Page Object Model intact: tests should interact only through page object methods, not raw driver calls.
- Do not use placeholder-based XPath selectors for the main form fields.
- Use actual navigation to pages where the routes exist, not direct URL injection of protected pages.
- Prioritize form validation and realistic data over quick acceptance.
