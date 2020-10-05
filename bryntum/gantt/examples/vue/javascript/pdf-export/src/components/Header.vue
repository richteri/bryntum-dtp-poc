<!--
/**
 * Header with title and buttons
 */
-->

<template>
    <header class="app-header">
        <h1><a :href="link">{{ $props.title }}</a></h1>
        <app-button color="b-skip-test b-orange b-raised" text="Export to PDF/PNG" action="export"></app-button>
        <fullscreen-button></fullscreen-button>
    </header>
</template>

<script>
    import FullscreenButton from 'bryntum-vue-shared/src/FullscreenButton.vue';
    import AppButton from './Button.vue';

    export default {
        name  : 'app-header',
        props : {
            link  : { type : String, default : '..' },
            title : { type : String, default : 'Example Header' }
        },
        components: {
            FullscreenButton,
            AppButton
        },
        mounted() {
            document.title = this.$props.title;
        }
    } // exports the header components
</script>

<style>
    .app-header {
        padding             : 2.1em .5em 2.1em 5em;
        background          : url(~bryntum-resources/images/logo_bryntum_bw.png) #2667c8;
        background-repeat   : no-repeat;
        background-size     : 40px;
        background-position : center left 1.5em;
        display             : flex;
    }

    .app-header h1 {
        margin      : 0;
        font-size   : 1.8em;
        color       : #fff;
        font-weight : normal;
        flex        : 1;
        align-self  : center;
    }

    .app-header a {
        color           : inherit;
        text-decoration : none;
    }

    .app-header button {
        margin-right  : 1em;
    }

</style>

<!-- eof -->
