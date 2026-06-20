# MediAssist AI Test Implementation Todo

## Status

- [x] Create a refined test plan in `REFINED_TEST_PLAN.md`
- [ ] Add stable `data-testid` selectors to frontend login and register pages
- [ ] Fix register submit button test IDs for both step 1 and step 2
- [ ] Update Selenium page objects to use stable selectors
- [ ] Replace placeholder-based XPath selectors in page objects
- [ ] Implement explicit login validation tests and URL assertions
- [ ] Implement explicit registration validation tests and account creation flow
- [ ] Complete empty test classes for symptom analyzer, chat, medicine, hospital, report
- [ ] Replace `Thread.sleep()` with explicit waits in tests
- [ ] Save progress and update todo file with completed subtasks

## Notes

- Keep Page Object Model intact.
- Use real navigation to `/login` and `/register`.
- Use realistic test data for names, email, and passwords.
- Validate actual form errors rather than only URL state.
