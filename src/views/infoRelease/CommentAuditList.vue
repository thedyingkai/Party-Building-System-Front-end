<template>
  <div style="display: flex; flex-direction: column; flex-grow: 1;padding: 1vh">
    <el-table :data="returntable.filter(data =>!search || (data.title?.toLowerCase()?.includes(search.toLowerCase()))
    || (data.uid?.toLowerCase()?.includes(search.toLowerCase()))
                                                       || (data.send_time?.toLowerCase()?.includes(search.toLowerCase()))
                                                       || (data.content?.toLowerCase()?.includes(search.toLowerCase())))"
              stripe :row-style="{ height: '100px' }" :cell-style="{ padding: '0px' }" v-loading="loading">
      <el-table-column prop="title" label="评论文章" width="240">
      </el-table-column>
      <el-table-column prop="uname" label="评论者" width="140">
      </el-table-column>
      <el-table-column prop="content" label="内容" width="520">
        <template slot-scope="scope">
          <span class="ellipsis-text" v-if="scope.row.content">{{ stripHtmlTags(scope.row.content) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="send_time" label="提交时间" width="200">
      </el-table-column>
      <el-table-column
          align="right">
        <template slot="header" slot-scope="scope">
          <div style="display: flex;justify-content: space-between;">
            <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"
                @input="handleInput(scope)"
                style="max-width: 200px;"
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
        title="预览"
        :visible.sync="dialogVisible"
        width="90%"
        fullscreen=true
    >
      <CommentView :draft="draft"></CommentView>
      <div class="audit-form-container">
        <AuditForm ref="auditFormRef" :did="draft.id"></AuditForm>
      </div>
      <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="submitAudit()">确 定</el-button>
            </span>
    </el-dialog>

    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="5"
        layout="prev, pager, next"
        :total="total"
        style="text-align: center">
    </el-pagination>

  </div>
</template>

<script>
import AuditForm from "@/components/AuditForm";
import CommentView from "@/components/CommentView.vue";

export default {
  name: "CommentAuditList",
  components: {CommentView, AuditForm},
  data() {
    return {
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      tableData: [],
      search: '',
      loading: true,
      draft: {
        id: '',
        title: '',
        content: '',
      },
      comments: {
        id: 1,
        title: '',
        uid: 1,
        content: '',
        send_time: '',
        audit_uid: 1,
        status: 0,
      },
      dialogVisible: false,
      currentPage: 1, // 当前页码
      total: 0, // 总数据量
      pageSize: 5,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;
      this.$request.get('/comment/selectallnopass').then(
          res => {
            if (res.code === '200') {
              this.tableData = res.data;
              this.total = this.tableData.length;
              this.loading = false;
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
        this.loading = false;
      });
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.fetchData();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchData();
    },
    stripHtmlTags(html) {
      let tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText;
    },
    audit(index, row) {
      this.draft.id = row.id;
      this.draft.title = row.title;
      this.draft.content = row.content;
      this.dialogVisible = true;
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleInput(event) {
      console.log(event);
    },
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
    submitAudit() {
      const auditForm = this.$refs.auditFormRef;
      const formData = auditForm.getFormData();
      this.comments.status = formData.status;
      this.comments.audit_uid = this.user.uid;
      this.comments.id = this.draft.id;
      console.log(this.comments);
      console.log(this.user);
      this.$request.put('/comment/audit', this.comments).then(
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
    },
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
    returntable() {
      return this.tableData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage);
    }
  }
}
;
</script>

<style lang="scss" scoped>
.el-date-table td, .el-table.cell, .el-table-filter {
  max-height: 95px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.audit-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.dialog-footer {
  text-align: center;
  display: block;
}

</style>