<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加商品按钮 -->
    <el-button type="success" plain style="margin-top:10px">添加商品</el-button>
    <!--  商品列表主体 -->
    <el-table :data="goodsData" stripe style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="editUserDialog(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete-solid"
            plain
            size="mini"
            @click="deleteUser(row.id)"
          ></el-button>
        </template>
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
    <!-- 添加用户 模态框 -->
  </div>
</template>


<script>
export default {
  data() {
    return {
      goodsData: [],
      total: 0,
      currentPage: 1,
      pageSize: 6
    };
  },

  created() {
    this.getGoodsData();
  },
  methods: {
    //封装一个获取页面商品列表的ajax请求
    async getGoodsData() {
      let res = await this.$http({
        url: "goods",
        method: "get",
        params: {
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      });
      //   console.log(res);
      this.goodsData = res.data.data.goods;
      this.total = res.data.data.total;
    },
    //分页跳转功能
    /* 
        注意：这里的currentPage是emeltent ui 默认自动帮我传过来，我们只要在这写一个形参就行！！！！！
     */
    onPageChange(currentPage) {
      this.currentPage = currentPage;
      this.getGoodsData();
    }
  }
};
</script>
