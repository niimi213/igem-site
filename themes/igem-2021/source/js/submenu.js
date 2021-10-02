$(function(){
    var $endPosition = $("footer");
    var $wrapper = $(".contents-wrapper");
    var $sticked = $(".page-navigation");
    var offset = $('header').height()+15;
    var sidebar_top = $wrapper.offset().top;
    var scrollTop = $(document).scrollTop();
    var sticked_original_top = $sticked.parent().offset().top;
    var sticked_height = $sticked.height();
    var scrollOffset = sticked_original_top-offset

    function updateNavigation() {
      var scrollTop = $(document).scrollTop();
      var content_bottom = $endPosition.offset().top
      if ((scrollTop > sticked_original_top-offset) && (scrollTop < content_bottom - sticked_height-offset)){
        $sticked.css({'position': 'fixed', 'top': offset});
      } else if(scrollTop >= content_bottom - sticked_height-offset){
        $sticked.css({'position': 'fixed', 'top': content_bottom-scrollTop-sticked_height-5});
      }else if(scrollTop<=sticked_original_top - offset){
        $sticked.css({'position': 'absolute', 'top': '0' });
      }
    }
    $(window).on('scroll resize', updateNavigation)
    updateNavigation()
  });