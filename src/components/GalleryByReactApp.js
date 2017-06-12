'use strict';

var React = require('react/addons');

// CSS
require('normalize.css');
require('../styles/main.scss');
var imageDatas = require('../data/imageDatas.json');
// 利用自执行函数， 将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
    for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImageData = imageDatasArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDatasArr[i] = singleImageData;
    }
    return imageDatasArr;
})(imageDatas);
//获取区间内的随机值
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}
function get30DegRandom() {
    return ((Math.random() < 0.5 ? '-' : '') + Math.ceil(Math.random() * 30));
}
//图片组件
var ImgFigure = React.createClass({
    handleClick: function (e) {
        if (this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    },
	render: function() {
        var styleObj = {};
        //如果props属性中指定了这张图片的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }
        if (this.props.arrange.rotate){
            (['MozTranform', 'WebkitTransform', 'msTransform', 'transform']).forEach(function (value){
                styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));
        }
        if (this.props.arrange.isCenter) {
            styleObj.zIndex = 11;
        }
        var imgFigureClassName = 'img-figure';
            imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
			<img src={this.props.data.imageURL} alt={this.props.data.title}/>
			<figcaption>
			<h2 className="img-title">{this.props.data.title}</h2>
            <div className='img-back' onClick={this.handleClick}>
                <p>{this.props.data.description}</p>
            </div>
			</figcaption>
			</figure>
			);
	}
});
//控制条组件
var ControllerUnit = React.createClass({
    handleClick: function (e) {
        if (this.props.arrange.isCenter){
            this.props.inverse();
        } else {
            this.props.center();
        }
        e.preventDefault();
        e.stopPropagation();
    },
    render: function () {
        var controllerUnitClassName = 'controller-unit';
        if (this.props.arrange.isCenter) {
            controllerUnitClassName += ' is-center';
        }
        if (this.props.arrange.isInverse) {
            controllerUnitClassName += ' is-inverse';
        }
        return (
            <span className={controllerUnitClassName} onClick={this.handleClick}></span>
            );
    }
});
var GalleryByReactApp = React.createClass({
    Constant: {
        centerPos: {
            left: 0,
            right: 0
        },
        hPosRange: {//水平方向取值范围
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },
        vPosRange: {//垂直方向取值范围
            x: [0, 0],
            topY: [0, 0]
        }
    },
    inverse: function (index) {
        return function () {
            var imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }.bind(this);
    },
    rearrange: function (centerIndex){
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,
            imgsArrangeTopArr = [],
            TopImgNum = Math.floor(Math.random() * 2),
            TopImgSpliceIndex = 0,
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
            //居中centerIndex的图片
            imgsArrangeCenterArr[0] = {
                pos: centerPos,
                rotate: 0,
                isCenter: true
            };
            //取出要布局于上侧的图片信息
            TopImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - TopImgNum));
            imgsArrangeTopArr = imgsArrangeArr.splice(TopImgSpliceIndex, TopImgNum);
              //布局位于上侧的图片
            imgsArrangeTopArr.forEach(function (value, index) {
                imgsArrangeTopArr[index] = {
                    pos: {
                        top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                        left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                    },
                    rotate: get30DegRandom(),
                    isCenter: false
                };
            });
            //布局两侧的图片
            for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
                var hPosRangeLORX = null;
                //前半部分布局左边
                if (i < k) {
                    hPosRangeLORX = hPosRangeLeftSecX;
                } else {
                    hPosRangeLORX = hPosRangeRightSecX;
                }
                imgsArrangeArr[i] = {
                    pos: {
                        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                        left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                    },
                    rotate: get30DegRandom(),
                    isCenter: false
                };
            }
            if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
                imgsArrangeArr.splice(TopImgSpliceIndex, 0, imgsArrangeTopArr[0]);
            }
            imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
    },
    center: function (index) {
        return function () {
            this.rearrange(index);
        }.bind(this);
    },
    getInitialState: function () {
        return {
            imgsArrangeArr: [
                /*{
                    pos{
                        left = "0",
                        top = "0"
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter:false
                }*/
            ]
        };
    },
        //组件加载后，为图片计算其位置范围
        componentDidMount: function () {
            //拿到舞台的大小
            var stageDom = React.findDOMNode(this.refs.stage),
                stageW = stageDom.scrollWidth,
                stageH = stageDom.scrollHeight,

                halfStageW = Math.ceil(stageW / 2),
                halfStageH = Math.ceil(stageH / 2);
            //拿到一份imgfigure的大小
            var imgFigureDom = React.findDOMNode(this.refs.imgFigure0),
                imgW = imgFigureDom.scrollWidth,
                imgH = imgFigureDom.scrollHeight,
                halfImgW = Math.ceil(imgW / 2),
                halfImgH = Math.ceil(imgH / 2);
            //计算中心图片的位置点
            this.Constant.centerPos = {
                left: halfStageW - halfImgW,
                top: halfStageH - halfImgH
            };
            //计算左侧右侧区域图片排布范围
            this.Constant.hPosRange.leftSecX[0] = -halfImgW;
            this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
            this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
            this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
            this.Constant.hPosRange.y[0] = -halfImgH;
            this.Constant.hPosRange.y[1] = stageH - halfImgH;
            //计算上侧区域图片排布范围
            this.Constant.vPosRange.topY[0] = -halfImgH;
            this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
            this.Constant.vPosRange.x[0] = halfStageW - imgW;
            this.Constant.vPosRange.x[1] = halfImgW;
            this.rearrange(0);
        },
  render: function() {
	var controllerUnits = [],
    imgFigures = [];
	imageDatas.forEach(function (value, index) {
        if(!this.state.imgsArrangeArr[index]){
            this.state.imgsArrangeArr[index] = {
                pos: {
                    left: 0,
                    top: 0
                },
                rotate: 0,
                isInverse: false,
                isCenter: false
            };
        }
        imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
        controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this));

    return (
     <section className="stage" ref="stage">
     <section className="img-sec">
     {imgFigures}
     </section>
     <nav className="controller-nav">
     {controllerUnits}
     </nav>
     </section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
