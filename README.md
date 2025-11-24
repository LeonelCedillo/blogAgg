# How to run the CLI:


## Requirements:

1. Install *NVM* and run:<br>
    `nvm use`
    The project’s *.nvmrc* specifies Node v22.15.0.

3. Install Node dependencies:<br>
    `npm install`<br>
    

## Config FIle (part 1):

1. Create a config file in your home directory, *~/.gatorconfig.json*, with the following content:
    ```javascript
    {
        "db_url": "postgres://restOfConnectionString"
    }
    ```
    > This file will store your database connection credentials for the PostgreSQL database and the currently logged-in user.
    >It will have this structure:
       >  ```javascript
>         {
>             "db_url": "connection_string_goes_here",
>             "current_user_name": "username_goes_here"
>         }
>         ```


## Database ():
### Install and Run Postgres 16+
>     [PostgreSQL](https://www.postgresql.org/), database and server. The default network port that Postgres listens on is :5432. To interact with Postgres, install the server and start it. Then, you can connect to it using a client like [psql](https://www.postgresql.org/docs/current/app-psql.html#:~:text=psql%20is%20a%20terminal%2Dbased,or%20from%20command%20line%20arguments.) or [PGAdmin](https://www.pgadmin.org/).

1. Install Postgres.
**macOS** with [brew](https://brew.sh/)
`brew install postgresql@16`

**Linux / WSL (Debian)**. ([Docs from Microsoft](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-database#install-postgresql)):
`sudo apt update`<br>
`sudo apt install postgresql postgresql-contrib`

> Confirm installation (version 16+):<br>
> `psql --version`

2. (Optional, Linux) set the Postgres *system* user password:<br>
`sudo passwd postgres`<br>

4. Start the Postgres server in the background:<br>
**Mac:** `brew services start postgresql@16`<br>
**Linux:** `sudo service postgresql start`<br>

5. Connect to the server:
> *psql* it's the "default" client for Postgres and a great way to interact with the database. Or, use a GUI like [PGAdmin](https://www.pgadmin.org/).

Enter the *psql* shell (`postgres=#`):<br>
**Mac:** `psql postgres`<br>
**Linux / WSL:** `sudo -u postgres psql`<br>

6. Create and connect the database (e.g. *gator*):<br>
`CREATE DATABASE gator;`<br>
`\c gator`<br>
> result prompt: `gator=#`

8. (Optional, Linux): set the Postgres **database** user password:
`ALTER USER postgres PASSWORD 'postgres';`<br>


## Config File (part 2):

1. Get your connection string *(psql format)*<br>
(URL with all of the information needed to connect to a database).
`protocol://username:password@host:port/database`
> Examples:
> macOS (no password, your username): 
    > postgres://myUserName:@localhost:5432/gator
> Linux (password: postgres , user: postgres): 
    > postgres://postgres:postgres@localhost:5432/gator

2. Test your connection string, for example:
`psql "postgres://username:@localhost:5432/gator"`

3. Add the connection string to the *.gatorconfig.json* file:
> In the config file it needs an additional `sslmode=disable` query string.
`protocol://username:password@host:port/database?sslmode=disable`


## Run Migrations (Drizzle ORM):

> The migration files are already included in the repository.
1. Apply them to your local Postgres database:
`npm run migrate` 
> (script wired to npx drizzle-kit migrate)
> This will create the required tables before running the CLI.


## CLI Usage:

1. Run the CLI:
    `npm run start`
    > Usage format: cli `command` `[args...]`
    > Example: `npm run start register alice`


## Commands:

2. Register a user<br>
    `register <username>`

3. Login
    `login <username>`

4. Reset/Delete all users
    `reset`

5. List all users
    `users`

6. Aggregate (Fetch feeds every certain time)
    `agg <time_between_reqs (e.g.: 15s, 5m, 1h, etc.)>`
    Shows posts for each feed.

7. Add a Feed
    `addfeed <feed_name> <feed_url>`

8. List all feeds
    `feeds`

9. Follow a feed
    `follow <feed_url>`

10. List feeds followed by the current user
    `following`

11. Unfollow a feed
    `unfollow <feed_url>`

12. Browse posts for the current user
    `browse <limit>`
