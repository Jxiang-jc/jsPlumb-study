jsPlumb.ready(function () {
    var instance = window.jsp = jsPlumb.getInstance({
        // default drag options 默认拖动选项
        DragOptions: {
            cursor: 'pointer',
            zIndex: 2000
        },
        // the overlays to decorate each connection with note that the label overlays uses a function to generate(生成) the label text; in this case it returns the 'labelText' member that we set on each connection in the 'init' method below

        // 默认连接线的样式
        ConnectionOverlays: [
            ['Arrow', { // 连接线箭头的样式
                location: 1,
                visible: true,
                width: 11,
                length: 11,
                id: 'ARROW',
                events: {
                    click: function () {
                        alert('you clicked on the arrow overlay')
                    }
                }
            }],
            ['Label', {
                location: 0.1,
                id: 'label',
                cssClass: 'aLabel',
                events: {
                    tap: function () {
                        alert('hey')
                    }
                }
            }]
        ],
        Container: 'canvas' // 容器的ID
    })

    var basicType = {
        connector: 'StateMachine',
        paintStyle: {
            stroke: 'red',
            strokeWidth: 4
        },
        hoverPaintStyle: {
            stroke: 'blue'
        },
        overlays: [
            'Arrow'
        ]
    }

    // 把basicType 赋给 basic,并登记在连接类型中,然后可以通过setType去更改,或者是toggleType去更改,细节可查看./some-explaian/registerConnectionType.html
    instance.registerConnectionType('basic', basicType)

    // this is the paint style for the connecting lines
    var connectorPaintStyle = {
            strokeWidth: 2,
            stroke: '#61b7cf',
            joinstyle: 'round',
            outlineStroke: 'white',
            outlineWidth: 2
        },
        // this is the hover style,
        connectorHoverStyle = {
            strokeWidth: 3,
            stroke: '#216477',
            outlineWidth: 5,
            outlineStroke: 'white'
        },
        endpointHoverStyle = {
            fill: '#216477',
            stroke: '#216477'
        },

        // the dfinition of source endpoints (the small blue ones)
        sourceEndpoint = {
            endpoint: 'Dot',
            paintStyle: {
                stroke: '#7AB02C',
                fill: 'transparent',
                radius: 7,
                strokeWidth: 1
            },
            isSource: true,
            connector: ['Flowchart', {
                stub: [40, 60],
                gap: 10,
                cornerRadius: 5,
                alwaysRespectStubs: true
            }],
            connectorStyle: connectorPaintStyle,
            hoverPaintStyle: endpointHoverStyle,
            connectorHoverStyle: connectorHoverStyle,
            dragOptions: {},
            overlays: [
                ['Label', {
                    location: [0.5, 1.5],
                    label: 'Dray',
                    cssClass: 'endpointSourceLabel',
                    visible: false
                }]
            ]
        },

        // the difinition of target endpoints (will appear when the user drags a connection)
        targetEndpoint = {
            endpoint: 'Dot',
            paintStyle: {
                fill: '#7AB02C',
                radius: 7
            },
            hoverPaintStyle: endpointHoverStyle,
            maxConnections: -1,
            dropOptions: {
                hoverClass: 'hover',
                activeClass: 'active'
            },
            /*
            Drop Options
                Drop options are treated by jsPlumb in the same way as drag options - they are passed through to the underlying library.

                Here are three common Katavorio droppable options that you might want to consider using:

                hoverClass - the CSS class to attach to the droppable when a draggable is hovering over it.

                activeClass - the CSS class to attach to the droppable when a draggable is, um, being dragged. 

                scope - the scope of the draggable. The draggable can only be dropped on a droppable with the same scope. This is discussed below.
            */
            isTarget: true,
            overlays: [
                ['Label', {
                    location: [0.5, -0.5],
                    label: 'Drop',
                    cssClass: 'endpointTargetLabel',
                    visible: false
                }]
            ]
        },
        init = function (connection) {
            connection.getOverlay('label').setLabel(connection.sourceId.substring(15) + '-' + connection.targetId.substring(15))
        }
    var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i]

            // 循环遍历 添加端点
            instance.addEndpoint('flowchart' + toId, {
                anchor: sourceAnchors[i],
                uuid: sourceUUID
            }, sourceEndpoint)
        }

        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j]

            instance.addEndpoint('flowchart' + toId, {
                anchor: targetAnchors[j],
                uuid: targetUUID
            }, targetEndpoint)
        }
    }

    // suspend drawing and initialise
    instance.batch(function () { // 这个函数也可以先将所有的连接全部注册好，再一次重绘。
        _addEndpoints('Window4', ['TopCenter', 'BottomCenter'], ['LeftMiddle', 'RightMiddle'])
        _addEndpoints('Window2', ['LeftMiddle', 'BottomCenter'], ['TopCenter', 'RightMiddle'])
        _addEndpoints('Window3', ['RightMiddle', 'BottomCenter'], ['LeftMiddle', 'TopCenter'])
        _addEndpoints('Window1', ['LeftMiddle', 'RightMiddle'], ['TopCenter', 'BottomCenter'])

        // listen for new connections; initialise them the same way we initialise the connections at startup. 每次新连接都会添加标识,如 '1-4 1-3 2-1' 等等
        instance.bind('connection', function (connInfo, originalEvent) {
            init(connInfo.connection)
        })

        // make all the window divs draggable
        instance.draggable(jsPlumb.getSelector('.flowchart-demo .window'), {
            grid: [20, 20]
        })
        // this demo only uses getSelector for convenience. use you libray's appropriate selector method or document.querySelectorAll:
        // jsplumb.draggable(document.querySelectorAll('.window'), {grid: [20, 20]})

        // connect a few up 先建立一些连接
        // uuids连接是编码连接方式.可以看第15个demo
        instance.connect({
            uuids: ["Window2BottomCenter", "Window3TopCenter"],
            editable: true
        }) //editable是否可编辑的
        instance.connect({
            uuids: ["Window2LeftMiddle", "Window4LeftMiddle"],
            editable: true
        })
        instance.connect({
            uuids: ["Window4TopCenter", "Window4RightMiddle"],
            editable: true
        })
        instance.connect({
            uuids: ["Window3RightMiddle", "Window2RightMiddle"],
            editable: true
        })
        instance.connect({
            uuids: ["Window4BottomCenter", "Window1TopCenter"],
            editable: true
        })
        instance.connect({
            uuids: ["Window3BottomCenter", "Window1BottomCenter"],
            editable: true
        })

        // listen for clicks on connections, and offer to delete conections on click.
        instance.bind('click', function (conn, originalEvent) {
            // if (confirm('Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"')) {
            //     instance.detach(conn)
            // }

            // 切换类型
            conn.toggleType('basic')
        })

        instance.bind('connectionDrag', function (connection) {
            console.log('connection' + connection.id + 'is being dragged suspendedElement is', connection.suspendedElement, 'of type', connection.suspendedElementType)
        })

        instance.bind('connectionDragStop', function (connection) {
            console.log('connection' + connection.id + 'was dragged')
        })

        instance.bind('connectionMoved', function (params) {
            console.log('connection' + params.connection.id + 'was moved')
        })
    })
    // 完成初始化
    jsPlumb.fire('jsPlumbDemoLoaded', instance)
    /* 
        It seems to be calling an undocumente EventGenerator method. 这看似一个未被验证的事件生成方法
         The first argument is the name of an event. The only event that seems to be set up by default is "ready". So the fire method checks if an event called "jsPlumbDemoLoaded" exists, then, when it's not found, the method returns.
    */
})