/**
 * el: 事件目标
 * parent: 容器。事件目标在父元素上拖动
 * startCallback： 开始拖拽的回调函数
 * stopCallback： 结束拖拽的回调函数
 * isTransition： 拖拽的时候是否需要过渡移动效果
 * 
 * 使用：new drag(el, document, startCallback, stopCallback, false)
 */
class drag {
    el = null;
    delay = 100;
    canDo = true;
    parent = null;
    isTransition = false;
    startCallback = null;
    stopCallback = null;
    maxLeft = 0;
    maxTop = 0;
    minLeft = 0;
    minTop = 0;
    constructor(el, parent, startCallback, stopCallback, isTransition) {
        this.el = el;
        this.parent = parent;
        this.startCallback = startCallback;
        this.stopCallback = stopCallback;
        // 是否需要元素过渡
        this.isTransition = isTransition;
        // 最大边界值：父元素的宽 - 元素的款 == 能拖拽的最大活动区域
        this.maxLeft = parent.width() - el.width();
        this.maxTop = parent.height() - el.height();
        // 给元素绑定mousedown事件
        el.bind('mousedown', this.start);
    }
    start = (e) => {
        // 保存起始坐标
        this.startX = e.clientX;
        this.startY = e.clientY;
        // 保存事件目标距离父元素的距离
        this.el_offsetLeft= this.el.offset().left;
        this.el_offsetTop = this.el.offset().top;
        this.startCallback && this.startCallback(e);
        // mousedown才给父元素添加监听事件的好处是：不用创建一个变量来标记mousedown按下的状态
        this.parent.bind({
            mousemove: this.move,
            mouseup: this.stop
        });
        
        // 给属性过度
        if(this.isTransition) {
            this.transition();
        } 
    }

    // 过度效果
    transition = () => {
        this.el.css({transition: "left 300ms linear, top 300ms linear"});
    }

    move = (e) => {
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
    }
    // 赋值移动
    moveEl() {
        this.el.css({
            left: this.left,
            top: this.top
        })
    }
    // 节流
    throttle = () => {
        if(!this.canDo) {
            return;
        }
        this.canDo = false;
        setTimeout(() => {
            this.canDo = true;
            // 赋值给style
            this.moveEl.call(this)
        }, this.delay)
    }
    // 取消事件
    stop = (e) => {
        this.parent.unbind('mousemove', this.move);
        this.parent.unbind('mouseup', this.stop);
        this.stopCallback && this.stopCallback(e);
    }
}
