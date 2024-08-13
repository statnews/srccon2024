<script>
    import { onMount } from 'svelte';
    import _ from 'lodash';
    import { afterUpdate } from 'svelte';
    import Fuse from 'fuse.js';
    import pym from 'Pym.js';

    import TopStats from './Top_stats.svelte';
    import Recordresult from './Recordresult.svelte';

    let pymChild;

    let test = [];
    let companies = [];
    let healthSystems = [];
    let applications = [];
    let subapplications = [];
    let targets = [];

    let topCompanies = [];
    let topSystems = [];
    let currentResults = [];
    let top3apps = [];
    let top3systems = [];
    let top3companies = [];
    let top3subapps = [];
    let top3targets = [];

    let numOfApps;
    let numOfSystems;
    let numOfCompanies;
    let numOfSubApps;

    // $: console.log(selectedFilterID);

    // $: console.log(countries);
    // $: console.log(test);
    // $: console.log(diseases);
    // $: console.log(editingTools);
    // $: console.log(companies);

    function sum(obj) {
        var sum = 0;
        for (var el in obj) {
            if (obj.hasOwnProperty(el)) {
                sum += parseFloat(obj[el].fields.count);
            }
        }
        return sum;
    }

    afterUpdate(() => {
        pymChild.sendHeight();
    });

    async function getAirtableRecords(tableName, collection, offset) {
        let reqURL = 'data/' + tableName + '.json';

        if (offset) {
            reqURL = reqURL + '&offset=' + offset;
        }

        return fetch(reqURL)
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
                        e.message,
                );
            });
    }

    onMount(async () => {
        const testRes = await getAirtableRecords('products', 'devices', false);
        const companiesRes = await getAirtableRecords(
            'companies',
            'devices',
            false,
        );
        const healthSystemsRes = await getAirtableRecords(
            'health-systems',
            'devices',
            false,
        );
        const applicationsRes = await getAirtableRecords(
            'applications',
            'devices',
            false,
        );
        const subapplicationsRes = await getAirtableRecords(
            'subapplications',
            'devices',
            false,
        );

        const targetsRes = await getAirtableRecords(
            'targets',
            'devices',
            false,
        );

        test = testRes;
        currentResults = testRes;
        companies = companiesRes;
        healthSystems = healthSystemsRes;
        applications = applicationsRes;
        subapplications = subapplicationsRes;
        targets = targetsRes;

        // console.log(companies);

        topCompanies = companies.slice(0, 20);
        topSystems = healthSystems.slice(0, 20);
        top3apps = applications.slice(0, 3);
        top3subapps = subapplications.slice(0, 3);
        top3systems = healthSystems.slice(0, 3);
        top3companies = companies.slice(0, 3);
        top3targets = targets.slice(0, 3);

        numOfApps = sum(applications);
        numOfSubApps = sum(subapplications);
        numOfCompanies = sum(companies);
        numOfSystems = sum(healthSystems);

        pymChild = new pym.Child({ polling: 500 });

        pymChild.sendHeight();
    });

    $: topStatsData = { top3targets, top3apps, top3companies, top3subapps };
    $: metadata = {
        companies,
        healthSystems,
        applications,
        subapplications,
        targets,
    };

    let authorizedFilter = false;

    import {
        selectedFilterID,
        selectedSearchField,
        selectedSearchCollection,
    } from './Stores.js';

    let selectedFilterObj = {};
    $: selectedFilterObj = _.find(companies, { id: $selectedFilterID });

    function setFilter(input, searchField, searchCollection) {
        $selectedFilterID = input;
        $selectedSearchField = searchField;
        $selectedSearchCollection = searchCollection;
    }

    function resetFilters() {
        $selectedFilterID = '';
    }

    function returnRecordObj(recordID, collection) {
        let result = _.find(collection, { id: recordID });
        let obj = result.fields;
        return obj;
    }

    function returnRecordName(recordID, collection) {
        let result = _.find(collection, { id: recordID });
        let name = result.fields.Name;
        return name;
    }

    function returnRecordDescription(recordID, collection) {
        let result = _.find(collection, { id: recordID });
        let description = result.fields.description;
        return description;
    }

    function returnRecordField(recordID, collection, fieldName) {
        let result = _.find(collection, { id: recordID });
        let description = result.fields[fieldName];
        return description;
    }

    function returnFilteredResults(filterID, searchField, collection) {
        let results = _.filter(collection, function (o) {
            // console.log(o.fields[searchField]);
            return _.includes(o.fields[searchField], filterID);
        });

        return results;
    }

    let textSearchTerm = '';

    const options = {
        includeScore: true,
        shouldSort: true,
        ignoreLocation: true,
        // Search in `author` and in `tags` array
        keys: ['fields.search_terms'],
    };

    let fuse = new Fuse(currentResults, options);
    let result = fuse.search(textSearchTerm);
    let newCurrentResults;

    $: fuse = new Fuse(currentResults, options);
    $: result = fuse.search(textSearchTerm);

    $: if (textSearchTerm) {
        $selectedFilterID = '';
        newCurrentResults = _.map(result, function (i) {
            return { id: i.item.id, fields: i.item.fields };
        });
    } else {
        newCurrentResults = currentResults;
    }

    $: if (authorizedFilter) {
        console.log("Let's only show authorized devices!");
        currentResults = onlyAuthed;
    } else {
        currentResults = test;
    }

    $: if ($selectedFilterID) {
        newCurrentResults = returnFilteredResults(
            $selectedFilterID,
            $selectedSearchField,
            currentResults,
        );
    } else {
        newCurrentResults = currentResults;
    }

    // $: console.log(currentResults);
