<template>
  <el-dialog title="编辑工时" :visible="visibility" :before-close="close">
    <WorkTimeForm
      @data-change="updateWorkTimeInfo"
      :feature-options="featureOptions"
      :activity-options="activityOptions"
      v-bind="editingWorkTimeInfo"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="onEditWorkTime">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import WorkTimeForm from './WorkTimeForm';
import { workTimeFormCheckMixin } from './mixin';
import { submitWorkTime, updateWorkTimeSubmit } from '../../../api/workTime';
import { dialogMixin } from '../../../util/mixin';

export default {
  components: {
    WorkTimeForm
  },
  props: {
    id: Number,
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
    endTime: String
  },
  mixins: [workTimeFormCheckMixin, dialogMixin],
  data() {
    return {
      editingWorkTimeInfo: {
        id: this.id,
        date: this.data,
        functionId: this.functionId,
        functionName: this.functionName,
        subfunctionId: this.subfunctionId,
        subfunctionName: this.subfunctionName,
        activityId: this.activityId,
        activityName: this.activityName,
        subactivityId: this.subactivityId,
        subactivityName: this.subactivityName,
        startTime: this.startTime,
        endTime: this.endTime
      }
    };
  },
  methods: {
    onEditWorkTime() {
      const params = this.getParamsForRemote(this.workTimeInfo);
      if (params) {
        updateWorkTimeSubmit(params).then(() => {
          this.close();
          this.$message.success('更新工时成功');
          this.$emit('success', 1);
        });
      }
    }
  }
};
</script>
