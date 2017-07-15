//得到商品ID
var goods_id = $.getQueryString('goods_id');
console.log(goods_id);
shop.api.fetchGoodsDetail(goods_id, function(response) {
    var obj = response.data[0];
    console.log(obj);
    $(".crumbs").append(
        '<a href="index.html">网易考拉海购</a>'
        +'&nbsp;>&nbsp;'
        +'<span class="crumbs-title">'
        + obj.goods_name
        +'</span>');
    $(".detail-img").append(
        '<div class="show-img">\
            <img src=' + obj.goods_thumb + '/>\
            <div class="zoom"></div>\
        </div>\
        <div class="hide-img">\
        </div>');

    $(".show-img").hover(function(){
        $(".zoom").show();
        $(".hide-img").show();
    },function(){
        $(".zoom").hide();
        $(".hide-img").hide();
    });

    $(".show-img").mousemove(function(event){
        event = event || window.event;
        // 卷动值
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;

        // 鼠标坐标 - (元素净top - 卷动值)
        var x = event.clientX - (getAllLeft($(this))-scrollLeft)-$(".zoom")[0].offsetWidth/2;
        var y = event.clientY - (getAllTop($(this)) - scrollTop)-$(".zoom")[0].offsetHeight/2;
        if(x < 0) x = 0;
        if(y < 0) y = 0;
        if(x > $(this)[0].clientWidth - $(".zoom")[0].offsetWidth) x = $(this)[0].clientWidth - $(".zoom")[0].offsetWidth;
        if(y > $(this)[0].clientHeight - $(".zoom")[0].offsetHeight) y = $(this)[0].clientHeight - $(".zoom")[0].offsetHeight;

        $(".zoom")[0].style.left = x + "px";
        $(".zoom")[0].style.top = y + "px";

        var rateW = $(".hide-img")[0].clientWidth/($(this)[0].clientWidth - $(".zoom")[0].offsetWidth);
        var rateH = $(".hide-img")[0].clientHeight/($(this)[0].clientHeight - $(".zoom")[0].offsetHeight);
        $(".hide-img")[0].style.backgroundImage = "url(" + obj.goods_thumb +")";
        $(".hide-img")[0].style.backgroundPosition = -x*rateW + "px " + -y*rateH + "px";


    })
        //<p>' + obj.goods_desc + '</p><button class="cart-btn">加入购物车</button></div>');
    $(".cart-btn").click(function() {
        //验证用户是否登录，未登录则跳到登录页
        if (!localStorage.token) {
            location.href = "login.html#callbackurl=" + location.href;
            return;
        }
        console.log(localStorage.token);
        console.log(goods_id);
        console.log("已登录");
        //获取当前商品已经购买的数量
        var goods_number = localStorage.getItem("cart"+ goods_id);
        goods_number = goods_number ? parseInt(goods_number)+1 : 1;//如果已经有了则加1，没有则是第一次购买
        updateCartInfo(goods_id, goods_number, function(response){
            location.href = "/cart.html";
        });
    });
});


// 放大镜效果

// $(".show-img").mouseenter(function(){
//     $(".zoom").hide();
// });



    function getAllLeft(obj){
        var allLeft = obj.offsetLeft;
        var currentObj = obj;
        while(currentObj = currentObj.offsetParent){
            allLeft += currentObj.offsetLeft;
        }
        return allLeft;
    }

    function getAllTop(obj){
        var allTop = obj.offsetTop;
        var currentObj = obj;
        while(currentObj = currentObj.offsetParent){
            allTop += currentObj.offsetTop;
        }
        return allTop;
    }
