<!--
/**
 * @component DraftAuditList
 * @description 草稿审核列表页面 - 审核人员处理待审核的文章草稿
 * @author Party Building System
 */
-->
<template>
  <!-- 草稿审核列表容器 -->
  <div style="display: flex; flex-direction: column; flex-grow: 1;padding: 1vh">
    <el-table v-loading="loading"
              :cell-style="{ padding: '0px' }" :data="returntable.filter(data =>!search || (data.title?.toLowerCase()?.includes(search.toLowerCase()))
                                                       || (data.content?.toLowerCase()?.includes(search.toLowerCase())))"
              :row-style="{ height:'100px',overflow: 'hidden' }"
              stripe>
      <el-table-column label="栏目" prop="column" width="100">
      </el-table-column>
      <el-table-column label="标题" prop="title" width="140">
      </el-table-column>
      <el-table-column label="拟稿人" prop="uname" width="140">
      </el-table-column>
      <el-table-column label="内容" prop="content" width="350">
        <template slot-scope="scope">
          <span v-if="scope.row.content" class="ellipsis-text">{{ stripHtmlTags(scope.row.content) }}</span>
        </template>
      </el-table-column>
      <!-- 新增的图片列 -->
      <el-table-column width="200">
        <template slot-scope="scope">
          <img v-if="getFirstImage(scope.row.content)" :src="getFirstImage(scope.row.content)"
               :style="{ width: getImageWidth(scope.row.content), height: '100px' }"/>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" prop="save_time" width="200">
      </el-table-column>

      <el-table-column
          align="right">
        <template slot="header" slot-scope="scope">
          <div style="display: flex;justify-content: space-between;">
            <el-input
                v-model="search"
                placeholder="输入关键字搜索"
                size="mini"
                style="max-width: 200px;"
                @input="handleInput(scope)"
            />
          </div>
        </template>
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="audit(scope.$index, scope.row)">审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        :center="true"
        :visible.sync="dialogVisible"
        fullscreen=true title="审核"
        width="90%"
    >
      <ArticleView :draft="draft"></ArticleView>
      <div class="audit-form-container">
        <AuditForm ref="auditFormRef" :did="draft.did"></AuditForm>
      </div>
      <span slot="footer" class="dialog-footer">
              <el-button type="warning" @click="handleEdit(draft)">修改文章</el-button>
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="submitAudit(draft)">确 定</el-button>
            </span>
    </el-dialog>

    <el-pagination
        :current-page.sync="currentPage"
        :page-size="5"
        :total="total"
        layout="prev, pager, next"
        style="text-align: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
    </el-pagination>

  </div>
</template>

<script>
import ArticleView from "@/components/ArticleView";
import AuditForm from "@/components/AuditForm";

