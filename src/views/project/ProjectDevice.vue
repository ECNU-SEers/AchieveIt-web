<template>
  <div class="device">
    <sticky-top>
      <div class="device-header">
        <div class="header-left"><p class="title">设备信息</p></div>
        <div class="header-right">
          <!-----搜索----------------------------------->
          <lin-search
            class="search-bar"
            v-permission="'搜索设备信息'"
            @query="onQueryChange"
            ref="searchKeyword"
          />
          <!--新增------------------------------------->
          <el-button size="medium" @click="addFormVisible = true" type="primary"
            >新增</el-button
          >
          <el-dialog
            title="资产信息"
            :visible.sync="addFormVisible"
            :before-close="handleClose"
            @open="handleForm"
            :append-to-body="true"
            ><!--组件之内,使遮罩层在上-->
            <el-form
              :model="addForm"
              :rules="rules"
              ref="addForm"
              label-width="120px"
            >
              <el-form-item label="资产ID:" prop="id">
                <el-input v-model="addForm.id"></el-input>
              </el-form-item>
              <el-form-item label="资产类型:" prop="type">
                <el-radio-group v-model="addForm.type">
                  <el-radio label="电脑"></el-radio>
                  <el-radio label="手机"></el-radio>
                  <el-radio label="PAD"></el-radio>
                  <el-radio label="移动存储设备"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="资产管理者:" prop="monitor">
                <!--带搜索的下拉选择-->
                <el-select
                  v-model="addForm.monitor"
                  filterable
                  placeholder="请选择资产管理者"
                >
                  <el-option
                    v-for="item in monitors"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="资产使用期限:" prop="date">
                <el-date-picker
                  v-model="addForm.date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="资产状态:">
                <el-input
                  placeholder="已领取"
                  v-model="addForm.status"
                  :disabled="true"
                >
                </el-input>
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
      </div>
    </sticky-top>
    <!------列表展示----------->
    <div class="body">
      <el-table
        :data="deviceData"
        height="500"
        stripe
        border
        :default-sort="{ prop: 'index', order: 'ascending' }"
        max-height="1000"
        style="“width:100%”"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form
              inline="true"
              title="检查情况"
              label-position="left"
              class="table-expand"
            >
              <el-form-item label="检查日期:">
                <span> {{ props.row.checkDate }}</span>
              </el-form-item>
              <el-form-item label="设备状态:">
                <span>{{ props.row.status }}</span>
              </el-form-item>
              <el-form-item label="备注:">
                <span>{{ props.row.tip }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" prop="index"> </el-table-column>
        <el-table-column label="资产 ID" prop="id"> </el-table-column>
        <el-table-column label="资产类型" prop="type"> </el-table-column>
        <el-table-column label="资产管理者" prop="monitor"> </el-table-column>
        <el-table-column label="资产使用期限" prop="date"> </el-table-column
        ><!--区分开始时间和结束时间？-->
        <el-table-column label="资产状态" prop="status"> </el-table-column>
        <el-table-column label="归还日期" prop="returnDate"> </el-table-column>
        <el-table-column label="操作" prop="action">
          <!--------编辑------------>
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="addFormVisible = true"
            style="margin-right:10%;"
          >
          </el-button>
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
              <el-form-item label="资产ID:" prop="id">
                <el-input v-model="addForm.id"></el-input>
              </el-form-item>
              <el-form-item label="资产类型:" prop="type">
                <el-radio-group v-model="addForm.type">
                  <el-radio label="电脑"></el-radio>
                  <el-radio label="手机"></el-radio>
                  <el-radio label="PAD"></el-radio>
                  <el-radio label="移动存储设备"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="资产管理者:" prop="monitor">
                <!--带搜索的下拉选择-->
                <el-select
                  v-model="addForm.monitor"
                  filterable
                  placeholder="请选择资产管理者"
                >
                  <el-option
                    v-for="item in monitors"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="资产使用期限:" prop="date">
                <el-date-picker
                  v-model="addForm.date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="资产状态:">
                <el-input
                  placeholder="已领取"
                  v-model="addForm.status"
                  :disabled="true"
                >
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="editSubmit('addForm')"
                  style="margin-right:8%;"
                  >修改</el-button
                >
                <el-button @click="addFormVisible = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-button
            icon="el-icon-delete"
            circle
            @click="deleteSubmit"
          ></el-button>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import LinSearch from '@/components/base/search/lin-search';

export default {
  components: {
    LinSearch
  },
  data() {
    return {
      deviceData: [
        {
          index: '2',
          id: '123456',
          type: '手机',
          monitor: 'G08',
          date: '4月22日',
          status: '已领取',
          returnDate: '暂无',
          checkDate: '3月14日',
          tip: '暂无'
        },
        {
          index: '2',
          id: '123456',
          type: '手机',
          monitor: 'G08',
          date: '4月22日',
          status: '已领取',
          returnDate: '暂无',
          checkDate: '3月14日',
          tip: '暂无'
        },
        {
          index: '2',
          id: '123456',
          type: '手机',
          monitor: 'G08',
          date: '4月22日',
          status: '已领取',
          returnDate: '暂无',
          checkDate: '3月14日',
          tip: '暂无'
        },
        {
          index: '2',
          id: '123456',
          type: '手机',
          monitor: 'G08',
          date: '4月22日',
          status: '已领取',
          returnDate: '暂无',
          checkDate: '3月14日',
          tip: '暂无'
        },
        {
          index: '2',
          id: '123456',
          type: '手机',
          monitor: 'G08',
          date: '4月22日',
          status: '已领取',
          returnDate: '暂无',
          checkDate: '3月14日',
          tip: '暂无'
        },
        {
          index: '2',
          id: '123456',
          type: '手机',
          monitor: 'G08',
          date: '4月22日',
          status: '已领取',
          returnDate: '暂无',
          checkDate: '3月14日',
          tip: '暂无'
        },
        {
          index: '2',
          id: '123456',
          type: '手机',
          monitor: 'G08',
          date: '4月22日',
          status: '已领取',
          returnDate: '暂无',
          checkDate: '3月14日',
          tip: '暂无'
        },
        {
          index: '2',
          id: '123456',
          type: '手机',
          monitor: 'G08',
          date: '4月22日',
          status: '已领取',
          returnDate: '暂无',
          checkDate: '3月14日',
          tip: '暂无'
        }
      ],
      monitors: [
        {
          //资产管理者选项
          value: '1',
          label: '人名1'
        }
      ],
      addForm: {
        id: '',
        type: '',
        monitor: '',
        date: '',
        status: ''
      },
      addFormVisible: false,
      rules: {
        id: [{ required: true, message: '请输入资产ID', trigger: 'blur' }],
        type: [
          { required: true, message: '请选择资产类型', trigger: 'change' }
        ],
        monitor: [
          { required: true, message: '请选择资产管理者', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择资产使用期限', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    /**********start to 新增***/
    addSubmit(formName) {
      //新增设备信息
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('提交成功');
        } else {
          alert('提交失败');
          return false;
        }
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleForm() {
      if (this.$refs['addForm']) {
        this.$refs['addForm'].clearValidate();
        this.$refs['addForm'].resetFields();
      }
    },
    /*******end of 新增********/
    /**********start to 修改***/
    editSubmit(formName) {
      alert('修改成功');
      addFormVisible = false;
    },
    /*******end of 修改********/
    /**********start to 删除***/
    deleteSubmit() {
      alert('删除成功');
    }
    /*******end of 删除********/
  }
};
</script>

<style lang="scss" scoped>
.device {
  .device-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-bottom: -24px;

    .header-left {
      float: left;

      .title {
        height: 59px;
        line-height: 59px;
        color: #4c76af;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .header-right {
      // float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 100px;
      .search-bar {
        margin-right: 50px;
      }
      .dialog-footer {
        margin-top: -50px;
        margin-right: 10%;
      }
    }
  }
  .body {
    width: 100%;
    margin-top: 50px;

    .table-expand {
      font-size: 0;
    }
    .table-expand label {
      width: 90px;
      color: #99a9bf;
    }
    .table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 30%;
    }
  }
}
</style>
