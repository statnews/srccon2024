<script>
    import _ from 'lodash';

    // define search data parameters
    import {
        selectedFilterID,
        selectedSearchField,
        selectedSearchCollection,
    } from './Stores.js';

    export let record;
    export let metadata;

    $: healthSystems = metadata.healthSystems;
    $: companies = metadata.companies;
    $: applications = metadata.applications;
    $: subapplications = metadata.subapplications;
    $: targets = metadata.targets;

    function returnRecordName(recordID, collection) {
        let result = _.find(collection, { id: recordID });
        let name = result.fields.Name;
        return name;
    }

    function setFilter(input, searchField, searchCollection) {
        $selectedFilterID = input;
        $selectedSearchField = searchField;
        $selectedSearchCollection = searchCollection;
    }

    function resetFilters() {
        $selectedFilterID = '';
    }
</script>

<div class="block">
    <div class="card">
        <div class="card-content">
            <div class="content">
                <div class="columns mb-0">
                    <div class="column has-text-left">
                        <h2 class="title is-4">
                            {record.fields.product_name}
                        </h2>
                    </div>
                </div>

                <div class="columns mb-0">
                    <div class="column is-half has-text-left">
                        {#if record.fields.health_system}
                            <strong>Health system(s)</strong>
                            <div class="control">
                                <div class="tags">
                                    {#each record.fields.health_system as area}
                                        <span
                                            class="tag is-primary has-pointer-cursor"
                                            on:click|preventDefault={setFilter(
                                                area,
                                                'health_system',
                                                healthSystems,
                                            )}
                                            >{returnRecordName(
                                                area,
                                                healthSystems,
                                            )}</span
                                        >
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                    <div class="column is-half has-text-left">
                        {#if record.fields.company}
                            <strong>Developer(s)</strong>
                            <div class="control">
                                <div class="tags">
                                    {#each record.fields.company as area}
                                        <span
                                            class="tag is-danger has-pointer-cursor"
                                            on:click|preventDefault={setFilter(
                                                area,
                                                'company',
                                                companies,
                                            )}
                                            >{returnRecordName(
                                                area,
                                                companies,
                                            )}</span
                                        >
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>

                <div class="columns mb-0">
                    <div class="column is-half has-text-left">
                        {#if record.fields.application}
                            <strong>Application(s)</strong>
                            <div class="control">
                                <div class="tags">
                                    {#each record.fields.application as area}
                                        <span
                                            class="tag has-pointer-cursor"
                                            on:click|preventDefault={setFilter(
                                                area,
                                                'application',
                                                applications,
                                            )}
                                            >{returnRecordName(
                                                area,
                                                applications,
                                            )}</span
                                        >
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                    <div class="column is-half has-text-left">
                        {#if record.fields.subapplication}
                            <strong>Sub-application(s)</strong>
                            <div class="control">
                                <div class="tags">
                                    {#each record.fields.subapplication as area}
                                        <span
                                            class="tag has-pointer-cursor"
                                            on:click|preventDefault={setFilter(
                                                area,
                                                'subapplication',
                                                subapplications,
                                            )}
                                            >{returnRecordName(
                                                area,
                                                subapplications,
                                            )}</span
                                        >
                                    {/each}
                                </div>
                            </div>
                        {/if}

                        {#if record.fields.editing_tool_tested}
                            <div class="control">
                                <div class="tags has-addons">
                                    <span class="tag is-dark">Tool</span>
                                    <span class="tag is-link"
                                        >{#each record.fields.editing_tool_tested as tool}
                                            {returnRecordName(
                                                tool,
                                                editingTools,
                                            )}
                                        {/each}</span
                                    >
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>

                <div class="columns mb-0">
                    <div class="column is-half has-text-left">
                        {#if record.fields.application}
                            <strong>Target user(s)</strong>
                            <div class="control">
                                <div class="tags">
                                    {#each record.fields.target_user as user}
                                        <span
                                            class="tag has-pointer-cursor"
                                            on:click|preventDefault={setFilter(
                                                user,
                                                'target_user',
                                                targets,
                                            )}
                                            >{returnRecordName(
                                                user,
                                                targets,
                                            )}</span
                                        >
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>

                <p>
                    {#if record.fields.description}
                        {record.fields.description}
                    {/if}
                </p>
            </div>
        </div>

        <footer class="card-footer">
            {#if record.fields.stat_url}
                <a
                    href={record.fields.stat_url}
                    target="_blank"
                    class="card-footer-item"
                >
                    <div class="tags has-addons">
                        <span class="tag is-link is-light">
                            <span class="icon-text">
                                <span class="icon">
                                    <i class="fas fa-newspaper" />
                                </span>
                                <span> STAT coverage </span>
                            </span>
                        </span>
                    </div>
                </a>
            {/if}
            {#if record.fields.source_url}
                <a
                    href={record.fields.source_url}
                    target="_blank"
                    class="card-footer-item"
                >
                    <div class="tags has-addons">
                        <span class="tag is-link is-light">
                            <span class="icon-text">
                                <span class="icon">
                                    <i class="fas fa-file" />
                                </span>
                                <span> Source link </span>
                            </span>
                        </span>
                    </div>
                </a>
            {/if}
        </footer>
    </div>
</div>
