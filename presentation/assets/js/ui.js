var UI = function() {
  var _initalize = function() {
    $('.item-list').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
    });
      
  }

  return {
    init: _initalize
  };
}();

document.addEventListener("DOMContentLoaded", function() {
  UI.init();
});