export default {
  name: "DraftAuditList",
  components: {AuditForm, ArticleView},
  data() {
    return {
      /** 当前登录的审核员信息 */
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      /** 待审核草稿列表数据 */
      tableData: [],
      /** 搜索关键字 */
      search: '',
      /** 加载状态 */
      loading: true,
      /** 当前审核的草稿信息 */
      draft: {
        id: 0,         // 草稿ID
        aid: 0,        // 审核记录ID
        next: 0,       // 下一级审核ID
        srid: 0,       // 提交记录ID
        source: '',    // 来源
        title: '',     // 标题
        content: '',   // 内容
        column: '',    // 所属栏目
      },
      /** 审核对话框显示状态 */
      dialogVisible: false,
      /** 当前页码 */
      currentPage: 1,
      /** 总记录数 */
      total: 0,
      /** 每页显示数量 */
      pageSize: 5,
    };
  },
  /**
   * 生命周期钩子 - 组件挂载后加载待审核列表
   */
  mounted() {
    this.loadData();
  },
  methods: {
    /**
     * 编辑文章
     * 跳转到审核编辑页面
     * @param {Object} row - 文章数据
     */
    handleEdit(row) {
      this.$router.push({
        name: '审核文章编辑',
        params: {
          id: row.srid,
          coid: row.coid,
          source: row.source,
          title: row.title,
          content: row.content,
          column:row.column,
        }
      });
    },
    /**
     * 加载待审核的草稿列表
     */
    loadData() {
      console.log(this.user);
      this.loading = true;
      this.$request.get('/audit/selectByUid/'+this.user.uid).then(
          res => {
            if (res.code === '200') {
              this.tableData = res.data;
              console.log(this.tableData);
              this.total = this.tableData.length;
              this.loading = false;
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
        this.loading = false;
      });
    },
    /**
     * 处理每页条数变化
     * @param {number} newSize - 新的每页条数
     */
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.fetchData();
    },
    /**
     * 处理页码变化
     * @param {number} newPage - 新的页码
     */
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchData();
    },
    /**
     * 移除HTML标签
     * @param {string} html - HTML内容
     * @returns {string} 纯文本内容
     */
    stripHtmlTags(html) {
      let tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText;
    },
    /**
     * 审核草稿
     * 锁定草稿并打开审核对话框
     * @param {number} index - 表格索引
     * @param {Object} row - 草稿数据行
     */
    audit(index, row) {
      this.$request.put('/draft/lock/' + row.id).then(
          res => {
            if (res.code === '200') {
              this.draft.id = row.did;
              this.draft.aid=row.id;
              this.draft.srid=row.srid;
              this.draft.next=row.next;
              this.draft.title = row.title;
              this.draft.source = row.source;
              this.draft.content = row.content;
              this.draft.column=row.column;
              this.dialogVisible = true;
            } else {
              this.$message.error(res.data.msg);
            }
          }
      );
    },
    /**
     * 删除草稿
     * @param {number} index - 索引
     * @param {Object} row - 数据行
     */
    handleDelete(index, row) {
      console.log(index, row);
    },
    /**
     * 处理输入事件
     * @param {Event} event - 输入事件
     */
    handleInput(event) {
      console.log(event);
    },
    /**
     * 获取HTML中的第一张图片
     * @param {string} htmlContent - HTML内容
     * @returns {string|null} 图片URL
     */
    getFirstImage(htmlContent) {
      if (htmlContent) {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = htmlContent;
        let images = tmp.getElementsByTagName('img');
        if (images.length > 0) {
          return images[0].src;
        }
      }
      return null;
    },
    /**
     * 计算图片宽度
     * 根据图片宽高比计算显示宽度
     * @param {string} htmlContent - HTML内容
     * @returns {Promise<string>|string} 图片宽度
     */
    getImageWidth(htmlContent) {
      const img = this.getFirstImage(htmlContent);
      if (img) {
        return new Promise((resolve, reject) => {
          const imgElement = new Image();
          imgElement.onload = function () {
            const ratio = imgElement.width / imgElement.height;
            resolve(`${100 * ratio}px`);
          };
          imgElement.onerror = function () {
            reject(new Error('图片加载失败'));
          };
          imgElement.src = img;
        });
      }
      return '0px';
    },
    /**
     * 提交审核结果
     * 验证表单并提交审核意见
     * @param {Object} draft - 草稿对象
     */
    submitAudit(draft) {
      const auditForm = this.$refs.auditFormRef;
      auditForm.validateForm().then(() => {// 表单验证通过
        const formData = auditForm.getFormData();
        console.log(formData);
        console.log(draft);
        const audit={id:draft.aid,did:draft.id,srid:draft.srid,status:formData.status,next:draft.next}
        this.$request.post('/audit/Update', audit).then(
            res => {
              if (res.code === '200') {
                this.$message.success('保存成功');
                this.loadData();
              } else {
                this.$message.error(res.data.msg);
              }
            }
        );
        this.dialogVisible = false;
      }).catch(() => {// 表单验证失败
        console.log('请完善审核信息');
      });
    },
    /**
     * 取消审核
     * 解锁草稿并关闭对话框
     */
    cancel() {
      this.$request.put('/draft/unlock/' + this.draft.id).then(
          res => {
            if (res.code === '200') {
              this.loadData();
              this.dialogVisible = false;
            } else {
              this.$message.error(res.data.msg);
            }
          }
      ).catch((error) => {
        console.error('解锁请求出现错误:', error);
      });
    }
  },
  computed: {
    /**
     * 返回当前页的草稿数据
     * @returns {Array} 分页后的草稿列表
     */
    returntable() {
      return this.tableData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage);
    }
  }
}
;
</script>

<style lang="scss" scoped>
.audit-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>