import { dateFormat } from '../../../util/date';
import { getAllActivities, getAllFeatures } from '../../../api/workTime';

export const workTimeFormCheckMixin = {
  data() {
    return {
      featureOptions: [],
      activityOptions: [],
      workTimeInfo: null
    };
  },
  methods: {
    getParamsForRemote(form) {
      const { date, startTime, endTime, activities, features } = form;
      if (!date) this.$message.error('请选择日期');
      else if (features.length < 2) this.$message.error('请选择功能');
      else if (activities.length !== 2) this.$message.error('请选择活动');
      else if (!startTime) this.$message.error('请选择开始时间');
      else if (!endTime) this.$message.error('请选择结束时间');
      else {
        if (features.length === 2) {
          for (let i = 0; i < this.featureOptions.length; ++i) {
            for (let j = 0; j < this.featureOptions[i].children.length; ++j) {
              if (this.featureOptions[i].children[j].value === features[0]) {
                const projectId = this.featureOptions[i].value;
                features.splice(0, 0, projectId);
                break;
              }
            }
            if (features.length > 2) break;
          }
        }

        const functionName = this.featureOptions
          .find(item => item.value === features[0])
          .children.find(item => item.value === features[1]).label;

        const subfunctionName = this.featureOptions
          .find(item => item.value === features[0])
          .children.find(item => item.value === features[1])
          .children.find(item => item.value === features[2]).label;

        const activityName = this.activityOptions.find(
          item => item.id === activities[0]
        ).name;

        const subactivityName = this.activityOptions
          .find(item => item.id === activities[0])
          .children.find(item => item.id === activities[1]).name;

        return {
          date: date instanceof Date ? date.getTime() : date,
          functionId: features[1],
          functionName,
          subfunctionId: features[2],
          subfunctionName,
          activityId: activities[0],
          activityName: activityName,
          subactivityId: activities[1],
          subactivityName: subactivityName,
          startTime: startTime.getTime(),
          endTime: endTime.getTime()
        };
      }
    },
    updateWorkTimeInfo(workTimeInfo) {
      this.workTimeInfo = workTimeInfo;
    },
    initOptions() {
      Promise.all([getAllFeatures(), getAllActivities()]).then(res => {
        [this.featureOptions, this.activityOptions] = res;
      });
    }
  },
  created() {
    this.initOptions();
  }
};
