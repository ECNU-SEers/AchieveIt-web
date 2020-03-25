<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>AchieveIt</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="dialogFormVisible = true"
          >修改</el-button
        >

        <el-dialog title="修改项目基本信息" :visible.sync="dialogFormVisible">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <!-- 不可修改 -->
            <el-form-item label="项目ID">
              <el-input
                v-model="tableData[0].detail"
                :disabled="true"
                placeholder=""
              ></el-input>
            </el-form-item>

            <!-- 输入框 -->
            <el-form-item label="项目名称" prop="name">
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入项目名称"
                clearable
              ></el-input>
            </el-form-item>

            <!-- 下拉单选 -->
            <el-form-item label="客户名称" prop="userName">
              <el-select
                v-model="ruleForm.userName"
                placeholder="请选择客户"
                clearable
              >
                <el-option label="客户1" value="客户11"></el-option>
                <el-option label="客户2" value="客户22"></el-option>
              </el-select>
            </el-form-item>

            <!-- 预定时间 -->
            <el-form-item label="预定时间" required prop="date1">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.date1"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>

            <!-- 交付日 -->
            <el-form-item label="交付日" required prop="date2">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.date2"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>

            <!-- 下拉单选 -->
            <el-form-item label="项目上级" prop="leader">
              <el-select v-model="ruleForm.leader" placeholder="请选择项目上级">
                <el-option label="项目上级1" value="上级1"></el-option>
                <el-option label="项目上级2" value="上级2"></el-option>
              </el-select>
            </el-form-item>

            <!-- 文本框 -->
            <el-form-item label="主要里程碑" prop="milestone">
              <el-input type="textarea" v-model="ruleForm.milestone"></el-input>
            </el-form-item>

            <!-- 多选 -->
            <el-form-item label="采用技术" prop="skills">
              <el-checkbox-group v-model="ruleForm.skills">
                <el-checkbox label="技术1" name="type"></el-checkbox>
                <el-checkbox label="技术2" name="type"></el-checkbox>
                <el-checkbox label="技术3" name="type"></el-checkbox>
                <el-checkbox label="技术4" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <!-- 单选 -->
            <el-form-item label="业务领域">
              <el-radio-group v-model="ruleForm.area">
                <el-radio label="业务领域1"></el-radio>
                <el-radio label="业务领域2"></el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 文本框 -->
            <el-form-item label="主要功能" prop="function">
              <el-input type="textarea" v-model="ruleForm.function"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')"
                >提交</el-button
              >
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>

      <el-table :data="tableData" :show-header="hiddenTableHeader">
        <el-table-column prop="name" label="名称" width="140">
        </el-table-column>
        <el-table-column prop="detail" label="详细信息"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: "120px",

      tableData: [
        {
          name: "项目ID",
          detail: "G08_20200312"
        },
        {
          name: "项目名称",
          detail: "AchieveIt项目管理系统"
        },
        {
          name: "客户信息",
          detail: "小明"
        },
        {
          name: "预定时间",
          detail: "2020-02-23"
        },
        {
          name: "交付日",
          detail: "2020-04-29"
        },
        {
          name: "项目上级",
          detail: "小张"
        },
        {
          name: "主要里程碑",
          detail: "主要里程碑主要里程碑主要里程碑主要里程碑"
        },
        {
          name: "采用技术",
          detail: ["技术1", "技术2"]
        },
        {
          name: "业务领域",
          detail: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        },
        {
          name: "主要功能",
          detail: "XXXXXXXXXXXXXXXXXXXXXXXX"
        }
      ],

      ruleForm: {
        name: "",
        userName: "",
        date1: "",
        date2: "",
        leader: "",
        milestone: "",
        skills: [],
        area: "",
        function: ""
      },

      // 修改Form初始为原本的项目信息
      // ruleForm.name: tableData[1].detail;
      // userName:tableData[2].detail,
      // date1:'',
      // date2:'',
      // leader:tableData[5].detail,
      // milestone:tableData[6].detail,
      // skills:'',
      // area:tableData[8].detail,
      // function:tableData[9].detail

      rules: {
        name: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请选择客户姓名", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择预定日期",
            trigger: "blur"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择交付时间",
            trigger: "blur"
          }
        ],
        leader: [
          { required: true, message: "请选择项目上级", trigger: "blur" }
        ],
        milestone: [
          { required: true, message: "请填写主要里程碑", trigger: "blur" }
        ],
        skills: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个技术",
            trigger: "blur"
          }
        ],
        function: [
          { required: true, message: "请填写项目主要功能", trigger: "blur" }
        ]
      },

      hiddenTableHeader: false
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
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
</style>
