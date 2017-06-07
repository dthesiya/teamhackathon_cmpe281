Steps to setup Cassandra 3.0.4 Cluster using docker containers
==============================================================

1. fetch cassandra 3.0.4 docker repository using <docker fetch cassandra:3.0.4>

2. create a container using `docker run --name cassandra1 -p 9042:9042 -d cassandra:3.0.4`

3. create second cassandra container using `docker run --name cassandra2 -d -e CASSANDRA_SEEDS="$(docker inspect --format='{{ .NetworkSettings.IPAddress }}' cassandra1)"  cassandra:3.0.4`

4. create third cassandra container using `docker run --name cassandra3 -d -e CASSANDRA_SEEDS="$(docker inspect --format='{{ .NetworkSettings.IPAddress }}' cassandra1),$(docker inspect --format='{{ .NetworkSettings.IPAddress }}' cassandra2)"  cassandra:3.0.4`

5. check the status of cluster nodes using `docker exec -i -t cassandra1 sh -c 'nodetool status'`

6. now all three cassandra instances are in a cluster communicating with each other. So any communication with any single node will result into data synchronization in all three instances(containers in our case).

7. create a cluster of docker containers running on different machines using `docker run --name <container-name> -p 9042:9042 -p 7000:7000 -e CASSANDRA_BROADCAST_ADDRESS=<seed-ip(s)> -e CASSANDRA_SEEDS="<seed-ip(s)>" cassandra:3.0.4`

8. start a kong container using `docker run -d --name kong -e "KONG_DATABASE=cassandra" -e "KONG_CASSANDRA_CONTACT_POINTS=<seed-ip(s)>" -e "KONG_CASSANDRA_CONSISTENCY=LOCAL_QUORUM" -e "KONG_CASSANDRA_REPL_FACTOR=3" -p 8000:8000 -p 8443:8443 -p 8001:8001 -p 7946:7946 -p 7946:7946/udp kong`


<b>P.S. :</b> I bound port 9042 of each container to some external port(which is different in our case because on host port cannot be bound to multiple container ports. If containers are on difference machines the 9042 is fine for every container, but CASSANDRA_SEEDS should be the ip addresses of different container nodes.) in order for external applications(e.g. kong and maybe starbucks itself) to be able to communicate with cassandra cluster nodes.
