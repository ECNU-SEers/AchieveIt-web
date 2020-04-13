<template>
    <div>
        <PageHeader title="工时审核">
            <lin-date-picker v-model="searchDateRange" class="date"/>
            <el-button @click="onSearch(1)" type="primary" class="btn"
            >查询
            </el-button>
        </PageHeader>
        <LPageTable
                :table-data="tableData"
                :table-header="tableHeader"
                :current-page.sync="currentPage"
                :total="total"
                :loading="loading"
                @page-change="onPageChange"
        >
            <el-table-column :width="160" label="操作">
                <template slot-scope="scope">
                    <template v-if="scope.row.state === '待审核'">
                        <el-button
                                @click="onAccept(scope.row)"
                                type="success"
                                plain
                                size="mini"
                        >通过
                        </el-button>
                        <el-button
                                @click="onRefuse(scope.row)"
                                type="danger"
                                size="mini"
                                plain
                        >退回
                        </el-button>
                    </template>
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
  import {loadable, pageable} from '../../../util/mixin';
  import LinDatePicker from '@/components/base/date-picker/lin-date-picker';
  import {workTimeCheckTableHeader} from '../const';
  import {
    acceptWorkTime,
    getWorkTimeCheckList,
    refuseWorkTime,
    searchWorkTimeCheckList
  } from '../../../api/workTime';
  import {isEmpty} from 'lodash';

  export default {
    components: {
      Search,
      PageHeader,
      LinDatePicker,
      LPageTable
    },
    mixins: [pageable, loadable],
    data() {
      return {
        tableHeader: Object.freeze(workTimeCheckTableHeader),
        searchDateRange: []
      };
    },
    methods: {
      onSearch(page) {
        if (isEmpty(this.searchDateRange)) return this.getCheckList(1);
        const [start, end] = this.searchDateRange;
        this.applyLoading(
            searchWorkTimeCheckList(start, end, page, this.pageSize)
        ).then(res => {
          const {items, total} = res;
          this.tableData = items;
          this.total = total;
        });
      },
      getCheckList(page) {
        this.applyLoading(getWorkTimeCheckList(page, this.pageSize)).then(res => {
          const {items, total} = res;
          this.tableData = items;
          this.total = total;
        });
      },
      onPageChange(nextPage) {
        isEmpty(this.searchDateRange)
            ? this.getCheckList(nextPage)
            : this.onSearch(nextPage);
      },
      onAccept(row) {
        acceptWorkTime(row.id).then(() => {
          this.$message.success('通过成功');
          this.getCheckList(this.currentPage);
        });
      },
      onRefuse(row) {
        refuseWorkTime(row.id).then(() => {
          this.$message.success('退回成功');
          this.getCheckList(this.currentPage);
        });
      }
    },
    created() {
      this.getCheckList(this.currentPage);
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
