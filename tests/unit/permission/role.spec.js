import { mount } from '@vue/test-utils';
import Role from '@/views/permission/role';
import Search from '@/components/common/Search';
import AddRoleDialog from '@/views/permission/role/AddRoleDialog';
import EditRoleDialog from '@/views/permission/role/EditRoleDialog';

describe('Role', () => {
  let wrapper;
  let vm;
  beforeEach(() => {
    wrapper = mount(Role);
    vm = wrapper.vm;
  });

  it('should search method work properly', function() {
    wrapper.find(Search).vm.$emit('search', '管理员');
    expect(vm.tableData.length > 0).toBeTruthy();
  });

  it('should search method work properly without key', function() {
    wrapper.find(Search).vm.$emit('search', '');
    expect(vm.tableData.length > 0).toBeTruthy();
  });

  it('should query search word properly', function() {
    vm.querySearch('XXX', result => {
      expect(result).toEqual([]);
    });
  });

  it('should add role work properly', function() {
    vm.onAddRole();
    expect(vm.showAddRoleDialog).toBeTruthy();
  });

  it('should edit role work properly', function() {
    vm.onEditRole();
    expect(vm.showEditRoleDialog).toBeTruthy();
  });
});

describe('AddRoleDialog', () => {
  let wrapper;
  let vm;
  beforeEach(() => {
    wrapper = mount(AddRoleDialog);
    vm = wrapper.vm;
  });

  it('should updatePermissions properly', function() {
    vm.updatePermissions('管理权限');
    expect(vm.form.permissions).toBe('管理权限');
  });

  it('should updateAllPermissions properly', function() {
    vm.updateAllPermissions('管理权限');
    expect(vm.allPermissions).toBe('管理权限');
  });

  it('should add role properly', function() {
    vm.onAddRole();
    expect(vm.form.permissions instanceof Array).toBeTruthy();
  });
});

describe('EditRoleDialog', () => {
  let wrapper;
  let vm;
  beforeEach(() => {
    wrapper = mount(EditRoleDialog);
    vm = wrapper.vm;
  });

  it('should EditRoleDialog updatePermissions properly', function() {
    vm.updatePermissions('管理权限');
    expect(vm.form.permissions).toBe('管理权限');
  });

  it('should EditRoleDialog updateAllPermissions properly', function() {
    vm.updateAllPermissions('管理权限');
    expect(vm.allPermissions).toBe('管理权限');
  });

  it('should EditRoleDialog edit role properly', function() {
    vm.onEditRole();
    expect(vm.form.permissions instanceof Array).toBeTruthy();
  });
});
