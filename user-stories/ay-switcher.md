- ui selector
- default AY - define in client app


All the necessary components for assessment year functionality are already in place. The implementation follows a clean architecture:
- The assessment year is stored in localStorage and provided through a context
- Changing the assessment year reloads the app to ensure all components update
- Documents are associated with a specific assessment year in the database
- The UI displays the current assessment year and allows users to change it
- API calls include the assessment year for filtering and organization