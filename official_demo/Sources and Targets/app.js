jsPlumb.ready(function () {
    // list of possible anchor locations for the blue source element
    var sourceAnchors = [// 方位: 下 左 上 右
        [0, 1, 0, 1],
        [0.25, 1, 0, 1],
        [0.5, 1, 0, 1],
        [0.75, 1, 0, 1],
        [1, 1, 0, 1]
    ]
    
    var instance = window.instance = jsPlumb.getInstance({
        // drag options
        DragOptions: {cursor: 'pointer', zIndex: 2000},
        // default to a gradient stroke from blue to green
        PaintStyle: {
            gradient: {
                stops: [
                    [0, '#0d78bc'],
                    [1, '#58bc58']
                ]
            },
            stroke: '#58bc58',
            strokeWidth: 10
        },
        Container: 'canvas'
    })

    // click listener for the enable/disable link in the source box(the blue one)
    jsPlumb.on(document.getElementById('enableDisableSource'), 'click', function (e) {
        var sourceDiv = (e.target || e.srcElement).parentNode
        console.log(sourceDiv)
        var state = instance.toggleSourceEnabled(sourceDiv) // Toggles the source enabled state of the given element or elements.
        this.innerHTML = (state ? 'disable' : 'enable')
        jsPlumb[state ? 'removeClass' : 'addClass'](sourceDiv, 'element-disabled')
        jsPlumbUtil.consume(e)
    })

    // click listener for enable/disable in the small green boxes
    jsPlumb.on(document.getElementById('canvas'), 'click', '.enableDisableTarget', function (e) {
        var targetDiv = (e.target || e.srcElement).parentNode
        var state = instance.toggleTargetEnabled(targetDiv)
        this.innerHTML = (state ? 'disable' : 'enable')
        jsPlumb[state ? 'removeClass' : 'addClass'](targetDiv, 'element-disable') // jsPlumb.addClaas(targetDiv, 'element-disable')

        jsPlumbUtil.consume(e)
    })

    // bind to a connection event, just for the purposes of pointing out that it can be done.
    instance.bind('connection', function (info, c) {
        if (typeof console !== 'undefined') console.log('connection', info.connection,)
        // c is undefined 我也不懂为啥还有一个形参c咯
    })

    // get the list of ".smallWindow" elements
    var smallWindows = jsPlumb.getSelector('.smallWindow')
    // make them draggable
    instance.draggable(smallWindows, {
        // 筛选出a标签,如果是a标签的话就不拖动
        filter: '.enableDisableTarget'
    })

    // suspend drawing and initialise
    instance.batch(function () {
        // make 'window1' a connection source. notice the filter and filterExclude parameters: they tell jsPlumb to ignore drags that started on the 'enable/disable' link on the blue window
        instance.makeSource('sourceWindow1', {
            filter: 'a',
            filterExclude: true, //filterExclude:过滤排除
            maxConnections: -1,
            endpoint: ['Dot', {radius: 7, cssClass: 'small-blue'}],
            anchor: sourceAnchors
        })

        // configure the .smallWindows as targets.
        instance.makeTarget(smallWindows, {
            dropOptions: {hoverClass: 'hover'},
            anchor: 'Top',
            endpoint: ['Dot', {radius: 11, cssClass: 'large-green'}]
        })

        // and finally connect a couple of small windows, just so its obvious what's going on when this demo loads.
        instance.connect({
            source: 'sourceWindow1',
            target: 'targetWindow5'
        })
        instance.connect({
            source: 'sourceWindow1',
            target: 'targetWindow2'
        })
    })
    jsPlumb.fire('jsPlumbDemoLoaded', instance)
})