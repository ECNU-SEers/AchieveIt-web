import { mount } from "@vue/test-utils";
import FunctionBasic from "@/views/project/ProjectBasic.vue";

describe("FunctionBasic", () =>{
    let wrapper;
    let vm;
    beforeEach(() => {
      wrapper = mount(FunctionBasic, {
        stubs: ["el-pagination", "el-table-column", "el-*"]
      });
      vm = wrapper.vm;
    });



});