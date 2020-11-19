# Referral Service

Serves as a referral service.

## Installation

To run locally use `npm install` to install all dependencies.

## Terminology
* broker: is the person who creates and/or shares the promocode.
* guest: is the person who is shared the promocode with, and introduces it when signing up

## Features
1. A broker can generate a six long alphanumeric promocode
2. A guest can introduce this code when signing up
3. The broker gets a reward when guest introduces the promocode
4. Reward amount and reward currency can be changed anytime
5. A ranking of brokers can be retrieved
6. How many times a promocode has been used can be retrieved
7. How much money a broker has won so far can be retrieved
8. General stats can be retrieved


## System
The referral process consists of tho models, Referral model and Reward Model
1. The Reward model: It stores the curreny and amount. We can store as many docs as we want in the collectons, but just one will be active, that is, just one will be used at a time
2. The Referral model: It stores de referral data, like the promocode creation date etc

An api has been created to update, getAll, get, create an delete any referral and reward

The promocode will be 6 char long and alphanumeric. Has at about 50^6 posible conbinations so the chance of generating the same code is almost null. Anyway, everytime a promocode is created, it checks if it already exists and then creates another one if so. This process is repeated up 
to 5 times, then if no success, an error is thrown.


## Flow process
1. A broker can generate a promocode from the app. When the user does this, a referral document will be created on Referral Collection, and it is already expected a reward document to already exists
2. Then, the broker can look up for its promococe and share it
3. When the guest introduces the shared promocode, it will be verified against referrals documents (promodoce is indexed)
4. If promodoce is valid, the payment executes automatically from mueve to broker (separate steps for security)

## Next Release
1. ~~The transfers are not executed automatically. They will be created and put on hold (pending state), so that they can be approved all at once
from the admin panel~~
2. Security issues, like not updating the whole object passed on as parameter, but the only no sensible params when posible
3. promoCode should be encrypted and decripted using broker id as hash. To avoid hacking
3. when sending all transfers at once, make it through a throtle, that way we can send all transfers in paralel
4. refactor makeTransfer handler










