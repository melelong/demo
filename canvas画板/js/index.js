

//单对象编程

var drawingBoard = {
    cavs: document.getElementById('cavs'),
    ctx: document.getElementById('cavs').getContext('2d'),
    colorChange: document.getElementById('colorChange'),
    lineRuler: document.getElementById('lineRuler'),
    imgArr:[],
    init: function () {
        // console.log(this.name);
        this.drawing();//开始画画
        this.ctx.lineCap = 'round';//线条起始和结尾的样式
        this.ctx.lineJoin = 'round';//转弯处
        this.btnsALLfn();
    },
    btnsALLfn: function () {
        var _this = this;//保存当前的drawingBoard
        this.colorChange.onchange = function () {//改变颜色
            console.log(this.value);
            _this.ctx.strokeStyle = this.value;
        }

        this.lineRuler.onchange = function () {//改变线条粗细
            console.log(this.value);
            _this.ctx.lineWidth = this.value;
        }
        var btns = document.getElementsByTagName('ul')[0];
        btns.onclick = function (e) {
            console.log(e.target.id);
            switch (e.target.id) {
                case 'cleanBoard':
                    _this.ctx.clearRect(0,0,_this.cavs.offsetWidth,_this.cavs.offsetHeight);
                    break;

                case 'eraser':
                    _this.ctx.strokeStyle = '#ffffff';
                    break;

                case 'rescind':
                    if(_this.imgArr.length>0){
                        _this.ctx.putImageData(_this.imgArr.pop(),0,0);
                    }
                  
                    break;
            }




        }



    },
    drawing: function () {
        var _this = this,
            cavs = this.cavs,
            c_left = cavs.offsetLeft,
            c_top = cavs.offsetTop;

        this.cavs.onmousedown = function (e) {
            var c_x = e.pageX - c_left,
                c_y = e.pageY - c_top;
            _this.ctx.beginPath();
            _this.ctx.moveTo(c_x, c_y);

            var img = _this.ctx.getImageData(0,0,_this.cavs.offsetWidth,_this.cavs.offsetHeight);
            _this.imgArr.push(img);
            console.log(_this.imgArr);




            document.onmousemove = function (e) {
                _this.ctx.lineTo(e.pageX - c_left, e.pageY - c_top);
                _this.ctx.stroke();
            }

            document.onmouseup = function (e) {
                document.onmousemove = null;
                _this.ctx.closePath();
            }


        }








    }
}
drawingBoard.init();//代码入口

// (function(){//代码块



/****
 * 
 * 全阶班:
 * 一阶段 :  7299
 * 二阶段:   7599
 * 全套:  12999 元  
 * 
 * 线上: 直播 + 录播(永久)
 *  解锁下个模块
 * 
 * 1,就业保障协议 年薪保底10w  
 * 2,享有该阶段与时俱进的课程更新  
 * 3,大厂内推的名额
 * 4,支持分期付款  
 * 
 * 19期全阶班  15号      原价 12999    报名  : xxxx?  回去问一下你们学业顾问
 * 
 */
// })()