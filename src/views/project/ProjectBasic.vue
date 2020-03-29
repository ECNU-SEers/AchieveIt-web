<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>AchieveIt</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="editBasic">修改</el-button>

        <el-dialog title="修改项目基本信息" :visible.sync="dialogFormVisible">
          <el-form
            :model="editForm"
            :rules="rules"
            ref="editForm"
            label-width="100px"
            class="demo-editForm"
          >
            <!-- 不可修改 -->
            <el-form-item label="项目ID">
              <el-input v-model="editForm.outerId" :disabled="true" placeholder></el-input>
            </el-form-item>

            <!-- 输入框 -->
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="editForm.name" placeholder="请输入项目名称" clearable></el-input>
            </el-form-item>

            <!-- 下拉单选 -->
            <el-form-item label="客户名称" prop="company">
              <el-select
                v-model="editForm.client"
                value-key="outerId"
                filterable
                placeholder="请选择客户"
                clearable
              >
                <el-option
                  v-for="item in clients"
                  :key="item.outerId"
                  :label="item.company"
                  :value="item"
                >
                  <span style="float: left">{{ item.company }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{
                    item.outerId
                    }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 预定时间 -->
            <el-form-item label="预定时间" required prop="startDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="editForm.startDate"
                style="width: 30%;"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <!-- 交付日 -->
            <el-form-item label="交付日" required prop="endDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="editForm.endDate"
                style="width: 30%;"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>

            <!-- 不可修改 -->
            <el-form-item label="项目上级" prop="leader">
              <el-input v-model="tableData[5].detail" :disabled="true" placeholder></el-input>
            </el-form-item>

            <!-- 文本框 -->
            <el-form-item label="主要里程碑" prop="milestone">
              <el-input type="textarea" v-model="editForm.milestone"></el-input>
            </el-form-item>

            <!-- 多选 -->
            <el-form-item label="采用技术" prop="skillNames">
              <el-checkbox-group v-model="editForm.skillNames">
                <el-checkbox
                  v-for="item in skills"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <!-- 单选 -->
            <el-form-item label="业务领域">
              <el-radio-group v-model="editForm.businessAreaName">
                <el-radio
                  v-for="item in areas"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 文本框 -->
            <!-- <el-form-item label="主要功能" prop="function">
              <el-input type="textarea" v-model="editForm.function"></el-input>
            </el-form-item>-->

            <el-form-item>
              <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
              <el-button @click="resetForm('editForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>

      <!-- 项目详情展示 -->
      <el-table
        :data="tableData"
        :show-header="hiddenTableHeader"
        :row-class-name="getRowClassName"
      >
        <!-- 展开内容 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="客户ID">
                <span>{{ props.row.moreDetail.outerId }}</span>
              </el-form-item>
              <el-form-item label="接口人">
                <span>{{ props.row.moreDetail.innerPerson }}</span>
              </el-form-item>
              <el-form-item label="公司名称">
                <span>{{ props.row.moreDetail.company }}</span>
              </el-form-item>
              <el-form-item label="客户等级">
                <span>{{ props.row.moreDetail.level }}</span>
              </el-form-item>
              <el-form-item label="电子邮件">
                <span>{{ props.row.moreDetail.email }}</span>
              </el-form-item>
              <el-form-item label="电话">
                <span>{{ props.row.moreDetail.phone }}</span>
              </el-form-item>
              <el-form-item label="地址">
                <span>{{ props.row.moreDetail.address }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="140"></el-table-column>
        <el-table-column prop="detail" label="详细信息"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Project from "@/sys/models/project_htx";

export default {
  data() {
    let validateDate = (rule, value, callback) => {
      if (this.editForm.endDate > this.editForm.startDate == false) {
        callback(new Error("交付日须在预定时间之后！"));
      } else {
        callback();
      }
    };
    return {
      // 修改弹框
      dialogFormVisible: false,
      formLabelWidth: "120px",

      // 详情信息
      tableData: [
        {
          name: "项目ID",
          detail: "暂无数据",
          isExpend: 0
        },
        {
          name: "项目名称",
          detail: "暂无数据",
          isExpend: 0
        },
        {
          name: "客户信息",
          detail: "",
          moreDetail: {},
          isExpend: 1
        },
        {
          name: "预定时间",
          detail: "暂无数据",
          isExpend: 0
        },
        {
          name: "交付日",
          detail: "暂无数据",
          isExpend: 0
        },
        {
          name: "项目上级",
          detail: "暂无数据",
          isExpend: 0
        },
        {
          name: "主要里程碑",
          detail: "暂无数据",
          isExpend: 0
        },
        {
          name: "采用技术",
          detail: "暂无数据",
          isExpend: 0
        },
        {
          name: "业务领域",
          detail: "暂无数据",
          isExpend: 0
        },
        {
          name: "主要功能",
          detail: "暂无数据",
          isExpend: 0
        }
      ],

      editForm: {
        outerId: "",
        name: "",
        client: {
          outerId: "",
          company: ""
        },
        startDate: "",
        endDate: "",
        milestone: "",
        skillNames: [],
        businessAreaName: ""
      },
      clients: [
        {
          outerId: "",
          company: ""
        }
      ],
      supervisors: [
        {
          id: 2,
          username: "kiki",
          realName: "kiki"
        }
      ],
      areas: [],
      skills: [],
      rules: {
        name: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
          // { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ],
        client: [
          { required: true, message: "请选择客户姓名", trigger: "blur" }
        ],
        startDate: [
          {
            // type: "date",
            required: true,
            message: "请选择预定日期",
            trigger: "blur"
          }
        ],
        endDate: [
          {
            // type: "date",
            required: true,
            message: "请选择交付时间",
            trigger: "blur"
          },
          { validator: validateDate, trigger: "blur" }
        ],
        // milestone: [
        //   { required: true, message: "请填写主要里程碑", trigger: "blur" }
        // ],
        skillNames: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个技术",
            trigger: "blur"
          }
        ]
      },

      hiddenTableHeader: false
    };
  },
  methods: {
    // 增加隐藏展开图标的样式
    getRowClassName({ row, rowIndex }) {
      if (row.isExpend === 0) {
        return "row-expand-cover";
      }
    },

    // 获取项目详细信息
    async getBasic() {
      console.log("try to get basic info");
      try {
        // 尝试获取项目详细信息
        var outerId = "P01";
        const info = await Project.getBasic(outerId);
        console.log("get basic success!");
        this.tableData[0].detail = info.project.outerId;
        this.tableData[1].detail = info.project.name;
        this.tableData[2].detail = info.projectClient.company;
        this.tableData[2].moreDetail = info.projectClient;
        this.tableData[3].detail = info.project.startDate;
        this.tableData[4].detail = info.project.endDate;
        this.tableData[5].detail = info.project.supervisorName;
        this.tableData[8].detail = info.projectBusinessArea.businessAreaName;
        // 技术
        var skillStr = "";
        for (var i = 0; i < info.projectSkills.length; ++i) {
          skillStr = skillStr + info.projectSkills[i].skillName + " ";
        }
        this.tableData[7].detail = skillStr;
        // 切割里程碑
        var str = "";
        for (var i = 0; i < info.projectMilestones.length; ++i) {
          str =
            str +
            info.projectMilestones[i].progress +
            " " +
            info.projectMilestones[i].recordDate;
          if (i != info.projectMilestones.length - 1) {
            str = str + " \n ";
          }
        }
        this.tableData[6].detail = str;
        // 功能
        str = "";
        for (var i = 0; i < info.projectFunctions.length; ++i) {
          str = str + info.projectFunctions[i].name + " \n ";
        }
        this.tableData[9].detail = str;
      } catch (e) {
        console.log(e);
        // this.$message.error("获取设备信息失败");
      }
    },

    // 修改弹框
    async editBasic() {
      this.dialogFormVisible = true;
      // 客户
      this.clients = await Project.getClients();
      // 项目上级
      // this.supervisors = await Project.getSupervisors();
      // 业务领域
      this.areas = await Project.getAreas();
      // 采用技术
      this.skills = await Project.getSkills();
      var outerId = "P01";
      const info = await Project.getBasic(outerId);
      this.editForm.outerId = info.project.outerId;
      this.editForm.name = info.project.name;
      // this.editForm.client.outerId = info.projectClient.outerId;
      // this.editForm.client.company = info.projectClient.company;
      this.editForm.startDate = info.project.startDate;
      this.editForm.endDate = info.project.endDate;

      var tmpStr = "";
      // for (var i = 0; i < info.projectMilestones.length; ++i) {
      //   tmpStr = tmpStr + info.projectMilestones[i].progress + "\n";
      // }
      this.editForm.milestone = tmpStr;

      // this.editForm.businessAreaName = info.projectBusinessArea;
      // this.editForm.skillNames = info.projectSkills;
      console.log(this.editForm);
    },
    // 提交表单
    submitForm(formName) {
      console.log(formName);
      console.log(this.editForm);
      // var stones = this.editForm.milestone.split("\n");
      // console.log(stones);
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("valid")
          Project.updateBasic(
            this.editForm.outerId,
            this.editForm.name,
            this.editForm.client.outerId,
            this.editForm.client.company,
            this.editForm.startDate,
            this.editForm.endDate,
            this.editForm.milestone,
            this.editForm.skillNames,
            this.editForm.businessAreaName
          ).then(() => {
            alert("submit!");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted: function() {
    console.log("in mounted");
    this.getBasic();
  }
};
</script>

<style>
/* 不显示展开图标 */
.row-expand-cover .el-table__expand-icon {
  visibility: hidden;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  /* width: 480px; */
  margin: 20px 30px 30px 30px;
}

/* 展开信息的样式 */
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
