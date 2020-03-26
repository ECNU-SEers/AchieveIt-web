<template>
  <div>
    <PageHeader title="设备信息">
      <!--工具条：搜索栏-->
      <Search placeholder="请输入设备ID" :query-search="searchDevice">
          <template slot-scope="{ item }">
          <span >{{ item.outerId }}</span>
        </template>

      </Search>
      <div style="width:20px;height=100%;"></div>

      <!--新增-->
      <el-button size="medium" @click="addFormVisible = true" type="primary"
        >新增</el-button
      >
    </PageHeader>

    <!--列表展示-->
    <Pagination>
      <el-table
        :data="deviceData"
        stripe
        border
        :default-sort="{ prop: 'index', order: 'ascending' }"
        highlight-current-row
        style="width:100%"
      >
        <!--下拉展示-->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form
              inline="true"
              title="检查情况"
              label-position="left"
              class="table-expand"
            >
              <el-form-item label="检查日期:">
                <span>{{ props.row.inspectDate }}</span>
              </el-form-item>
              <el-form-item label="设备状态:">
                <span>{{ props.row.intact }}</span>
              </el-form-item>
              <el-form-item label="备注:">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <!--列表展示-->
        <el-table-column label="序号" type="index"></el-table-column>

        <el-table-column label="资产 ID" prop="outerId"></el-table-column>

        <el-table-column label="资产类型" prop="type"></el-table-column>

        <el-table-column label="资产管理者" prop="managerId"></el-table-column>

        <el-table-column label="开始时间" prop="startDate"></el-table-column>
        <el-table-column label="归还期限" prop="dueDate"></el-table-column>

        <el-table-column label="资产状态" prop="state"></el-table-column>

        <el-table-column label="归还日期" prop="returnDate"></el-table-column>

        <!---编辑和删除-->
        <el-table-column label="操作" width="180px" prop="action">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="medium"
                @click="editFormVisible = true;"
              ></el-button>

              <el-button
                type="danger"
                size="medium"
                icon="el-icon-delete"
                @click="deleteSubmit"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </Pagination>

    <!--新增-->
    <el-dialog
      title="资产信息"
      :visible.sync="addFormVisible"
      :before-close="handleClose"
      @open="handleForm"
      :append-to-body="true"
    >
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="120px"
      >
        <!--文本框-->
        <el-form-item label="资产ID:" prop="id">
          <el-input v-model="addForm.outerId"></el-input>
        </el-form-item>

        <!--单选-->
        <el-form-item label="资产类型:" prop="type">
          <el-radio-group v-model="addForm.type">
            <el-radio label="电脑"></el-radio>
            <el-radio label="手机"></el-radio>
            <el-radio label="PAD"></el-radio>
            <el-radio label="移动存储设备"></el-radio>
          </el-radio-group>
        </el-form-item>

        <!--带搜索的下拉选择-->
        <el-form-item label="资产管理者:" prop="monitor">
          <el-select
            v-model="addForm.managerName"
            filterable
            placeholder="请选择资产管理者"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.username"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--日期段-->
        <el-form-item label="资产使用期限:" prop="date">
          <el-date-picker
          v-model="addForm.startDate"
          type="date"
          placeholder="开始日期"
          >
          </el-date-picker>
          <span>&nbsp;至&nbsp;</span>
          <el-date-picker
            v-model="addForm.dueDate"
            type="date"
            placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <!--不可更改-->
        <el-form-item label="资产状态:">
          <el-input
            placeholder="已领取"
            v-model="addForm.state"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="addSubmit('addForm')"
            style="margin-right:8%;"
            >添加</el-button
          >
          <el-button @click="addFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--编辑-->
    <el-dialog
      title="资产信息"
      :visible.sync="editFormVisible"
      :before-close="handleClose"
      @open="handleForm"
      :append-to-body="true"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="120px" 
      >
        <!--文本框-->
        <el-form-item label="资产ID:" prop="id">
          <el-input v-model="editForm.outerId"></el-input>
        </el-form-item>

        <!--单选-->
        <el-form-item label="资产类型:" prop="type">
          <el-radio-group v-model="editForm.type">
            <el-radio label="电脑"></el-radio>
            <el-radio label="手机"></el-radio>
            <el-radio label="PAD"></el-radio>
            <el-radio label="移动存储设备"></el-radio>
          </el-radio-group>
        </el-form-item>

        <!--带搜索的下拉选择-->
        <el-form-item label="资产管理者:" prop="monitor">
          <el-select
            v-model="editForm.managerName"
            filterable
            placeholder="请选择资产管理者"
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.username"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--日期段-->
        <el-form-item label="资产使用期限:" prop="date">
          <el-date-picker
          v-model="editForm.startDate"
          type="date"
          placeholder="开始日期"
          >
          </el-date-picker>
          <span>至</span>
          <el-date-picker
            v-model="editForm.dueDate"
            type="date"
            placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <!--不可更改-->
        <el-form-item label="资产状态:">
          <el-input
            placeholder="已领取"
            v-model="editForm.state"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="editSubmit('editForm')"
            style="margin-right:8%;"
            >修改</el-button
          >
          <el-button @click="addFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Search from "@/components/common/Search";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import ProjectLW from "@/sys/models/project_lw";

