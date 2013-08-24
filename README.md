Instructions to set up the server:
============
1. Clone the repo:

    $ git clone git@github.com:jayant1992/Monopoly.git

2. Create the folder directory and create SSL folder
    $cd monopoly
    $mkdir ssl

3. Generate and put your SSL key and certificates into /ssl folder

4. Update the ssl ca key and certificate filenames in constants.json file
    $ cd JSON
    $ gedit constants.json

5. Create a JSON file for passwords
    $ touch password.json
    $ gedit password.json
This needs G_MYSQL_USERNAME, G_MYSQL_PASSWORD and G_SSL_CERT_PASSPHRASE in JSON format.

6. Import the db.schema from /schema to MySQL server.

7. [OPTIONAL] Update the G_DOMAIN_NAME and G_SERVER_PORT in constants file
    $ gedit constants.js
This would need a corrosponding update to socket.io path in index.html.
    $gedit ../public/index.html

8. Start the server by:
    $ cd ..
    $ sudo node server.js