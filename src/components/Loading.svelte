<script>
    import { onDestroy } from "svelte";

    let dots = [null, null, null];
    let index = 0;

    let interval = setInterval(() => {
        if (index === 3) {
            for (let dot of dots)
                dot.style.visibility = "hidden";
            index = 0;
            return;
        }

        dots[index].style.visibility = "visible";
        index++;
    }, 750);

    onDestroy(() => clearInterval(interval));
</script>

<div class="loading">
    Loading<span bind:this={dots[0]}>.</span><span bind:this={dots[1]}>.</span><span bind:this={dots[2]}>.</span>
</div>
<style lang="scss">
    @import "../css/bootstrap";

    .loading {
        @include absolute-center(60px);

        box-sizing: border-box;
        font-size: 3rem;
        font-weight: 300;
        padding: 1rem;
        text-align: center;
        width: 100%;

        span {
            color: $color-primary;
            font-weight: bold;
            visibility: hidden;
        }
    }
</style>
