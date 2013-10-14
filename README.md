# **Monopoly**

Setting up the server
====

1. Clone the repository

       $ git clone git@git.sdslabs.co.in:monopoly
       $ cd monopoly\

2. Create a SSL folder
    
       $ mkdir ssl 
Put SSL key and certificate (.pem) in this (ssl) folder (**not necessary for development**).

3. Update the SSL key and certificate filenames in the constants file
       
       $ nano JSON/constants.json
       
4. Create a JSON file for passwords. Add G_MYSQL_USERNAME, G_MYSQL_PASSWORD and G_SSL_CERT_PASSPHRASE.

        $ JSON/touch password.json
        $ gedit password.json
      
5. Import the db.schema from /schema to MySQL server.

6. Update the G_DOMAIN_NAME and G_SERVER_PORT in constants file.
        
        $ nano JSON/constants.js
        
7. This would need a corrosponding update to socket.io path in index.html.
        
        $ gedit ../public/index.html

8. The server can now be started.

        $ sudo node server.js
   Root is needed as the server uses default SSL port (443).
