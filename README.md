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

Options
---

See configurable options in `JSON/constants.json`. For instance, set `G_IP_ADDR` to `""` for running the server on a local network. Otherwise, `G_IP_ADDR` should *exactly* match the *URL* the server is deployed on.

Default SSL and HTTP ports (`443` and `80` respectively) require the server to be running with *superuser* permissions. 

For *production*, SSL has to enabled. Add server certificate and key to `/ssl` and update `constant.json` and `password.json`.
