<template>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="username" label="姓名" width="180"></el-table-column>
    <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
    <el-table-column prop="mobile" label="电话"></el-table-column>
    <el-table-column label="用户状态">
      <template v-slot="scope">
        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        <!-- {{scope.row}} -->
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
      <el-button type="danger" icon="el-icon-delete-solid" plain size="mini"></el-button>
      <el-button type="success" plain size="mini">分配角色</el-button>
    </el-table-column>
  </el-table>
</template>


<script>
import axios from "axios";
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    axios({
      url: "http://localhost:8888/api/private/v1/users",
      method: "get",
      params: {
        pagenum: 1,
        pagesize: 5
      },
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then(({ data: { data, meta } }) => {
      //   console.log(data, meta);
      if (meta.status === 200) {
        this.tableData = data.users;
      }
    });
  }
};
</script>