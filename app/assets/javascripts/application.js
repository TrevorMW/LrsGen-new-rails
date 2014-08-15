// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs

;(function( $, window, undefined ){

  $(document).ready(function(){

    var map,
        geocoder,
        marker,
        formTools = {
          'getFieldFegex': function(){}
        },
        mapTools = {
          'mapInit':function(id, center, marker, markerCenter){
              var canvas = document.getElementById(id),
                  o = {
                    zoom:10,
                    center:center
                  };
              map = new google.maps.Map( canvas, o );
              if( marker ){
                var m = new google.maps.Marker({
                  map:map,
                  position:center,
                  draggable:true
                })
              }

           }
       }


    // IN NEW HOTEL FORM, ALLOW USER TO ENTER A FEE
    $('.allow-fee').on('change', function(){
      var a = $(this),
          b = $(this).closest('.group'),
          c = 'input[type="number"], input[type="text"]';
      if( a.is(':checked')){
        b.find(c).attr('readonly', false);
      } else {
        b.find(c).attr('readonly', true).val('');
      }
    })

    // INIT NEW HOTEL MAP
    google.maps.event.addDomListener( window, 'load', mapTools.mapInit( 'map-canvas', new google.maps.LatLng(33, -81), true) );






  })

})(jQuery, window);
