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

    // START ALL DOC READY FUNCTIONS
    $(document).on('ready page:load', function(){

      var map,
          geocoder = new google.maps.Geocoder(),
          marker,
          flag = true,
          addressToLocate,
          latBox = $('#js-hotel-lat'),
          lngBox = $('#js-hotel-lng');

      var formTools = {
            checkFields: function(a){ event.preventDefault();
              this.resetErrors(); flag == false;
              a.find('[data-regex]').each( function(){ formTools.matchFieldRegex( $(this), $(this).val(), $(this).data('regex') ) });
            },
            matchFieldRegex: function(a, val, regex){
              if( flag == true ){
                var r = new RegExp( regex, 'i' ).test( val );
                if( r == false){ flag = false; a.parent().addClass('error'); }
              }
            },
            resetErrors: function(){
              $('[data-regex]').each( function(){ $(this).parent().removeClass('error') })
            },
            allowFees: function(a){
              var b = a.closest('.group'),
                  c = 'input[type="number"], input[type="text"]';
              if( a.is(':checked') ){ b.find(c).attr('readonly', false); } else { b.find(c).attr('readonly', true).val(''); }
            },
            checkForHotelInstance: function(a){
              var b = a.parent();
              $.get( a.attr('data-validateUrl'), { hotel: a.val() }).success(function(){
                  b.removeClass('has-error has-success').addClass('has-success');
              }).error(function(){
                  b.removeClass('has-error has-success').addClass('has-error');
              });
            }
          }

      var mapTools = {
            mapInit:function( center ){
                var canvas = this.canvas,
                    o = { zoom:13,   center:center };
                map = new google.maps.Map( document.getElementById('map-canvas'), o );
                marker = new google.maps.Marker({ map:map, position:center , draggable:true })
                latBox.val(center.lat())
                lngBox.val(center.lng())
            },
            getGeocodeString:function(a){
                $('.geolocate').each(function(){
                  addressToLocate += $(this).val() + '+';
                })
            },
            findHotel:function(a){
              this.getGeocodeString(a);
              if( addressToLocate.length > 0 ){
                geocoder.geocode({'address':addressToLocate}, function(r, s){
                  var l = r[0].geometry.location;
                  if( s == google.maps.GeocoderStatus.OK ){
                    map.setCenter(l);
                    map.setZoom(15);
                    marker.setPosition(l);
                    latBox.val(l.lat());
                    lngBox.val(l.lng());
                  }
                })
              }
            },
            changeCoords: function(e){ latBox.val(e.latLng.lat()); lngBox.val(e.latLng.lng()); }
         }



      ///////////////////////////////////////////////////////////////////////////
      ////  CREATE HOTEL FORM JS
      ///////////////////////////////////////////////////////////////////////////

      // UNLOCK HOTEL FEE BOXES
      $('.allow-fee').on('change', function(){ formTools.allowFees($(this)) });

      // INIT NEW HOTEL MAP
      google.maps.event.addDomListener( window, 'load', mapTools.mapInit(new google.maps.LatLng(32.7856, -79.9362)) );

      // SET EVENT LISTENER FOR MARKER DRAG
      google.maps.event.addListener(marker,'dragend', function(e){ mapTools.changeCoords(e) });

      // CAPTURE HOTEL CREATE FORM SUBMIT FOR JS VALIDATION
      $('#js-create-hotel').submit( function(){ formTools.checkFields( $(this) ) } );

      //$(document).on('focusout', '.geolocate', function(){ addressToLocate = ''; mapTools.findHotel( $(this) ) });

      $(document).on('focusout','#js-check-hotel-name', function(){ formTools.checkForHotelInstance( $(this) ); });



      ///////////////////////////////////////////////////////////////////////////
      ////  CREATE HOTEL FORM JS
      ///////////////////////////////////////////////////////////////////////////



  })



})(jQuery, window);
