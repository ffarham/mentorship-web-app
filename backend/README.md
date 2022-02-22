# Server Side

## Start-up
- `yarn install` (on initial start-up)
- `yarn start`

## Initialise database
- `psql -U postgres`
- `\i database/schema.sql`

# If yarn gives a 'not digitally signed` error
- `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` (current session only)
