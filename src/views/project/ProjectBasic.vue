<template>
  <div>
    <PageHeader title="项目基本信息" style="height:40px;"></PageHeader>
    <el-card v-if="this.outerId !== undefined" class="box-card">
      <div slot="header" class="clearfix">
        <span>当前项目ID: {{ this.outerId }}</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="editBasic"
          v-if="
            this.state !== '结束' &&
              this.state !== '已归档' &&
              this.permission === true
          "
          >编辑</el-button
        >

        <!-- 修改项目信息 -->
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
            <el-form-item label="客户名称" prop="client.company">
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
              <el-input
                v-model="tableData[5].detail"
                :disabled="true"
                placeholder
              ></el-input>
            </el-form-item>

            <!-- 文本框 -->
            <el-form-item label="主要里程碑" prop="milestone">
              <el-input
                type="textarea"
                autosize
                :disabled="true"
                v-model="this.stones"
              ></el-input>
              <el-input
                v-if="this.state !== '申请立项'"
                type="textarea"
                autosize
                v-model="editForm.milestone"
              ></el-input>
            </el-form-item>

            <!-- 多选 -->
            <el-form-item label="采用技术" prop="skillNames">
              <el-select
                v-model="editForm.skillNames"
                multiple
                filterable
                placehoder="请选择采用的技术"
              >
                <el-option
                  v-for="item in skills"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 单选 -->
            <el-form-item label="业务领域">
              <el-radio-group v-model="editForm.businessAreaName">
                <el-radio
                  v-for="item in areas"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 文本框 -->
            <!-- <el-form-item label="主要功能" prop="function">
              <el-input type="textarea" v-model="editForm.function"></el-input>
            </el-form-item>-->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm('editForm')"
              >提交</el-button
            >
          </div>
        </el-dialog>
      </div>

      <!-- 项目详情展示 -->
      <el-table
        :data="tableData"
        :show-header="hiddenTableHeader"
        :row-class-name="getRowClassName"
      >
        <!-- 展开客户内容 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item
                v-for="item in props.row.moreDetail"
                :key="item.name"
                :label="item.name"
              >
                <span>{{ item.detail }}</span>
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
import PageHeader from "../../components/common/PageHeader";

