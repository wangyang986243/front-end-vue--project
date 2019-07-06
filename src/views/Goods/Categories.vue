<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加商品按钮 -->
    <el-button type="success" plain style="margin-top:10px" @click="showAddCategoriesDialog">添加分类</el-button>
    <!--商品分类主体  -->
    <el-table :data="categoriesData" stripe style="width: 100%">
      <!-- <el-table-column prop="cat_name" label="分类名称"></el-table-column> -->
      <!-- 
        解释： file-icon :不可展开的图标
              folder-icon ：可以展开项的图标
              treeKey： 节点唯一标识
              parentKey： 数据的父节点id
              childrenKey： 当前节点所有子节点存放属性的名字 默认是children
              indent-size: 用来设置每个层级之间的缩进距离的
              设置indent-size 需要指定层级属性
              level-key 设置数据中标识层级的属性名即可
      -->
      <el-table-tree-column
        file-icon="el-icon-document"
        folder-icon="el-icon-folder"
        prop="cat_name"
        label=" 分类名称"
        width="220"
        parentKey="cat_pid"
        treeKey="cat_id"
        :index-size="50"
        level-key="cat_level"
      ></el-table-tree-column>

      <el-table-column label="是否有效">
        <template v-slot="{row}">{{row.cat_deleted?'否':'是'}}</template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级"></el-table-column>
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
    <!-- 添加用户模态框 -->
    <el-dialog title="添加分类" :visible.sync="isAddCategoriesDialogShow">
      <el-form :model="addCategoriesForm" label-width="100px" ref="addCateForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoriesForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="parentArr">
          <el-cascader
            v-model="addCategoriesForm.parentArr"
            :options="cateOptions"
            :props="defaultProps"
            :clearable="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteAddcategories">取 消</el-button>
        <el-button type="primary" @click="addCategories">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const ElTreeGrid = require("element-tree-grid");

// console.log(ElTreeGrid); 打印结果： el-table-tree-column,functional: true, props: {…}, render: ƒ}

export default {
  components: {
    /* 
    注解：
        这里的[ElTreeGrid.name]: ElTreeGrid还有一种写法就是  'el-table-tree-column':ElTreeGrid  因为这里局部组件其实就是要一个名字，
        那这个插件引进来需要的名字就是这个el-table-tree-column。
        前面的写法是es6的
        
   */
    [ElTreeGrid.name]: ElTreeGrid
  },
  data() {
    return {
      categoriesData: [],
      total: 0,
      currentPage: 1,
      pageSize: 5,
      isAddCategoriesDialogShow: false,
      addCategoriesForm: {
        cat_name: "",
        parentArr: []
      },
      cateOptions: [],

      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        checkStrictly: true
      }
    };
  },
  created() {
    this.getCategoriesData();
  },
  methods: {
    //封装一个请求当前分类页数据的ajax请求
    async getCategoriesData() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      });
      // console.log(res);
      this.categoriesData = res.data.data.result;
      this.total = res.data.data.total;
    },
    //分页功能的实现
    onPageChange(currentPage) {
      // console.log(currentPage);
      this.currentPage = currentPage;
      this.getCategoriesData();
    },
    //点击添加分类，跳出添加模态框
    async showAddCategoriesDialog() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 2
        }
      });
      // console.log(res);
      this.cateOptions = res.data.data;
      this.isAddCategoriesDialogShow = true;
    },
    //点击确定按钮，发送ajax请求，添加商品分类
    async addCategories() {
      let cat_name = this.addCategoriesForm.cat_name;
      let cat_level = this.addCategoriesForm.parentArr.length;
      let cat_pid = this.addCategoriesForm.parentArr.pop() || 0;
      let res = await this.$http({
        url: "categories",
        method: "post",
        data: {
          cat_pid,
          cat_name,
          cat_level
        }
      });
      // console.log(res);
      if (res.data.meta.status === 201) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        this.isAddCategoriesDialogShow = false;
        this.getCategoriesData();
        this.$refs["addCateForm"].resetFields();
        // console.log(this.$refs["addCateForm"]);

        // this.$refs.addCateForm.resetFields();
      }
    },
    // 点击取消按钮，重置表单
    deleteAddcategories() {
      // this.$refs.addCateForm.resetFields();
      this.$refs["addCateForm"].resetFields();
      this.isAddCategoriesDialogShow = false;
    }
  }
};
</script>

