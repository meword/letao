/*
 * @Author: zw
 * @Date:   2017-12-29 09:35:50
 * @Last Modified by:   44808
 * @Last Modified time: 2017-12-29 21:36:30
 */
//当前正在显示的页数
var page = 1;
var search = getQueryString('search');
//给当前页面的搜索框赋值为searh的值

$(function() {
    //初始化下拉刷新插件
    mui.init({
        pullRefresh: {
            container: '#pullrefresh', //传入父容器的选择器
            down: { //控制下拉刷新
                contentdown: '下拉刷新效果',
                contentover: '拉动的时候的效果',
                contentrefresh: '松开手的时候正在加载数据的显示文本...',
                callback: function() {
                        //模拟ajax请求 过1秒后结束下拉刷新
                        setTimeout(function() {
                              page = 1;
                            //模拟网络慢的情况 等1秒再发送请求
                            getProductList({
                                proName: '鞋', //商品名称
                                brandId: 1, //品牌的id
                                price: 1, //价格排序 1是升序  2是降序
                                num: 1, //数量的排序 1是升序 2是降序
                                page: 1, //页码数  第几页商品类别
                                pageSize: 2, //页容量 每页的商品条数
                            }, function(data) {
                                console.log(data);
                                var html = template('productListTmp', data);
                                $('.productlist-content .mui-row').html(html);
                                //当数据请求完毕后结束下拉刷新
                                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                                //注意当加载不了更多数据了重新刷新页面的时候要重置上啦刷新
                                mui('#pullrefresh').pullRefresh().refresh(true);
                                 // mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                            });

                        }, 1000);
                    } //下拉刷新的回调函数
            },
            up: {
                contentrefresh: "加载中...", //提示上拉刷新
                contentnomore: '在下实在是给不更多',
                //上拉加载更多
                callback: function() {
                    console.log(page);
                    //模拟ajax请求 过1秒后结束上拉加载更多
                    setTimeout(function() {
                        //在上拉加载更多的回调函数里面page++
                        page++;
                        getProductList({
                            proName: '鞋', //商品名称
                            brandId: 1, //品牌的id
                            price: 1, //价格排序 1是升序  2是降序
                            num: 1, //数量的排序 1是升序 2是降序
                            page: page, //页码数  第几页商品类别
                            pageSize: 2, //页容量 每页的商品条数
                        }, function(data) {
                            console.log(data);
                            var html = template('productListTmp', data);
                            // 因为要加载更多数据是追加 所以渲染页面的时候要append
                            $('.productlist-content .mui-row').append(html);
                            if (data.data.length <= 0) {
                                mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                                return;
                            }
                            //等上拉加载更多数据完成后 关闭上拉加载的转圈圈
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                        });
                    }, 1000);
                }
            }
        }
    });
    $('.search-input').val(search);
    getProductList({
        proName: search, //商品名称
        price: 1, //价格排序 1是升序  2是降序
        num: 1, //数量的排序 1是升序 2是降序
        page: 1, //页码数  第几页商品类别
        pageSize: 2, //页容量 每页的商品条数
    }, function(data) {
        var html = template('productListTmp', data);
        $('.productlist-content .mui-row').html(html);
    });
    // 调用搜索商品列表的方法
    searchProductlist();
    // 调用排序的方法
    productlistSort();
    linkDetail();
});

/*getProductList获取商品列表的函数 options对象传入一些参数
options = {
    proName:'商品的名称',//商品名称
    brandId:1,//品牌的id
    price:1,//价格排序 1是升序  2是降序
    num:1,//数量的排序 1是升序 2是降序
    page:1,//页码数  第几页商品类别
    pageSize:5,//页容量 每页的商品条数
}
*/
function getProductList(options, callback) {
    $.ajax({
        url: '/product/queryProduct',
        data: options,
        success: function(data) {
            callback && callback(data);
        }
    });
}

function searchProductlist() {
    $('.btn-search').on('click', function() {
        var search = $('.search-input').val().trim();
        if (!search) {
            alert('请输入要搜索的商品');
            return;
        }
        //调用获取商品列表的方法传入当前要搜索的内容
        getProductList({
            proName: search, //商品名称
            price: 1, //价格排序 1是升序  2是降序
            num: 1, //数量的排序 1是升序 2是降序
            page: 1, //页码数  第几页商品类别
            pageSize: 2, //页容量 每页的商品条数
        }, function(data) {
            if (data.data.length <= 0) {
                $('.productlist-content .mui-row').html('<p>没有此商品</p>');
                return;
            }
            var html = template('productListTmp', data);
            $('.productlist-content .mui-row').html(html);
        });
    });
}

// 定义排序的方法
function productlistSort() {
    // 注意下拉刷新插件里面禁止click事件 使用tap事件就能点击了
    // tap可能点击会触发多次手机是不会的
    $('.productlist-title .mui-row > div').on('tap', function() {
        //给所有div删除active类名
        $('.productlist-title .mui-row > div').removeClass('active');
        //给当前点击的div添加active
        $(this).addClass('active');
        // 获取当前排序的类型
        var sortType = $(this).data('type');
        //获取当前排序的方式 升序1 降序2
        var sort = $(this).data('sort');
        if (sort == 1) {
            sort = 2;
            //把排序方式设置为2
            $(this).data('sort', 2);
            //如果2类名改成向上
            $(this).find('i').removeClass().addClass('fa-angle-up');
        } else {
            sort = 1;
            //把排序方式设置为1
            $(this).data('sort', 1);
            //如果1类名改成向下
            $(this).find('i').removeClass().addClass('fa-angle-down');
        }
        //判断如果当前排序类型是price就调用API传入排序方式在price属性
        if (sortType == 'price') {
            getProductList({
                proName: search, //商品名称
                price: sort, //价格排序 1是升序  2是降序
                page: 1, //页码数  第几页商品类别
                pageSize: 6, //页容量 每页的商品条数
            }, function(data) {
                var html = template('productListTmp', data);
                $('.productlist-content .mui-row').html(html);
            });
        } else if (sortType == 'num') { //如果排序类型是num 调用API传入排序方式num属性
            getProductList({
                proName: search, //商品名称
                num: sort,//数量排序 1是升序 2降序
                page: 1, //页码数  第几页商品类别
                pageSize: 6, //页容量 每页的商品条数
            }, function(data) {
                var html = template('productListTmp', data);
                $('.productlist-content .mui-row').html(html);
            });
        }
    });
}


//获取url中的参数并且解决中文乱码问题
function getQueryString(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}

function linkDetail() {
    $('body').on('tap','.product',function () {
        //跳转到商品详情页传入当前点击的商品的id
        window.location.href="detail.html?id="+$(this).data('id');
    })
}