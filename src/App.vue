<template>
  <div id="app">
    <kz-tree :data="tree" @node-click="hanldeNodeClick"></kz-tree>
    <div class="content">
      {{ content }}

      <div class="copyright">
        &copy;kuaizi.co 
        <span>
          <a href="https://github.com/kuaizi-co/treeManager">Github</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * tree 实例
 **/
export default {
  name: 'app',
  components: {
    kzTree: require('./tree.vue')
  },
  data () {
    return {
      content: 'TreeManager',
      tree: {
        url: {
          C: '/api/tree/add',
          U: '/api/tree/update',
          R: '/api/tree/list',
          D: '/api/tree/delete'
        }
      }
    }
  },
  methods: {
    hanldeNodeClick (data) {
      this.content = data.name
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,body {
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  height: 100%;
}
.content {
  position: relative;
  border-left: 1px solid #ddd;
  flex: 1;
  padding: 50px 20px;
}
.el-tree {
  border: none;
}
.copyright {
  position: absolute;
  bottom: 20px;
  right: 0;
  left: 0;
  text-align: center;
}
</style>
