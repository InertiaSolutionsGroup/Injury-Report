# Injury Reporting / Boo-Boo Report Application

This application provides a web-based solution for documenting and managing child injuries within a childcare center. It streamlines the process of creating, validating, and reviewing injury reports with AI assistance.

## Features

- **Teacher Form**: Allows teachers to document injury details with AI-assisted validation and suggestions
- **Front Desk View**: Enables front desk staff to view submitted reports and track their status
- **Memo Generation**: Automatically generates professional, parent-friendly "Boo-Boo Report" memos
- **Status Management**: Tracks review and delivery status of each report

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: n8n webhook endpoints for validation and memo generation

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- Supabase project created
- n8n instance with configured workflows for validation and memo generation

### Configuration

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables by updating the `.env` file with your Supabase and n8n webhook URLs:
   ```
   REACT_APP_SUPABASE_URL=your-supabase-project-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   REACT_APP_VALIDATION_WEBHOOK_URL=your-n8n-validation-webhook-url
   REACT_APP_MEMO_GENERATION_WEBHOOK_URL=your-n8n-memo-generation-webhook-url
   ```
4. Set up the Supabase database by executing the SQL script in `supabase/schema.sql`
5. Populate sample data for `Children` and `Users` tables via the Supabase UI

### Running the Application

```
npm start
```

This runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```
npm run build
```

This builds the app for production to the `build` folder.

## Application Flow

1. **Teacher**: Selects their name, fills out injury details, and submits for AI validation
2. **AI Validation**: Provides suggestions for improving the report quality
3. **Teacher**: Accepts suggestions or edits manually before final submission
4. **Front Desk**: Views submitted reports and selects one to review
5. **AI Memo Generation**: Creates a polished memo summarizing the incident
6. **Front Desk**: Reviews the memo and marks it as reviewed/delivered to parents

## Database Schema

The application uses three main tables:
- `Children`: Stores information about children
- `Users`: Stores information about teachers and front desk staff
- `InjuryReports`: Stores all injury report data including status tracking

## Original Create React App Documentation

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
