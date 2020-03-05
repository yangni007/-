/**
 * el: 事件目标
 * parent: 容器。事件目标在父元素上拖动
 * startCallback： 开始拖拽的回调函数
 * stopCallback： 结束拖拽的回调函数
 * 
 * 使用：mixin种引入 drag， 然后在生命周期init(el, parent, startCallback, stopCallback)
 */
var drag = {
    data() {
        return {
            delay: 100,
            canDo: true,
            isTransition: false,
            startCallback: null,
            stopCallback: null,
            isDrag: false,
            transData: {
                left: 0,
                top: 0
            },
            maxLeft: 0,
            maxTop: 0,
            minLeft: 0,
            minTop: 0,
        }
    },
    methods: {
        init(el, parent, startCallback, stopCallback, isTransition) {
            this.startCallback = startCallback;
            this.stopCallback = stopCallback;
            this.isTransition = isTransition;
            // 最大边界值：父元素的宽 - 元素的款 == 能拖拽的最大活动区域
            this.maxLeft = parent.offsetWidth - el.offsetWidth;
            this.maxTop = parent.offsetHeight - el.offsetHeight;
        },
        start(e){
            // 保存起始坐标
            this.startX = e.clientX;
            this.startY = e.clientY;
            // 保存事件目标到
            this.el_offsetLeft = e.target.offsetLeft;
            this.el_offsetTop = e.target.offsetTop;
            this.startCallback && this.startCallback(e);
            this.isDrag = true;
        },
        move(e){
            if(this.isDrag) {
                let moveX = e.clientX - this.startX;
                let moveY = e.clientY - this.startY;
                // 鼠标移动的距离 === 元素移动的距离
                this.left = moveX + this.el_offsetLeft;
                this.top = moveY + this.el_offsetTop;
                // 判断是否超出了边界值
                if(this.left > this.maxLeft) {
                    this.left = this.maxLeft;
                } else if(this.left < 0) {
                    this.left = 0;
                }
                if(this.top > this.maxTop) {
                    this.top = this.maxTop;
                } else if(this.top < 0) {
                    this.top = 0;
                }
                // 节流
                this.throttle();
                // this.moveEl();
            }
        },
        moveEl() {
            this.transData.left = this.left + 'px';
            this.transData.top = this.top + 'px';
        },
        throttle() {
            if(!this.canDo) {
                return;
            }
            this.canDo = false;
            setTimeout(() => {
                this.canDo = true;
                // 赋值给style
                this.moveEl.call(this)
            }, this.delay)
        },
        stop(e){
            this.isDrag = false;
            this.stopCallback && this.stopCallback(e);
        }
    }
}