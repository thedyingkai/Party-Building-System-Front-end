<template>
  <el-container style="margin: 40px;border: solid crimson;width: 80vw;min-height: 65vh">
    <el-header style="margin: 20px;width: 80vw;">
      <el-button  @click="routereturn">返回</el-button>
      <el-button type="primary" @click="editCommittee">增设职务</el-button>
    </el-header>
    <el-main>
      <div style="display: flex;flex-wrap:wrap;gap:20px;">
        <el-card v-for="manager in branch_managers" :key="manager.id">
          <div slot="header" style="text-align: center">
            <el-row>
              <el-avatar shape="square" :size="60" :src="manager.avatar"></el-avatar>
            </el-row>
            <el-row>
              <span style="font-size: 20px">{{ manager.name }}</span>
            </el-row>
            <el-row>
              <span style="font-size: 15px">{{ manager.uname }}</span>
            </el-row>
          </div>
          <el-row>
            <label @click="changeManager(manager.id)" class="click-able">
              <i class="el-icon-edit-outline"></i>
              调整任职人员</label>
          </el-row>
          <el-row>
            <label @click="deleteManager(manager.id)" class="click-able">
              <i class="el-icon-delete"></i>
              移除职务</label>
          </el-row>
        </el-card>
      </div>
    </el-main>

    <!-- 新增委员对话框 -->
    <el-dialog
        :visible.sync="dialogVisible"
        show-cancel-button="true"
        title="增设职务"
        width="60%"
    >
      <el-form>
        <div v-for="(item, index) in newManagers" :key="index">
          <el-form-item>
            <el-select popper-class="select_popper"
                       v-model="item.name"
                       placeholder="请输入或选择职务（可新建）"
                       filterable
                       allow-create
                       clearable
                       style="width: 200px;margin-right: 10px;"
            >
              <el-option
                  v-for="opt in possibleManager"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.label"
              >
                {{ opt.label }}
                <span style="float:right; color:#8492a6; font-size: 13px">
            {{ opt.value === 'custom' ? '自定义' : '' }}
          </span>
              </el-option>
              <div class="custom-tip">
                <i class="el-icon-info"></i>
                可直接输入新职务名称，按回车确认
              </div>
            </el-select>

            <el-select popper-class="select_popper"
                       v-model="item.uid"
                       placeholder="选择人员"
                       style="width: 200px;margin-right: 10px;"
            >
              <el-option
                  v-for="user in branch_users"
                  :key="user.id"
                  :label="user.uname"
                  :value="user.id"
              />
            </el-select>

            <el-button
                v-if="index > 0"
                @click="removeManager(index)"
                icon="el-icon-remove"
                circle
            />
          </el-form-item>
        </div>
        <el-form-item>
          <el-button @click="addManager" type="text">
            <i class="el-icon-circle-plus"></i> 添加更多职务
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="subManager">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 调整任职人员对话框 -->
    <el-dialog
        :visible.sync="changeManagerDialogVisible"
        show-cancel-button="true"
        title="调整任职人员"
        width="30%"
    >
      <el-form>
        <el-form-item>
          <el-select popper-class="select_popper"
                     v-model="newManagerUid"
                     placeholder="选择人员"
                     style="width: 200px;"
          >
            <el-option
                v-for="user in branch_users"
                :key="user.id"
                :label="user.uname"
                :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="changeManagerDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="submitChangeManager">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import {MessageBox} from "element-ui";

export default {
  name: 'BranchManager',
  props: {},
  data() {
    return {
      bid: null,
      dialogVisible: false,
      changeManagerDialogVisible: false,
      branch_managers: [],
      branch_users: [],
      newManagers: [{
        uid: '',
        name: ''
      }], // 改为数组形式
      possibleManager: [
        {value: 0, label: '支部书记'},
        {value: 1, label: '支部副书记'},
        {value: 2, label: '组织委员'},
        {value: 3, label: '宣传委员'},
        {value: 4, label: '保密委员'},
        {value: 5, label: '青年委员'},
        {value: 6, label: '纪检委员'}],
      rules: {
        name: [{required: true, message: '请选择人员', trigger: 'blur'}]
      },
      currentManagerId: null,
      newManagerUid: ''
    }
  },
  watch: {},
  mounted() {
    this.bid = this.$route.params.id;
    this.getBranch_manager(this.bid);
  },
  methods: {
    async getBranch_manager(id) {
      try {
        const res = await this.$request.get(`/branch_manager/selectByBid/${id}`);
        if (res.code === '200') {
          this.branch_managers = res.data;
        }
      } catch (error) {
        console.error('数据加载出错', error);
      }
    },
    async getBranch_user(id) {
      try {
        const res = await this.$request.get(`/user/selectByBranch/${id}`);
        if (res.code === '200') {
          this.branch_users = res.data;
        }
      } catch (error) {
        console.error('数据加载出错', error);
      }
    },
    editCommittee() {
      this.newManagers = [{
        uid: '',
        name: '',
        bid: this.bid // 直接携带bid
      }];
      this.getBranch_user(this.bid);
      this.dialogVisible = true;
    },
    addManager() {
      this.newManagers.push({uid: '', name: '', bid: this.bid})
    },
    removeManager(index) {
      this.newManagers.splice(index, 1)
    },
    async subManager() {
      // 提交前验证
      const isValid = this.newManagers.every(item => {
        return item.name && item.uid && item.bid
      });

      if (!isValid) {
        this.$message.error('请完善所有表单项');
        return;
      }

      try {
        const res = await this.$request.post("/branch_manager/batchAdd", this.newManagers);

        if (res.code === '200') {
          this.$message.success("添加成功");
          this.getBranch_manager(this.bid);
          this.dialogVisible = false;
        }
      } catch (error) {
        console.error('添加失败:', error);
        this.$message.error('操作失败，请检查数据');
      }
    },
    deleteManager(id) {
      MessageBox.confirm('确定删除？', '删除委员', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await this.$request.delete(`/branch_manager/delete/${id}`);
          if (res.code === '200') {
            this.$message.success('删除成功');
            this.getBranch_manager(this.bid);
          }
        } catch (error) {
          console.error('删除失败:', error);
          this.$message.error('删除失败，请稍后再试');
        }
      }).catch(() => {
      });
    },
    routereturn() {
      this.$router.back();
    },
    changeManager(id) {
      this.currentManagerId = id;
      this.getBranch_user(this.bid);
      this.changeManagerDialogVisible = true;
    },
    async submitChangeManager() {
      if (!this.newManagerUid) {
        this.$message.error('请选择新的任职人员');
        return;
      }

      try {
        const res = await this.$request.put("/branch_manager/changeManager", {
          id: this.currentManagerId,
          uid: this.newManagerUid
        });

        if (res.code === '200') {
          this.$message.success("任职人员更换成功");
          this.getBranch_manager(this.bid);
          this.changeManagerDialogVisible = false;
        }
      } catch (error) {
        console.error('更换任职人员失败:', error);
        this.$message.error('操作失败，请检查数据');
      }
    }
  }
}
</script>
<style>
/* 在下拉框中添加自定义提示 */
.custom-tip {
  padding: 8px 15px;
  color: #67C23A;
  font-size: 12px;
  border-top: 1px solid #eee;
  background: #f8ffeb;
}

/* 输入框提示 */
.el-select__input::placeholder {
  color: #F56C6C;
  opacity: 0.8;
}
</style>