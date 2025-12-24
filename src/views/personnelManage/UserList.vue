<!--
/**
 * @component UserList
 * @description 用户列表管理页面 - 支持用户批量导入导出、用户信息编辑和搜索
 * @author Party Building System
 */
-->
<template>
  <!-- 用户列表管理容器 -->
  <div style="display: flex; flex-direction: column; flex-grow: 1;padding: 1vh">
    <el-dialog
        :show-cancel-button="true"
        :visible.sync="dialogVisible_import"
        title="批量导入用户">
      <el-upload
          :headers="{token:user.token}"
          :on-success="handleImport"
          :show-file-list="false"
          class="upload-demo"
          drag accept=".xls,.xlsx"
          :action="uploadAction">
        <i class="el-icon-upload"></i>
        <div>将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <div class="grow upload-description flex-row justify-between items-center">
        <p>支持的格式：XLS,XLSX</p>
        <p>请上传10MB以内的文件</p>
      </div>
      <div class="grow example-container flex-row justify-between items-center">
        <div><h1><i class="el-icon-download"></i> 模板文件下载</h1>
          <p class="example-description">这是一个模板文件，你可以下载这个文件并填写要导入的用户信息后上传</p></div>
        <el-button plain style="height: 38px" @click="downloadExcel">
          下载模版
        </el-button>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible_import = false">取 消</el-button>
  </span>
    </el-dialog>
    <el-table
        ref="userTable" v-loading="loading" :cell-style="{ padding: '0px' }" :data="filterTableData"
        :row-style="{ height: rowHeight+'px' }" stripe>
      <el-table-column label="用户名" prop="uname" width="200">
      </el-table-column>
      <el-table-column label="身份" prop="cname" width="200">
      </el-table-column>
      <el-table-column label="积分" prop="points" width="200">
      </el-table-column>
      <el-table-column
          align="right">
        <template slot="header">
          <div style="display: flex;justify-content: space-between;">

            <el-button plain style="height: 38px" type="primary" @click="inputDialog">
              批量导入
            </el-button>

            <el-button plain style="height: 38px" type="warning" @click="exportData">
              批量导出
            </el-button>
            <SearchInput
                :chineseColumns="chineseColumns"
                :search="search"
                :selectedColumn="selectedColumn"
                @change="updateSelectedColumn"
                @input="updateSearch"
            />
          </div>
        </template>
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <adaptive-pagination
        :table-data="tableData" :table-ref="$refs.userTable" :total="total"
        @update:sliced-data="handleSlicedData"></adaptive-pagination>

    <el-dialog :visible.sync="dialogVisible" title="信息修改">
      <user-info :user="selectedUser" @update-user="handleUserUpdate"></user-info>
    </el-dialog>
  </div>

</template>

<script>
import _ from 'lodash';
import SearchInput from "@/components/SearchInput.vue";
import UserInfo from "@/views/personnelManage/UserEdit.vue";
import AdaptivePagination from "@/components/AdaptivePagination.vue";
import {MessageBox} from "element-ui";

/**
 * 用户列表管理组件
 */
