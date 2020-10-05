<!--
 *- Header with title and buttons
-->
<template>
    <header class="app-header">
        <h1><a :href="link">{{ $props.title }}</a></h1>
        <show-headers-button 
            type        = "button"
            color       = "b-blue b-raised"
            cls         = "show-headers"
            text        = "Show header elements"
            tooltip     = "Toggles the rendering of time range header elements"
            icon        = "b-fa-square"
            pressedIcon = "b-fa-check-square"
            :toggleable = true
            :pressed    = true
            @click      = "onShowHeadersClick"
        />
        <fullscreen-button></fullscreen-button>
    </header>
</template>

<script>
    import FullscreenButton from 'bryntum-vue-shared/src/FullscreenButton.vue';
    import ShowHeadersButton from 'bryntum-vue-shared/src/BryntumWidget.vue';

    // instance of Vue for events delivery
    import { eventBus } from '../main.js';

    export default {
        name  : 'app-header',
        props : {
            link  : { type : String, default : '..' },
            title : { type : String, default : 'Example Header' }
        },
        components : {
            FullscreenButton,
            ShowHeadersButton
        },
        methods : {
            onShowHeadersClick(event) {
                // console.log('onShowHeadersClick');
                eventBus.$emit('onShowHeadersClick', event)
            }
        }
    } // exports the header components
</script>

<style lang="scss">
    .app-header {
        padding             : 2.1em .5em 2.1em 5em;
        background          : url(~bryntum-resources/images/logo_bryntum_bw.png) #2667c8;
        background-repeat   : no-repeat;
        background-size     : 40px;
        background-position : center left 1.5em;
        display             : flex;
        align-items         : center;
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

</style>

<!-- eof -->
