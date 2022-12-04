# Project Description

This project code manages the process of stocks data import.
The data fetched from as SFTP server and the processed result saved at Redis database.

## Unimplemented

 - Archiving file after processed
 - Notification system
 - Error management
 - Github Workflows

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start:dev

# production mode
$ npm run build && npm run start:prod
```

## Configuration

- LOG_LEVELS
- REDIS_HOST: hostname of the Redis server
- REDIS_PASSWORD: username for Redis login
- REDIS_USERNAME: password for Redis login
- SFTP_SERVER: hostname of SFTP server
- SFTP_USER: username for SFTP login
- SFTP_PASSWORD: password for SFTP login
- SFTP_PORT: port of SFTP server
- SFTP_STOCKS_FOLDER_PATH: the directory in which the stock inventory files are located in the SFTP server
- STOCK_CSV_DELIMITER: The delimiter that is used at the stock inventory files. Default: ";"

### Structure of Redis hashes

The stocks processed data is saved at Redis via the (HSET method)[https://redis.io/commands/hset/]:

- the hash name is the product ID
- the key is the store ID
- the value is the inventory amount

Example structures as JSON:

```JSON
{
  "1923370112345": {
    "234451": 1
  },
  "1923370112346": {
    "234451": 3
  },
  ...
}
```

### Structure of inventory files

Each file contains a header line and afterwards the stocks data lines.
Each line represents stock data, by the following CSV structure:

```CSV

store;product_id;quantity;quantity_in_transit;quantity_defective;quantity_reserved;quantity_to_return
234451;1923370112345;1;0;;;
234452;1923370112345;1;0;;;

```

A field value is according to the corresponding column at the header line.
Each field and column is separated from others by a semi-colon (`;`).

The relevant columns are:

- store: the store ID
- product_id: the product ID
- quantity: the product inventory amount at that store

## Running tests

To run the tests, please run the following command:

`npm run test`

## Process Algorithm

 - get the delta files folder path (config)
 - get all files paths matching that pattern (sftp)
 - for each file path:
    - download the content (sftp)
    - convert the csv to JSON (csv)
    - for each object at the result JSON array:
       - save the result at the database (database)
