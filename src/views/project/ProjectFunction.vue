<template>
  <div>
    <el-row v-if="this.projectId !== undefined && this.getInfoPermission !== true" style="height: 800px">
      <el-col style="height: 800px"
        v-loading="loading"
        element-loading-text="您暂无权限查看此页面"
        element-loading-spinner="el-icon-loading"
      ></el-col>
    </el-row>
    <div v-if="this.getInfoPermission === true">
      <!--工具条：搜索栏-->
      <PageHeader title="项目功能列表">
        <Search
          v-if="this.projectId !== undefined"
          placeholder="请输入功能名称"
          :query-search="querySearch"
          @search="searchFunctions"
          @select-suggestion="getOne"
        >
          <!-- <span style="float: left">{{ item.value }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{item.id}}</span>-->
        </Search>
        <!-- <el-input prefix-icon="el-icon-search" v-model="search" style="width: 200px" placeholder="输入关键字搜索"></el-input> -->
        <el-button
          type="primary"
          class="add-btn"
          @click="addFirst"
          v-if="
            this.state !== '结束' &&
              this.state !== '已归档' &&
              this.state !== '申请立项' &&
              this.state !== '立项驳回' &&
              this.permission === true
          "
        >新增</el-button>
        <el-button
          type="primary"
          class="add-btn"
          @click="addExcelFormVisible = true"
          v-if="
            this.state !== '结束' &&
              this.state !== '已归档' &&
              this.state !== '申请立项' &&
              this.state !== '立项驳回' &&
              this.permission === true
          "
        >导入</el-button>
        <el-button
          type="primary"
          class="add-btn"
          v-if="
            this.state !== '结束' &&
              this.state !== '已归档' &&
              this.state !== '申请立项' &&
              this.state !== '立项驳回' &&
              this.permission === true
          "
          @click="exportExcel"
        >导出</el-button>
      </PageHeader>

      <!-- 导入excel -->
      <el-dialog title="导入项目功能列表" :visible.sync="addExcelFormVisible">
        <el-upload
          action
          :auto-upload="false"
          :limit="1"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :on-change="handleChange"
        >
          <el-button type="primary">上传excel文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传excel文件，一次仅支持上传一个且大小不超过10MB</div>
        </el-upload>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addExcelFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload" :loading="submitLoading">提交</el-button>
        </div>
      </el-dialog>

      <!-- 功能列表 -->
      <Pagination v-if="this.projectId !== undefined">
        <el-table
          v-if="this.projectId !== undefined"
          :data="tableData"
          style="margin-bottom: 20px;"
          row-key="id"
          stripe
          border
          lazy
          :load="load"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column width="50"></el-table-column>
          <el-table-column type="index" label="序号" width="70"></el-table-column>
          <el-table-column prop="id" label="功能ID" width="180"></el-table-column>
          <el-table-column prop="name" label="功能名称" width="180"></el-table-column>
          <el-table-column prop="description" label="功能描述"></el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            width="180px"
            v-if="
              this.state !== '结束' &&
                this.state !== '已归档' &&
                this.state !== '申请立项' &&
                this.state !== '立项驳回' &&
                this.permission === true
            "
            v-permission="'归档申请'"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  size="medium"
                  @click="addSubFunction(scope.$index, scope.row)"
                  icon="el-icon-plus"
                ></el-button>
                <el-button
                  size="medium"
                  type="primary"
                  @click="editFunction(scope.$index, scope.row)"
                  icon="el-icon-edit"
                ></el-button>
                <el-button
                  size="medium"
                  type="danger"
                  @click="deleteFunction(scope.$index, scope.row)"
                  icon="el-icon-delete"
                ></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </Pagination>

      <!-- 新增 -->
      <el-dialog title="新增项目功能" :visible.sync="addFormVisible">
        <el-form label-width="150px" class="demo-ruleForm">
          <!-- <el-form-item label="项目ID" required>
          <el-input v-model="addForm.id" placeholder="请填写项目ID"></el-input>
          </el-form-item>-->

          <el-form-item label="功能名称" required>
            <el-input v-model="addForm.name" placeholder="请填写功能名称"></el-input>
          </el-form-item>

          <el-form-item label="功能描述">
            <el-input type="textarea" v-model="addForm.description" placeholder="请填写功能描述"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAddForm" :loading="submitLoading">提交</el-button>
        </div>
      </el-dialog>

      <!-- 修改 -->
      <el-dialog title="修改项目功能" :visible.sync="editFormVisible">
        <el-form label-width="150px" class="demo-ruleForm">
          <!-- <el-form-item label="项目ID" required>
          <el-input v-model="editForm.id" placeholder="请填写项目ID"></el-input>
          </el-form-item>-->

          <el-form-item label="项目名称" required>
            <el-input v-model="editForm.name" placeholder="请填写项目名称"></el-input>
          </el-form-item>

          <el-form-item label="项目描述">
            <el-input type="textarea" v-model="editForm.description" placeholder="请填写项目描述"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEditForm" :loading="submitLoading">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import PageHeader from "../../components/common/PageHeader";
