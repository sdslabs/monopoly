# **Monopoly**

Dependencies
---

1. [Node.js](https://github.com/joyent/node)

Setting up the server
---

1. Clone the repository:

        $ git clone git@git.sdslabs.co.in:monopoly
        $ cd monopoly

2. Import the `db.schema` from `/schema` to *phpMyAdmin*.
       
3. Update `password.json.template` and rename it to `password.json`. Set `G_MYSQL_USERNAME`, `G_MYSQL_PASSWORD`.

4. Make an entry for `sdslabs.local` in `/etc/hosts`.

5. The server can now be started:

        $ node server.js

6. Visit `sdslabs.local:8080` in browser.

Enabling SSL
---

1. Enable production by uncommenting the code within `Production` header.
2. Add *server certificate* and *server key* to `/ssl`

        $ mkdir ssl
    
3. Update `G_SSL_CERT_PASSPHRASE` (this is the password used to encrypt the server's certificate and private key) in `JSON/password.json`, if applicable.
4. To start the server at port `443`, *root* is needed.

        $ sudo node server.js

Options
---

See configurable options in `JSON/constants.json`. For instance, set `G_IP_ADDR` to `""` for running the server on a local network. Otherwise, `G_IP_ADDR` should *exactly* match the *URL* the server is deployed on.

Default SSL and HTTP ports (`443` and `80` respectively) require the server to be running with *superuser* permissions. 

To change global logging level set `G_SERVER_LOG_LEVEL`. 
To enable full socket level logging, set `G_LOG_CONNECTION_MESSAGES`.
