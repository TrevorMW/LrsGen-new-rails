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
          lngBox = $('#js-hotel-lng'),
          predefinedCenter = $('[data-start-coords]').data(),
          zoom = 12;

      if( typeof predefinedCenter == 'object' ){
        startCoords = new google.maps.LatLng(predefinedCenter.startCoords.lat, predefinedCenter.startCoords.lng);
        zoom = 17;
      } else {
        startCoords = new google.maps.LatLng(32.7856, -79.9362)
      }

      var basic = {
          removeAlert: function(a){
            a.closest('div.alert').remove();
          }
      }

      var filterFunctions = {
        'show_all_filter_items': function( a ){
          a.show();
        },
        'filter_items': function( a, b ){
          a.hide();
          a.filter( function(){ return b.test( $(this).attr('data-filter') ) }).show();
        },
        'select_filters': function( a, b ){
           var c = '';
           b != null ? c = '(?=.*'+b+')' : c = '' ;
           a.find('select').each(function(){
             c += '(?=.*' + $(this).val() + ')';
           });
           return c;
        },
        'input_filter': function( a ){
          var b = a.find('input').val();
          if( b != null ){ return b; }
        },
        'build_regex_query':function( a ){
          if( typeof a == 'object'){
            var b = this.input_filter( a ),
                c = this.select_filters( a, b );
            if( c.length >= 1 ){ return c; } else { return ''; }
          }
        }
      }

      var formTools = {
            checkFields: function(a){
              this.resetErrors();
              flag == false;
              a.find('[data-regex]').each( function(){ formTools.matchFieldRegex( $(this), $(this).val(), $(this).data('regex') ) });
            },
            matchFieldRegex: function(a, val, regex){
              if( flag == true ){
                var r = new RegExp( regex, 'i' ).test( val );
                if( r == false ){ flag = false; a.parent().addClass('error');}
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
              var b = a.parent(),
                  c = $('#js-create-hotel').find('input[type="submit"]');

              $.get( a.attr('data-validateUrl'), { hotel: a.val() }).success(function(){
                  b.removeClass('error success').addClass('success');
                  c.attr('disabled', false)
              }).error(function(){
                  b.removeClass('error success').addClass('error');
                  c.attr('disabled', true)
              });
            }
          }

      var mapTools = {
            mapInit:function( center ){
                var canvas = this.canvas,
                    o = { zoom:zoom,   center:center };
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
                  if( r.length > 0 ){
                    var l = r[0].geometry.location;
                    if( s == google.maps.GeocoderStatus.OK ){
                      map.setCenter(l);
                      map.setZoom(15);
                      marker.setPosition(l);
                      latBox.val(l.lat());
                      lngBox.val(l.lng());
                    }
                  }
                })
              }
            },
            changeCoords: function(e){ latBox.val(e.latLng.lat()); lngBox.val(e.latLng.lng()); }
         }



      ///////////////////////////////////////////////////////////////////////////
      ////  GLOBAL JS
      ///////////////////////////////////////////////////////////////////////////

      $(document).on('click', '[data-dismiss]', function(){ basic.removeAlert( $(this) )})




      ///////////////////////////////////////////////////////////////////////////
      ////  CREATE HOTEL FORM JS
      ///////////////////////////////////////////////////////////////////////////

      // UNLOCK HOTEL FEE BOXES
      $('.allow-fee').on('change', function(){ formTools.allowFees($(this)) });

      // INIT NEW HOTEL MAP AND SET EVENT LISTENER FOR MARKER DRAG
      if( document.getElementById('map-canvas') != null ){
        google.maps.event.addDomListener( window, 'load', mapTools.mapInit(startCoords) );
        google.maps.event.addListener(marker,'dragend', function(e){ mapTools.changeCoords(e) });
      }

      // CAPTURE HOTEL CREATE FORM SUBMIT FOR JS VALIDATION
      $('#js-create-hotel').submit( function(){ formTools.checkFields( $(this) ) } );

      $(document).on('focusout', '.geolocate', function(){ addressToLocate = ''; mapTools.findHotel( $(this) ) });

      if( $('#js-create-hotel').hasClass('new') ){
        $(document).on('focusout','#js-check-hotel-name', function(){ formTools.checkForHotelInstance( $(this) ); });
      }




      ///////////////////////////////////////////////////////////////////////////
      ////  HOTELS INDEX JS
      ///////////////////////////////////////////////////////////////////////////

      // RESET FILTERS
      $(document).on('click','#js-reset-filters', function(e){
        e.preventDefault();
        var form = $('#js-filter');
        filterFunctions.show_all_filter_items( $('[data-filter]') );
        form.trigger('reset');
      });

      // FILTER
      /*
      $('#js-filter').submit( function( event ){
        event.preventDefault();
        var a = $(this),
            b = filterFunctions.build_regex_query( a ),
            c = new RegExp( b, 'ig' ),
            d = $('[data-filter]');

        if( b.length >= 1 )
          filterFunctions.filter_items( d, c );
        else
          filterFunctions.show_all_filter_items( d );
      }); */

      $('#js-filter-hotel-type').change(function(event){
        event.preventDefault();
        var a = $(this).closest('form'),
            b = filterFunctions.select_filters( a, null ),
            c = new RegExp( b, 'ig' ),
            d = $('[data-filter]');

        if( b.length >= 1 )
          filterFunctions.filter_items( d, c );
        else
          filterFunctions.show_all_filter_items( d );
      })


  })

})(jQuery, window);
