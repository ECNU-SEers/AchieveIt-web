import {get, post, put} from '@/sys/plugins/axios';

const NODULE_NAME = '/laborhour';

export const getWorkTimeCheckList = (pageNo, pageSize = 10) =>
    get(`${NODULE_NAME}/show/subordinate/list`, {pageNo, pageSize});

export const acceptWorkTime = id => put(`${NODULE_NAME}/accept`, {id});

export const refuseWorkTime = id => put(`${NODULE_NAME}/return`, {id});

export const searchWorkTimeCheckList = (
    startDateTimestamp,
    endDateTimestamp,
    pageNo,
    pageSize = 10
) =>
    get(`${NODULE_NAME}/search/subordinate`, {
      startDateTimestamp,
      endDateTimestamp,
      pageNo,
      pageSize
    });

export const getWorkTimeSubmitList = (pageNo, pageSize = 10) =>
    get(`${NODULE_NAME}/show/list`, {pageNo, pageSize});

export const searchWorkTimeSubmitList = (
    startDateTimestamp,
    endDateTimestamp,
    pageNo,
    pageSize = 10
) =>
    get(`${NODULE_NAME}/search`, {
      startDateTimestamp,
      endDateTimestamp,
      pageNo,
      pageSize
    });

export const submitWorkTime = row => post(`${NODULE_NAME}/create`, row);

export const updateWorkTimeSubmit = row => put(`${NODULE_NAME}/update`, row);

export const getAllFeatures = () => get('/functions/me');

export const getAllActivities = () => get('/activity/all');
