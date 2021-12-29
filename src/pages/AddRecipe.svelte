<script>
    import { fly } from "svelte/transition";
</script>

<div class="add-recipe-modal" transition:fly={{ y: document.body.clientHeight, duration: 375, opacity: 1 }}>

</div>

<style lang="scss">
    @import "../css/bootstrap";

    .add-recipe-modal {
        background: $color-white;
        border-radius: 16px 16px 0 0;
        bottom: 0;
        box-shadow: 0 -4px 16px 0 rgba($color-black, .25);
        box-sizing: border-box;
        height: calc(100% - 20px);
        left: 0;
        overflow: auto;
        padding: 1rem 1rem calc(1rem + 80px) 1rem;
        position: absolute;
        width: 100%;
        z-index: 999;
    }
</style>
