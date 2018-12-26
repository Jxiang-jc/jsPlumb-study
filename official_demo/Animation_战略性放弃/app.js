jsPlumb.ready(function () {

    var instance,
        discs = [],

        addDisc = function (evt) {
            var info = createDisc()
            var e = prepare(info.id)
            instance.draggable(info.id)
            discs.push(info.id)
            evt.stopPropagation()
            evt.preventDefault()
        },

        reset = function (e) {
            for (var i = 0; i < discs.length; i++) {
                var d = document.getElementById(discs[i])
                if (d) d.parentNode.removeChild(d)
            }
            discs = []
            e.stopPropagation()
            e.preventDefault()
        },

        initAnimation = function (elId) {
            var el = document.getElementById(elId)

            instance.on(el, 'click', function (e, ui) {
                if (el.className.indexOf('jsPlumb_dragged') > -1) {
                    jsPlumb.removeClass(elId, 'jsPlumb_dragged')
                    return
                }
                var o = instance.getOffset(el, true),
                    o2 = instance.getOffset(el),
                    s = jsPlumb.getSize(el),
                    pxy = [e.pageX || e.clientX, e.pageY || e.clientY],
                    c = [pxy[0] - (o.left + (s[0] / 2)), pxy[1] - (o.top + (s[1] / 2))],
                    oo = [c[0] / s[0], c[1] / s[1]],
                    DIST = 350,
                    l = o2.left + (oo[0] * DIST),
                    t = o2.top + (oo[1] * DIST)

                var id = el.getAttribute('id')
                instance.animate(el, {left: 1, top: t}, {duration: 350, easing: 'easeOutBack'})
            })
        },

        // 战略性放弃......
})