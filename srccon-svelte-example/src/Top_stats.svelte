<script>
    export let topStatsData;
    export let currentResults;

    $: top3targets = topStatsData.top3targets;
    $: top3companies = topStatsData.top3companies;
    $: top3apps = topStatsData.top3apps;
    $: top3subapps = topStatsData.top3subapps;
</script>

<nav class="level">
    <div class="level-item has-text-centered pb-5">
        <div>
            <p class="heading">Top targets</p>
            {#each top3targets as app}
                <p class="stat-row-name">{app.fields.Name}</p>
                <progress
                    class="progress is-primary is-small mb-0"
                    value={app.fields.count}
                    max={currentResults.length}>15%</progress
                >
                <p class="stat-row-detail">
                    {app.fields.count} out of {currentResults.length} products
                </p>
            {/each}
        </div>
    </div>
    <div class="level-item has-text-centered pb-5">
        <div>
            <p class="heading">Top developers</p>
            {#each top3companies as app}
                <p class="stat-row-name">{app.fields.Name}</p>
                <progress
                    class="progress is-danger is-small mb-0"
                    value={app.fields.count}
                    max={currentResults.length}>15%</progress
                >
                <p class="stat-row-detail">
                    {app.fields.count} out of {currentResults.length} products
                </p>
            {/each}
        </div>
    </div>
    <div class="level-item has-text-centered pb-5">
        <div>
            <p class="heading">Top applications</p>
            {#each top3apps as app}
                <p class="stat-row-name">{app.fields.Name}</p>
                <progress
                    class="progress is-primary is-small mb-0"
                    value={app.fields.count}
                    max={currentResults.length}>15%</progress
                >
                <p class="stat-row-detail">
                    {app.fields.count} out of {currentResults.length} products
                </p>
            {/each}
        </div>
    </div>
    <div class="level-item has-text-centered pb-5">
        <div>
            <p class="heading">Top Sub-applications</p>
            {#each top3subapps as app}
                <p class="stat-row-name">{app.fields.Name}</p>
                <progress
                    class="progress is-primary is-small mb-0"
                    value={app.fields.count}
                    max={currentResults.length}>15%</progress
                >
                <p class="stat-row-detail">
                    {app.fields.count} out of {currentResults.length} products
                </p>
            {/each}
        </div>
    </div>
</nav>
