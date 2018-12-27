;
(function () {
    jsPlumb.ready(function () {

        // 基本连接线样式
        var connectorPaintStyle = {
                lineWidth: 4,
                strokeStyle: '#61b7cf',
                joinstyle: 'round',
                outlineColor: 'white',
                outlineWidth: 2
            },

            // 鼠标悬停浮在连接线上的样式
            connectorHoverStyle = {
                lineWidth: 4,
                strokeStyle: '#216477',
                outlineColor: 'white',
                outlineWidth: 2
            },
            endpointHoverStyle = {
                fillStyle: '#216477',
                strokeStyle: '#216477'
            },

            // 空心圆端点样式
            hollowCircle = {
                endpoint: ['Dot', {
                    radius: 10
                }], // 断点的形状
                connectorStyle: connectorPaintStyle, // 连接线的颜色, 大小样式
                connectorHoverStyle: connectorHoverStyle,
                paintStyle: {
                    strokeStyle: '#1e8151', // 边框颜色
                    fillStyle: 'transparent',
                    radius: 6,
                    lineWidth: 3 // 边框宽度
                }, // 端点的颜色样式
                // anchor: 'AutoDefault',
                isSource: true,
                connector: ['Flowchart', {
                    stub: [30, 60],
                    gap: 10,
                    cornerRadius: 5, //转角
                    alwaysRespectStubs: true
                }], // 连接线的样式种类有[Bezier], [Flowchart], [StateMachine], [Straight]
                isTarget: true,
                maxConnections: -1,
                connectorOverlays: [
                    ['Arrow', {
                        width: 13,
                        length: 12,
                        location: 1
                    }]
                ]
            },

            // 实心圆样式
            solidCircle = {
                endpoint: ['Dot', {
                    radius: 8
                }], // 断点的形状
                paintStyle: {
                    fillStyle: '#58bc58'
                }, // 端点的颜色样式
                connectorStyle: {
                    strokeStyle: 'rgb(97, 183, 207)',
                    lineWidth: 4
                }, //连接线的颜色, 大小样式
                isSource: true, // 是否可以拖动（作为连线起点）
                connector: ['Flowchart', {
                    stub: [40, 60],
                    gap: 10,
                    cornerRadius: 7,
                    alwaysRespectStubs: true
                }],
                isTarget: true,
                maxConnections: 3,
                connectorOverlays: [
                    ['Arrow', {
                        width: 10,
                        length: 10,
                        location: 1
                    }]
                ]
            }

        var instance = jsPlumb.getInstance({
            DragOptions: {
                cursor: 'pointer',
                zIndex: 2000
            },
            Container: 'canvas'
        })

        // 保证每次id都不一样
        var i = 0

        // suspend drawing and initialise
        instance.batch(function () {
            $("#left").children().draggable({
                helper: 'clone',
                scope: 'haha'
            })
            $('#right').droppable({
                scope: 'haha',
                drop: function (event, ui) {
                    // ui.offset.left得到的是相对浏览器左边的距离
                    // $(this).offset().left返回$('#right')的偏移量
                    let left = parseInt(ui.offset.left - $(this).offset().left)
                    let top = parseInt(ui.offset.top - $(this).offset().top)
                    let name = ui.draggable[0].id
                    switchType(name, left, top, ui)
                }
            })
            // $('#right').click(function (e) {
            //     // console.log(e.offsetX, e.offsetY) -> 该元素与距离最近的定位父元素间的距离
            //     // console.log(e.clientX) -> 鼠标到可视区左边框的距离。
            // })

            // 当鼠标进入
            $('#right').on('mouseenter', '.node', function (e) {
                $(this).append(`
                    <img src="./img/close2.png" style="position: absolute;">
                `)
                // console.log($(this).text().trim())
                if ($(this).text().trim() === '开始' || $(this).text().trim() === '结束') {
                    // console.log($('img'))
                    $('img').css('left', 158).css('top', -1)
                } else {
                    $('img').css('left', 158).css('top', -10)
                }
            })

            // 当鼠标离开时
            $("#right").on("mouseleave", ".node", function () {
                $("img").remove()
            })

            // 点击删除
            $('#right').on('click', 'img', function () {
                if (confirm('您确定要删除吗 ?')) {
                    jsPlumb.removeAllEndpoints($(this).parent().attr('id'))
                    $(this).parent().remove();
                }
            })

        })

        // 双击删除
        function doubleClick(id) {
            $(id).on('dblclick', function (e) {
                e.stopPropagation() // 阻止清空输入框后再次双击
                let text = $(this).text().trim()
                // console.log($(this))
                $(this).html('')
                $(this).append("<input class='editInput' type='text' value='" + text + "' />")
                    .find('.editInput').focus()

                // 失去焦点保存
                $('.editInput').blur(function () {
                    $(this).parent().html($("input[type='text']").val())
                })
            })

            // 回车保存
            $(id).keyup(function (e) {
                console.log($(this))
                if (e.keyCode === 13) {
                    $(this).html($("input[type='text']").val())
                }
            })
        }

        // 筛选类型
        function switchType(name, left, top, ui) {
            let id
            switch (name) {
                case 'node1':
                    i++
                    id = 'state_start' + i
                    $('#right').append(`
                        <div class="node radius" id="${id}">
                            ${$(ui.helper).html()}
                        </div>
                    `)
                    $("#" + id).css("left", left).css("top", top);
                    // 添加端点
                    jsPlumb.addEndpoint(id, {
                        anchors: "TopCenter"
                    }, solidCircle);
                    jsPlumb.addEndpoint(id, {
                        anchors: "RightMiddle"
                    }, hollowCircle);
                    jsPlumb.addEndpoint(id, {
                        anchors: "BottomCenter"
                    }, hollowCircle);
                    jsPlumb.addEndpoint(id, {
                        anchors: "LeftMiddle"
                    }, hollowCircle);
                    // jsPlumb.addEndpoint(id, hollowCircle);
                    // 这里我用jsplumb的拖拽, 当然也可以用jquery-ui里面的,都行
                    jsPlumb.draggable(id, {
                        containment: 'parent'
                    })
                    doubleClick("#" + id)
                    break;

                case 'node2':
                    i++
                    id = 'state_flow' + i
                    $('#right').append(`
                        <div class="node" id="${id}">
                            ${$(ui.helper).html()}
                        </div>
                    `)
                    $("#" + id).css("left", left).css("top", top);
                    // 添加端点
                    jsPlumb.addEndpoint(id, {
                        anchors: "TopCenter"
                    }, hollowCircle);
                    jsPlumb.addEndpoint(id, {
                        anchors: "RightMiddle"
                    }, hollowCircle);
                    jsPlumb.addEndpoint(id, {
                        anchors: "BottomCenter"
                    }, hollowCircle);
                    jsPlumb.addEndpoint(id, {
                        anchors: "LeftMiddle"
                    }, hollowCircle);

                    // 这里我用jsplumb的拖拽, 当然也可以用jquery-ui里面的,都行
                    jsPlumb.draggable(id, {
                        containment: 'parent'
                    })
                    doubleClick("#" + id);
                    break;

                case 'node3':
                    i++
                    id = 'state_decide' + i
                    $('#right').append(`
                        <div class="node" id="${id}">
                            ${$(ui.helper).html()}
                        </div>
                    `)
                    $("#" + id).css("left", left).css("top", top);
                    // 添加端点
                    jsPlumb.addEndpoint(id, {
                        anchors: "TopCenter"
                    }, hollowCircle);
                    jsPlumb.addEndpoint(id, {
                        anchors: "RightMiddle"
                    }, hollowCircle);
                    jsPlumb.addEndpoint(id, {
                        anchors: "BottomCenter"
                    }, hollowCircle);
                    jsPlumb.addEndpoint(id, {
                        anchors: "LeftMiddle"
                    }, hollowCircle);

                    // 这里我用jsplumb的拖拽, 当然也可以用jquery-ui里面的,都行
                    jsPlumb.draggable(id, {
                        containment: 'parent'
                    })
                    doubleClick("#" + id);
                    break;

                case 'node4':
                    i++
                    id = 'state_end' + i
                    $('#right').append(`
                        <div class="node" id="${id}">
                            ${$(ui.helper).html()}
                        </div>
                    `)
                    $("#" + id).css("left", left).css("top", top);
                    // 添加端点
                    jsPlumb.addEndpoint(id, {
                        anchors: "TopCenter"
                    }, hollowCircle);
                    jsPlumb.addEndpoint(id, {
                        anchors: "RightMiddle"
                    }, hollowCircle);
                    jsPlumb.addEndpoint(id, {
                        anchors: "BottomCenter"
                    }, hollowCircle);
                    jsPlumb.addEndpoint(id, {
                        anchors: "LeftMiddle"
                    }, hollowCircle);

                    // 这里我用jsplumb的拖拽, 当然也可以用jquery-ui里面的,都行
                    jsPlumb.draggable(id, {
                        containment: 'parent'
                    })
                    doubleClick("#" + id);
                    break;

                default:
                    alert('小傻瓜, 你弄啥咧')
            }
        }

        // 保存
        function save() {
            console.log(jsPlumb.getAllConnections())
            // 保存数据
            var connects = []
            $.each(jsPlumb.getAllConnections(), function (idx, connection) {
                
                // var cont = connection.getLabel() 

                connects.push({
                    ConnectionId: connection.id,
					PageSourceId: connection.sourceId,
					PageTargetId: connection.targetId,
					SourceText: connection.source.innerText,
					TargetText: connection.target.innerText,
					SourceAnchor: connection.endpoints[0].anchor.type,
					TargetAnchor: connection.endpoints[1].anchor.type
					// ConnectText: $(cont).html()
                })
            })

            var blocks = []
            $('#right .node').each(function (idx, elem) {
                var $elem = $(elem)
                blocks.push({
                    BlockId: $elem.attr('id'),
                    BlockContent: $elem.html(),
                    BlockX: parseInt($elem.css('left'), 10), // parseInt第二个参数为10相等于不填, 可查api 范围在2~36之间
                    BlockY: parseInt($elem.css('top'), 10)
                })
            })

            var serlize = JSON.stringify(connects) + '&' + JSON.stringify(blocks)
            $.ajax({
                type: 'post',
                url: 'ajax....xxx',
                data: {id: serlize},
                success: function (filePath) {
                    // do something here
                    // window.open("show-flowChart.aspx?path=" + filePath)
                }
            })
        }

        let savePosition = document.getElementById('savePosition')
        savePosition.onclick = function () {
            save()
        }
    })


})();
