# jsPlumb-study

#### 这个仓库存在的意义呢，算是记录我自己的一个学习过程吧。因为目前使用jsplumb的人不会太多，很多坑，只能自己一步一步踩。



## Basic Conceptes
```
jsPlumb 主要分为5个反面
    1. Anchor: 锚点位置
    2. Endpoint: 断点,连接的起点或终点
    3. Connector: 连线,连接两个节点的直观表现,有四种默认类型: Bezier(贝塞尔曲线), Straight(直线), Flowchart(流程图), Statemachine(状态机)
    4. Overlay: 装饰连接器的组件, 类似箭头之类
    5. Group: 包含在某个其他元素中的一组元素, 可以折叠, 导致与所有成员的连接被合并到折叠的组容器上
```