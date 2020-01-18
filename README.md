# realestate
hyperledger project


	README

## RealEstate
	RealEstate is an application for selling and buying of villas in hyperledger sawtooth

## Introduction
	RealEstate is an application which is created in BlockChain network using Sawtooth SDK for selling and buying the appropriate villas.
Hyperledger Sawtooth supports to create a permissioned(private) network which allows parallel Transaction execution in a secure,immutable,
and tracble way permissioning enabled.This example demonstrates a simple usecase,add the villas which is ready to be sale
and a Registerar could validate the details and give the permission for the approval of the selling and buying villa.The villa details 
table display all details of each available villas and the Buyer could view the table and go for the villa which is he/she were wish to buy.
There are a login page for the Seller,Buyer,validator(registrarer)for login to the application.

   1. Seller      :can add the villa details 
   2. Registerar :can validate the details
   3. Buyer       :can view and buy the villa

  ## Add villa
            The Seller would be signing  to the Transaction using the privatekey.
    The Seller is responsible for adding,deleting the villa details and using the fields adhaar,houseno,ownername,
    squreft,price..etc
    
   ## Validation
            The Registerar are responsible for the Validation of the villa details.There should be a login for
             registerar , who is allowed to validate the details entered by the seller. 

    ## Buy villa
            The buyer is anyone who can view the villa details go for buy the requied villa

 ## Addressing 
        The addressing scheme used here is 
        * a 6-hex character prefix (the )



##Setting up

1. Build and start the Docker containers:
    Start the pre-built Docker containers in docker-compose.yaml file, located in RealEstate directory:

    `cd RealEstate`
    
    `sudo docker-compose up`
    
2. Open a new browser and go to `http://localhost:3000`

3. Enter the privatekey for login, thats given in samplekeys.Then the main home page will appears.
4. In the navigation part there is Seller,Buyer and validator
5. click on seller , there will appear a form for add new villa and it will list out in viewasset page
6. while clicking buyer ,who can buy the villa using housenumber.
7. validator who validate the seller and his properties


8. To stop the validator and destroy the containers, type `^c` in the docker-compose window, wait for it to stop, then give the command

    `sudo docker-compose down`


    ## Permisions

1. Add identity-tp into the docker-compose.yaml file.
2. `sudo docker-compose up`
3. `sudo docker exec -it validator bash`
4. In the validator container create two keys for manufacture and testing authority
* `sawtooth keygen manufacture`
*  `sawtooth keygen tester`
5. Add my_key.pub to the list of allowed keys.
* ` sawset   proposal   create   --key   ~/.sawtooth/keys/my_key.priv  sawtooth.identity.allowed_keys=$(cat ~/.sawtooth/keys/my_key.pub) --url http://rest-api:8008 `

6. Once public key is stored in the setting, use the  command ​ sawtooth identity   policy   create   ​ to   set   and   update  roles and policies.  
# to create policy
* `sawtooth identity policy create --key ~/.sawtooth/keys/my_key.priv policy_1 "PERMIT_KEY *" --url http://rest-api:8008 `
# to create role
* `sawtooth identity role create --key ~/.sawtooth/keys/my_key.priv transactor policy_1 --url http://rest-api:8008`
7. give permision for the my_key.pub as a transactor
 * `sawtooth identity policy create --key ~/.sawtooth/keys/my_key.priv policy_1 "PERMIT_KEY 0252bff8f3a6d5c519754c7d9ac1aaa0b9f1bbad87a3df30fd6fdd1f2a0ba56fef" --url http://rest-api:8008`  
8. give permision to the seller as a transactor

 *  `sawtooth identity policy create --key ~/.sawtooth/keys/my_key.priv policy_1 "PERMIT_KEY 0252bff8f3a6d5c519754c7d9ac1aaa0b9f1bbad87a3df30fd6fdd1f2a0ba56fef​" “PERMIT_KEY 0200a82e97d243bcc1924f0711648c5cc32dbc81eafaa712bb1bbd809fd19fd132” --url http://rest-api:8008 `
  9. create another policy to give permision for testing validator

  * `sawtooth identity policy create --key ~/.sawtooth/keys/my_key.priv policy_2 "PERMIT_KEY *" --url http://rest-api:8008 `
  # crete new role

  * `sawtooth identity role create --key ~/.sawtooth/keys/my_key.priv transactor policy_2 --url http://rest-api:8008`
10. give permision for the   my_key.pub as a transactor in the new policy

* `sawtooth identity policy create --key ~/.sawtooth/keys/my_key.priv policy_2 "PERMIT_KEY 0252bff8f3a6d5c519754c7d9ac1aaa0b9f1bbad87a3df30fd6fdd1f2a0ba56fef" --url http://rest-api:8008`  

11. give permision to the seller as a transactor in the new policy

 *  `sawtooth identity policy create --key ~/.sawtooth/keys/my_key.priv policy_2 "PERMIT_KEY 0252bff8f3a6d5c519754c7d9ac1aaa0b9f1bbad87a3df30fd6fdd1f2a0ba56fef​" “PERMIT_KEY 03269e4b769ec6bf415950f63fa872e5c6de815d31bae08dfc97d98c53a7f98aa1 --url http://rest-api:8008 `
 
  


After creating permision only this 2 private key can send transaction.


