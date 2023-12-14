<script lang="ts">
    import dayjs from "dayjs";

    export let day = dayjs();

    $: daysInMonth = Array(day.daysInMonth())
        .fill(0)
        .map((_, i) => dayjs().date(i + 1));
</script>

<div class="datebar">
    <button on:click={() => (day = day.subtract(1, "month"))}>Previous</button>
    <h1>{day.format("MMMM YYYY")}</h1>
    <button on:click={() => (day = day.add(1, "month"))}>Next</button>
</div>
<div class="calendar">
    {#each daysInMonth as day}
        <div class="day">
            {day.format("D")}
        </div>
    {/each}
</div>

<style lang="scss">
    .datebar {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 3rem;
        margin: 1rem;
    }

    .calendar {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(5, 1fr);
        grid-gap: 1rem;
        width: calc(100% - 2rem);
        height: calc(100% - 2rem - 3rem);
    }

    .day {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 1rem;
        background-color: #fff;
    }
</style>