</script>

<link
    rel="stylesheet"
    href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
/>

<div class="container">
    <TopStats {topStatsData} {currentResults} />

    <div class="columns">
        <div class="column is-two-thirds">
            {#if $selectedFilterID}
                <nav class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <span class="icon-text">
                                <span class="icon">
                                    <i class="fas fa-search" />
                                </span>
                                <span>
                                    <strong>Showing products with</strong>
                                    <span class="tag is-info is-light"
                                        >{returnRecordName(
                                            $selectedFilterID,
                                            $selectedSearchCollection,
                                        )}
                                        <button
                                            class="delete is-small"
                                            on:click={resetFilters}
                                        /></span
                                    >
                                </span>
                            </span>
                        </div>
                    </div>
                </nav>
            {:else if textSearchTerm}
                <h1 class="title">Search results</h1>
            {:else}
                <h1 class="title">All products</h1>
            {/if}

            <div>
                {#each newCurrentResults as record}
                    {#if record.fields.product_name}
                        <Recordresult {record} {metadata} />
                    {/if}
                {:else}
                    <!-- this block renders when results are loading -->
                    <div class="box" in:fly={{ y: 200, duration: 800 }}>
                        <h1 class="title">Loading...</h1>
                        <progress class="progress is-primary" max="100"
                            >15%</progress
                        >
                    </div>
                {/each}
            </div>
        </div>

        <div class="column">
            <nav class="panel">
                <p class="panel-heading">Filter products</p>

                <div class="panel-block">
                    <p class="control has-icons-left">
                        <input
                            class="input"
                            type="text"
                            placeholder="Search"
                            bind:value={textSearchTerm}
                        />
                        <span class="icon is-left">
                            <i class="fas fa-search" aria-hidden="true" />
                        </span>
                    </p>
                </div>

                <div class="panel-block">
                    <div class="field">
                        <label class="label">Top health systems</label>

                        <div class="control">
                            <div class="tags">
                                {#each topSystems as company}
                                    {#if company.fields.products}
                                        {#if company.id === $selectedFilterID}
                                            <a
                                                class="tag is-primary"
                                                href="#"
                                                on:click|preventDefault={resetFilters}
                                                >{company.fields.Name} ({company
                                                    .fields.count})</a
                                            >
                                        {:else}
                                            <a
                                                class="tag is-primary is-light"
                                                href="#"
                                                on:click|preventDefault={setFilter(
                                                    company.id,
                                                    'health_system',
                                                    healthSystems,
                                                )}
                                                >{company.fields.Name} ({company
                                                    .fields.count})</a
                                            >
                                        {/if}
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="panel-block">
                    <div class="field">
                        <label class="label">Top developers</label>

                        <div class="control">
                            <div class="tags">
                                {#each topCompanies as company}
                                    {#if company.fields.Devices}
                                        {#if company.id === $selectedFilterID}
                                            <a
                                                class="tag is-danger"
                                                href="#"
                                                on:click|preventDefault={resetFilters}
                                                >{company.fields.Name} ({company
                                                    .fields.count})</a
                                            >
                                        {:else}
                                            <a
                                                class="tag is-danger is-light"
                                                href="#"
                                                on:click|preventDefault={setFilter(
                                                    company.id,
                                                    'company',
                                                    companies,
                                                )}
                                                >{company.fields.Name} ({company
                                                    .fields.count})</a
                                            >
                                        {/if}
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="panel-block">
                    <div class="field">
                        <label class="label">Applications</label>

                        <div class="control">
                            <div class="tags">
                                {#each applications as app}
                                    {#if app.fields.products}
                                        {#if app.id === $selectedFilterID}
                                            <a
                                                class="tag is-dark"
                                                href="#"
                                                on:click|preventDefault={resetFilters}
                                                >{app.fields.Name} ({app.fields
                                                    .count})</a
                                            >
                                        {:else}
                                            <a
                                                class="tag is-light"
                                                href="#"
                                                on:click|preventDefault={setFilter(
                                                    app.id,
                                                    'application',
                                                    applications,
                                                )}
                                                >{app.fields.Name} ({app.fields
                                                    .count})</a
                                            >
                                        {/if}
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="panel-block">
                    <div class="field">
                        <label class="label">Sub-applications</label>

                        <div class="control">
                            <div class="tags">
                                {#each subapplications as app}
                                    {#if app.fields.products}
                                        {#if app.id === $selectedFilterID}
                                            <a
                                                class="tag is-dark"
                                                href="#"
                                                on:click|preventDefault={resetFilters}
                                                >{app.fields.Name} ({app.fields
                                                    .count})</a
                                            >
                                        {:else}
                                            <a
                                                class="tag is-light"
                                                href="#"
                                                on:click|preventDefault={setFilter(
                                                    app.id,
                                                    'subapplication',
                                                    subapplications,
                                                )}
                                                >{app.fields.Name} ({app.fields
                                                    .count})</a
                                            >
                                        {/if}
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="panel-block">
                    <div class="field">
                        <label class="label">Target users</label>

                        <div class="control">
                            <div class="tags">
                                {#each targets as app}
                                    {#if app.fields.products}
                                        {#if app.id === $selectedFilterID}
                                            <a
                                                class="tag is-dark"
                                                href="#"
                                                on:click|preventDefault={resetFilters}
                                                >{app.fields.Name} ({app.fields
                                                    .count})</a
                                            >
                                        {:else}
                                            <a
                                                class="tag is-light"
                                                href="#"
                                                on:click|preventDefault={setFilter(
                                                    app.id,
                                                    'target_user',
                                                    targets,
                                                )}
                                                >{app.fields.Name} ({app.fields
                                                    .count})</a
                                            >
                                        {/if}
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="panel-block">
                    <button
                        class="button is-link is-outlined is-fullwidth"
                        on:click|preventDefault={resetFilters}
                    >
                        Reset all filters
                    </button>
                </div>
            </nav>
        </div>
    </div>
</div>

<style>
    :global {
        @import 'src/styles.scss';
    }

    .tag {
        font-weight: 600;
    }

    .container {
        padding-top: 2rem;
    }
</style>