export default {
  components: {
    PageHeader
  },

  data() {
    let validateDate = (rule, value, callback) => {
      if (this.editForm.endDate > this.editForm.startDate == false) {
        callback(new Error("交付日须在预定时间之后！"));
      } else {
        callback();
      }
    };
    return {
      state: "",
      outerId: "",
      projectId: "",
      permission: false,
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
          moreDetail: {},
          isExpend: 1
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
        }
        // {
        //   name: "主要功能",
        //   detail: "暂无数据",
        //   isExpend: 0
        // }
      ],

      // 修改框
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
      // 修改框中可选项
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
      stones: "暂无数据",
      rules: {
        name: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
          // { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ],
        ['client.company']: [
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
    async getBasic(outerId) {
      // console.log("try to get basic info");
      try {
        // 尝试获取项目详细信息
        const info = await Project.getBasic(outerId);
        // console.log("get basic success!");

        // 表格取值
        this.tableData[0].detail = info.project.outerId;
        this.tableData[1].detail = info.project.name;
        this.tableData[2].detail = info.projectClient.company;
        // 客户信息展开内容
        this.tableData[2].moreDetail = [
          {
            name: "客户ID",
            detail: info.projectClient.outerId
          },
          {
            name: "接口人",
            detail: info.projectClient.innerPerson
          },
          {
            name: "公司名称",
            detail: info.projectClient.company
          },
          {
            name: "客户等级",
            detail: info.projectClient.level
          },
          {
            name: "电子邮件",
            detail: info.projectClient.email
          },
          {
            name: "电话",
            detail: info.projectClient.phone
          },
          {
            name: "地址",
            detail: info.projectClient.address
          }
        ];
        this.tableData[3].detail = info.project.startDate;
        this.tableData[4].detail = info.project.endDate;
        this.tableData[5].detail = info.project.supervisorName;
        // 里程碑展开内容
        if (info.projectMilestones.length == 0) {
          this.tableData[6].detail = "暂无数据";
        } else {
          this.tableData[6].detail =
            info.projectMilestones[0].recordDate +
            " " +
            info.projectMilestones[0].progress;
          this.tableData[6].moreDetail = [];
          for (var i = 0; i < info.projectMilestones.length; ++i) {
            const obj = {};
            obj.name = info.projectMilestones[i].recordDate;
            obj.detail = info.projectMilestones[i].progress;
            this.tableData[6].moreDetail.push(obj);
          }
        }
        if (
          info.projectBusinessArea === null ||
          info.projectBusinessArea.length === 0
        ) {
          this.tableData[8].detail = "暂无数据";
        } else {
          this.tableData[8].detail = info.projectBusinessArea.businessAreaName;
        }
        // 技术
        if (info.projectSkills.length > 0) {
          var skillStr = "";
          for (var i = 0; i < info.projectSkills.length; ++i) {
            skillStr = skillStr + info.projectSkills[i].skillName;
            if (i != info.projectSkills.length - 1) {
              skillStr += "、 ";
            }
          }
          this.tableData[7].detail = skillStr;
        } else {
          this.tableData[7].detail = "暂无数据";
        }

        // 功能
        // if (info.projectFunctions.length > 0) {
        //   var str = "";
        //   for (var i = 0; i < info.projectFunctions.length; ++i) {
        //     str = str + info.projectFunctions[i].name + " \n ";
        //   }
        //   this.tableData[9].detail = str;
        // } else {
        //   this.tableData[9].detail = "暂无数据";
        // }

        // 获取修改框中的预设值（下拉选项和不可修改的显示）
        // 客户
        this.clients = await Project.getClients();
        // 业务领域
        var tmp = await Project.getAreas();
        this.areas = [];
        for(var i=0;i<tmp.length;++i){
          this.areas.push(tmp[i].name);
        }
        console.log(this.areas);
        // 采用技术
        this.skills = await Project.getSkills();
        // 切割里程碑
        if (info.projectMilestones.length > 0) {
          this.stones = "";
          for (var i = 0; i < info.projectMilestones.length; ++i) {
            this.stones =
              this.stones +
              info.projectMilestones[i].recordDate +
              " " +
              info.projectMilestones[i].progress;
            if (i != info.projectMilestones.length - 1) {
              this.stones = this.stones + "\n";
            }
          }
        } else {
          this.stones = "暂无数据";
        }

        // console.log(this.stones);

        // console.log(this.tableData);
      } catch (e) {
        console.log(e);
        // this.$message.error("获取设备信息失败");
      }
    },

    // 获取项目权限
    async getPermission(projectId) {
      var info = await Project.getPermissions(projectId);
      console.log(info);
      for (var i = 0; i < info.length; ++i) {
        if (info[i].name === "修改项目信息") {
          this.permission = true;
          break;
        }
      }
      console.log("permission: " + this.permission);
    },

    // 修改弹框
    async editBasic() {
      // 项目状态判断
      if (this.state === "结束" || this.state === "已归档") {
        this.$message({
          message: "项目已结束，不可修改！",
          type: "warning"
        });
      } else {
        this.dialogFormVisible = true;

        const info = await Project.getBasic(this.outerId);
        this.editForm = {
          outerId: info.project.outerId,
          name: info.project.name,
          client: {
            outerId: info.projectClient.outerId,
            company: info.projectClient.company
          },
          startDate: info.project.startDate,
          endDate: info.project.endDate,
          milestone: "",
          skillNames: []
        };
        if (
          info.projectBusinessArea === null ||
          info.projectBusinessArea === ""
        ) {
          this.editForm.businessAreaName = "";
        } else {
          this.editForm.businessAreaName =
            info.projectBusinessArea.businessAreaName;
            console.log(this.editForm.businessAreaName);
        }
        for (var i = 0; i < info.projectSkills.length; ++i) {
          this.editForm.skillNames.push(info.projectSkills[i].skillName);
        }

        // this.editForm.businessAreaName = info.projectBusinessArea;
        // this.editForm.skillNames = info.projectSkills;
        // console.log(this.editForm);
      }
    },
    // 提交表单
    submitForm(formName) {
      // console.log(formName);
      // console.log(this.editForm);
      // var stones = this.editForm.milestone.split("\n");
      // console.log(stones);
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log("valid");
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
            this.$message({
              type: "success",
              message: "已提交!"
            });
            this.dialogFormVisible = false;
            this.getBasic(this.outerId);
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
    // console.log("in mounted");
    // 获取项目projectId
    this.projectId = this.$route.query.projectId;

    // 获取outerId
    this.outerId = this.$route.query.outerId;
    // console.log("outerId: " + this.outerId);

    // 获取项目状态
    // console.log(this.$route.query);
    this.state = this.$route.query.projectState;
    // console.log("state: " + this.state);

    if (this.outerId === undefined) {
      this.$message({
        message: "请先选择项目！",
        type: "warning"
      });
    } else {
      // 获取项目基本信息
      this.getBasic(this.outerId);
      // 获取项目权限
      this.getPermission(this.projectId);
    }
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
