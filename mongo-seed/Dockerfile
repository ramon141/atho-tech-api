FROM mongo

COPY ./data/User.json /User.json

COPY ./seed.sh /seed.sh

RUN chmod +x /seed.sh

CMD ["sh", "-c", "/seed.sh"]
