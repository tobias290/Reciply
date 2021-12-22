<script>
    import { createEventDispatcher, onMount } from "svelte";

    export let startRightSide = false;

    onMount(() => {
        if (startRightSide)
            toggle = false;
    });

    let toggle = true;

    let dispatch = createEventDispatcher();

    const onToggle = () => {
        toggle = !toggle;
        dispatch("toggle", toggle)
    };
</script>

<div class="switch">
    <div
        class="switch__background"
        class:switch__background--left={toggle}
        class:switch__background--right={!toggle}
    ></div>

    <div
        class="switch__toggle"
        class:switch__toggle--active={toggle}
        on:click={onToggle}
    ><slot name="left"></slot></div>
    <div
        class="switch__toggle"
         class:switch__toggle--active={!toggle}
         on:click={onToggle}
    ><slot name="right"></slot></div>
</div>

<style lang="scss">
    @import "../css/_bootstrap.scss";

    .switch {
        @include flex($align: center, $justify: space-around);

        background: $color-white-dark;
        border-radius: 16px;
        height: 50px;
        min-height: 50px;
        position: relative;
        width: 100%;

        &__background {
            background: $color-primary;
            border-radius: inherit;
            height: 100%;
            position: absolute;
            width: 50%;
            transition: left .125s ease-in;

            &--left {
                left: 0;
            }

            &--right {
                left: 50%;
            }
        }

        &__toggle {
            @include flex($center: true);

            border-radius: inherit;
            color: #999;
            height: 50px;
            transition: color .125s linear;
            width: 50%;
            z-index: 1;

            &--active {
                color: $color-white;
            }
        }
    }
</style>
