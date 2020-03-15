<template>
  <div class="config">
    <sticky-top>
      <div class="config-header">
        <p class="title">当前项目:007</p>
      </div>
    </sticky-top>
    <div class="body">
      <div style="width:100%;hegiht:500px;backgournd-color:black;"></div>
      <div class="config-form">
        <el-form :model="configForm" label-width="130px">
          <p class="title-form">项目配置信息</p>
          <el-form-item label="Git仓库地址:">
            <el-input
              v-model="configForm.GitAddress"
              placeholder="暂无数据"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="虚拟机空间:">
            <el-input
              v-model="configForm.virtualSpace"
              placeholder="暂无数据"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="文件服务器目录:">
            <el-input
              v-model="configForm.fileCatalog"
              placeholder="未生成"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <!--------------编辑----------------->
          <el-form-item>
            <el-button
              v-permission="'修改配置信息'"
              @click="changeFormVisible = true"
              type="primary"
              >编辑</el-button
            >
            <el-dialog
              title="项目配置信息"
              :visible.sync="changeFormVisible"
              :append-to-body="true"
            >
              <el-form :model="form">
                <el-form-item label="Git仓库地址:">
                  <el-input v-model="configForm.GitAddress"></el-input>
                </el-form-item>
                <el-form-item label="虚拟机空间:">
                  <el-input v-model="configForm.virtualSpace"></el-input>
                </el-form-item>
                <el-form-item label="文件服务器目录:">
                  <el-input v-model="configForm.fileCatalog"></el-input>
                </el-form-item>
                <el-form-item style="padding-left:65%;">
                  <el-button
                    type="primary"
                    @click="
                      changeFormSubmit;
                      changeFormVisible = false;
                    "
                    style="margin-right:8%;"
                    >确 定</el-button
                  >
                  <el-button @click="changeFormVisible = false"
                    >取 消</el-button
                  >
                </el-form-item>
              </el-form>
            </el-dialog>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      configForm: {
        GitAddress: '暂无数据',
        virtualSpace: '暂无数据',
        fileCatalog: '未生成',
        unit: ''
      },
      changeFormVisible: false
    };
  },
  methods: {
    changeFormSubmit() {
      //修改配置信息
    }
  }
};
</script>

<style lang="scss" scoped>
.config {
  .config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-bottom: -24px;

    .title {
      float: left;
      height: 59px;
      line-height: 59px;
      color: #4c76af;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .body {
    position: absolute;
    width: 100%;
    height: 100%;
    margin-top: 50px;
    // background-color: white;
    .title-form {
      margin-left: 40%;
      height: 59px;
      line-height: 59px;
      color: #4c76af;
      font-size: 16px;
      font-weight: 500;
    }

    .config-form {
      margin: 3% auto 0 auto;
      position: relative;
      height: 480px;
      width: 500px;
      padding-top: 25px;
      background-color: white;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .config-form label {
      color: #99a9bf;
    }
    .config-form .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      margin-top: 35px;
      margin-left: 30px;
      width: 80%;

      .el-button {
        margin-left: 25%;
      }
    }
  }
}
</style>
