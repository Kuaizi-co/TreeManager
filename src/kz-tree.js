/**
 * Element-UI Tree 最佳实践
 * 扩展管理无刷新操作树节点
 * @author tommyshao
 * @copyright kuaizi.co
 */

import kzTree from './tree.vue'

kzTree.install = function (Vue) {
  Vue.component(kzTree.name, kzTree)
}

export default kzTree
