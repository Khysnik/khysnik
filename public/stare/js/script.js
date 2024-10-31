function timeConverter(t) {     
    //var a = new Date(t * 1000);
    var a = new Date(parseInt(t));
    var today = new Date();
    var yesterday = new Date(Date.now() - 86400000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    if (hour<10) {hour='0'+hour};
    var min = a.getMinutes();
    if (min<10) {min='0'+min};
    if (a.setHours(0,0,0,0) == today.setHours(0,0,0,0))
        return 'Today, ' + hour + ':' + min;
    else if (a.setHours(0,0,0,0) == yesterday.setHours(0,0,0,0))
        return 'Yesterday, ' + hour + ':' + min;
    else if (year == today.getFullYear())
        return date + ' ' + month;
    else
        return date + ' ' + month + ' ' + year;
}

$( ".date" ).each(function( index ) {
	var time =  timeConverter($( this ).text())
 	$( this ).text(time)
});