import Search from "../../components/common/Search";
import Pagination from "../../components/common/Pagination";
import Project from "@/sys/models/project_htx";
import XLSX from "xlsx";

export default {
  components: {
    PageHeader,
    Search,
    Pagination
  },
  data() {
    return {
      loading: true,
      testpermission: false,
      state: "",
      permission: false,
      getInfoPermission: false,
      // 搜索
      keyword: "",
      functionSearch: [],
      submitLoading: false,
      projectId: "",

      addExcelFormVisible: false,
      fileList: [],
      functionId: 0,
      addFormVisible: false,
      editFormVisible: false,
      tableData: [],
      addForm: {
        // id: "",
        name: "",
        description: ""
      },
      parentId: -1,
      editForm: {
        id: "",
        name: "",
        description: ""
      },

      // 导入
      uploadFuntion: [],
      // 导出
      row: 1
    };
  },
  methods: {
    // 获取项目权限
    async getPermission(projectId) {
      var info = await Project.getPermissions(projectId);
      console.log(info);
      for (var i = 0; i < info.length; ++i) {
        if (info[i].name === "管理项目功能列表") {
          this.permission = true;
          this.getInfoPermission = true;

          break;
        }
        if (info[i].name === "查询项目功能列表") {
          this.getInfoPermission = true;
          console.log("permission：查询");
        }
      }
      if (this.getInfoPermission === false) {
        this.$message({
          message: "无权限查看！",
          type: "warning"
        });
      }
      console.log("permission: " + this.permission);
    },
    showInfo() {},
    // 获取一级功能列表并展示
    async getFunctionList(keyword) {
      try {
        const info = await Project.getFirstFunctionList(
          this.projectId,
          keyword
        );
        console.log("get function list success!");
        this.tableData = info;

        for (var i = 0; i < this.tableData.length; ++i) {
          // 标记有二级功能的功能
          if (this.tableData[i].numSubFunctions > 0) {
            this.tableData[i].hasChildren = true;
          }
          // 标记一级功能
          this.tableData[i].isSub = false;
          // 功能描述展示
          if (
            this.tableData[i].description === null ||
            this.tableData[i].description === ""
          ) {
            this.tableData[i].description = "暂无数据";
          }
        }
      } catch (e) {
        console.log(e);
        // this.$message.error("获取功能列表失败");
      }
    },
    // 二级功能懒加载
    async load(tree, treeNode, resolve) {
      // 当前节点的id
      console.log("tree.id");
      console.log(tree.id);
      var info = await Project.getSubFunctionList(this.projectId, tree.id);
      console.log("sub function:");
      console.log(info);

      for (var i = 0; i < info.length; ++i) {
        // 标记有二级功能的功能
        // if (info[i].numSubFunctions > 0) {
        //   info[i].hasChildren = true;
        // }
        // 标记为二级功能
        info[i].isSub = true;
        // 功能描述展示
        if (info[i].description === null || info[i].description === "") {
          info[i].description = "暂无数据";
        }
      }

      setTimeout(() => {
        resolve(info);
      }, 500);
    },
    // 新增一级弹框
    addFirst() {
      // 项目状态判断
      if (
        this.state === "结束" ||
        (this.state === "已归档" &&
          this.state !== "申请立项" &&
          this.state !== "立项驳回")
      ) {
        this.$message({
          message: "项目已结束，不可修改！",
          type: "warning"
        });
      } else {
        this.addFormVisible = true;
        this.parentId = -1;
      }
    },
    // 新增子功能弹框
    addSubFunction(index, row) {
      // 项目状态判断
      if (
        this.state === "结束" ||
        (this.state === "已归档" &&
          this.state !== "申请立项" &&
          this.state !== "立项驳回")
      ) {
        this.$message({
          message: "项目已结束，不可修改！",
          type: "warning"
        });
      } else {
        // 二级功能无法拥有总功能
        if (row.isSub) {
          this.$message({
            message: "二级功能无法扩展",
            type: "warning"
          });
        } else {
          this.addFormVisible = true;
          this.parentId = row.id;
        }
      }
      console.log(row.isSub);
    },
    // 提交新增功能
    async submitAddForm() {
      try {
        const info = await Project.addFunction(
          this.projectId,
          this.addForm.name,
          this.addForm.description,
          this.parentId
        );
        console.log("add function list success!");
        this.addFormVisible = false;
        this.parentId = -1;
      } catch (e) {
        console.log(e);
      }
      this.getFunctionList(this.keyword);
    },
    // 删除功能
    async deleteFunction(index, row) {
      if (
        this.state === "结束" ||
        (this.state === "已归档" &&
          this.state !== "申请立项" &&
          this.state !== "立项驳回")
      ) {
        this.$message({
          message: "项目已结束，不可修改！",
          type: "warning"
        });
      } else {
        console.log(row);

        this.$confirm("是否确定删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            try {
              console.log("id: " + row.id);
              var info = await Project.deleteFunction(this.projectId, row.id);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              location.reload();
              // this.getFunctionList(this.keyword);
            } catch (e) {
              console.log(e);
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      }
    },
    // 修改弹窗
    editFunction(index, row) {
      if (
        this.state === "结束" ||
        (this.state === "已归档" &&
          this.state !== "申请立项" &&
          this.state !== "立项驳回")
      ) {
        this.$message({
          message: "项目已结束，不可修改！",
          type: "warning"
        });
      } else {
        this.editForm.name = row.name;
        if (row.description === "暂无数据") {
          this.editForm.description = "";
        } else {
          this.editForm.description = row.description;
        }
        this.editForm.id = row.id;
        this.editFormVisible = true;
      }
    },
    // 修改提交
    async submitEditForm() {
      try {
        const info = await Project.editFunction(
          this.projectId,
          this.editForm.id,
          this.editForm.name,
          this.editForm.description
        );
        console.log("edit function list success!");
        this.editFormVisible = false;
        this.getFunctionList(this.keyword);
      } catch (e) {
        console.log(e);
      }
    },
    // 上传excel
    async submitUpload() {
      if (this.submitUploadfailed === false) {
        let parentId = 0;
        let i = 0;
        for (i = 0; i < this.uploadFuntion.length; i++) {
          const func = this.uploadFuntion[i];
          if (func.hasOwnProperty("一级功能名称")) {
            parentId = await Project.addFunction(
              this.projectId,
              func["一级功能名称"],
              func["一级功能描述"]
            );
            await Project.addFunction(
              this.projectId,
              func["二级功能名称"],
              func["二级功能描述"],
              parentId
            );
          } else {
            await Project.addFunction(
              this.projectId,
              func["二级功能名称"],
              func["二级功能描述"],
              parentId
            );
          }
        }
        this.$message({
          message: "提交成功！",
          type: "success"
        });
        this.addExcelFormVisible = false;
        this.getFunctionList("");
      } else {
        this.$message.error("上传文件的大小不能超过10M!");
      }
    },
    handleChange(file, fileList) {
      const size = file.size / 1024 / 1024;
      if (size > 10) {
        this.submitUploadfailed = true;
        this.$message.error("上传文件的大小不能超过10M!");
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          // console.log(workbook)
          let sheet = Object.keys(workbook.Sheets)[0];
          const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]); //获得以第一列为键名的sheet数组对象
          this.uploadFuntion = json;
          console.log(json);
        } catch (e) {
          console.log(e);
        }
      };
      fileReader.readAsBinaryString(file.raw);
    },
    handleSuccess() {},
    handleError() {},

    // 搜索
    async querySearch(queryString, cb) {
      console.log(queryString);
      var tmp = [];
      this.functionSearch = await Project.searchFunctions(
        this.projectId,
        queryString
      );
      console.log(this.functionSearch);
      // 下拉显示的数据
      this.functionSearch.forEach(item => {
        const obj = {};
        obj.id = item.id;
        obj.value = item.name;
        tmp.push(obj);
      });
      this.functionSearch = tmp;
      cb(tmp);
    },
    searchFunctions(item) {
      console.log(item);
      console.log("search or click");
    },

    // 点击下拉中的一条获取一条功能信息
    async getOne(item) {
      console.log(item);
      try {
        const info = await Project.getOneFunction(this.projectId, item.id);
        console.log(info);
        // 标记有二级功能的功能
        if (info.subFunctions.length > 0) {
          info.hasChildren = true;
        } else {
          info.hasChildren = false;
        }
        this.tableData = [];
        this.tableData.push(info);
      } catch (e) {
        console.log(e);
      }
    },

    // 导出
    sheet2blob(sheet, sheetName) {
      sheetName = sheetName || "sheet1";
      var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
      };
      workbook.Sheets[sheetName] = sheet;
      // 生成excel的配置项
      var wopts = {
        bookType: "xlsx", // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: "binary"
      };
      var wbout = XLSX.write(workbook, wopts);
      var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
      // 字符串转ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
      return blob;
    },

    openDownloadDialog(url, saveName) {
      if (typeof url == "object" && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
      }
      var aLink = document.createElement("a");
      aLink.href = url;
      aLink.download = saveName || ""; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event;
      if (window.MouseEvent) event = new MouseEvent("click");
      else {
        event = document.createEvent("MouseEvents");
        event.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
      }
      aLink.dispatchEvent(event);
    },

    async exportExcel() {
      this.row = 1;
      let aoa = [
        ["一级功能名称", "一级功能描述", "二级功能名称", "二级功能描述"]
      ];
      let firstFunction = await Project.getFirstFunctionList(
        this.projectId,
        ""
      );
      let i = 0;
      let merges = [];
      for (i = 0; i < firstFunction.length; i++) {
        let mergeItem1 = {};
        let mergeItem2 = {};
        const start1 = { r: this.row, c: 0 };
        const start2 = { r: this.row, c: 1 };
        let secondFunction = await Project.getSubFunctionList(
          this.projectId,
          firstFunction[i].id
        );
        let j = 0;
        if (secondFunction.length === 0) {
          let aoaItem = [];
          aoaItem.push(firstFunction[i].name);
          aoaItem.push(firstFunction[i].description);
          aoaItem.push(null);
          aoaItem.push(null);
          aoa.push(aoaItem);
          this.row += 1;
        }
        for (j = 0; j < secondFunction.length; j++) {
          let aoaItem = [];
          if (j === 0) {
            aoaItem.push(firstFunction[i].name);
            aoaItem.push(firstFunction[i].description);
            aoaItem.push(secondFunction[j].name);
            aoaItem.push(secondFunction[j].description);
            aoa.push(aoaItem);
          } else {
            aoaItem.push(null);
            aoaItem.push(null);
            aoaItem.push(secondFunction[j].name);
            aoaItem.push(secondFunction[j].description);
            aoa.push(aoaItem);
          }
        }
        this.row += j;
        const end1 = { r: this.row - 1, c: 0 };
        const end2 = { r: this.row - 1, c: 1 };
        mergeItem1["s"] = start1;
        mergeItem1["e"] = end1;
        merges.push(mergeItem1);
        mergeItem2["s"] = start2;
        mergeItem2["e"] = end2;
        merges.push(mergeItem2);
      }
      var sheet = XLSX.utils.aoa_to_sheet(aoa);
      sheet["!merges"] = merges;
      // sheet["!merges"] = [
      //   // 设置A1-C1的单元格合并
      //   { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }
      // ];
      this.openDownloadDialog(this.sheet2blob(sheet), "项目功能列表.xlsx");
    }
  },

  mounted: function() {
    this.projectId = this.$route.query.projectId;
    console.log("projectId: " + this.projectId);
    // 获取项目状态
    this.state = this.$route.query.projectState;
    console.log("state: " + this.state);

    if (this.projectId === undefined) {
      this.$message({
        message: "请先选择项目！",
        type: "warning"
      });
    } else {
      this.keyword = "";
      this.getFunctionList(this.keyword);
      // 获取项目权限
      this.getPermission(this.projectId);
    }
  }
};
</script>

<style scoped>
.add-btn {
  height: 32px;
  margin-left: 20px;
  border-radius: 3px;
  width: 80px;
}
</style>
