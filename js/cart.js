$(function() {
    // 立即结算按钮
    $("#checkout").click(function() {
        location.assign("checkout.html?total=" + $("#payMoneyTxt").text());
    });
    shop.api.fetchCart(function(response) {
        console.log(response);
        if (response.data.length > 0) {
            for (var i = 0; i < response.data.length; i++) {
                var obj = response.data[i];
                obj.subtotal = parseInt(obj.goods_price) * parseInt(obj.goods_number);
                var tr = '<tr data-id="' + obj.goods_id + '">\
                            <td class="txtl" width="110">\
                              <input type="checkbox" class="chkbox goods_id" checked="true" value="' + obj.goods_id + '">\
                            </td>\
                            <td width="300"><img width="100px" src="' + obj.goods_thumb + '" /><br /> ' + obj.goods_name + '</td>\
                            <td width="120"><span class="operate minus"  id="minus-' + obj.goods_id + '">-</span><input type="text" value="' + obj.goods_number + '" class="goods_number" /><span class="operate plus" id="plus-' + obj.goods_id + '">+</span></td>\
                            <td width="160" class="goods_price">' + obj.goods_price + '</td>\
                            <td width="160" id="subtotal_' + obj.goods_id + '" class="subtotal">' + obj.subtotal + '</td>\
                            <td><span class="delete-goods">删除</span></td>\
                          </tr>';
                $('.carTab tbody').append($(tr));
            };
            showSum();
        }
    });
});

// 显示总价
function showSum() {
    var trs = $("#shoppingcarList tr:gt(0)");
    // 找到每行中的小计，累加起来就是总和
    var sum = 0;
    for (var i = 0; i < trs.length; i++) {
        var tr = trs[i];
        // 判断一下当前行的选中框是否选中，如果选中则计算到总价中
        if ($(tr).children("td:first").children("input").is(":checked")) {
            sum += parseInt($(tr).children("td:eq(4)").text());
        }
    }
    $("#payMoneyTxt").text(sum);
}


// 事件委托，点击表格中任意元素都会触发
$("table").click(function(event) {
    console.log(event.target);
    if (event.target.className === "operate minus") {
        updateCart(event.target, "-1");
    }

    if (event.target.className === "operate plus") {
        // 修改数量
        var oNumber = $(event.target).prev();
        var number = oNumber.val();
        oNumber.val(++number);
        // 小计
        var price = parseInt($(event.target).parent().next().text());
        console.log(price);
        var oSubtotal = $(event.target).parent().next().next();
        var subtotal = price * number;
        oSubtotal.text(subtotal);
        // 总价
        showSum();
        // ajax
        var goods_id = $(event.target).parent().parent().attr("data-id");
        shop.api.updateCart(goods_id, number, function(response) {
            console.log(response);
        });
        return;
    }
    if (event.target.id === "selectAll") {
        // 全选的事情
        var selected = event.target.checked;
        console.log(selected);
        var checkboxs = document.getElementsByClassName("chkbox");
        console.log(checkboxs);
        for (var i = 0; i < checkboxs.length; i++) {
            checkboxs[i].checked = selected;
        }
        showSum();
        return;
    }
    if (event.target.type === "checkbox") {
        showSum();
        checkSelectAll();
    }
    if (event.target.className === "delete-goods") {
        deleteGoods(event.target);
    }
});

// 全部选中
function selectAll(obj) {
    // $("input[class="chkbox"]").prop("checked", obj.checked);
    console.log(obj);
    showSum();
};

// 检查全选的状态，不等于购物车里面的数量的时候就是 false
function checkSelectAll() {
    var goods_count = $("input:checkbox").filter('.chkbox').length;
    console.log($("input:checkbox").filter('.chkbox'));
    console.log($("input:checkbox").filter('.chkbox').filter(":checked"));
    if ($("input:checkbox").filter('.chkbox').filter(":checked").length !== goods_count) {
        $("#selectAll").prop("checked", false);
    } else {
        $("#selectAll").prop("checked", true);
    }
}

// 从购物车中删除某件商品
function deleteGoods(obj) {
    updateCart(obj, "0");
    // 删除DOM元素
    var tr = obj.parentNode.parentNode;
    tr.parentNode.removeChild(tr);
}
//        // 减某件商品
//        function minusGoods(obj) {
//            updateCart(obj, "-1");
//        }
//        // 加某件商品
//        function plusGoods(obj) {
//            updateCart(obj, "+1");
//        }
// 设置某件商品
function setGoods(obj) {
    var num = parseInt($(obj).val());
    if (num < 1 || isNaN(num)) $(obj).val(1);
    if (num > 10) $(obj).val(10);
    updateCart(obj, $(obj).val());
}

function stepSetGoods(obj, event) {
    event.preventDefault();
    // 如果是上则加，下则减
    if (event.keyCode === 40) {
        minusGoods(obj);
    } else if (event.keyCode === 38) {
        plusGoods(obj);
    }
}

// obj 当前操作的对象
// num 减 1 或者 加 1 ， 或者是固定的数字，或者是 0；
function updateCart(obj, num) {
    // 数量为1的时候不处理，数量大于1的时候
    // 商品数量减1，最少数量是1
    // 商品小计重新计算和赋值
    // 显示总价
    // 请求ajax
    var tr = obj.parentNode.parentNode;
    var goods_id = tr.getElementsByClassName("goods_id")[0].value; // 商品id的隐藏元素，把商品ID给元素的属性赋值也可以
    var goods_number = tr.getElementsByClassName("goods_number")[0]; //商品数量的元素
    var goods_number_value = parseInt(goods_number.value); //商品数量的值
    var goods_price = tr.getElementsByClassName('goods_price')[0]; //商品单价的元素
    var goods_price_value = parseInt(goods_price.innerText); //商品单价的值
    var goods_subtotal = tr.getElementsByClassName('subtotal')[0];

    //获得商品编号 和 数量
    if (num === '-1' && goods_number_value <= 1) {
        //当前商品数量为1, 并且是减，不允许再减
        return;
    }
    if (num === '+1' && goods_number_value >= 10) {
        //当前商品数量为10, 并且是加操作，不允许再加
        return;
    }

    if (num === '-1') { //-1
        goods_number_value--;
    } else if (num === '+1') { //+1
        goods_number_value++;
    } else if (num > 0) { //设置固定的数
        goods_number_value = num;
    } else { //删除
        goods_number_value = 0;
    }
    goods_number.value = goods_number_value;
    //小计的费用
    var subtotal = goods_number_value * goods_price_value;
    goods_subtotal.innerText = subtotal;
    //请求ajax
    updateCartInfo(goods_id, goods_number_value, function() {});
    //显示总价
    showSum();
}
