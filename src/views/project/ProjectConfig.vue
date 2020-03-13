<template>
  <div>
    <p v-permission="{ name: '查看系统消息', type: 'disabled' }">
      this is a config.
    </p>
    <p v-permission="'查看日志'">Hello word</p>
    <button v-permission="['修改信息', '修改密码']">编辑</button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped></style>
