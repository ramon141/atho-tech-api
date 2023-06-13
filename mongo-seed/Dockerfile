FROM mongo

COPY ./data/User.json /User.json
COPY ./data/Configuration.json /Configuration.json
COPY ./data/Enterprise.json /Enterprise.json
COPY ./data/Kits.json /Kits.json
COPY ./data/Products.json /Products.json

COPY ./seed.sh /seed.sh

RUN chmod +x /seed.sh

CMD ["sh", "-c", "/seed.sh"]
