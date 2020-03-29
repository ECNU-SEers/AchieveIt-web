<template>
  <div>
    <PageHeader title="风险信息">
      <!--工具条：搜索栏-->
      <Search />
      <div style="width:20px;height=100%;"></div>

      <!--新增风险信息-->
      <el-button size="medium" @click="addFormVisible = true" type="primary" class="top-btn">新增</el-button>

      <!--导入-->
      <el-button size="medium" @click="importFormVisible = true" type="primary" class="top-btn">导入</el-button>
    </PageHeader>

    <!--列表展示-->
    <Pagination>
      <el-table
        :data="riskData"
        stripe
        border
        highlight-current-row
         v-loading="loading"
        style="width: 100%"
      >
       <el-table-column type="expand">
         <template slot-scope="props">
           <el-form label-position="left" class="demo-table-expand">
             <el-form-item label="风险 ID">
               <span>{{props.row.id}}</span>
               </el-form-item>
             <el-form-item label="风险名称">
               <span>{{props.row.name}}</span>
               </el-form-item>
               <el-form-item label="风险类型">
               <span>{{props.row.type}}</span>
               </el-form-item>
                  <el-form-item label="风险级别">
               <span>{{props.row.level}}</span>
               </el-form-item>
                  <el-form-item label="风险描述">
               <div class="text"> <span>{{props.row.description}}</span></div>
               </el-form-item>
                  <el-form-item label="影响程度">
               <span>{{props.row.impact}}</span>
               </el-form-item>
                  <el-form-item label="应对策略">
               <div class="text"> <span>{{props.row.strategy}}</span></div>
               </el-form-item>
                  <el-form-item label="风险状态">
               <span>{{props.row.state}}</span>
               </el-form-item>
                  <el-form-item label="责任人">
               <span>{{props.row.ownerName}}</span>
               </el-form-item>
                  <el-form-item label="跟踪频度">
               <span>{{props.row.trackingFreq}}</span>
               </el-form-item>
                  <el-form-item label="相关者" >
               <span v-for ="person in props.row.riskRelatedPeople" :key="person.id" >   {{person.username}}   </span> 
               </el-form-item>
                  <el-form-item label="风险来源">
               <span>{{props.row.source}}</span>
               </el-form-item>
           </el-form>
         </template>
       </el-table-column>
        <el-table-column label="序号" type="index" fixed></el-table-column>
        <el-table-column label="风险级别" prop="level"></el-table-column>
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
        <el-table-column label="风险来源" prop="source"></el-table-column> -->

        <!---编辑和移除-->
        <el-table-column label="操作" width="180px" prop="action">
          <template slot-scope="{row,$index}">
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="medium"
                @click="editFormVisible = true;updateRisk(row)"
              ></el-button>

              <el-button type="danger" size="medium" icon="el-icon-delete" @click="deleteSubmit(row)"></el-button>
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
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px">
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
            <el-radio :label=1>低</el-radio>
            <el-radio :label=2>中</el-radio>
            <el-radio :label=3>高</el-radio>
          </el-radio-group>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险影响度:" prop="impact">
          <el-radio-group v-model="addForm.impact">
             <el-radio :label=1>低</el-radio>
            <el-radio :label=2>中</el-radio>
            <el-radio :label=3>高</el-radio>
          </el-radio-group>
        </el-form-item>

        <!--文本域-->
        <el-form-item label="风险应对策略:" prop="strategy">
          <el-input type="textarea" :row="3" placeholder="请输入风险应对策略" v-model="addForm.strategy"></el-input>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险状态:" >
        <el-input placeholder="仍存在" disabled></el-input>
        </el-form-item>

        <!--带搜索的下拉选择-->
        <el-form-item label="风险责任人:" prop="owner">
          <el-select v-model="addForm.owner" value-key="userId"  @visible-change="getAllMembers($event)" filterable placeholder="请选择该风险责任人">
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.username"
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
          <el-select v-model="addForm.relatedPersons" @visible-change="getAllMembers($event)" multiple filterable placeholder="请选择">
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.username"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--不可更改-->
        <el-form-item label="资产来源:">
          <el-input placeholder="项目本身识别"  :disabled="true"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addSubmit('addForm')" style="margin-right:8%;">添加</el-button>
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
      <div style="text-align:center;margin:-20px auto 0 auto;color:red;font-size:1px;">
        <span>(提示：若从其他项目导入，可直接搜索项目ID，所选项目所有风险将会被导入)</span>
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
          <el-button type="primary" @click="addSubmit('importForm')" style="margin-right:8%;">导入</el-button>
          <el-button @click="addFormVisible = false">取消</el-button>
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
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="120px">
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
            <el-radio :label=1>低</el-radio>
            <el-radio :label=2>中</el-radio>
            <el-radio :label=3>高</el-radio>
          </el-radio-group>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险影响度:" prop="impact">
          <el-radio-group v-model="editForm.impact">
            <el-radio :label=1>低</el-radio>
            <el-radio :label=2>中</el-radio>
            <el-radio :label=3>高</el-radio>
          </el-radio-group>
        </el-form-item>

        <!--文本域-->
        <el-form-item label="风险应对策略:" prop="strategy">
          <el-input type="textarea" :row="3" placeholder="请输入风险应对策略" v-model="editForm.strategy"></el-input>
        </el-form-item>

        <!--单选-->
        <el-form-item label="风险状态:" prop="state">
          <el-radio-group v-model="editForm.state">
            <el-radio :label=1>仍存在</el-radio>
            <el-radio :label=2>已排除</el-radio>
          </el-radio-group>
        </el-form-item>

        <!--带搜索的下拉选择-->
        <el-form-item label="风险责任人:" prop="owner">
          <el-select v-model="editForm.owner"  @visible-change="getAllMembers($event)" filterable placeholder="请选择该风险责任人">
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.username"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--单选-->
          <!--单选-->
        <el-form-item label="风险跟踪频度:（单位:天/次）" prop="trackingFreq">
          <el-input v-model="editForm.trackingFreq"></el-input>
        </el-form-item>

        <!--风险相关人员 （多选、可搜索）-->
        <el-form-item label="风险相关者:" prop="relatedPersons">
          <el-select v-model="editForm.relatedPersons"  @visible-change="getAllMembers($event)" multiple filterable placeholder="请选择">
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.username"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>

         <!--资产来源-->
        <el-form-item label="资产来源:">
          <el-input  v-model="editForm.source"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="editSubmit('editForm')" style="margin-right:8%;">添加</el-button>
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
      projectId: 1,
      pageNo: 1,
      pageSize: 10,
      riskData: [],
      users: [],
       owner:[],
       relatedPersons:[],
       row:"",
      //新增
      addFormVisible: false,
      addForm: {
        owner:[],
        relatedPersons:[]
      },
      
     //编辑
     editFormVisible: false,
      editForm: {
        owner:[],
        relatedPersons:[]
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
      importSource: "",
      importSources: [
        {
          value: "standard",
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
  mounted(){
    this.getRiskList();
  },
  methods: {
     //列表展示
    async getRiskList() {
      const res = await ProjectLW.getRiskList(
        this.projectId,
        this.pageNo,
        this.pageSize
      );
      this.riskData = res.items;
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
            this.addForm.owner.username,
            this.addForm.trackingFreq,
            this.addForm.description,
            this.addForm.relatedPersons
          );
         // console.log(res);
          this.addFormVisible=false;
       this.$message.success("添加成功");
       getRiskList();
        } else {
          this.$message.error("请填写正确信息");
          return false;
        }
      });
    },
   //下拉，项目成员
    async getAllMembers(callback) {
     // console.log("回调参数" + callback);
      if (callback) {
        const res = await ProjectLW.getAllMembers(this.projectId);
       // console.log(res);
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

  
    //点击“编辑” 深拷贝原信息
     updateRisk(row){

      this.editForm = {
         name:row.name,
         type:row.type,
         level:row.level,
         impact:row.impact,
         strategy:row.strategy,
         owner:row.ownerName,
         trackingFreq:row.trackingFreq,
         source:row.source,
         description:row.description,
         relatedPersons:row.riskRelatedPeople,
         state:row.state
      };
      this.row=row;
     },

    //确认编辑
    editSubmit(formName) {
           this.$refs[formName].validate(async valid => {
        var _this = this;
        if (valid) {
          const res = await ProjectLW.updateRisk(_this.row.id,_this.projectId,this.editForm);
         // console.log(res);
          _this.editFormVisible = false;
          _this.$message.success("修改成功");
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
          const res =await ProjectLW.deleteRisk(this.projectId,row.id); 
            this.$message({
              type: "success",
              message: "删除成功!"
            });
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
.top-btn {
  height: 40px;
  margin-left: 20px;
  border-radius: 3px;
  width: 80px;
}
.demo-table-expand .el-form-item{
     width:50%;
     .text{
       height:100%;
       width:100%;
     }
}
</style>
