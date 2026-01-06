<!--
  资源上传组件
  
  @component ResourceUpload
  @description 支持文件上传、浏览、移动和筛选的资源管理组件
  @author 党建系统开发团队
-->
<template>
  <div style="display: flex; flex-direction: column; flex-grow: 1;">
    <el-container>
      <!-- 头部操作区 -->
      <el-header class="center-box">
        <div>
          <el-button size="middle" type="primary" @click="dialogVisible=true"><i class="el-icon-upload"></i>上传文件
          </el-button>
          <el-button v-if="existSelected&&!isMenu" size="middle" type="primary" @click="dialogVisible_move=true"><i
              class="el-icon-upload"></i>移动
          </el-button>
        </div>
        <!-- 搜索和筛选 -->
        <div class="center-box">
          <div class="input-container">
            <el-input
                v-model="filterText"
                placeholder="输入关键字进行过滤">
            </el-input>
          </div>
          <drop-down-menu v-show="!isMenu" :menu-items="menuData"></drop-down-menu>
        </div>
      </el-header>
      <!-- 主内容区 -->
      <el-main>
        <div style="margin: 10px">
          <div v-if="!isMenu" class="click-able" @click="goBack"><i class="el-icon-back">返回</i></div>
        </div>
        <!-- 活动列表视图 -->
        <el-table v-if="isMenu"
                  :data="filteredTableData"
                  :header-cell-style="{background: '#f5f7fa', color: '#606266' }"
                  style="width: 100%"
                  tooltip-effect="dark"
                  @selection-change="handleSelectionChange">
          <el-table-column
              label="活动">
            <template slot-scope="scope">
              <div class="click-able" @click="toMenu(scope.row.id)">{{ scope.row.name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="创建日期"
              prop="date"
              show-overflow-tooltip width="150">
            <template slot-scope="scope">
              <div class="click-able" @click="toMenu(scope.row.id)">{{ scope.row.time }}</div>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-show="!isMenu"
                  ref="multipleTable"
                  :data="filteredTableData"
                  :header-cell-style="{background: '#f5f7fa', color: '#606266' }"
                  style="width: 100%"
                  tooltip-effect="dark"
                  @selection-change="handleSelectionChange">
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column label="文件">
            <template slot-scope="scope">
              <el-tooltip effect="light">
                <div slot="content">查看</div>
                <div class="click-able" @click="openFile(scope.row.content)"> {{ scope.row.name }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
              label="上传日期" prop="date"
              show-overflow-tooltip
              width="150">
            <template slot-scope="scope">
              <div> {{ scope.row.savetime }}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-dialog
          :before-close="handleClose"
          :visible.sync="dialogVisible"
          title="文件上传"
          width="30%">
        <div style="margin: 10px 0; display:flex;flex-direction: column;justify-content: center;align-items: center;">
          <div style="display: flex;align-items: center;width: 360px;"><label>上传到</label>
            <el-select v-model="targetActivityId" placeholder="请选择" popper-class="select_popper" style="margin: 10px;">
              <el-option
                  v-for="item in activities"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </div>
          <resource-uploader :acid="targetActivityId"></resource-uploader>
        </div>
      </el-dialog>
      <el-dialog
          :before-close="clearSelectedSource"
          :cancel-button-text="cancelButtonText"
          :confirm-button-text="confirmButtonText"
          :custom-class="customClass"
          :show-cancel-button="true"
          :visible.sync="dialogVisible_move"
          title="移动资源"
      ><label>以下资源将被移至栏目</label>
        <el-select v-model="targetActivityId" placeholder="请选择" popper-class="select_popper" style="margin: 10px;">
          <el-option
              v-for="item in activities"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
        <div class="sourceList-container">
          <el-tree
              ref="tree-to-move"
              :data="multipleSelection"
              :default-checked-keys="selectAll(multipleSelection)"
              :draggable="true"
              :render-content="renderContentInDialog"
              class="filter-tree"
              default-expand-all
              node-key="id"
              show-checkbox>
          </el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_move = false">取 消</el-button>
        <el-button type="primary" @click="moveSourceTo">确 定</el-button>
      </span>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import DropDownMenu from "@/components/DropDownMenu";
import ResourceUploader from "@/components/ResourceUploader";

export default {
  name: "ResourceUpload",
  components: {ResourceUploader, DropDownMenu},
  data() {
    return {
      // 单个文件
      file: '',
      // 文件列表
      fileList: [],
      // 单个URL
      url: '',
      // URL列表
      urls: [],
      // 当前用户
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      // 上传对话框显示状态
      dialogVisible: false,
      // 表格数据
      tableData: [],
      // 多选项
      multipleSelection: [],
      // 是否为菜单视图
      isMenu: true,
      // 活动列表
      activities: [],
      // 目标活动ID
      targetActivityId: -1,
      // 是否存在选中项
      existSelected: false,
      // 确认按钮文本
      confirmButtonText: '确定',
      // 取消按钮文本
      cancelButtonText: '取消',
      // 移动对话框显示状态
      dialogVisible_move: false,
      // 自定义对话框类名
      customClass: 'custom-dialog-box',
      // 当前菜单ID
      currentMenuId: '',
      // 过滤文本
      filterText: '',
      // 菜单数据
      menuData: [
        {icon: "el-icon-menu", label: "全部"},
        {icon: "el-icon-picture", label: "图片"},
        {icon: "el-icon-film", label: "视频"},
        {icon: "el-icon-check", label: "音频"},
        {icon: "el-icon-circle-check", label: "WORD"},
        {icon: "el-icon-circle-check", label: "EXCEL"},
        {icon: "el-icon-circle-check", label: "PPT"},
        {icon: "el-icon-circle-check", label: "PDF"}
      ],
    };
  },
  /**
   * 组件挂载后
   * @description 加载活动列表
   */
  mounted() {
    this.showActivities();
  },
  computed: {
    /**
     * 过滤后的表格数据
     * @returns {Array} 过滤后的数据列表
     * @description 根据过滤文本筛选表格数据
     */
    filteredTableData() {
      if (this.filterText === '') {
        return this.tableData;
      } else {
        return this.tableData.filter(row => {
          return row.name.toLowerCase().includes(this.filterText.toLowerCase());
        });
      }
    }
  },
  methods: {
    /**
     * 渲染树节点内容（对话框中）
     * @param {Function} h - createElement 函数
     * @param {Object} context - 节点上下文
     * @param {Object} context.data - 节点数据
     * @returns {VNode} 虚拟节点
     * @description 自定义树节点的渲染内容，显示文件夹或文件图标
     */
    renderContentInDialog(h, {data}) {
      const children = [];
      children.push(h('span', {class: 'icon'}, [
        h('i', {class: data.children ? 'el-icon-folder' : 'el-icon-document'})
      ]));
      let labelText = data.name;
      children.push(h('span', {}, labelText));
      return h('span', {class: 'custom-tree-node'}, children);
    },
    /**
     * 选择所有资源
     * @param {Array} selectedSourceList - 选中的资源列表
     * @returns {Array} 资源ID数组
     * @description 提取所有选中资源的ID
     */
    selectAll(selectedSourceList) {
      let result = [];
      // TODO: 实现资源选择逻辑
      return result;
    },
    /**
     * 清空选中的资源
     * @description 关闭移动对话框并清空选中资源列表
     */
    clearSelectedSource() {
      this.selectedSourceList = [];
      this.dialogVisible_move = false;
    },
    /**
     * 显示活动列表
     * @description 从服务器获取所有活动数据
     */
    showActivities() {
      this.$request.get('/activity/selectAll').then(
          res => {
            if (res.code === '200') {
              this.activities = res.data || [];
            }
          }
      ).catch((error) => {
        console.error('加载活动列表错误:', error);
      });
    },
    /**
     * 返回到活动列表
     * @description 切换回菜单视图并刷新活动列表
     */
    goBack() {
      this.isMenu = true;
      this.showActivities();
    },
    /**
     * 打开文件
     * @param {string} content - 文件URL
     * @description 在新窗口中打开文件
     */
    openFile(content) {
      window.open(content);
    },
    /**
     * 关闭上传对话框
     * @description 清空文件并关闭上传对话框
     */
    handleClose() {
      this.file = '';
      this.fileList = [];
      this.dialogVisible = false;
    },
    /**
     * 处理文件上传
     * @param {Object} response - 服务器响应
     * @param {Object} file - 文件对象
     * @param {Array} fileList - 文件列表
     * @description 处理文件上传后的响应，保存文件信息到数据库
     */
    handleFileUpload(response, file, fileList) {
      this.urls = fileList.map(v => v.response?.data);
      if (response.code === '200') {
        this.file = {
          uid: this.user.uid,
          acid: this.targetActivityId,
          type: file.raw.type,
          name: file.name,
          content: response.data,
        }
        // 检查 type 并根据不同的包含内容进行转换
        if (this.file.type.startsWith('image/')) {
          this.file.type = 1;
        } else if (this.file.type.startsWith('video/')) {
          this.file.type = 2;
        } else if (this.file.type.startsWith('audio/')) {
          this.file.type = 3;
        } else if (this.file.type === 'application/msword' || this.file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          this.file.type = 4; // Word 文档
        } else if (this.file.type === 'application/vnd.ms-excel' || this.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.file.type = 5; // Excel 表格
        } else if (this.file.type === 'application/vnd.ms-powerpoint' || this.file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
          this.file.type = 6; // PowerPoint 演示文稿
        } else if (this.file.type === 'application/pdf') {
          this.file.type = 7; // PDF 文件
        } else {
          this.file.type = 8; // 默认类型，对于未匹配到的文件类型
        }
        this.$request.post('resource/add', this.file).then(
            res => {
              if (res.code === '200') {
                this.$message.success('上传成功');
                this.handleClose();
              }
            }
        ).catch((error) => {
          console.error('数据加载出现错误:', error);
        });
      }
    },
    /**
     * 提交上传
     * @description 手动触发文件上传
     */
    submitUpload() {
      this.$refs.upload.submit();
    },
    /**
     * 移除文件
     * @param {Object} file - 文件对象
     * @param {Array} fileList - 文件列表
     * @description 从列表中移除指定文件
     */
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.$message.success("文件'" + file.name + "'已移除");
    },
    /**
     * 处理文件超出限制
     * @param {Array} files - 新选择的文件
     * @param {Array} fileList - 已选择的文件列表
     * @description 当选择的文件数量超过限制时提示用户
     */
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 9 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    /**
     * 处理选择变化
     * @param {Array} val - 选中的行数据
     * @description 更新多选状态和选中的资源列表
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length > 0) {
        this.existSelected = true;
      } else {
        this.existSelected = false;
      }
    },
    /**
     * 从菜单获取资源
     * @param {number} id - 活动ID
     * @description 根据活动ID获取该活动的所有资源
     */
    getResourceFromMenu(id) {
      const data = {uid: this.user.uid, acid: id};
      this.$request.get('resource/selectByUidAndAcid', {params: data}).then(
          res => {
            if (res.code === '200') {
              if (res.data.length > 0) {
                this.tableData = res.data;
              } else {
                this.tableData = [];
              }
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
      });
    },
    /**
     * 进入活动菜单
     * @param {number} id - 活动ID
     * @description 切换到资源列表视图并加载指定活动的资源
     */
    toMenu(id) {
      this.currentMenuId = id;
      this.getResourceFromMenu(id);
      this.isMenu = false;
    },
  }
}
</script>

<style scoped>
.center-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-main {
  padding: 0 20px;
}
</style>