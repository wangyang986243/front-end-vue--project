<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 添加用户栏 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 主体内容 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot="{row}">
          <el-switch v-model="row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete-solid" plain size="mini"></el-button>
        <el-button type="success" plain size="mini">分配角色</el-button>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      @current-change="onPageChange"
    ></el-pagination>
  </div>
</template>



<script>
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 3
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 封装一个获取数据的axios请求方法
    getUserList() {
      this.$http({
        url: "users",
        method: "get",
        params: {
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      }).then(res => {
        let {
          data: { data, meta }
        } = res;
        console.log(res);
        this.tableData = data.users;
        this.total = data.total;
      });
    },
    //分页功能
    onPageChange(page) {
      // console.log(page);
      this.currentPage = page;
      this.getUserList();
    }
  }
};
</script>
<style>
.el-breadcrumb {
  background-color: #d4dae0;
  height: 50px;
  line-height: 50px !important;
  font-size: 16px !important;
  padding-left: 10px;
}
</style>