export default {
  name: "UserList",
  components: {AdaptivePagination, UserInfo, SearchInput},
  data() {
    return {
      user: JSON.parse(localStorage.getItem("current-user") || '{}'), // 当前登录用户
      tableData: [], // 完整的表格数据
      slicedData: [], // 切片后的表格数据
      total: 0, // 用户总数
      search: '', // 搜索关键字
      rowHeight: 50, // 表格行高
      loading: true, // 加载状态
      tableColumns: ['uname', 'cname', 'points'], // 表格列配置
      selectedColumn: '', // 选中的搜索列
      sequence: 1, // 序号起始值
      chineseColumns: [ // 中文列名映射
        {label: '用户名', value: 'uname'},
        {label: '身份', value: 'cname'},
        {label: '积分', value: 'points'}
      ],
      selectedUser: '', // 当前编辑的用户
      dialogVisible: false, // 编辑对话框显示状态
      dialogVisible_import: false, // 导入对话框显示状态
    };
  },
  /**
   * 组件挂载时获取用户列表数据
   */
  mounted() {
    this.fetchData();
  },
  computed: {
    /**
     * 过滤后的表格数据
     * 根据搜索关键字和选中列进行过滤
     * @returns {Array} 过滤后的用户数据列表
     */
    filterTableData() {
      if (!this.search || !this.selectedColumn) {
        return this.slicedData; // 使用切片后的数据
      }
      return this.slicedData.filter(item => {
        const value = item[this.selectedColumn];
        if (typeof value === 'string' && value.toLowerCase().includes(this.search.toLowerCase())) {
          return true;
        }
        return false;
      });
    },
    /**
     * 批量导入的上传地址
     * @returns {string} 完整的上传API地址
     */
    uploadAction() {
      return `${process.env.VUE_APP_BASEURL}/user/import`;
    },
  },
  methods: {
    /**
     * 获取用户列表数据
     * 从服务器加载所有用户信息
     */
    fetchData() {
      this.loading = true;
      this.$request.get('/user/selectAll').then(
          res => {
            if (res.code === '200') {
              this.tableData = res.data;
              this.loading = false;
              this.total = this.tableData.length;
              this.generateSequence();
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
        this.loading = false;
      });
    },
    /**
     * 删除用户
     * 弹出确认框后删除选中的用户
     * @param {Object} user - 要删除的用户对象
     */
    handleDelete(user) {
      console.log(user);
      MessageBox.confirm('确定删除？', '删除人员', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.delete('/user/delete/' + user.id).then(
            (res) => {
              if (res.code === '200') {
                this.$message.success('删除成功');
              }
            }
        ).catch((error) => {
          console.error('删除失败:', error);
          this.$message.error('删除失败，请稍后再试');
        });
      }).catch(() => {
      });

    },
    /**
     * 处理分页切片数据
     * 接收分页组件传递的切片数据
     * @param {Array} slicedData - 切片后的数据
     */
    handleSlicedData(slicedData) {
      this.slicedData = slicedData;
    },
    /**
     * 更新搜索关键字
     * @param {string} value - 新的搜索关键字
     */
    updateSearch(value) {
      this.search = value;
      this.debouncedHandleInput();
    },
    /**
     * 更新选中的搜索列
     * @param {string} value - 列字段名
     */
    updateSelectedColumn(value) {
      this.selectedColumn = value;
      this.debouncedHandleInput();
    },
    /**
     * 防抖处理搜索输入
     * 300ms延迟执行
     */
    debouncedHandleInput: _.debounce(function () {
    }, 300),
    /**
     * 为表格数据生成序号
     * 为每条记录添加序号字段
     */
    generateSequence() {
      this.tableData.forEach((item, index) => {
        item.sequence = this.sequence + index;
      });
    },
    /**
     * 导出用户数据
     * 打开导出Excel文件的URL
     */
    exportData() {
      window.open(process.env.VUE_APP_BASEURL + '/user/export');
    },
    /**
     * 处理批量导入结果
     * @param {Object} res - 服务器响应结果
     */
    handleImport(res) {
      this.fetchData();
      if (res.code === '200') {
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.msg);
      }
    },
    /**
     * 编辑用户信息
     * 打开用户编辑对话框
     * @param {number} index - 表格行索引
     * @param {Object} row - 用户数据行
     */
    handleEdit(index, row) {
      this.selectedUser = row;
      this.dialogVisible = true;
    },
    /**
     * 处理用户信息更新
     * 更新表格中的用户数据
     * @param {Object} updatedUser - 更新后的用户对象
     */
    handleUserUpdate(updatedUser) {
      const index = this.tableData.findIndex(item => item.id === updatedUser.id);
      if (index !== -1) {
        this.tableData[index] = updatedUser;
      }
      this.dialogVisible = false;
    },
    /**
     * 打开批量导入对话框
     */
    inputDialog() {
      this.dialogVisible_import = true;
    },
    /**
     * 下载Excel导入模板
     */
    downloadExcel() {
      window.open(process.env.VUE_APP_BASEURL + '/file/download/用户信息表模板.xlsx');
    },
  },
};
</script>

<style lang="scss">
.el-date-table td, .el-table.cell, .el-table-filter {
  max-height: 95px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upload-demo .el-upload {
  width: 100%;
}

.upload-demo .el-upload-dragger {
  width: 100%;
}

.upload-description {
  color: #7a7a7a;
  margin-bottom: 10px;
}

.example-container {
  background-color: rgb(233 233 233);
  border-radius: 3px;
  padding: 2vh;
  margin: 1vh;

  .example-description {
    color: #828282;
  }
}
</style>