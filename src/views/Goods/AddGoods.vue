<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 有步骤的精度条 -->
    <el-steps :active="activeStep" style="margin-top:20px" @tab-click="changeTabs">
      <el-step title="第一步" description="基本信息"></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>
    <!-- tab栏 -->
    <el-tabs
      tab-position="left"
      style="margin-top:20px"
      @tab-click="changeTabs"
      v-model="activeName"
    >
      <el-tab-pane label="基本信息" name="basic">
        <el-form ref="form" :model="addGoodsData" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addGoodsData.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addGoodsData.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addGoodsData.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addGoodsData.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="addGoodsData.catArr"
              :options="addGoodsOptions"
              :props="defaultProps"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio-group v-model="addGoodsData.is_promote">
              <el-radio label="1" v-model="addGoodsData.is_promote">是</el-radio>
              <el-radio label="0" v-model="addGoodsData.is_promote">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <el-button type="primary" @click="next(1,'pic')">下一步</el-button>
      </el-tab-pane>

      <el-tab-pane label="商品图片" name="pic">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          list-type="picture-card"
          :on-success="onUploadSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2,'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <quill-editor v-model="addGoodsData.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGoods">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
//在组件中引入quill
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  //为了在组件内能应用富文本器添加的局部组件
  components: {
    quillEditor
  },
  data() {
    return {
      activeStep: 1,
      activeName: "basic",
      addGoodsData: {
        goods_name: "",
        catArr: [],
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        is_promote: "0 ",
        pics: []
      },
      addGoodsOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      },
      //设置请求头，和令牌
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  //发送ajax，让级联菜单有数据
  async created() {
    let res = await this.$http({
      url: "categories",
      params: {
        type: 3
      }
    });
    // console.log(res);
    this.addGoodsOptions = res.data.data;
  },
  methods: {
    //点击下一步，实现切换功能
    next(index, name) {
      this.activeStep = index;
      this.activeName = name;
      // console.log(name);
    },
    //点击tab栏，实现tab栏的切换功能
    changeTabs(tab) {
      // console.log(tab);
      this.activeStep = +tab.index;
    },
    //图片上传成功之后要将图片存到pics中
    onUploadSuccess(res) {
      // console.log(res);
      this.addGoodsData.pics.push({
        pic: res.data.tmp_path
      });
      // console.log(this.addGoodsData.pics);
    },
    //点击商品内容里面的确定按钮，添加商品到数据库中
    async addGoods() {
      // console.log(this.addGoodsData);
      let res = await this.$http({
        url: "goods",
        method: "post",
        data: {
          goods_name: this.addGoodsData.goods_name,
          goods_cat: this.addGoodsData.catArr.join(),
          goods_price: this.addGoodsData.goods_price,
          goods_number: this.addGoodsData.goods_number,
          goods_weight: this.addGoodsData.goods_weight,
          goods_introduce: this.addGoodsData.goods_introduce,
          is_promote: this.addGoodsData.is_promote,
          pics: this.addGoodsData.pics
        }
      });
      console.log(res);
      if (res.data.meta.status === 201) {
        this.$router.push("/goods");
      } else {
        this.$message({
          type: "error",
          message: res.data.meta.msg,
          duration: 1000
        });
      }
    }
  }
};
</script>

<style >
.ql-editor {
  height: 200px;
}
</style>