export default {
  components: {
    Search,
    PageHeader,
    Pagination
  },
  data() {
    return {
      //分页
      pageNo: 1,
      pageSize: 1,
      projectId: 1,

        //列表
      deviceData: [],
      //下拉管理员名单
      users:[],

      //编辑
      editFormVisible: false,
      editForm:{
        outerId:"",
        type:"",
        managerName:"",
        startDate:"",
        dueDate:"",
        sate:""
      },
    

      //新增
      addFormVisible: false,
      addForm: {
        outerId: "",
        type: "",
        managerName: "",
        startDate: "",
        dueDate:"",
        state: ""
      },
      rules: {
        id: [{ required: true, message: "请输入资产ID", trigger: "blur" }],
        type: [
          { required: true, message: "请选择资产类型", trigger: "change" }
        ],
        monitor: [
          { required: true, message: "请选择资产管理者", trigger: "change" }
        ],
        date: [
          { required: true, message: "请选择资产使用期限", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.getDeviceList();
    this.getUserModal();
  },
  methods: {
    //搜索
    searchDevice(queryString,cb){
      var deviceData = this.deviceData;
      var results =queryString
      ? deviceData.filter(this.createFilter(queryString))
      :deviceData;
      cb(results);
    },
      createFilter(queryString) {
      return device => {
        return (
          device.outerId.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },

    //列表展示
    async getDeviceList() {
      const res = await ProjectLW.getDeviceList(
        this.pageNo,
        this.pageSize,
        this.projectId
      );

      if (res.code === 1000) {
        this.deviceData = res.data.items;
      } else {
        this.$message.error("获取设备信息失败");
      }
    },
    //新增
    addSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("提交成功");
        } else {
          alert("提交失败");
          return false;
        }
      });
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    handleForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].clearValidate();
        this.$refs[formName].resetFields();
      }
    },

    //编辑
    //获取备选管理员
    async getUserModal(){
      const res =await ProjectLW.getAllUser();
      if(res.code===1000){
        this.users=res.data;
      }else{
        this.$message.error("获取管理者名单失败");
      }
    },
     editSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            const res =  ProjectLW.updateDeviceDetail(this.form)
        }else{
          console.log('error submit!')
          this.$message.error('信息错误')
          return false
        }
      })
      addFormVisible = false;
    },

    //删除
    deleteSubmit() {
      alert("删除成功");
    }
  }
};
</script>

<style lang="scss" scoped>
.top-btn {
  height: 40px;
  margin-left: 20px;
  border-radius: 3px;
  width: 80px;
}
</style>
