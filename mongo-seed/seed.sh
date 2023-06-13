mongoimport --host $IP_DOCKER --db athotech --collection User --type json --file /User.json --jsonArray
mongoimport --host $IP_DOCKER --db athotech --collection Configuration --type json --file /Configuration.json --jsonArray
mongoimport --host $IP_DOCKER --db athotech --collection Enterprise --type json --file /Enterprise.json --jsonArray
mongoimport --host $IP_DOCKER --db athotech --collection Kits --type json --file /Kits.json --jsonArray
mongoimport --host $IP_DOCKER --db athotech --collection Products --type json --file /Products.json --jsonArray