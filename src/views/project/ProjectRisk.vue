<template>
  <div>
    <el-row
      v-if="this.projectId !== undefined && this.permissions.indexOf('查询项目风险信息') <= -1"
      style="height: 800px"
    >
      <el-col
        style="height: 800px"
        v-loading="loading"
        element-loading-text="您暂无权限查看此页面"
        element-loading-spinner="el-icon-loading"
      ></el-col>
    </el-row>
    <div v-if="this.permissions.indexOf('查询项目风险信息') > -1">
    <PageHeader title="项目风险信息">
      <!--工具条：搜索栏-->
      <Search
        v-model="riskSearch"
        v-if="
          this.projectId !== undefined &&
            this.permissions.indexOf('查询项目风险信息') > -1
        "
        :query-search="querySearch"
        @select-suggestion="getRisk"
        value-key="name"
      ></Search>
      <!-- <div style="width:20px;height=100%;"></div> -->

      <!--新增风险信息-->
      <el-button
        class="add-btn"
        v-if="
          this.projectState !== '结束' &&
            this.projectState !== '已归档' &&
            this.projectState !== '申请立项' &&
            this.projectState !== '立项驳回' &&
            this.permissions.indexOf('新增风险') > -1
        "
        @click="addFormVisible = true"
        type="primary"
        >新增</el-button
      >

      <!--导入-->
      <el-button
        class="add-btn"
        @click="importFormVisible = true"
        type="primary"
        v-if="
          this.projectState !== '结束' &&
            this.projectState !== '已归档' &&
            this.projectState !== '申请立项' &&
            this.projectState !== '立项驳回' &&
            this.permissions.indexOf('新增风险') > -1
        "
        >导入</el-button
      >
    </PageHeader>

    <!--列表展示-->
    <Pagination v-if="this.projectId !== undefined">
      <el-table
        :data="riskData"
        stripe
        border
        highlight-current-row
        style="width: 100%"
        v-if="
          this.projectId !== undefined &&
            this.permissions.indexOf('查询项目风险信息') > -1
        "
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item label="风险 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="风险名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="风险类型">
                <span>{{ props.row.type }}</span>
              </el-form-item>
              <el-form-item label="风险级别">
                <span>{{ props.row.level }}</span>
              </el-form-item>
              <el-form-item label="风险描述">
                <div class="text">
                  <span>{{ props.row.description }}</span>
                </div>
              </el-form-item>
              <el-form-item label="影响程度">
                <span>{{ props.row.impact }}</span>
              </el-form-item>
              <el-form-item label="应对策略">
                <div class="text">
                  <span>{{ props.row.strategy }}</span>
                </div>
              </el-form-item>
              <el-form-item label="风险状态">
                <span>{{ props.row.state }}</span>
              </el-form-item>
              <el-form-item label="责任人">
                <span>{{ props.row.ownerName }}</span>
              </el-form-item>
              <el-form-item label="跟踪频度(单位:次/天)">
                <span>{{ props.row.trackingFreq }}</span>
              </el-form-item>
              <el-form-item label="相关者">
                <span
                  v-for="person in props.row.riskRelatedPeople"
                  :key="person.id"
                  >{{ person.username }}</span
                >
                <span v-if="props.row.riskRelatedPeople == null">暂无</span>
              </el-form-item>
              <el-form-item label="风险来源">
                <span>{{ props.row.source }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="70px"
        ></el-table-column>
        <el-table-column label="风险 ID" prop="id"></el-table-column>
        <el-table-column label="风险名称" prop="name"></el-table-column>
        <el-table-column label="风险类型" prop="type"></el-table-column>
        <el-table-column label="风险级别" prop="level"></el-table-column>
        <!-- <el-table-column label="风险描述" prop="description"></el-table-column>
        <el-table-column label="影响程度" prop="impact"></el-table-column>
        <el-table-column label="应对策略" prop="strategy"></el-table-column>
        <el-table-column label="风险状态" prop="state"></el-table-column>
        <el-table-column label="责任人" prop="ownerId"></el-table-column>
        <el-table-column label="跟踪频度" prop="trackingFreq"></el-table-column>
        <el-table-column label="相关者" prop="relatedPersons"></el-table-column>
        <el-table-column label="风险来源" prop="source"></el-table-column>-->

        <!---编辑和移除-->
        <el-table-column
          label="操作"
          width="180px"
          prop="action"
          v-if="
            this.projectState !== '结束' &&
              this.projectState !== '已归档' &&
              this.projectState !== '申请立项' &&
              this.projectState !== '立项驳回' &&
              this.permissions.indexOf('修改风险信息') > -1
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
                  updateRisk(row);
                "
              ></el-button>

              <el-button
                type="danger"
                size="medium"
                icon="el-icon-delete"
                @click="deleteSubmit(row)"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </Pagination>

    <!--新增-->
    <el-dialog
      title="风险信息"
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
      >
        <!--文本框-->
        <el-form-item label="风险名称:" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>

        <!--文本框-->
        <el-form-item label="风险类型:" prop="type">
          <el-input v-model="addForm.type"></el-input>
        </el-form-item>

        <!--文本域-->
        <el-form-item label="风险描述:" prop="description">
          <el-input
            type="textarea"
            :row="3"
            placeholder="请对该风险进行简要描述"
            v-model="addForm.description"
          ></el-input>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险级别:" prop="level">
          <el-radio-group v-model="addForm.level">
            <el-radio :label="1">低</el-radio>
            <el-radio :label="2">中</el-radio>
            <el-radio :label="3">高</el-radio>
          </el-radio-group>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险影响度:" prop="impact">
          <el-radio-group v-model="addForm.impact">
            <el-radio :label="1">低</el-radio>
            <el-radio :label="2">中</el-radio>
            <el-radio :label="3">高</el-radio>
          </el-radio-group>
        </el-form-item>

        <!--文本域-->
        <el-form-item label="风险应对策略:" prop="strategy">
          <el-input
            type="textarea"
            :row="3"
            placeholder="请输入风险应对策略"
            v-model="addForm.strategy"
          ></el-input>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险状态:">
          <el-input placeholder="仍存在" disabled></el-input>
        </el-form-item>

        <!--带搜索的下拉选择-->
        <el-form-item label="风险责任人:" prop="owner">
          <el-select
            v-model="addForm.owner"
            value-key="userId"
            @visible-change="getAllMembers($event)"
            filterable
            placeholder="请选择该风险责任人"
          >
            <el-option
              v-for="item in users.items"
              :key="item.userId"
              :label="item.realName + '(' + item.username + ')'"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险跟踪频度:（单位:天/次）" prop="trackingFreq">
          <el-input v-model="addForm.trackingFreq"></el-input>
        </el-form-item>

        <!--风险相关人员 （多选、可搜索）-->
        <el-form-item label="风险相关者:" prop="relatedPersons">
          <el-select
            v-model="addForm.relatedPersons"
            @visible-change="getAllMembers($event)"
            multiple
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in users.items"
              :key="item.userId"
              :label="item.realName + '(' + item.username + ')'"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--不可更改-->
        <el-form-item label="资产来源:">
          <el-input placeholder="项目自身识别" :disabled="true"></el-input>
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

    <!--导入-->
    <el-dialog
      title="导入风险信息"
      :visible.sync="importFormVisible"
      :before-close="handleClose"
      :append-to-body="true"
      @open="clearCascader()"
      center
    >
      <div
        style="text-align:center;margin:-20px auto 0 auto;color:red;font-size:1px;"
      >
        <span
          >(提示：若从其他项目导入，可直接搜索项目名称，所选项目所有风险将会被导入)</span
        >
        <div style="padding-top:30px;">
          <el-cascader
            ref="cascader"
            v-model="importSourceId"
            :options="importSources"
            :props="importProps"
            :show-all-levels="false"
            filterable
            clearable
          >
          </el-cascader>
        </div>
        <div style="padding-top:30px;">
          <el-button
            type="primary"
            @click="importSubmit()"
            style="margin-right:8%;"
            >导入</el-button
          >
          <el-button @click="importFormVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!--编辑-->
    <el-dialog
      title="风险信息"
      :visible.sync="editFormVisible"
      :before-close="handleClose"
      @open="handleForm('editForm')"
      :append-to-body="true"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="120px"
      >
        <!--文本框-->
        <el-form-item label="风险名称:" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>

        <!--文本框-->
        <el-form-item label="风险类型:" prop="type">
          <el-input v-model="editForm.type"></el-input>
        </el-form-item>

        <!--文本域-->
        <el-form-item label="风险描述:" prop="description">
          <el-input
            type="textarea"
            :row="3"
            placeholder="请对该风险进行简要描述"
            v-model="editForm.description"
          ></el-input>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险级别:" prop="level">
          <el-radio-group v-model="editForm.level">
            <el-radio :label="1">低</el-radio>
            <el-radio :label="2">中</el-radio>
            <el-radio :label="3">高</el-radio>
          </el-radio-group>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险影响度:" prop="impact">
          <el-radio-group v-model="editForm.impact">
            <el-radio :label="1">低</el-radio>
            <el-radio :label="2">中</el-radio>
            <el-radio :label="3">高</el-radio>
          </el-radio-group>
        </el-form-item>

        <!--文本域-->
        <el-form-item label="风险应对策略:" prop="strategy">
          <el-input
            type="textarea"
            :row="3"
            placeholder="请输入风险应对策略"
            v-model="editForm.strategy"
          ></el-input>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险状态:" prop="state">
          <el-radio-group v-model="editForm.state">
            <el-radio :label="1">仍存在</el-radio>
            <el-radio :label="2">已排除</el-radio>
          </el-radio-group>
        </el-form-item>

        <!--带搜索的下拉选择-->
        <el-form-item label="风险责任人:" prop="owner">
          <el-select
            v-model="editForm.owner"
            value-key="userId"
            @visible-change="getAllMembers($event)"
            filterable
            placeholder="请选择该风险责任人"
          >
            <el-option
              v-for="item in users.items"
              :key="item.userId"
              :label="item.realName + '(' + item.username + ')'"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险跟踪频度:（单位:天/次）" prop="trackingFreq">
          <el-input v-model="editForm.trackingFreq"></el-input>
        </el-form-item>

        <!--风险相关人员 （多选、可搜索）-->
        <el-form-item label="风险相关者:" prop="relatedPersons">
          <el-select
            v-model="editForm.relatedPersons"
            @visible-change="getAllMembers($event)"
            value-key="username"
            multiple
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in users.items"
              :key="item.userId"
              :label="item.realName + '(' + item.username + ')'"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--风险来源-->
        <el-form-item label="风险来源:">
          <el-input v-model="editForm.source" disabled></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="editSubmit('editForm')"
            style="margin-right:8%;"
            >添加</el-button
          >
          <el-button @click="addFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import Search from "@/components/common/Search";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import ProjectLW from "@/sys/models/project_lw";
// import { mapGetters } from "vuex";
export default {
  components: {
    Search,
    PageHeader,
    Pagination
  },
  data() {
    return {
      projectId: 1,
      projectState: "",
      pageNo: 1,
      pageSize: 10,
      riskSearch: "",
      riskData: [],
      results: [],
      users: [],
      owner: [],
      relatedPersons: [],
      row: "",
      permissions: [],
      //风险级别映射
      level: [
        {},
        {
          name: "低",
          value: 1
        },
        {
          name: "中",
          value: 2
        },
        {
          name: "高",
          value: 3
        }
      ],
      //风险影响度映射
      impact: [
        {},
        {
          name: "低",
          value: 1
        },
        {
          name: "中",
          value: 2
        },
        {
          name: "高",
          value: 3
        }
      ],
      //风险状态映射
      state: [
        {},
        {
          name: "仍存在",
          value: 1
        },
        {
          name: "已排除",
          value: 2
        }
      ],
      //风险来源映射
      source: [
        {},
        {
          name: "项目自身识别",
          value: 1
        },
        {
          name: "从其它项目导入",
          value: 2
        },
        {
          name: "从组织风险标准库导入",
          value: 3
        }
      ],
      //新增
      addFormVisible: false,
      addForm: {
        owner: [],
        relatedPersons: []
      },
      //编辑
      editFormVisible: false,
      editForm: {
        owner: [],
        relatedPersons: []
      },
      rules: {
        name: [{ required: true, message: "请输入风险名称", trigger: "blur" }],
        type: [
          { required: true, message: "请选择风险类型", trigger: "change" }
        ],
        description: [
          { required: true, message: "请输入风险描述", trigger: "blur" }
        ],
        level: [
          { required: true, message: "请选择风险级别", trigger: "change" }
        ],
        impact: [
          { required: true, message: "请选择风险影响度", trigger: "change" }
        ],
        strategy: [
          { required: true, message: "请输入风险策略", trigger: "blur" }
        ],
        owner: [
          { required: true, message: "请选择资风险管理者", trigger: "change" }
        ],
        trackingFreq: [
          { required: true, message: "请选择风险跟踪频度", trigger: "change" }
        ],
        relatedPersons: [
          {
            required: true,
            message: "请选择至少一位风险相关者",
            trigger: "change"
          }
        ],
        state: [
          { required: true, message: "请选择风险状态", trigger: "change" }
        ]
      },
      //导入
      importFormVisible: false,
      importSourceId: [],
      importProps: {
        expandTrigger: "hover",
        children: "otherProjects",
      },
      importSources: [
        {
          value: "-1",
          label: "组织标准风险库"
        },
        {
          value: "otherProject",
          label: "其他项目",
          children: []
        }
      ]
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
      this.getMyPermissions(this.projectId);
      this.getRiskList();
      this.getOtherProjects();
    }
  },
  methods: {
    //获取用户当前项目权限
    async getMyPermissions() {
      const res = await ProjectLW.getMyPermissions(this.projectId);
      var obj = "";
      res.forEach(item => {
        obj = item.name;
        this.permissions.push(obj);
      });

      console.log("getMypermission=" + this.permissions);
    },
    //列表展示
    async getRiskList() {
      var _this = this;
      const res = await ProjectLW.getRiskList(
        this.projectId,
        this.pageNo,
        this.pageSize
      );
      var tmp = [];
      res.items.forEach(item => {
        const obj = {};
        if (item.id == null || "") {
          obj.id = "暂无数据";
        } else {
          obj.id = item.id;
        }
        if (item.name == null || "") {
          obj.name = "暂无数据";
        } else {
          obj.name = item.name;
        }
        if (item.type == null || "") {
          obj.type = "暂无数据";
        } else {
          obj.type = item.type;
        }
        if (item.level == null || "") {
          obj.level = "暂无数据";
        } else {
          obj.level = _this.level[item.level].name;
        }
        if (item.impact == null || "") {
          obj.impact = "暂无数据";
        } else {
          obj.impact = _this.impact[item.impact].name;
        }
        if (item.strategy == null || "") {
          obj.strategy = "暂无数据";
        } else {
          obj.strategy = item.strategy;
        }
        if (item.ownerName == null || "") {
          obj.ownerName = "暂无数据";
        } else {
          obj.ownerName = item.ownerName;
        }
        if (item.trackingFreq === null || "") {
          obj.trackingFreq = "暂无数据";
        } else {
          obj.trackingFreq = item.trackingFreq;
        }
        if (item.description === null || "") {
          obj.description = "暂无数据";
        } else {
          obj.description = item.description;
        }
        if (item.state === null || "") {
          obj.state = "暂无数据";
        } else {
          obj.state = _this.state[item.state].name;
        }
        if (item.source === null || "") {
          obj.source = "暂无数据";
        } else {
          obj.source = _this.source[item.source].name;
        }
        if (JSON.stringify(item.riskRelatedPeople) == "{}") {
          obj.riskRelatedPeople = null;
        } else {
          console.log("there are riskRelatedPeople! and item.id="+item.id);
          obj.riskRelatedPeople = item.riskRelatedPeople;
        }
        tmp.push(obj);
      });
      this.riskData = tmp;
    },
    //新增
    addSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          var _this = this;
          const res = await ProjectLW.addRisk(
            this.projectId,
            this.addForm.name,
            this.addForm.type,
            this.addForm.level,
            this.addForm.impact,
            this.addForm.strategy,
            this.addForm.owner.userId,
            this.addForm.owner.realName, //realname or username
            this.addForm.trackingFreq,
            this.addForm.description,
            this.addForm.relatedPersons
          );
          // console.log(res);
          this.getRiskList();
          this.addFormVisible = false;
          this.$message.success("添加成功");
        } else {
          this.$message.error("请填写正确信息");
          return false;
        }
      });
    },
    //Form下拉，项目成员
    async getAllMembers(callback) {
      // console.log("回调参数" + callback);
      if (callback) {
        const res = await ProjectLW.getAllMembers(this.projectId);
        console.log("member="+res);
        this.users = res;
      } else;
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
    //映射数字对应的中文
    find(obj, val) {
      var res;
      obj.forEach(item => {
        if (item.name == val) {
          res = item.value;
        }
      });
      //console.log(val+"深拷贝:"+res);
      return res;
    },
    //点击“编辑” 深拷贝原信息
    updateRisk(row) {
      var _this = this;
      this.editForm = {
        name: row.name === "暂无数据" ? "" : row.name,
        type: row.type === "暂无数据" ? "" : row.type,
        level: this.$options.methods.find(_this.level, row.level),
        impact: this.$options.methods.find(_this.impact, row.impact),
        strategy: row.strategy === "暂无数据" ? "" : row.strategy,
        owner: row.ownerName === "暂无数据" ? "" : row.ownerName,
        trackingFreq: row.trackingFreq === "暂无数据" ? "" : row.trackingFreq,
        source: row.source,
        description: row.description === "暂无数据" ? "" : row.description,
        relatedPersons: row.riskRelatedPeople,
        state: this.$options.methods.find(_this.state, row.state)
      };
      this.row = row;
    },
    //确认编辑
    editSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        var _this = this;
        if (valid) {
          const res = await ProjectLW.updateRisk(
            _this.projectId,
            _this.row.id,
            _this.editForm.name,
            _this.editForm.type,
            _this.editForm.level,
            _this.editForm.impact,
            _this.editForm.strategy,
            _this.editForm.state,
            _this.editForm.owner.userId,
            _this.editForm.owner.realName, //realname or username
            _this.editForm.trackingFreq,
            _this.editForm.source,
            _this.editForm.description,
            _this.editForm.relatedPersons
          );
          // console.log(res);
          _this.editFormVisible = false;
          _this.$message.success("修改成功");
          this.getRiskList();
        } else {
          this.$message.error("修改失败");
          return false;
        }
      });
    },
    //删除
    deleteSubmit(row) {
      this.$confirm("此操作将永久删除该风险信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await ProjectLW.deleteRisk(this.projectId, row.id);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getRiskList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //导入
        //下拉，获取其他项目
    async getOtherProjects() {
      var _this = this;
        const res = await ProjectLW.getOtherProjects();
        var tmp = [];
        res.forEach(item => {
          const obj = {};
          obj.value = item.id;
          obj.label = item.name + "( ID:" + item.outerId + " )";
          tmp.push(obj);
        });
         this.$set(this.importSources[1], "otherProjects", tmp);
    },
   // 再次打开“导入”前，清空选框内容
    clearCascader() {
      this.importSourceId="";
      // let obj = {};
      // obj.stopPropagation = () => {};
      // try {
      
      //   this.$refs.cascader.clearValue(obj);
       
      // } catch (e) {
      //   this.$refs.cascader.handleClear(obj);
      // }
    },
    //确定“导入”
    async importSubmit() {
      var importSourceId = this.importSourceId;
      var _this = this;
      try {
        if (importSourceId == -1) {
          const res = await ProjectLW.importRisksFromStdLib(this.projectId);
          _this.$message.success("导入成功1");
        } else {
         // console.log("importSourceId="+importSourceId[1]);
          const res = await ProjectLW.importRisksFromOtherProject(
            this.projectId,
            importSourceId[1]
          );
          _this.$message.success("导入成功");
        }
        this.getRiskList();
        this.importFormVisible = false;
      } catch (e) {
        _this.$message.error("导入失败");
      }
    },
    //搜索
    async querySearch(queryString, cb) {
      var tmp = [];
      const results = await ProjectLW.searchRisk(this.projectId, queryString);
      results.forEach(item => {
        const obj = {};
        obj.id = item.id;
        obj.value = item.name;
        tmp.push(obj);
      });
      // 调用 callback 返回建议列表的数据
      console.log("tmp=" + tmp);
      cb(tmp);
    },
    //查询
    async getRisk(item) {
      console.log("item=" + item);
      const res = await ProjectLW.getRisk(this.projectId, item.id);
      console.log("返回查询结果=" + res);
    }
    // cb(this.results);
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
.demo-table-expand .el-form-item {
  width: 50%;
  .text {
    height: 100%;
    width: 100%;
  }
}
</style>
