import { mount } from "@vue/test-utils";
import UserPermission from "@/views/permission/user/index.vue";
import LPageTable from "@/components/common/LPageTable";
import Search from "@/components/common/Search";
import EditUserDialog from "@/views/permission/user/EditUserDialog";

describe("UserPermission", () => {
  let wrapper;
  let vm;
  beforeEach(() => {
    wrapper = mount(UserPermission, {
      stubs: ["el-pagination", "el-table-column", "el-*"]
    });
    vm = wrapper.vm;
  });

  it("should search method work properly", function() {
    wrapper.find(Search).vm.$emit("search", "keyword");
    expect(vm.searchKey).toBe("keyword");
  });

  it("should fetch data properly", function() {
    vm.$nextTick(() => {
      expect(vm.tableData.length > 0).toBeTruthy();
    });
  });

  it("should change page properly", function() {
    wrapper.find(LPageTable).vm.handleCurrentChange(2);
    expect(vm.currentPage).toBe(2);
  });

  it("should show edit dialog properly", function() {
    vm.onEditUser();
    expect(vm.showEditUserDialog).toBeTruthy();
  });

  it("should refresh data after edit properly", async function() {
    wrapper.setData({ showEditUserDialog: true });
    const mockOnEditUserSuccess = jest.fn();
    wrapper.setMethods({
      onEditUserSuccess: mockOnEditUserSuccess
    });
    await vm.$nextTick();
    wrapper.find(EditUserDialog).vm.$emit("success");
    await vm.$nextTick();
    expect(mockOnEditUserSuccess).toBeCalled();
  });

  it("should query search word properly", function() {
    vm.querySearch("XXX", result => {
      expect(result).toEqual([]);
    });
  });
});
