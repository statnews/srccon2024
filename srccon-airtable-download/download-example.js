const path = require('path');
const fs = require('fs/promises');
const fetch = require('node-fetch');

let tableOne = [];
let tableTwo = [];

// define the url of the airtable database
let airtableURL = 'https://api.airtable.com/v0/**BASE ID GOES HERE**/';

// define auth headers
// don't actually store your bearer token this way, you should probably use environmental variables
// this is only for local testing purposes, do NOT commit your token to version control
authHeader = { 'Authorization': 'Bearer **TOKEN GOES HERE**' }

// function to handle grabbing data in offset chunks
async function getOffsetData(tableName, collection, offset, view) {
    console.log('1. starting getOffsetData function..');

    let theRecords = [];

    if (collection) {
        theRecords = collection;
    }

    let theData = await getAirtableRecords(tableName, collection, offset, view);

    console.log('3. got data, inserting it into records array');
    let records = theData.records;

    records.forEach((element) => {
        theRecords = [...theRecords, element];
    });

    if (theData.offset) {
        console.log('4. offset present! need to get more data..');
        let moreData = await getOffsetData(
            tableName,
            theRecords,
            theData.offset,
            view
        );
        console.log('5. returning moredata..');
        return moreData;
    }

    console.log('6. returning thedata..');
    return theRecords;
}

async function getAirtableRecords(tableName, collection, offset, view) {
    let reqURL =
        airtableURL + tableName + '?view=' + view;

    console.log(reqURL);

    if (offset) {
        reqURL = reqURL + '&offset=' + offset;
    }

    return fetch(reqURL, {
            headers: authHeader
        })
        .then((response) => {
            // console.log('getting data..')
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((jsonRes) => {
            return jsonRes;
        })
        .catch((e) => {
            console.log(
                'There has been a problem with your fetch operation: ' +
                e.message
            );
        });
}

(async() => {
    const tableOneResponse = await getOffsetData('Table_Name', false, false, 'view_name');
    const tableTwoResponse = await getOffsetData(
        'Table_Two_Name',
        false,
        false,
        'table_two_view_name'
    );

    tableOne = JSON.stringify(tableOneResponse);
    tableTwo = JSON.stringify(tableTwoResponse);

    fs.writeFile('./data/tableOne.json', tableOne, (err) => {
        if (err) throw err;
        console.log("tableOne.json has been saved.");
    })
    fs.writeFile('./data/tableTwo.json', tableTwo, (err) => {
        if (err) throw err;
        console.log("tableTwo.json has been saved.");
    })
})();