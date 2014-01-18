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

Options
---

See configurable options in `JSON/constants.json`. For instance, set `G_IP_ADDR` to `""` for running the server on a local network. Otherwise, `G_IP_ADDR` should *exactly* match the *URL* the server is deployed on.

Default SSL and HTTP ports (`443` and `80` respectively) require the server to be running with *superuser* permissions. 

Rules
===

Elements
----
1. Based on IITR Map containing all/most IITR buildings.
2. Non circular/rectangular map with boundaries.
4. **Properties** All locations at IITR. For optimization, some buildings very close to each other are omitted.
5. No Roads (these complicate the map too much).

Banking Rules
----
1. ***Objective***: To become the wealthiest player through buying, renting and selling of property.
2. Each player receives an intital amount.
3. Each player moves a random number of steps, in directions allowed by his current position on the map).
4. If the player lands on an unowned property, he may buy it for the price listed on that property's space. If he agrees to buy it, he pays the Bank the amount shown on the property space and receives that property.
6. If the player lands on his or her own property, or on property which is owned by another player but currently mortgaged, nothing happens.
7. If a player path passes through property owned by other players, he would still need to pay them. 
11. Players may not loan money to other players, only the bank can loan money, and then only by mortgaging properties.
13. (DOUBT) If a player lands on property and refuses to buy it the others may bid on the property. The player with the highest bid gets the property.
14. (PLANNED) Properties are arranged in "color groups" of two or three properties. Once a player owns all properties of a color group (a monopoly), the rent is doubled on all unimproved lots of that color group, even if some of the properties are mortgaged to the Bank.
15. (PLANNED) The player may purchase either investments (see above) for those properties (as long as none of the properties of that color group are mortgaged to the bank), which raise the rents that must be paid when other players land on the property. In addition, investments can be small or big (the big allowed after all the small ones are complete).
5. (LATER) If the player lands on an unmortgaged property owned by another player, he pays rent to that person, as depending on the property.
7. (LATER) If the player lands on Income Tax he must pay the Bank either a specific amount of money (income tax, based on his current assets), or some of his total assets
8. (LATER) If the player lands a on Chance or Community Chest, the player takes a card from the top of the respective pack and performs the instruction given on the card.
9. (LATER) If the player lands on the Jail space, he is "Just Visiting" and does nothing. No penalty applies. But if the player lands on the Go to Jail square (designated spot(s)), he must move his token directly to Jail. 
12. (LATER) A player in jail remains there until he opts to pay a bailout amount (on his turn to the bank.

Movement Rules
----
1. Each player randomly starts from a Go space (starting point). The server itself acts as Banker.
2. For one move, a player can make a choice to go to any available location based on current location. For multiple moves, this is repeated and path is generated.
4. Choice element. There are multiple paths which gives you a choice when moving, unlike monopoly, where only the number on the die decides where you go.
5. Boundaries are enforced wherever applicable.

Additional Ideas
----
1. (DOUBT) **Fog of war** You can only see the properties associated with the square you are on (and which is unmortgaged). Buying streets removes fog of war. Makes the game much more strategic.
2. (DOUBT) Spies, Reveal Map etc which allows you to view a given area of the map, or track enemy movement for a turn or two.
3. (POSSIBLE) Properties which generate income per turn, without needing the enemy player to have to come to that property. Generated income will always be less than rent income.

Miscellaneous
----
1. (PLANNED) **Leaderboard system** Every game gives you certain ranking points based on the money you accumulated and other factors. 
2. (PLANNED) ***Save game/load game*** A player might get disconnected due to connection problems. Basically, when a player leaves, the remaining players have an option to save the game and play it later or the now vacant properties are returned to the bank/auctioned/removed from map (not streets). 
3. (LATER) **Game modes** With different gameplay and victory conditions like
***Quick Conquest*** with limited number of turns where player with most money after the turns run out wins, or ***Professional*** where the first one to buy a certain number of properties wins.
