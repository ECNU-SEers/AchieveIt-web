<template>
  <el-dialog title="新增工时" :visible="visibility" :before-close="close">
    <el-form v-model="form" label-width="80px" label-position="left">
      <el-form-item label="日期">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="timestamp"
        />
      </el-form-item>
      <el-form-item label="功能名称">
        <el-cascader
          v-model="form.featureName"
          :options="options"
          @change="onFeatureChange"
        />
      </el-form-item>
      <el-form-item label="活动名称">
        <el-cascader
          v-model="form.featureName"
          :options="options"
          @change="onActivityChange"
        />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-time-picker
          v-model="form.startTime"
          placeholder="请选择开始时间"
          format="HH:mm"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-time-picker
          v-model="form.endTime"
          placeholder="请选择结束时间"
          format="HH:mm"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="onAddWorkTime">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addNewRole } from "@/api/permisssion";

export default {
  components: {},
  props: {
    visibility: Boolean
  },
  data() {
    return {
      form: {
        date: new Date(),
        startTime: new Date(2020, 1, 1, 9),
        endTime: new Date(2020, 1, 1, 17),
        activityName: "",
        featureName: ""
      },
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则"
            }
          ]
        }
      ]
    };
  },
  methods: {
    onAddWorkTime() {
      addNewRole().then(() => {
        this.close();
        this.$message.success("新增工时成功");
      });
    },
    onFeatureChange() {},
    onActivityChange() {},
    close() {
      this.$emit("update:visibility", false);
    }
  }
};
</script>

<style lang="scss" scoped></style>
