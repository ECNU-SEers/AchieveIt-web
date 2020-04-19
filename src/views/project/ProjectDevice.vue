<template>
  <div>
    <el-row
      v-if="
        this.projectId !== undefined &&
          this.permissions.indexOf('查询项目设备信息') <= -1
      "
      style="height: 800px"
    >
      <el-col
        style="height: 800px"
        v-loading="loading"
        element-loading-text="您暂无权限查看此页面"
        element-loading-spinner="el-icon-loading"
      ></el-col>
    </el-row>
    <div v-if="this.permissions.indexOf('查询项目设备信息') > -1">
      <PageHeader title="项目设备信息">
        <!--工具条：搜索栏-->
        <Search
          v-if="
            this.projectId !== undefined &&
              this.permissions.indexOf('查询项目设备信息') > -1
          "
          placeholder="请输入设备名称"
          :query-search="querySearch"
          @search="searchDevice"
          @select-suggestion="selectSearch"
        ></Search>
        <!-- <div style="width:20px;height=100%;"></div> -->

        <!--新增-->
        <el-button
          class="add-btn"
          @click="addFormVisible = true"
          type="primary"
          v-if="
            this.projectState !== '结束' &&
              this.projectState !== '已归档' &&
              this.projectState !== '申请立项' &&
              this.projectState !== '立项驳回' &&
              this.permissions.indexOf('管理项目设备信息') > -1
          "
        >新增</el-button>
      </PageHeader>

      <!--列表展示-->
      <Pagination
        :current-page.sync="pageNo"
        :page-size="pageSize"
        :total="devicesLength"
        @page-change="handlePageChange"
      >
        <el-table
          v-if="
            this.projectId !== undefined &&
              this.permissions.indexOf('查询项目设备信息') > -1
          "
          v-loading="infoLoading"
          :data="deviceData"
          stripe
          border
          :default-sort="{ prop: 'index', order: 'ascending' }"
          highlight-current-row
          style="width:100%"
          :row-key="getRowKeys"
          @expand-change="exChange"
        >
          <!--下拉展示-->
          <!-- <el-table-column type="expand">
          <template>
            <el-table
              :data="inspectData"
              row-key="getRowKeys"
              style="width: 100%"
            >
              <el-table-column
                prop="inspectDate"
                label="检查日期"
                width="300"
              ></el-table-column>
              <el-table-column
                prop="intact"
                label="设备状态"
                width="300"
              ></el-table-column>
              <el-table-column
                prop="remark"
                label="备注"
                width="300"
              ></el-table-column>
            </el-table>
          </template>
          </el-table-column>-->

          <!--列表展示-->
          <el-table-column label="序号" width="70px" type="index"></el-table-column>

          <el-table-column label="资产 ID" prop="outerId"></el-table-column>

          <el-table-column label="资产类型" prop="type"></el-table-column>

          <el-table-column label="资产管理者" prop="managerId"></el-table-column>

          <el-table-column label="开始时间" prop="startDate"></el-table-column>
          <el-table-column label="归还期限" prop="dueDate"></el-table-column>

          <el-table-column label="资产状态" prop="state"></el-table-column>

          <el-table-column label="归还日期" prop="returnDate"></el-table-column>

          <!---编辑和删除-->
          <el-table-column
            label="操作"
            width="180px"
            prop="action"
            v-if="
              this.projectState !== '结束' &&
                this.projectState !== '已归档' &&
                this.projectState !== '申请立项' &&
                this.projectState !== '立项驳回' &&
                this.permissions.indexOf('管理项目设备信息') > -1
            "
          >
            <template slot-scope="{ row }">
              <el-button-group>
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="medium"
                  @click="
                    editFormVisible = true;
                    updateDevice(row);
                  "
                ></el-button>

                <el-button
                  type="success"
                  size="medium"
                  icon="el-icon-check"
                  @click="checkSubmit(row)"
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
        @open="handleForm('addForm')"
        :append-to-body="true"
      >
        <el-form
          :model="addForm"
          :rules="rules"
          ref="addForm"
          label-width="120px"
          @submit.native.prevent
        >
          <!--文本框-->
          <el-form-item label="资产ID:" prop="outerId">
            <el-input v-model="addForm.outerId" clearable :maxlength="maxNameLength" show-word-limit></el-input>
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
          <el-form-item label="资产管理者:" prop="managerId">
            <el-select v-model="addForm.managerId" filterable placeholder="请选择资产管理者">
              <el-option
                v-for="(item, index) in users"
                :key="index + '1'"
                :label="item.realName"
                :value="item.userId"
              >
              <span style="float: left">{{ item.realName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span></el-option>
            </el-select>
          </el-form-item>

          <!--日期段-->
          <el-form-item label="开始使用时间:" prop="startDate">
            <el-date-picker
              v-model="addForm.startDate"
              value-format="yyyy-MM-dd"
              format="yyyy年MM月dd日"
              type="date"
              placeholder="开始使用时间"
              :picker-options="addPickerTimeBeg"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="资产归还期限:" prop="dueDate">
            <el-date-picker
              v-model="addForm.dueDate"
              value-format="yyyy-MM-dd"
              format="yyyy年MM月dd日"
              type="date"
              placeholder="结束日期"
              :picker-options="addPickerTimeEnd"
            ></el-date-picker>
          </el-form-item>

          <!--不可更改-->
          <el-form-item label="资产状态:">
            <el-input placeholder="已领取" v-model="addForm.state" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addSubmit('addForm')">提交</el-button>
        </div>
      </el-dialog>

      <!--编辑-->
      <el-dialog
        title="资产信息"
        :visible.sync="editFormVisible"
        :before-close="handleClose"
        @open="handleForm(editForm)"
        :append-to-body="true"
      >
        <el-form :model="editForm" :rules="rules" ref="editForm" label-width="120px">
          <!--文本框-->
          <el-form-item label="资产ID:" prop="outerId">
            <el-input v-model="editForm.outerId" disabled></el-input>
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
          <el-form-item label="资产管理者:" prop="managerId">
            <el-select v-model="editForm.managerId" filterable placeholder="请选择资产管理者">
              <el-option
                v-for="(item, index) in users"
                :key="index"
                :label="item.realName"
                :value="item.userId"
              >
              <span style="float: left">{{ item.realName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span></el-option>
            </el-select>
          </el-form-item>

          <!--日期段-->
          <el-form-item label="开始使用时间:" prop="startDate">
            <el-date-picker
              v-model="editForm.startDate"
              value-format="yyyy-MM-dd"
              format="yyyy年MM月dd日"
              type="date"
              placeholder="开始日期"
              :picker-options="editPickerTimeBeg"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="资产归还期限:" prop="dueDate">
            <el-date-picker
              v-model="editForm.dueDate"
              value-format="yyyy-MM-dd"
              format="yyyy年MM月dd日"
              type="date"
              placeholder="结束日期"
              :picker-options="editPickerTimeEnd"
            ></el-date-picker>
          </el-form-item>

          <!--不可更改-->
          <el-form-item label="资产状态:">
            <el-input placeholder="已领取" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click="editSubmit('editForm')">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Search from "@/components/common/Search";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import ProjectLW from "@/sys/models/project_lw";
import { mapGetters } from "vuex";
export default {
  components: {
    Search,
    PageHeader,
    Pagination
  },
  data() {
    return {
      maxNameLength: 30,
      maxDesLength: 200,
      infoLoading: true,
      loading: true,
      //分页
      pageNo: 1,
      pageSize: 10,
      devicesLength: 0,
      projectId: 1,
      projectState: "",
      permissions: [],
      //列表
      deviceData: [],
      //下拉展示设备审核
      getRowKeys: row => {
        return row.outerId;
      },
      inspectData: [
        // {
        //   inspectDate:"2020-02-02",
        //   state:"完好",
        //   remark:""v1
        // }
      ],
      //下拉管理员名单
      users: [],
      //编辑
      editFormVisible: false,
      editForm: {
        outerId: "",
        type: "",
        managerId: "",
        startDate: "",
        dueDate: "",
        state: ""
      },
      editPickerTimeBeg: {
        //限制开始时间
        disabledDate: time => {
          if (this.editForm.dueDate != "" && this.editForm.dueDate) {
            let timeStr = new Date(this.editForm.dueDate.replace(/-/g, "/"));
            return time.getTime() > timeStr;
          } else {
            return "";
          }
        }
      },
      editPickerTimeEnd: {
        //限制结束时间
        disabledDate: time => {
          if (this.editForm.startDate != "" && this.editForm.startDate) {
            let timeStr = new Date(this.editForm.startDate.replace(/-/g, "/"));
            return time.getTime() < timeStr;
          } else {
            return "";
          }
        }
      },
      //新增
      addFormVisible: false,
      addForm: {
        outerId: "",
        type: "",
        managerId: "",
        startDate: "",
        dueDate: "",
        state: ""
      },
      addPickerTimeBeg: {
        //限制开始时间
        disabledDate: time => {
          if (this.addForm.dueDate != "" && this.addForm.dueDate) {
            let timeStr = new Date(this.addForm.dueDate.replace(/-/g, "/"));
            return time.getTime() > timeStr;
          } else {
            return "";
          }
        }
      },
      addPickerTimeEnd: {
        //限制结束时间
        disabledDate: time => {
          if (this.addForm.startDate != "" && this.addForm.startDate) {
            let timeStr = new Date(this.addForm.startDate.replace(/-/g, "/"));
            return time.getTime() < timeStr;
          } else {
            return "";
          }
        }
      },
      rules: {
        outerId: [{ required: true, message: "请输入资产ID", trigger: "blur" }],
        type: [
          { required: true, message: "请选择资产类型", trigger: "change" }
        ],
        managerId: [
          { required: true, message: "请选择资产管理者", trigger: "change" }
        ],
        startDate: [
          {
            required: true,
            message: "请选择资产开始使用时间",
            trigger: "change"
          }
        ],
        dueDate: [
          { required: true, message: "请选择归还期限", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.projectId = this.$route.query.projectId;
    this.projectState = this.$route.query.projectState;
    if (this.projectId === undefined) {
      this.$message({
        message: "请先选择项目！",
        type: "warning"
      });
    } else {
      this.getMyPermissions();
      this.getDeviceList("");
      this.getDeviceLength();
      this.getAllMembers();
    }
  },
  methods: {
    handlePageChange(val) {
      this.pageNo = val;
      this.getDeviceList("");
    },

    async getDeviceLength() {
      const results = await ProjectLW.searchDevice(this.projectId, "");
      this.devicesLength = results.length;
    },

    //获取用户当前项目权限
    async getMyPermissions() {
      this.permissions = [];
      const res = await ProjectLW.getMyPermissions(this.projectId);
      var obj = "";
      res.forEach(item => {
        obj = item.name;
        this.permissions.push(obj);
      });
      console.log("getMypermission=" + this.permissions);
    },
    //列表展示
    async getDeviceList(keyword) {
      const res = await ProjectLW.getDeviceList(
        this.pageNo,
        this.pageSize,
        this.projectId,
        keyword
      );
      console.log(res.items);
      this.deviceData = res.items;
      this.infoLoading = false;
    },
    //下拉展示设备审核
    async exChange(row, expandedRows) {
      console.log("exChange");
      var _this = this;
      if (expandedRows.length) {
        //只展开一行
        _this.expands = [];
        if (row) {
          const res = await ProjectLW.getDeviceDetail(
            this.projectId,
            row.outerId
          );
          console.log(res);
          _this.inspectData = res;
        }
      } else {
        _this.expands = []; //收起
      }
    },
    //新增
    async addSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          var _this = this;
          const res = await ProjectLW.addDevice(
            _this.addForm.outerId,
            _this.addForm.type,
            _this.projectId,
            _this.addForm.managerId,
            _this.addForm.startDate,
            _this.addForm.dueDate
          );
          console.log(res);
          this.addFormVisible = false;
          this.$message.success("添加成功");
          this.$refs["addForm"].resetFields();
          this.getDeviceList("");
        } else {
          this.$message.error("请填写正确信息");
          return false;
        }
      });
    },
    //下拉，可选设备管理员
    async getAllMembers() {
      const res = await ProjectLW.getDeviceManager(this.projectId);
      console.log(res);
      this.users = res;
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
    //点击“编辑” 深拷贝原信息
    updateDevice(row) {
      console.log(row.type);
      this.editForm = {
        outerId: row.outerId,
        type: row.type,
        managerId: row.managerId,
        startDate: row.startDate,
        dueDate: row.dueDate,
        state: row.state
      };
    },
    //确认编辑
    editSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        var _this = this;
        console.log("editForm.startDate=" + _this.editForm.startDate);
        console.log("editForm.dueDate=" + _this.editForm.dueDate);
        if (valid) {
          ProjectLW.updateDevice(
            _this.editForm.outerId,
            _this.editForm.type,
            _this.projectId,
            _this.editForm.managerId,
            _this.editForm.startDate,
            _this.editForm.dueDate,
            _this.editForm.returnDate
          ).then(() => {
            _this.editFormVisible = false;
            _this.$message.success("修改成功");
            this.$refs["editForm"].resetFields();
            this.getDeviceList("");
          });
        } else {
          this.$message.error("修改失败");
          return false;
        }
      });
    },
    //搜索
    async querySearch(queryString, cb) {
      var tmp = [];
      const results = await ProjectLW.searchDevice(this.projectId, queryString);
      results.forEach(item => {
        const obj = {};
        obj.id = item;
        obj.value = item;
        tmp.push(obj);
      });
      // 调用 callback 返回建议列表的数据
      cb(tmp);
    },
    //查询返回单个设备信息
    async selectSearch(item) {
      this.selectedMember = item.id;
    },

    async searchDevice(keyword) {
      this.getDeviceList(keyword);
    },
    //确认归还
    checkSubmit(row) {
      this.$confirm("确认归还该设备？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          if (row.state == "已领取") {
            console.log("row.outerId=" + row.outerId);
            ProjectLW.returnDevice(this.projectId, row.outerId).then(() => {
              this.getDeviceList("");
              this.$message({
                type: "success",
                message: "归还成功!"
              });
            });
          } else {
            this.$message.error("设备已归还!");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.add-btn {
  height: 32px;
  margin-left: 20px;
  border-radius: 3px;
  width: 80px;
}
.top-btn {
  height: 40px;
  margin-left: 20px;
  border-radius: 3px;
  width: 80px;
}
</style>
