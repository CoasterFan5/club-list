<script lang="ts">
    import type { PageData } from "./$types"
    export let data: PageData;
 </script>

<div class="wrap">
    <div class="clubs">
    </div>
    <div class="sidebar">
        <h2>Tags</h2>
    </div>    
</div>

<style>
    .wrap {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: 1rem 5rem;
        display: flex;
        flex-direction: row;
        align-items: start;
        justify-content: center;
    }
    .clubs {
        width: 100%;
        box-sizing: border-box;
        padding-right: 1rem;
        box-sizing: border-box;
        height: 100%;
    }
    .sidebar {
        width: 250px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        flex-direction: column;
        background: #ffffff;
        box-shadow: 2px 2px rgba(0, 0, 0, 0.1);
    }
</style>

