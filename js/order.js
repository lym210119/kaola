shop.api.fetchOrder(function(response) {
    var html = '';
    for (var i = 0; i < response.data.length; i++) {
        var obj = response.data[i]; //订单信息
        html += '<div class="order-item">';
        for (var j = 0; j < obj.goods_list.length; j++) {
            var goods = obj.goods_list[j]; //商品列表
            goods.subtotal = goods.goods_price * goods.goods_number;
            html += '<div data-id="' + goods.goods_id + '">\
                  <img width="100px" src="' + goods.goods_thumb + '" /><br /> ' + goods.goods_name + goods.goods_number + goods.goods_price +
                goods.subtotal + '<span>删除</span></div>';
        }
        html += '</div>';
    }
    $('#order-list').html(html);
    console.log(response);
});
