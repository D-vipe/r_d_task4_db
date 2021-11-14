# r_d_task4_db
add database connection to existing project

# Steps to start project (use terminal)
1. yarn install
2. Creating DataBase and user
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
    # type \q to exit commannd line
3. create .env file and copy data from env_example. User credentials for user and password above
# run migrations
4. sequelize db:migrate
# seed db
5. sequelize db:seed:all
6. npm start (or if using VScode open Explorer. At the bottom of the side panel you can find NPM SCRIPTS section. Toggle it and press "start")
7. to authorize login: admin, password: gogo123 (admin auth)
