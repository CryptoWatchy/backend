#!/bin/bash
echo "Clearing the database..."

# Debugging: Print environment variables to verify they are being passed
echo "POSTGRES_USER: $POSTGRES_USER"
echo "POSTGRES_DB: $POSTGRES_DB"
echo "PG_HOST: $PG_HOST"
echo "PG_PASSWORD: $PG_PASSWORD"  # Debugging: Verify PG_PASSWORD is set

# Execute the SQL command to clear the database, passing the password
PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USER -d $POSTGRES_DB -h $POSTGRES_HOST -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
