jsPlumb.ready(function () {

    // 默认一开始使用第一组的数据, 当拖拽时,会根据不同的方位选择不同的位置, 'foo' 'bar' 等是添加类名
    var sourceAnchors = [
            [0.2, 0, 0, -1, 0, 0, 'foo'],
            [1, 0.2, 1, 0, 0, 0, 'bar'],
            [0.8, 1, 0, 1, 0, 0, 'baz'],
            [0, 0.8, -1, 0, 0, 0, 'qux']
        ],
        targetAnchors = [
            [0.6, 0, 0, -1],
            [1, 0.6, 1, 0],
            [0.4, 1, 0, 1],
            [0, 0.4, -1, 0]
        ],

        exampleColor = '#00f',
        exampleDropOptions = {
            tolerance: 'touch',
            hoverClass: 'dropHover',
            activeClass: 'dragActive'
        },
        connector = ['Bezier', {
            cssClass: 'connectorClass',
            hoverClass: 'connectorHoverClass'
        }],
        connectorStyle = {
            gradient: {
                stops: [
                    [0, exampleColor],
                    [0.5, '#09098e'],
                    [1, exampleColor]
                ]
            },
            strokeWidth: 5,
            stroke: exampleColor
        },
        hoverStyle = {
            stroke: '#449999'
        },
        overlays = [
            ['Diamond', {
                fill: '#09098e',
                width: 15,
                length: 15
            }]
        ],
        endpoint = ['Dot', {
            cssClass: 'endpointClass',
            radius: 10,
            hoverClass: 'endpointHoverClass'
        }],
        endpointStyle = {
            fill: exampleColor
        },
        anEndpoint = {
            endpoint: endpoint,
            paintStyle: endpointStyle,
            hoverPaintStyle: {
                fill: '#449999'
            },
            isSource: true,
            isTarget: true,
            maxConnections: -1,
            connector: connector,
            connectorStyle: connectorStyle,
            connectorHoverStyle: hoverStyle,
            connectorOverlays: overlays
        }

    var instance = jsPlumb.getInstance({
        DragOptions: {
            cursor: 'pointer',
            zIndex: 2000
        },
        Container: 'canvas'
    })

    // suspend drawing and initialise
    instance.batch(function () {
        // 这里的逻辑是要对着效果图看才清晰, 因为是无限制连接,因此用了数组的形式,
        // 建议如果要往数组继续添加时连接时,也要响应增加endpoint才行
        var connections = {
                'dynamicWindow1': ['dynamicWindow4'],
                "dynamicWindow3": ["dynamicWindow1"],
                "dynamicWindow5": ["dynamicWindow3"],
                "dynamicWindow6": ["dynamicWindow5"],
                "dynamicWindow2": ["dynamicWindow6"],
                "dynamicWindow4": ["dynamicWindow2"]
            },
            endpoints = {},

            // ask jsPlumb for a selector for the window class
            divsWithWindowClass = jsPlumb.getSelector('.dynamic-demo .window')

        // add endpoints to all these -one for source, and one for target, configured so they don't sit on top each other.
        // 配置使它们不会坐着在彼此之上。
        for (var i = 0; i < divsWithWindowClass.length; i++) {
            var id = instance.getId(divsWithWindowClass[i])
            console.log(id)
            // 每一个div上添加两个以数组形式的点
            endpoints[id] = [
                // note the three-arg version of addEndpoint; lets you re-use some common settings easily
                instance.addEndpoint(id, anEndpoint, {
                    anchor: sourceAnchors
                }),
                instance.addEndpoint(id, anEndpoint, {
                    anchor: targetAnchors
                })
            ]
        }
        console.log(endpoints)
        // then connect everything using the connections map declared above.
        for (var key in endpoints) {
            // console.log('key', key)
            if (connections[key]) {
                for (var j = 0; j < connections[key].length; j++) {
                    // 在这里 connections[key].length === 1 
                    // console.log(1, endpoints[key])
                    // console.log(2, endpoints[connections[key][j]])
                    console.log()
                    instance.connect({
                        source: endpoints[key][0],
                        target: endpoints[connections[key][j]][1]
                    })
                }
            }
        }

        // 如果把目标作为来源(source),会无视拖拽draggable
        instance.makeSource('num1', {
            endpoint:endpoint,
            connectorStyle: {
                stroke: "#5c96bc",
                strokeWidth: 8,
                outlineStroke: "transparent",
                outlineWidth: 4
            }
        })
        
        instance.makeTarget('num2', {
            endpoint:endpoint,
            connectorStyle: connectorStyle
        })

        // bind click listener: delete connections on click
        instance.bind('click', function (conn) {
            console.log(instance)
            console.log(jsPlumb)
            // 此api没有了            jsPlumb.detach(conn)

            // instance.detach(conn)
            instance.deleteConnection(conn)
        })

        // bind beforeDetach interceptor: will be fired when the click handler above calls detach, and the user will be prompted to confirm deletion
        instance.bind('beforeDetach', conn => {
            return confirm('Delete connection ?')
        })

        // configure ".window to be draggable. 'getSelector' is a jsPlumb convenience method that allows you to write library-agnostic selectors: you could use your library's insted, eg"
        //
        // $('.window')       jquery
        // $$('.window')      mootools
        // Y.all('.window')   yui3
        
        instance.draggable(divsWithWindowClass, {
            filter: '#num2' // filter 目前我所知道的,无法用数组形式, 而且只能选择比目标元素的子代,同级兄弟无法筛选

        })

        jsPlumb.fire('jsPlumbDemoLoaded', instance)

    })

})