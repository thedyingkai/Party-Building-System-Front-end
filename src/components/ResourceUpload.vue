<template>
  <div style="display: flex; flex-direction: column; flex-grow: 1;">
    <el-container>
      <el-header class="center-box">
        <div>
          <el-button size="middle" type="primary" @click="dialogVisible=true"><i class="el-icon-upload"></i>上传文件
          </el-button>
          <el-button v-if="existSelected&&!isMenu" size="middle" type="primary" @click="dialogVisible_move=true"><i
              class="el-icon-upload"></i>移动
          </el-button>
        </div>
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
      <el-main>
        <div style="margin: 10px">
          <div v-if="!isMenu" class="click-able" @click="goBack"><i class="el-icon-back">返回</i></div>
        </div>
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
      file: '',
      fileList: [],
      url: '',
      urls: [],
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      dialogVisible: false,
      tableData: [],
      multipleSelection: [],
      isMenu: true,
      activities: [],
      targetActivityId: -1,
      existSelected: false,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      dialogVisible_move: false,
      customClass: 'custom-dialog-box',
      currentMenuId: '',
      filterText: '',
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
  mounted() {
    this.showActivities();
  },
  computed: {
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
    renderContentInDialog(h, {data}) {
      const children = [];
      children.push(h('span', {class: 'icon'}, [
        h('i', {class: data.children ? 'el-icon-folder' : 'el-icon-document'})
      ]));
      let labelText = data.name;
      children.push(h('span', {}, labelText));
      return h('span', {class: 'custom-tree-node'}, children);
    },
    selectAll(selectedSourceList) {
      let result = [];
      selectedSourceList.forEach(item => {
        let id = item.id
        result.push(id);
      })
      return result;
    },
    clearSelectedSource() {
      this.selectedSourceList = [];
      this.dialogVisible_move = false;
    },
    showActivities() {
      this.$request.get('/activity/selectAll').then(
          res => {
            if (res.code === '200') {
              this.activities = res.data;
              this.tableData = this.activities;
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
      });
    },
    goBack() {
      this.isMenu = true;
      this.showActivities();
    },
    openFile(content) {
      // 使用 window.open 打开文件地址
      window.open(content);
    },
    handleClose() {
      this.file = '',
          this.fileList = [];
      this.dialogVisible = false;
    },
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
                this.handleClose()
              }
            }
        ).catch((error) => {
          console.error('数据加载出现错误:', error);
        });
      } else this.$message.error(response.msg);
    },
    moveSourceTo() {
      const selectedSourceIdList = this.$refs["tree-to-move"].getCheckedKeys();
      this.$request.put('/resource/batchMoveToActivity/' + this.targetActivityId, selectedSourceIdList).then(
          res => this.$handleResponse(res, () => {
            this.$message.success('移动成功');
            this.getResourceFromMenu(this.currentMenuId);
          }));
      this.dialogVisible_move = false;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.$message.success("文件'" + file.name + "'已移除");
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 9 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length > 0) {
        this.existSelected = true;
      } else {
        this.existSelected = false;
      }
    },
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
    toMenu(id) {
      this.currentMenuId = id;
      this.getResourceFromMenu(id)
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