$(function () {
    // 获取数据
    Detail.getData();

    // 自动轮播,给小点添加active 
    Detail.setTem();

    // 初始化下拉刷新
    Detail.downScroll();

    // 当加入购物车按钮点击
    Detail.onCartClick();
});

function Detail() {
    Detail.Url = Detail.getUrlData('productid');
}

Detail.getUrlData = function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}


Detail.getData = function (callback) {
    // 获取url地址栏数据
    var id = Detail.getUrlData('productid');
    $.ajax({
        url: '/product/queryProductDetail',
        data: {
            id: id
        },
        success: function (backData) {

            var data = template('getDataTem', backData);
            $('#main >.mui-scroll').html(data);
            callback && callback(backData);
        }
    })
}

Detail.setTem = function() {
    Detail.getData(function (backData) {
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
        });

        // 给小点添加active
        $('#main .mui-slider >.mui-slider-indicator >div').first().addClass('mui-active');

        // 让轮播图无限循环
        var firstImg = backData.pic[0].picAddr;
        var lastImg = backData.pic[backData.pic.length - 1].picAddr;
        $('#main .mui-slider >.mui-slider-group >div').first().find('img').attr('src',lastImg);
        $('#main .mui-slider >.mui-slider-group >div').last().find('img').attr('src',firstImg);
        
        // 生成模板尺码
        var sizeArr = backData.size.split('-');
        var startNum = sizeArr[0];
        var endNum = sizeArr[sizeArr.length-1];
        for(var i = startNum ; i <= endNum ; i++ ) {
            $('#main .size').append('<span>'+i+'</span>')
        }

        // 尺码点击事件
        $('#main .size').on('tap', 'span', function() {
            $('#main .size span').removeClass('active');
            $(this).addClass('active');
        })

        //点击添加数量
        $('#main .num >.add').on('tap', function(event) {
            event.preventDefault();
            var count = $('#main .num >.count').val();
            var totalcount = $(this).data('count');
            if(count < totalcount) {
                count++;
            }
            $('#main .num >.count').val(count);
        })

        // 点击减少数量
        $('#main .num >.reduce').on('tap', function(event) {
            event.preventDefault();
            var count = $('#main .num >.count').val();
            if(count > 0){
                count--;
            }
            $('#main .num >.count').val(count);
        })
    });
}


Detail.downScroll = function() {
    //初始化下拉刷新
    mui.init({  
        pullRefresh: {  
            container: '#main',  //传入父容器的id
            down: {  
                callback: function(){
                    setTimeout(function() {
                        mui('#main').pullRefresh().endPulldownToRefresh();
                    }, 1000);
                }
            },  
        }  
    });  
}


Detail.onCartClick = function() {
    $('.btn-cart').on('click',function() {
        var size = $('#main .size span.active').html();
        var num = $('#main .num .count').val();
        if(!size) {
            mui.toast('请选择尺码',{duration: 1000, type:'div'});
            return;
        };
        if(num == 0) {
            mui.toast('请选择数量',{duration: 1000, type:'div'});
            return;
        };

        // 待写

    })
}


