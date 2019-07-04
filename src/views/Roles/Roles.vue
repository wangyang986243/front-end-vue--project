<template>
<!-- ref属性，如果是想操作子元素，就要把ref加个这些资源的父元素。操作子元素的时候用this.$refs -->
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体 -->
    <el-table :data="RolesData" stripe style="width: 100%" ref="rightTree">
      <el-table-column type="expand">
        <template v-slot="{row}">
          <el-row type="flex" v-for="item1 in row.children" :key="item1 .id" class="item1">
            <el-col :span="6">
              <el-tag closable @close="deleteRoleRight(row.id,item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col>
              <el-row type="flex" v-for="item2 in item1.children" :key="item2.id" class="item2">
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="deleteRoleRight(row.id,item2.id)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col>
                  <el-tag
                    type="warning"
                    closable
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    class="item3"
                    @close="deleteRoleRight(row.id,item3.id)"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete-solid" plain size="mini"></el-button>
          <el-button type="success" plain size="mini" @click="assignRole(row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限 模态框 -->
    <el-dialog title="角色授权" :visible.sync="isRolesDialogShow">
      <el-tree
        ref="tree"
        :data="rightsData"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :props="defaultProps"
        :default-checked-keys="defaultCheck"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isRolesDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="updateRoleRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      RolesData: [],
      rightsData: [],
      isRolesDialogShow: false,
      defaultProps: {
        children: "children",
        label: "authName"
      },
      //这个属性是用来绑定分配角色下面复选框的勾选的状态，是一个数组
      defaultCheck: [],
      currentId: -1
    };
  },
  created() {
    this.getRolesData();
  },
  methods: {
    //获取列表数据
    async getRolesData(callback) {
      let res = await this.$http({
        url: "roles"
      });
      this.RolesData = res.data.data;
      callback && callback();
    },
    //分配角色权利
    async assignRole(row) {
      this.isRolesDialogShow = true;
      let res = await this.$http({
        url: "rights/tree"
      });
      // console.log(res);
      this.rightsData = res.data.data;
      //获取数据,将每个级别的权限的id组合成一个数组，赋值给defaultCheck
      // console.log(row);
      // let level1Ids = [];
      // let level2Ids = [];
      let level3Ids = [];
      //循环遍历row的每一级寻找id，把这些id给相应4级别的数组就好
      row.children.forEach(level1 => {
        // level1Ids.push(level1.id);
        level1.children.forEach(level2 => {
          // level2Ids.push(level2.id);
          level2.children.forEach(level3 => {
            level3Ids.push(level3.id);
          });
        });
      });
      this.defaultCheck = [...level3Ids];
      // console.log(row);
      this.currentId = row.id;
    },
    //更新角色授权
    async updateRoleRights() {
      let ids = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ].join(",");

      let res = await this.$http({
        url: `roles/${this.currentId}/rights`,
        method: "post",
        data: {
          rids: ids
        }
      });
      this.$message({
        message: "更新成功",
        type: "success",
        duration: 1000
      });
      this.isRolesDialogShow = false;
      this.getRolesData();
    },
    //删除单个权限
    /* 
        调用接口，删除当前角色指定的权限信息
          接口信息:
              roles/:id/rights/:rightID
               method: delete
     */
    async deleteRoleRight(rowId, rightId) {
      // console.log(rowId, rightId);
      let res = await this.$http({
        url: `roles/${rowId}/rights/${rightId}`,
        method: "delete"
      });
      console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        console.log(this.$refs.tree);

        this.getRolesData(() => {
          this.$nextTick(() => {
            this.$refs.rightTree.toggleRowExpansion(
              this.RolesData.find(v => v.id == rowId),
              true
            );
          });
        });
      }
    }
  }
};
</script>

<style scoped>
.item1 {
  border-bottom: 1px dashed #000;
  padding: 10px 0;
}
.item1:last-child {
  border-bottom: none;
}
.item2 {
  margin-bottom: 15px;
}
.item3 {
  margin-right: 10px;
  margin-bottom: 10px;
  float: left;
}
</style>
