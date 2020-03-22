<template>
    <div class="container">
        <p class="title">{{ title }}</p>
        <div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      title: String
    }
  };
</script>

<style lang="scss" scoped>
    .container {
        @include flex-container(row, space-between, center);
        background-color: #ffffff;
        padding: 15px 20px;

        .title {
            color: #4c76af;
            font-size: 16px;
            font-weight: 500;
        }

        div {
            @include flex-container(row, space-between, center);
        }
    }
</style>
