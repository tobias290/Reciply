<script>
    export let progress;
    export let max = 100;

    progress = progress / max * 100;
</script>

<div class="progress-bar">
    <div class="progress-bar__progress" style="width: {progress}%"></div>
</div>

<style lang="scss">
    @import "../css/bootstrap";

    .progress-bar {
        background: $color-white-dark;
        border-radius: 8px;
        height: 8px;
        overflow: hidden;
        width: 100%;

        &__progress {
            background: $color-primary;
            border-radius: inherit;
            height: 100%;
            transition: width .125s ease-in-out;
            width: 0;
        }
    }
</style>
