# Magic Columns

Run locally with:

```
npm i
npm run dev
Note: Run it on localhost:3000 or else API will give CORS error
```

Decisions Made:
• Added functionality to delete Magic Columns.
• Implemented error handling for cases where search returns no results; also added a loading state.
• Introduced filters for minimum and maximum employees, Company Name, and Funding Stage.
• Enabled column sorting by clicking on the column header.
• Combined company website and LinkedIn links into a single cell for better usability.
• Made the Company Name column sticky for easier navigation.
• Added options to open and copy the Signal link.
• Utilized hookstate for managing API calls.
• Used Chakra UI for UI components.

Retrospective:
I’ve focused only on what I know and have experience with—I’m honest about my work and limitations. As a frontend developer, I find tables to be one of the most complex components since they can accommodate endless features. I’ve aimed to keep the frontend as clean and user-friendly as possible. Due to time constraints, I didn’t implement a custom Chakra UI theme.
