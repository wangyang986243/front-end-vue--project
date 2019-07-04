<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容 -->
    <el-table :data="rightsData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="120"></el-table-column>
      <el-table-column prop="path" label="路径" width="120"></el-table-column>
      <template>
        <el-table-column label="层级" v-slot="{row}">{{row.level==0?'一级':(row.level==1?'二级':'三级')}}</el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsData: []
    };
  },
  methods: {
    //获取权限列表
    async getRightsData() {
      let res = await this.$http({
        url: "rights/list",
        method: "get"
      });
      console.log(res);

      if (res.data.meta.status === 200) {
        this.rightsData = res.data.data;
      }
    }
  },
  created() {
    this.getRightsData();
  }
};
</script>
