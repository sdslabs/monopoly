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
       
3. Create a JSON file for passwords. Add `G_MYSQL_USERNAME`, `G_MYSQL_PASSWORD`:

        $ touch JSON/password.json
        $ gedit JSON/password.json

4. Make an entry for `sdslabs.local` in `/etc/hosts`.

5. The server can now be started:

        $ node server.js

6. Visit `sdslabs.local:8080` in browser.

Other
---

See configurable options in `JSON/constants.json`. For instance, set `G_IP_ADDR` to `""` for running the server on a local network. Otherwise, `G_IP_ADDR` should *exactly* match the *URL* the server is deployed on.

Default SSL and HTTP ports (`443` and `80` respectively) require the server to be running with *superuser* permissions. 
