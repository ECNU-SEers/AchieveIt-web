import {get} from '@/sys/plugins/axios';
import _ from "lodash";

const MOCK = true;

export const getUserList = () => MOCK
    ? Promise.resolve(_.fill(new Array(10), {
      name: 'xx',
      permission: 'xxxx',
      creator: 'xxx'
    }))
    : get('');

export const getRoleList = () => MOCK
    ? Promise.resolve(_.fill(new Array(10), {
      name: 'xx',
      permission: 'xxxx',
      creator: 'xxx'
    }))
    : get('');
