import { dateFormat } from '../../util/date';

export const workTimeCheckTableHeader = [
  { label: '日期', prop: 'date' },
  { label: '功能名称', prop: 'functionName' },
  { label: '活动名称', prop: 'activityName' },
  { label: '开始时间', prop: 'startTime' },
  { label: '结束时间', prop: 'endTime' },
  { label: '提交人', prop: 'submitterName' },
  { label: '提交日期', prop: 'submissionDate' },
  { label: '参与项目', prop: 'projectName' },
  { label: '状态', prop: 'state' }
];

export const workTimeSubmitTableHeader = [
  { label: '日期', prop: 'date', formatter: (r, c, v) => dateFormat(v) },
  { label: '功能名称', prop: 'functionName' },
  { label: '活动名称', prop: 'activityName' },
  {
    label: '开始时间',
    prop: 'startTime',
    formatter: (r, c, v) => dateFormat(v, 'hh:mm')
  },
  {
    label: '结束时间',
    prop: 'endTime',
    formatter: (r, c, v) => dateFormat(v, 'hh:mm')
  },
  {
    label: '提交日期',
    prop: 'submissionDate',
    formatter: (r, c, v) => dateFormat(v)
  },
  { label: '状态', prop: 'state' }
];
