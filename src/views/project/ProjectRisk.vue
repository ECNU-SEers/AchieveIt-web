<template>
  <div>
    <PageHeader title="风险信息">
      <!--工具条：搜索栏-->
      <Search />
      <div style="width:20px;height=100%;"></div>

      <!--新增风险信息-->
      <el-button
        size="medium"
        @click="addFormVisible = true"
        type="primary"
        class="top-btn"
        >新增</el-button
      >

      <!--导入-->
      <el-button
        size="medium"
        @click="importFormVisible = true"
        type="primary"
        class="top-btn"
        >导入</el-button
      >
    </PageHeader>

    <!--列表展示-->
    <Pagination>
      <el-table
        :data="riskData"
        stripe
        border
        :default-sort="{ prop: 'id', order: 'ascending' }"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="序号" prop="index" fixed></el-table-column>

        <el-table-column label="风险 ID" prop="id"></el-table-column>

        <el-table-column label="风险类型" prop="type"></el-table-column>

        <el-table-column label="风险描述" prop="description"></el-table-column>

        <el-table-column label="风险级别" prop="level"></el-table-column>

        <el-table-column label="风险影响度" prop="influence"></el-table-column>

        <el-table-column label="风险应对策略" prop="strategy"></el-table-column>

        <el-table-column label="风险状态" prop="status"></el-table-column>

        <el-table-column label="风险责任人" prop="monitor"></el-table-column>

        <el-table-column
          label="风险跟踪频度"
          prop="frequency"
        ></el-table-column>

        <el-table-column label="风险相关者" prop="related"></el-table-column>

        <el-table-column label="风险来源" prop="source"></el-table-column>

        <!---编辑和移除-->
        <el-table-column label="操作" width="180px" prop="action">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="medium"
                @click="addFormVisible = true"
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
        <el-form-item label="风险ID:" prop="id">
          <el-input v-model="addForm.id"></el-input>
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
            <el-radio label="低"></el-radio>
            <el-radio label="中"></el-radio>
            <el-radio label="高"></el-radio>
          </el-radio-group>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险影响度:" prop="influence">
          <el-radio-group v-model="addForm.influence">
            <el-radio label="低"></el-radio>
            <el-radio label="中"></el-radio>
            <el-radio label="高"></el-radio>
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
        <el-form-item label="风险状态:" prop="status">
          <el-radio-group v-model="addForm.influence">
            <el-radio label="未解决"></el-radio>
            <el-radio label="已解决"></el-radio>
          </el-radio-group>
        </el-form-item>

        <!--带搜索的下拉选择-->
        <el-form-item label="风险责任人:" prop="monitor">
          <el-select
            v-model="addForm.monitor"
            filterable
            placeholder="请选择该风险责任人"
          >
            <el-option
              v-for="item in monitors"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险跟踪频度:" prop="frequency">
          <el-radio-group v-model="addForm.frequency">
            <el-radio label="一天一次"></el-radio>
            <el-radio label="一周一次"></el-radio>
            <el-radio label="一月一次"></el-radio>
            <el-radio label="三月一次"></el-radio>
            <el-radio label="半年一次"></el-radio>
          </el-radio-group>
        </el-form-item>

        <!--风险相关人员 （多选、可搜索）-->
        <el-form-item label="风险相关者:" prop="related">
          <el-select
            v-model="addForm.related"
            multiple
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--不可更改-->
        <el-form-item label="资产来源:">
          <el-input
            placeholder="系统本身识别"
            v-model="addForm.source"
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

    <!--导入-->
    <el-dialog
      title="导入风险信息"
      :visible.sync="importFormVisible"
      :before-close="handleClose"
      @open="handleForm('importForm')"
      :append-to-body="true"
      center
    >
      <div
        style="text-align:center;margin:-20px auto 0 auto;color:red;font-size:1px;"
      >
        <span
          >(提示：若从其他项目导入，可直接搜索项目ID，所选项目所有风险将会被导入)</span
        >
        <div style="padding-top:30px;">
          <el-cascader
            v-model="importSource"
            :options="importSources"
            :props="{ expandTrigger: 'hover' }"
            :show-all-levels="false"
            filterable
            @change="handleChange"
          ></el-cascader>
        </div>
        <div style="padding-top:30px;">
          <el-button
            type="primary"
            @click="addSubmit('importForm')"
            style="margin-right:8%;"
            >导入</el-button
          >
          <el-button @click="addFormVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!--编辑-->
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
        <el-form-item label="风险ID:" prop="id">
          <el-input v-model="addForm.id"></el-input>
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
            <el-radio label="低"></el-radio>
            <el-radio label="中"></el-radio>
            <el-radio label="高"></el-radio>
          </el-radio-group>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险影响度:" prop="influence">
          <el-radio-group v-model="addForm.influence">
            <el-radio label="低"></el-radio>
            <el-radio label="中"></el-radio>
            <el-radio label="高"></el-radio>
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
        <el-form-item label="风险状态:" prop="status">
          <el-radio-group v-model="addForm.influence">
            <el-radio label="未解决"></el-radio>
            <el-radio label="已解决"></el-radio>
          </el-radio-group>
        </el-form-item>

        <!--带搜索的下拉选择-->
        <el-form-item label="风险责任人:" prop="monitor">
          <el-select
            v-model="addForm.monitor"
            filterable
            placeholder="请选择该风险责任人"
          >
            <el-option
              v-for="item in monitors"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险跟踪频度:" prop="frequency">
          <el-radio-group v-model="addForm.frequency">
            <el-radio label="一天一次"></el-radio>
            <el-radio label="一周一次"></el-radio>
            <el-radio label="一月一次"></el-radio>
            <el-radio label="三月一次"></el-radio>
            <el-radio label="半年一次"></el-radio>
          </el-radio-group>
        </el-form-item>

        <!--风险相关人员 （多选、可搜索）-->
        <el-form-item label="风险相关者:" prop="related">
          <el-select
            v-model="addForm.related"
            multiple
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--不可更改-->
        <el-form-item label="资产来源:">
          <el-input
            placeholder="系统本身识别"
            v-model="addForm.source"
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
  </div>
