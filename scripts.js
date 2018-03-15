var datbaseUrl = "http://localhost:3000";

// var email = $('#email').value();
$('#loadingDiv').hide()
// window.ajaxStart( function(e) {
//     e.preventDefault();
//     $('#loadingDiv').show();  // show Loading Div
//     } );

//     window.ajaxStop ( function(e){
//     e.preventDefault();
//     $('#loadingDiv').hide(); // hide loading div
//     });

$('#myForm').submit(function(e) {
    e.preventDefault();
    // get all the inputs into an array.
    var $inputs = $('#myForm :input');
    var retailer = [];
    // not sure if you wanted this, but I thought I'd add it.
    // get an associative array of just the values.
    var values = {};
    $inputs.each(function() {
        values[this.name] = $(this).val();
    });
    $("#loadingDiv").show();
    console.log(values)
    $.ajax({
        method: "GET",
        url: datbaseUrl+'/retailer/'+values.retailer,
        success : function(data){
            orderCount = data.count;
            console.log(orderCount)
            if(orderCount < 4){
                $.ajax({
                    method: "POST",
                    url:datbaseUrl+'/order/',
                    data: values
                  })
                    .done(function( msg ) {
                        orderCount++;
                        $.ajax({
                            method: "PUT",
                            url:datbaseUrl+'/retailer/'+values.retailer,
                            data: { count : orderCount}
                          }).done(function(){
                            var passstyles = {
                                color : "black",
                                display : "block"
                              };
                            $('#message').html('Order Posted Successfully')
                            $('.message').css(passstyles)
                            $("#loadingDiv").hide();
                            $("#myForm").trigger("reset");
                            setTimeout(function(){ $('#message').hide() }, 2000);                            
                          })
                    });
        }else{
            $("#loadingDiv").hide();
            var failstyles = {
                color : "red",
                display : "block"
              };
            $('#message').html('Order Limit Exceeded for the retailer')
            $('.message').css(failstyles)
            $("#myForm").trigger("reset");            
            setTimeout(function(){ $('#message').hide() }, 2000);
        }
      },
      error : function(){
        $.ajax({
            method: "POST",
            url:datbaseUrl+'/order/',
            data: values
          }).done(function( msg ) {
            $.ajax({
                method: "POST",
                url:datbaseUrl+'/retailer',
                data: { count : 1,
                        id : values.retailer
                      }
              }).done(function(){
                var passstyles = {
                    color : "black",
                    display : "block"
                  };
                $('#message').html('Order Posted Successfully');
                $('.message').css(passstyles);
                $("#loadingDiv").hide();
                $("#myForm").trigger("reset");
                setTimeout(function(){ $('#message').hide() }, 2000);
              })
        });
      }
    })
});