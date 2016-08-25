;(function($) {
    $.fn.sortableInit = function(){
        var elements = this;

        var sortKeyClass = [
            'sort_number',
            'sort_number_attr'
        ];

        elements.each(function(){
            $(this).find('thead').find('tr:last').find('th').each(function(index){
                var self = this;
                // 対象クラスを持たない列にはソートボタンを表示しない
                if(!sortKeyClass.some(function(v){
                    return $(self).hasClass(v);
                })) return this;

                var func = null;
                var isAttr = null;
                // 数値型
                if ($(this).hasClass('sort_number')) {
                    func = mergeSortNumber;
                    isAttr = false;
                }
                // 属性数値型
                else if ($(this).hasClass('sort_number_attr')) {
                    func = mergeSortNumber;
                    isAttr = true;
                }

                var ascObj = $('<span>').html('▲').click(function(){
                    $(this).sortable(index, true, func, isAttr);
                }).css({"cursor":"pointer"});
                var descObj = $('<span>').html('▼').click(function(){
                    $(this).sortable(index, false, func, isAttr);
                }).css({"cursor":"pointer"});
                $(this).append($('<span>').addClass('sort_cursor').append(ascObj).append(descObj));
            });
        });

        return this;
    };

    $.fn.sortable = function(index, isAsc, func, isAttr){
        var element = this;

        var tbody = element.closest('table').find('tbody');
        // 色付けクラス削除
        tbody.find('td').removeClass('sort_by_asc sort_by_desc');
        var trs = [];
        tbody.find('tr').each(function(i){
            trs[i] = this;
        });
        trs = func(trs, index, isAsc, isAttr);
        tbody.empty().append(trs);
        // 色付けクラス追加
        tbody.find('tr').each(function(){
            $(this).find('td').eq(index).addClass(isAsc ? 'sort_by_asc' : 'sort_by_desc');
        });
        return this;
    };

    function mergeSortNumber(trs, index, isAsc, isAttr) {
        
        var sorter = [];

        // KEY配列だけ収集
        $.each(trs, function (key){
            var $tr = $(this).children().eq(index);
            var sort;
            if ( isAttr ) {
                sort = $tr.attr('sort-value');
            } else {
                sort = $tr.html();
            }
            sorter.push({
                key : key,
                sort : sort
            });
        });
        
        // 配列をソート
        sorter.sort(
            function(a,b){
                var aSort = a['sort'];
                var bSort = b['sort'];
                
                if ( !isNaN(aSort) ) {
                    aSort = parseFloat(aSort);
                }
                if ( !isNaN(bSort) ) {
                    bSort = parseFloat(bSort);
                }
                if ( isAsc ) {
                    if( aSort < bSort ) return -1;
                    if( aSort > bSort ) return 1;
                } else {
                    if( aSort < bSort ) return 1;
                    if( aSort > bSort ) return -1;
                }
                return 0;
            }
        );
        
        var results = [];
        $.each(sorter, function (){
            results.push(trs[this.key]);
        });
        
        return results;
    }

})(jQuery);
