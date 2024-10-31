

jQuery.fn.center = function () {
    this.css("position","fixed");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}

$( window ).on( "load", function() {
		  $(".imgList").each(function() {
            $(this).click(function(event) {
            	event.preventDefault();
              $("#imgPreview").hide();
              $("#imgPreview img").attr("src", this.href);
              $("#imgPreview").show();
            });
          });
        $("#imgPreview").click(function() {
          $(this).hide()
          $("#imgPreview img").attr("src", '');
        });
});