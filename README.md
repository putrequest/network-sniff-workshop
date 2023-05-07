# Workshops

Workshops will be consisting of capturing sensitive data from a `tcpdump` sample of network traffic. The sensitive data captured includes:

- Login credentials (Passwords and Usernames)
- Credit Card Numbers
- ID Photos

## Objective

The objective of the workshop is:

- Obtaining Credit Card Numbers of three users (using Websocket analysis on wireshark)
- Obtaining ID photos of three users (having decoded images from base64 in a POST request payload data)
- Obtaining Passwords and Usernames of five users
    - using some of them to receive a new photo from the website hosted at localhost:3000

## Setup

The virtual machine needs to have `docker compose`, `wireshark` and `git` installed on the system.

### Clone the repository

```
git clone https://github.com/putrequest/network-sniff-workshop && cd network-sniff-workshop
```

### Build & Seed

The dockerized version in polish or english (make sure the user is in the `docker` group). To build for the polish version:

```
LANGUAGE=pl docker compose -f docker-compose.unsecure.yml up -d
```

For the english version:

```
LANGUAGE=en docker compose -f docker-compose.unsecure.en.yml up -d
```

Then seed the database using:

```
docker compose -f docker-compose.unsecure.yml exec db sh /data/seed.sh
```

Then wait for some bit (you can use `docker compose -f docker-compose.unsecure.yml logs -f`) to make sure that the service is up and running. The website should be available locally at `localhost:3000`.

### Docs

The docs for the workshop in Polish and English can be found at the `docs` folder. This includes the speaker presentation as well as the workshop presentation and the workshop instructions for the user.
