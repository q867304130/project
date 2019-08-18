/**
 * 获取滚动的头部距离和左边距离
 * scroll().top scroll().left
 * @returns {*}
 */
function scroll() {
    if(window.pageYOffset !== null){
        return {
            top: window.pageYOffset,
            left: window.pageXOffset
        }
    }else if(document.compatMode === "CSS1Compat"){ // W3C
        return {
            top: document.documentElement.scrollTop,
            left: document.documentElement.scrollLeft
        }
    }

    return {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
    }
}

/**
 * 获取屏幕的宽度和高度
 * @returns {*}
 */
function client(){
    if(window.innerWidth){
    return {
            width : window.innerWidth,
            height : window.innerHeight
        }
    }

    else if(document.compatMode === "CSS1Compat"){
     return {
         width: document.documentElement.clientWidth ,
         height:document.documentElement.clientHeight
     }
    }
    
     return {
            width: document.body.clientWidth ,
            height:document.body.clientHeight
    }
    
}


function $(id) {
    return typeof id === "string" ? document.getElementById(id) : null;
}
function show(obj) {
    return obj.style.display = 'block';
}

function hide(obj) {
    return obj.style.display = '';
}


/**
 *  匀速动画 函数
 * @param {object}obj
 * @param {number}target
 * @param {number}speed
 */
function constant(obj, target, speed) {
    // 1. 清除定时器
    clearInterval(obj.timer);

    // 2. 判断方向
    var dir = obj.offsetLeft < target ? speed : -speed;


    // 3. 设置定时器
    obj.timer = setInterval(function () {
        obj.style.left = obj.offsetLeft + dir + "px";

        if(Math.abs(target - obj.offsetLeft) < Math.abs(dir)){
            clearInterval(obj.timer);

            obj.style.left = target + "px";
            console.log(obj.offsetLeft, target);
        }
    }, 20);

}

//缓动动画 函数  （单值）
// function buffer(obj, target) {
//     // 1.1 清除定时器
//     clearInterval(obj.timer);
    
//     // 1.2 设置定时器
//     obj.timer = setInterval(function () {
//         // 1.3 求出步长
//         var speed = (target - obj.offsetLeft) * 0.2;
//         // 判断是否向上取整
//         speed = (target > obj.offsetLeft) ? Math.ceil(speed) : Math.floor(speed);
//         // 1.4 动起来
//         obj.style.left = obj.offsetLeft + speed + "px";
//         obj.innerText = obj.offsetLeft;
//         // 1.5 判断
//         if(obj.offsetLeft === target){
//             clearInterval(obj.timer);
//         }
//     }, 20)
// };

//缓动动画 函数 （多值 + 回调） 
function buffer(obj, json, fn) {
    // 1.1 清除定时器
    clearInterval(obj.timer);

    // 1.2 设置定时器
    var begin = 0, target = 0, speed = 0;
    obj.timer = setInterval(function () {
        // 1.3.0 旗帜
        var flag = true;
        for(var k in json){
            // 1.3 获取初始值
            if("opacity" === k){ // 透明度
                begin =  parseInt( parseFloat(getCSSAttrValue(obj, k)) * 100);
                target = parseInt(parseFloat(json[k]) * 100);
            }else if("scrollTop" === k){
                begin = Math.ceil(obj.scrollTop);
                target = parseInt(json[k]);
            }
            else { // 其他情况
                begin = parseInt(getCSSAttrValue(obj, k)) || 0;
                target = parseInt(json[k]);
            }

            // 1.4 求出步长
            speed = (target - begin) * 0.2;

            // 1.5 判断是否向上取整
            speed = (target > begin) ? Math.ceil(speed) : Math.floor(speed);

            // 1.6 动起来
            if("opacity" === k){ // 透明度
                // w3c的浏览器
                obj.style.opacity = (begin + speed) / 100;
                // ie 浏览器
                obj.style.filter = 'alpha(opacity:' + (begin + speed) +')';
            }else if("scrollTop" === k){
                obj.scrollTop = begin + speed;
            }
            else if("zIndex" === k){
                obj.style[k] = json[k];
            }
            else {
                obj.style[k] = begin + speed + "px";
            }

            console.log(begin, target);

            // 1.5 判断
            if(begin !== target){
                flag = false;
            }
        }

        // 1.3 清除定时器
        if(flag){
            clearInterval(obj.timer);

            

            // 判断有没有回调函数
            if(fn){
                fn();
            }
        }
    }, 20);
}

   

//动态设置CSS属性 函数
function changeCssStyle(obj,attr,value){
    obj.style[attr] = value;
}

//获取CSS的属性值 函数
function getCSSAttrValue(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }else{
        return window.getComputedStyle(obj,null)[attr];
    }
}