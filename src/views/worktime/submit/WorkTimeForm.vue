<template>
  <el-form :model="form" label-width="100px" label-position="left">
    <el-form-item :rules="rules" label="日期">
      <el-date-picker
        v-model="form.date"
        type="date"
        placeholder="日期"
        format="yyyy 年 MM 月 dd 日"
        :picker-options="datePickerOptions"
        value-format="timestamp"
      />
    </el-form-item>
    <el-form-item required label="功能名称">
      <el-cascader v-model="form.features" :options="featureOptions" />
    </el-form-item>
    <el-form-item required label="活动名称">
      <el-cascader
        v-model="form.activities"
        :options="activityOptions"
        :props="activityProps"
      />
    </el-form-item>
    <el-form-item required label="开始时间">
      <el-time-picker
        v-model="form.startTime"
        placeholder="请选择开始时间"
        format="HH:mm:ss"
      />
    </el-form-item>
    <el-form-item required label="结束时间">
      <el-time-picker
        v-model="form.endTime"
        placeholder="请选择结束时间"
        format="HH:mm:ss"
      />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    date: String,
    functionId: Number,
    functionName: String,
    subfunctionId: Number,
    subfunctionName: String,
    activityId: Number,
    activityName: String,
    subactivityId: Number,
    subactivityName: String,
    startTime: String,
    endTime: String,
    featureOptions: Array,
    activityOptions: Array
  },
  data() {
    return {
      form: {},
      rules: { required: true, message: '该项为必填项' },
      activityProps: { label: 'name', value: 'id' },
      datePickerOptions: {
        disabledDate: day => day.getTime() > new Date().getTime()
      }
    };
  },
  methods: {
    initForm() {
      let activities = [],
        features = [];
      this.activityId && activities.push(this.activityId);
      this.subactivityId && activities.push(this.subactivityId);
      this.functionId && features.push(this.functionId);
      this.subfunctionId && features.push(this.subfunctionId);

      this.form = {
        date: this.date ? new Date(this.date) : new Date(),
        startTime: this.startTime
          ? new Date(this.startTime)
          : new Date(2020, 1, 1, 9),
        endTime: this.endTime
          ? new Date(this.endTime)
          : new Date(2020, 1, 1, 17),
        activities: activities,
        features: features
      };
    }
  },
  watch: {
    form: {
      handler(data) {
        this.$emit('data-change', data);
      },
      deep: true
    }
  },
  created() {
    this.initForm();
  }
};
</script>

<style lang="scss" scoped></style>
