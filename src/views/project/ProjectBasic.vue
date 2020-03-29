<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>AchieveIt</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="editBasic"
          >修改</el-button
        >

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
              <el-input
                v-model="editForm.outerId"
                :disabled="true"
                placeholder
              ></el-input>
            </el-form-item>

            <!-- 输入框 -->
            <el-form-item label="项目名称" prop="name">
              <el-input
                v-model="editForm.name"
                placeholder="请输入项目名称"
                clearable
              ></el-input>
            </el-form-item>

            <!-- 下拉单选 -->
            <el-form-item label="客户名称" prop="userName">
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
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.outerId
                  }}</span>
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
              ></el-date-picker> </el-form-item
            >-->
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
              <el-input
                v-model="tableData[5].detail"
                :disabled="true"
                placeholder
              ></el-input>
            </el-form-item>

            <!-- 文本框 -->
            <el-form-item label="主要里程碑" prop="milestone">
              <el-input type="textarea" v-model="editForm.milestone"></el-input>
            </el-form-item>

            <!-- 多选 -->
            <el-form-item label="采用技术" prop="skills">
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
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
              <el-button @click="resetForm('editForm')">重置</el-button>
            </el-form-item> -->
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
      if (this.editForm.endDete > this.editForm.startDete == false) {
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
          detail: "",
          isExpend: 0
        },
        {
          name: "项目名称",
          detail: "",
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
          detail: "",
          isExpend: 0
        },
        {
          name: "交付日",
          detail: "2020-04-29",
          isExpend: 0
        },
        {
          name: "项目上级",
          detail: "小张",
          isExpend: 0
        },
        {
          name: "主要里程碑",
          detail: "主要里程碑主要里程碑主要里程碑主要里程碑",
          isExpend: 0
        },
        {
          name: "采用技术",
          detail: ["技术1", "技术2"],
          isExpend: 0
        },
        {
          name: "业务领域",
          detail: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          isExpend: 0
        },
        {
          name: "主要功能",
          detail: "XXXXXXXXXXXXXXXXXXXXXXXX",
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
        milestone: [],
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
        company: [
          { required: true, message: "请选择客户姓名", trigger: "change" }
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
        milestone: [
          { required: true, message: "请填写主要里程碑", trigger: "blur" }
        ],
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
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // let {} = this.ruleForm;
          // updateBasic({}).then(()=>{

          alert("submit!");
          // })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
        this.tableData[6].detail = info.project.projectMilestones;
        this.tableData[7].detail = info.project.projectSkills;
        this.tableData[8].detail = info.project.projectFunctions;
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
      this.editForm.client.outerId = info.projectClient.outerId;
      this.editForm.client.company = info.projectClient.company;
      this.editForm.startDate = info.project.startDate;
      this.editForm.endDate = info.project.endtDate;
      this.editForm.milestone = info.projectMilestones;
      this.editForm.businessAreaName = info.projectBusinessArea;
      this.editForm.skillNames = info.projectSkills;
      console.log(this.editForm.endDate);
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
