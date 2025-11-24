# How to run the CLI:


## Requirements:

1. Install *NVM* and run:<br>
    `nvm use`<br>
    The project’s *.nvmrc* specifies Node v22.15.0.

3. Install Node dependencies:<br>
    `npm install`<br>
    

## Config File (part 1):

1. Create a config file in your home directory, `~/.gatorconfig.json`, with the following content:
    ```javascript
    {
        "db_url": "connection_string_will_go_here",
        "current_user_name": "username_will_go_here"
    }
    ```
    > This file will store your database connection credentials for the PostgreSQL database and the currently logged-in user.
    

## Database Setup (PostgreSQL):

1. Install Postgres:<br>
    **macOS** with [brew](https://brew.sh/):<br>
    `brew install postgresql@16`<br>
    **Linux/WSL (Debian)**. ([Docs from Microsoft](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-database#install-postgresql)):<br>
    `sudo apt update`<br>
    `sudo apt install postgresql postgresql-contrib`<br>
    Confirm installation (version 16+):<br> 
    `psql --version`

2. (Optional, Linux) set the Postgres **system** user password:<br>
    `sudo passwd postgres`<br>

4. Start the Postgres server:<br>
    **Mac:** `brew services start postgresql@16`<br>
    **Linux/WSL:** `sudo service postgresql start`<br>

5. Connect to the server:
    **Mac:** `psql postgres`<br>
    **Linux/WSL:** `sudo -u postgres psql`<br>
    > You will enter the *psql* shell (`postgres=#`). *psql* it's the "default" client for Postgres and a great way to interact with the database. Or, use a GUI like [PGAdmin](https://www.pgadmin.org/).

6. Create and connect the database (example: *gator*):<br>
    `CREATE DATABASE gator;`<br>
    `\c gator`<br>
    > You should see: `gator=#`

8. (Optional, Linux): set the Postgres **database** user password:
    `ALTER USER postgres PASSWORD 'postgres';`<br>


## Config File (part 2):

1. Get your connection string:<br>
`protocol://username:password@host:port/database`<br>
> The URL with all of the information needed to connect to a database.<br>
> The default network port that Postgres listens on is: 5432.<br>
> Examples:<br>
> **macOS** (no password, your username):<br>
    > `postgres://myUserName:@localhost:5432/gator`<br>
> **Linux** (password: postgres , user: postgres):<br>
    > `postgres://postgres:postgres@localhost:5432/gator`

2. Test your connection string, for example:<br>
    `psql "postgres://username:@localhost:5432/gator"`

3. Add the connection string to the `.gatorconfig.json` file:<br>
    `protocol://username:password@host:port/database?sslmode=disable`<br>
    > In the config file it needs an additional `sslmode=disable` query string than the psql format.


## Run Migrations:

1. Apply them to your local Postgres database:<br>
    `npm run migrate`<br>
    > The migration files are already included in the repository.<br>The migrate script wired to `npx drizzle-kit migrate` will create the required tables before running the CLI.


## CLI Usage:

1. Run the CLI:<br>
    `npm run start`<br>
    > Usage format: cli `command` `[args...]`<br>
    > Example: `npm run start register alice`


## Commands:

2. Register a user:<br>
    `register <username>`

3. Login:<br>
    `login <username>`

4. Reset/Delete all users:<br>
    `reset`

5. List all users:<br>
    `users`

6. Aggregate (Fetch feeds every certain time):<br>
    `agg <time_between_reqs (e.g.: 15s, 5m, 1h, etc.)>`<br>
    Shows posts for each feed.

7. Add a Feed:<br>
    `addfeed <feed_name> <feed_url>`

8. List all feeds:<br>
    `feeds`

9. Follow a feed:<br>
    `follow <feed_url>`

10. List feeds followed by the current user:<br>
    `following`

11. Unfollow a feed:<br>
    `unfollow <feed_url>`

12. Browse posts for the current user:<br>
    `browse <limit>`
