<template>
  <div>
    <AddWorkTimeDialog
      v-if="showAddWorkTimeDialog"
      :visibility.sync="showAddWorkTimeDialog"
      @success="_getWorkTimeSubmitList"
    />
    <EditWorkTimeDialog
      v-if="showEditWorkTimeDialog"
      :visibility.sync="showEditWorkTimeDialog"
      v-bind="editingWorkTime"
      @success="_getWorkTimeSubmitList"
    />
    <PageHeader title="工时提交">
      <lin-date-picker class="date" v-model="searchDateRange" />
      <el-button @click="onSearch(1)" type="primary" class="btn">
        查询
      </el-button>
      <el-button @click="onAdd" type="primary" class="btn">新增</el-button>
    </PageHeader>
    <LPageTable
      :table-data="tableData"
      :table-header="tableHeader"
      :current-page.sync="currentPage"
      :total="total"
      :loading="loading"
      @page-change="onPageChange"
    >
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.state === '待审核'"
            @click="onEdit(scope.row)"
            type="primary"
            plain
            size="mini"
          >
            编辑
          </el-button>
          <span
            v-else
            :class="{
              accept: scope.row.state === '已通过',
              refuse: scope.row.state === '已退回'
            }"
          >
            {{ scope.row.state }}
          </span>
        </template>
      </el-table-column>
    </LPageTable>
  </div>
</template>

<script>
import Search from '../../../components/common/Search';
import PageHeader from '../../../components/common/PageHeader';
import LPageTable from '../../../components/common/LPageTable';
import EditWorkTimeDialog from './EditWorkTimeDialog';
import AddWorkTimeDialog from './AddWorkTimeDialog';
import { loadable, pageable } from '../../../util/mixin';
import LinDatePicker from '@/components/base/date-picker/lin-date-picker';
import { workTimeSubmitTableHeader } from '../const';
import {
  getWorkTimeSubmitList,
  searchWorkTimeSubmitList
} from '../../../api/workTime';
import { isEmpty } from 'lodash';

export default {
  components: {
    Search,
    PageHeader,
    LPageTable,
    EditWorkTimeDialog,
    AddWorkTimeDialog,
    LinDatePicker
  },
  mixins: [pageable, loadable],
  data() {
    return {
      tableHeader: Object.freeze(workTimeSubmitTableHeader),
      searchDateRange: [],
      showAddWorkTimeDialog: false,
      showEditWorkTimeDialog: false,
      editingWorkTime: null
    };
  },
  methods: {
    onSearch(page) {
      if (isEmpty(this.searchDateRange)) return this._getWorkTimeSubmitList(1);
      const [start, end] = this.searchDateRange;
      this.applyLoading(
        searchWorkTimeSubmitList(start, end, page, this.pageSize)
      ).then(res => {
        const { items, total } = res;
        this.tableData = items;
        this.total = total;
      });
    },
    onAdd() {
      this.showAddWorkTimeDialog = true;
    },
    onEdit(row) {
      this.editingWorkTime = row;
      this.showEditWorkTimeDialog = true;
    },
    onPageChange(nextPage) {
      isEmpty(this.searchDateRange)
        ? this._getWorkTimeSubmitList(nextPage)
        : this.onSearch(nextPage);
    },
    _getWorkTimeSubmitList(page) {
      this.applyLoading(getWorkTimeSubmitList(page, this.pageSize)).then(
        res => {
          const { items, total } = res;
          this.total = total;
          this.tableData = items;
        }
      );
    }
  },
  created() {
    this._getWorkTimeSubmitList(this.currentPage);
  }
};
</script>

<style lang="scss" scoped>
.date {
  padding: 0;
  margin-right: 10px;
}

.btn {
  min-width: 80px;
  margin: 0 10px;
}

span.accept {
  color: green;
}

span.refuse {
  color: red;
}
</style>
