# r_d_task4_db
add database connection to existing project

# Install dependencies
1. yarn install
<!-- 2. Creating DataBase and user
    2.1. sudo -u <youruser> createuser express_admin
    2.2. sudo -u <youruser> createdb dev_db
    # if you OS doesn't support commands above, enter psql command line and type:
    CREATE DATABASE dev_db;
    CREATE USER express_admin WITH ENCRYPTED PASSWORD 's3cr3tpass';
    GRANT ALL PRIVILEGES ON DATABASE dev_db TO express_admin;

    # Enter psql command line
    2.3 psql postgres
    2.4 ALTER ROLE express_admin WITH SUPERUSER;
    2.5 GRANT ALL PRIVILEGES ON DATABASE dev_db TO express_admin;
    # add password to express_admin user
    2.6 ALTER USER express_admin WITH ENCRYPTED PASSWORD 's3cr3tpass'
    # type \q to exit commannd line -->
# Prepare mongoDb (assuming it is installed locally)
1. mongosh (to access shell)
2. use test (create db if it doesn't exist or switch to existing test db)
3. db.testDb.insert({some_key: "some_value"}); (to create testDb table)
4. db.createUser(
  {
    user: "@yaroslav@smoothr.de",
    pwd: "test",
    roles: [ { role: "readWrite", db: "test" } ]}); (create new user)
5. create .env file and copy data from env_example. User credentials for user and password above
6. db.testDb (create admin user to have access to admin panel)
7. node app/seeder.mongo.js (seed collection with test data)

<!-- # run migrations
4. sequelize db:migrate -->
<!-- # seed db
5. sequelize db:seed:all -->

# Starting app and authorizing
1. npm run start_dev (or if using VScode open Explorer. At the bottom of the side panel you can find NPM SCRIPTS section. Toggle it and press "start_dev")
2. to authorize login: admin@admin.ru, password: gogo123 (admin auth)

# Swagger info
1. swagger documentation is available at http://localhost:3000/docs
