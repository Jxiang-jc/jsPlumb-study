jsPlumb.ready(function () {
    var instance = jsPlumb.getInstance({
        Connector: 'StateMachine',
        PaintStyle: {
            strokeWidth: 3,
            stroke: '#ffa500',
            // 'dashstyle': '2 4' 等同于下面
            dashstyle: '2 4'
        },
        Endpoint: ['Dot', {radius: 5}],
        EndpointStyle: {fill: '#ffa500'},
        Container: 'canvas'
    })

    var shapes = jsPlumb.getSelector('.shape')

    // make everything draggable
    instance.draggable(shapes)

    // suspend drawing and initialise
    instance.batch(function () {

        // loop through them(循环遍历他们) and connect each one to each one
        for (var i = 0; i < shapes.length; i++) {
            for (var j = i + 1; j < shapes.length; j++) {
                instance.connect({
                    source: shapes[i], // just pass in the current node in the selector for souce
                    target: shapes[j],
                    // here we supply a different anchor for source and for target, and we get the element's 'data-shape' attribute to tell us what shape we should use, as well as, optionally, a rotation value
                    anchors: [
                        ["Perimeter", {shape: shapes[i].getAttribute('data-shape'), rotation: shapes[i].getAttribute('data-rotation')}], // source的形状描边
                        ["Perimeter", {shape: $(shapes).eq(j)[0].dataset.shape, rotation: $(shapes).eq(j)[0].dataset.rotation}] // target的形状描边
                    ] 
                })
            }
        }
    })
})

// 总结一下: 后生成的会覆盖前一个生成的连接.这跟zIndex有关.
// 这里之所以两个遍历,是为了每一个都需要连接到. Perimeter的具体用法:https://jsplumbtoolkit.com/community/doc/anchors.html#intro
// anchors 第一个perimeter是给source的,第二个才是给perimeter
// 这样的话,拖动时,锚点会跟着图形的边而变化,即使缩小了图片.也会跟着边变化而变化,很是神奇,当然我的猜想是,也必须是规则的图形才行.(我在CSS中给Diamond做了小小的修改.)