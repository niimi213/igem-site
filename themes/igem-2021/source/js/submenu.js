$(function(){
    var $endPosition = $("footer"); //スクロール終了位置
    var $wrapper = $(".contents-wrapper"); //親要素
    var $sticked = $(".page-navigation");  //固定する要素
    var offset = $('header').height()+15; //固定位置(top) headerの分だけ下げる
    var sidebar_top = $wrapper.offset().top;
    var scrollTop = $(document).scrollTop();
    // 固定するコンテンツの元々の位置
    var sticked_original_top = $sticked.parent().offset().top;
    // 固定するコンテンツの高さ
    var sticked_height = $sticked.height();
    //スクロール位置
    var scrollOffset = sticked_original_top-offset

    function updateNavigation() {
      var scrollTop = $(document).scrollTop();
      var content_bottom = $endPosition.offset().top
      if ((scrollTop > sticked_original_top-offset) && (scrollTop < content_bottom - sticked_height-offset)){
      // 上部固定
        $sticked.css({'position': 'fixed', 'top': offset});
      } else if(scrollTop >= content_bottom - sticked_height-offset){
      // 下部固定
        $sticked.css({'position': 'fixed', 'top': content_bottom-scrollTop-sticked_height-5});
      }else if(scrollTop<=sticked_original_top - offset){
        $sticked.css({'position': 'absolute', 'top': '0' });
      }
    }
    $(window).on('scroll resize', updateNavigation)
    updateNavigation()
  });