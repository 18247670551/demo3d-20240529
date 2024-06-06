<template>
    <div class="m-flex-row m-flex-jc-between m-flex-vc">
        <div class="m-flex-row m-flex-vc m-gap20">
            <slot name="left"/>
        </div>
        <div class="m-flex-row m-flex-vc m-gap10">
            <slot name="right"/>
        </div>
    </div>
</template>