</template>

<script>
import Search from "@/components/common/Search";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";

export default {
  components: {
    Search,
    PageHeader,
    Pagination
  },
  data() {
    return {
      riskData: [
        {
          index: "1",
          id: "1",
          type: "技术",
          description: "巴拉巴拉",
          level: "中",
          influence: "中",
          strategy: "巴拉巴拉",
          monitor: "dd",
          frequency: "一周一次",
          related: ["狗蛋子", "李四", "二麻子"],
          status: "未解决",
          source: "项目自己识别"
        },
        {
          index: "1",
          id: "1",
          type: "技术",
          description: "巴拉巴拉",
          level: "中",
          influence: "中",
          strategy: "巴拉巴拉",
          monitor: "dd",
          frequency: "一周一次",
          related: ["狗蛋子", "李四", "二麻子"],
          status: "未解决",
          source: "项目自己识别"
        }
      ],
      monitors: [
        {
          //资产管理者选项
          value: "1",
          label: "人名1"
        }
      ],

      //新增
      addFormVisible: false,
      addForm: {
        id: "",
        type: "",
        description: "",
        level: "",
        influence: "",
        strategy: "",
        monitor: "",
        frequency: "",
        related: []
      },
      rules: {
        id: [{ required: true, message: "请输入风险ID", trigger: "blur" }],
        type: [
          { required: true, message: "请选择风险类型", trigger: "change" }
        ],
        description: [
          { required: true, message: "请输入风险描述", trigger: "blur" }
        ],
        level: [
          { required: true, message: "请选择风险级别", trigger: "change" }
        ],
        influence: [
          { required: true, message: "请选择风险影响度", trigger: "change" }
        ],
        strategy: [
          { required: true, message: "请输入风险策略", trigger: "blur" }
        ],
        monitor: [
          { required: true, message: "请选择资风险管理者", trigger: "change" }
        ],
        frequency: [
          { required: true, message: "请选择风险跟踪频度", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择风险状态", trigger: "change" }
        ],
        related: [
          {
            required: true,
            message: "请选择至少一位风险相关者",
            trigger: "change"
          }
        ]
      },

      //导入
      importFormVisible: false,
      importSource: "",
      importSources: [
        {
          value: "standard",
          label: "组织标准风险库"
        },
        {
          value: "otherProject",
          label: "其他项目",
          children: [
            {
              value: "1", //设为label 可搜索
              label: "开心项目（ID：balaba）"
            },
            {
              value: "22",
              label: "快乐项目（ID：balaba）"
            }
          ]
        }
      ]
    };
  },
  methods: {
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

    //修改
    editSubmit(formName) {
      alert("修改成功");
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
