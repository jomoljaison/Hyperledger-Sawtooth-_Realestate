# realestate villa

people who can buy or sell appropriate villas.Hyperledger Sawtooth supports to create a permissioned(private) network which allows parallel Transaction execution in a secure,immutable,
and tracble way permissioning enabled.

Our network should have three participants.

1.seller ,they can sell their villas 
2.buyer ,they can buy villa 
3.registerar,can validate the details

# Seller

seller can sell their villa using house id,seller aadhar number,and with house attributes

# Buyer
 
  The buyer is anyone who can view the villa details and  go for buy the requied villa

# Registerar

 The Registerar are responsible for the Validation of the villa details.who is responsible for validate the details entered by the seller. 


# Approach

In this application here to create 3 forms,one for the seller to add villas that he wants to sell.seller can sell their villa using house id,seller aadhar number,and with house attributes
The second is buyer who can buy the villa that displayed by the seller.The buyer can use his aadhar as his id to buy the villa .
The registerar who have the responsibility for validate the villa. 

 


# Client Code Walkthrough

* index.hbs
    login page  of seller buyer and registerar(validator).Then the index.hbs page routes to the home page
* home.hbs    
  The home page shows just images of  villas and navigation part
* createvilla.hbs
   This page for add villa by seller
* buyvilla.hbs
 This page for buy villa 
* validation.hbs
validation.hbs page is the page for validation of villa details.
 
* public/javascript/main.js

This file contain the code to extract the data from both the forms and send to Apps router.main.js adds logic to the dashboard.hbs

* routes/index.js

 This file contains the code block that ultimately sends the transaction to the rest API

* routes/UserClient.js

 This file mentions the authorised private keys of manufacturer and testing authority.Relevant objects & functions to submit transaction to rest API is also included

# Processor Code Walkthrough


* Handler.js
   This file contain the business logic for current family of transactions.


* Processor.js
   This file establishes connection with validator and starts the transaction processor.

# Event Code Walkthrough   

* EventListener.js

 This file contain events and subscriptions.Two type events added.Block commit and custom events.The Custom events help to get product details from the block. 
