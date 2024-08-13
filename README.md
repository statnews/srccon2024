# srccon2024 - Quickly building and deploying reporter-friendly database apps with Svelte and Airtable

This repository contains code examples of a script for downloading data from an Airtable into flat JSON files. It also contains an example Svelte app for displaying the data contained in those files interactively.

## Download example script

This is a basic node script meant as a proof of concept for local testing. It includes some basic concepts around accessing the Aritable API and downloading recording iteratively.

To use it: after cloning the repo `cd` into the `srccon-airtable-download` directory.

Install dependancies with npm.

```
npm install
```

Insert the correct URL for the base you want to access and also provide your bearer token from Airtable. Then run the script. You'll also need to modify the names of tables and views to match your base.

```
node download.js
```

The script will download all records from your base and same them as JSON files in the `data` folder.

## Svelte example

To use this example, please refer to the instructions included in the readme file inside the `srccon-svelte-example` directory of this repo.

### Need help?

Find me online!

Threads: @jemoryparker

Bluesky: @jaspar.bsky.social