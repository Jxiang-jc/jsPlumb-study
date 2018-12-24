jsPlumb.ready(function () {
    var instance = window.jsp = jsPlumb.getInstance({
        // default drag options 默认拖动选项
        DragOptions: {
            cursor: 'pointer',
            zIndex: 2000
        },
        // the overlays to decorate each connection with note that the label overlays uses a function to generate the label text; in this vase it returns the 'labelText' member that we set on each connection in the 'init' method below

        // 默认连接线的样式
        ConnectionOverlays: [
            ['Arrow', {
                location: 1,
                visible: true,
                width: 11,
                lenght: 11,
                id: 'ARROW',
                events: {
                    click: function () {
                        alert('you clickd on the arrow overlay')
                    }
                }
            }],
            ['label', {
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
        Container: 'canvas' // 容器的id
    })

    var basicType = {
        connector: 'StateMachine',
        paintStyle: {
            stroke: 'red',
            strokeWidth: 4
        },
        hoverPainStyle: {
            stroke: 'blue'
        },
        overlays: [
            'Arrow'
        ]
    }

    instance.registerConnectionType('basic', basicType)

    // this is the paint style for connecting lines
    var connectorPaintStyle = {
        strokeWidth: 2,
        stroke: '#61b7cf',
        joinstyle: 'round',
        outlineStroke: 'white',
        outlineWidth: 2
    },
        // this is the hover style
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

        // the definition of sourse endpoints (the small blue ones)
        sourceEndpoint = {
            endpoint: 'Dot',
            paintStyle: {
                stroke: '#58bc58',
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
            hoverPainStyle: endpointHoverStyle,
            connectorHoverStyle: connectorHoverStyle,
            dragOptions: {},
            overlays: [
                ['label', {
                    loaction: [0.5, 1.5],
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
                fill: '#58bc58',
                radius: 7
            },
            hoverPainStyle: endpointHoverStyle,
            maxConnections: -1,
            dropOptions: {
                hoverClass: 'hover',
                activeClass: 'active'
            },
            isTarget: true,
            overlays: [
                ['Label', {
                    location: [0.5, 1.5],
                    label: 'Drop',
                    cssClass: 'endpointTargetLabel',
                    visible: false
                }]
            ]
        },
        init = function (connection) {
            connection.getOverlays('label').setLabel(connection.sourceId.substring(15) + '-' + connection.targetId.substring(15))
        }
    
    var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + souceAnchors[i]

            instance.addEndpoint('flowchart' + toId, {
                anchor: sourceAnchors[i],
                uuid: sourceUUID
            }, sourceEndpoint)
        }

        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[i]

            instance.addEndpoint('flowchart' + toId, {
                anchor: targetAnchors[i],
                uuid: targetUUID
            }, targetEndpoint)
        }
    }

    instance.batch(function () {
        _addEndpoints('Window4', ['TopCenter', 'BottomCenter'], ['LeftMiddle', 'RightMiddle'])
        _addEndpoints('Window2', ['LeftMiddle', 'BottomCenter'], ['TopCenter', 'RightMiddle'])
        _addEndpoints('Window3', ['RightMiddle', 'BottomCenter'], ['LeftMiddle', 'TopCenter'])
        _addEndpoints('Window1', ['LeftMiddle', 'RightMiddle'], ['TopCenter', 'BottomCenter'])

        instance.bind('connection', function (connInfo, originalEvent) {
            init(connInfo.connection)
        })

        // make all the window divs draggable
        instance.draggable(jsPlumb.getSelector('.flowchart-demo .window'), {
            grid: [20, 20] // 每次移动按照20, 20 来移动
        })

        instance.connect({
            uuids: ['Window2BottomCenter', 'Window3TopCenter'],
            editable: true
        })
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

        // listen for clicks on connections, and offer to delete conections on click
        instance.bind('click', function (conn, originalEvent) {
            conn.toggleType('basic')
        })

        instance.bind('connectionDrag', function (connection) {
            
        })

        instance.bind('connectionDragStop', function (connection) {

        })

        instance.bind('connectionMoved', function (params) {
            
        })

        // 完成初始化
        jsPlumb.fire('jsPlumbDemoLoaded', instance)
    })

})