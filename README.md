## teamhackathon_cmpe281
CMPE281 SPRING 2017 team hackathon content

## PURPOSE OF PROJECT

To create an application interacting with multiple servers through kong gateway.


## HOW TO START THIS APPLICATION

1. Create a cassandra node(or a 3 node cluster in our case) per server.

2. Create appropriate schema(s) in respective nodes(or clusters).

2. Setup backend servers communicating with respective cassandra nodes(or clusters).

3. Setup a cassandra node(or a 3 node cluster in our case) which is to be used by kong.

4. Setup kong and configure it with appropriate apis redirecting to respective servers.

5. Deploy web application(portal) on Heroku PaaS platfor which will be communicating with kong.


## License

This application is released under the [GNU General Public License v3.0](https://github.com/dthesiya/teamhackathon_cmpe281/blob/master/LICENSE).


## Team QuadCore

> [Apoorv Mehta](https://github.com/appsmehta)

> [Darshit Thesiya](https://github.com/dthesiya)

> [Tanmay Bhatt](https://github.com/TanmayAB)

> [Vikas Miyani](https://github.com/vikasmiyani)

