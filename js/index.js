shop.api.fetchGoodsHotGoods(function(response) {
    console.log(response);
    for (var i = 0; i < response.data.length; i++) {
        var obj = response.data[i];
        $("#goods-ul").append('' +
            '<li>' +
            '   <a href="detail.html?goods_id=' + obj.goods_id + '">' +
            '       <img src=' + obj.goods_thumb + '>' +
            '   </a>' +
            '   <a class="goods-info" href="detail.html?goods_id=' + obj.goods_id + '">' +
            '       <p class="price">￥' + obj.price + '</p>' +
            '       <p class="title">' + obj.goods_name + '</p>' +
            '   </a>' +
            '</li>');
    }
});


// banner


var i = 0;
var timer = null;

$(function() {
    timer = setInterval(next, 2000);

    $("#banner").hover(function() {
        clearInterval(timer);
    },function() {
        timer = setInterval(next, 2000);
    });

    $("#prev").click(function() {
        $(".img-list ul li").eq(i).fadeOut(1000);
        i--;
        if (i < 0) {
        i = $(".img-list ul li").length-1;
        }
        $(".img-list ul li").eq(i).fadeIn(1000);
        $(".circles ul li").removeClass("cur").eq(i).addClass("cur");
    });

    $("#next").click(function() {
        next();
    });
});



function next() {
    $(".img-list ul li").eq(i).fadeOut(1000);
    i++;
    if (i > $(".img-list ul li").length-1) {
        i = 0;
    }
    $(".img-list ul li").eq(i).fadeIn(1000);
    $(".circles ul li").removeClass("cur").eq(i).addClass("cur");

}

