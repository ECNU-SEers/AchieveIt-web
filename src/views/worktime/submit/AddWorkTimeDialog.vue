<template>
  <el-dialog title="新增工时" :visible="visibility" :before-close="close">
    <WorkTimeForm
      @data-change="updateWorkTimeInfo"
      :feature-options="featureOptions"
      :activity-options="activityOptions"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="onAddWorkTime">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { submitWorkTime } from '../../../api/workTime';
import WorkTimeForm from './WorkTimeForm';
import { workTimeFormCheckMixin } from './mixin';
import { dialogMixin } from '../../../util/mixin';

export default {
  components: {
    WorkTimeForm
  },
  mixins: [workTimeFormCheckMixin, dialogMixin],
  data() {
    return {};
  },
  methods: {
    onAddWorkTime() {
      const params = this.getParamsForRemote(this.workTimeInfo);
      if (params) {
        submitWorkTime(params).then(() => {
          this.close();
          this.$message.success('新增工时成功');
          this.$emit('success', 1);
        });
      }
    }
  }
};
</script>
