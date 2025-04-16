<!--
Last updated: 2025-04-15 20:26 EDT
NOTE: Update this timestamp whenever the document is updated.
-->

# Injury Reporting App — Quick Reference

## Starting & Stopping the Development Server

### Start the Server
```
npm start
```
- Runs the app in development mode at [http://localhost:3000](http://localhost:3000)
- Open this URL in your browser to use the app.

### Stop the Server
- Press `Ctrl + C` in the terminal where the server is running.

### Kill the Server (if stuck)
```
npx kill-port 3000
```
- Frees up port 3000 if the app didn’t shut down cleanly.

---

## Making a Git Backup
```
git add .
git commit -m "<your message>"
git tag <optional-tag>
```
- Use a descriptive commit message and tag before major changes.

---

## Refactoring Components
- Extract UI sections into new files in `src/components/` or subfolders.
- Keep state and logic in the parent component when splitting.
- Use TypeScript for all new components.

---

## Running and Interpreting Tests
- Run all tests: `npm test -- --watchAll=false`
- Test files live alongside components as `ComponentName.test.tsx`
- If tests fail due to missing imports or API mocks, see comments in test files for how to mock dependencies.

---

## General Tips
- Use `npm run build` to create a production build.
- Use `npm test` to run tests.
- For dependency changes, update `package.json` and run `npm install`.
- Keep all documentation in the `docs/` folder for clarity.

---

For more details, see the other docs or ask for specific workflow help!
