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
          zoom = 12,
          directionObj = new google.maps.DirectionsService(),
          start = $('#js-start-location'),
          end = $('#js-end-location');

      if( typeof predefinedCenter == 'object' ){
        startCoords = new google.maps.LatLng(predefinedCenter.startCoords.lat, predefinedCenter.startCoords.lng);
        zoom = 17;
      } else {
        startCoords = new google.maps.LatLng(32.7856, -79.9362)
      }

      var alerts = {
          removeAlert: function(a){
            a.closest('div.alert').remove();
          }
      }

      var filters = {
        showAll: function(){
          $('[data-filter]').show();
        },
        hideItem: function(a){
          a.hide();
        },
        getFilterValue:function(a){
          return a.find('input, select').val();
        },
        buildRegex:function(a){
          return new RegExp( a, 'i' );
        },
        checkItems:function(a){
          var r = filters.buildRegex(a);
          $('[data-filter]').each(function(){
            var result = r.test( $(this).data('filter') )
            if( !result ){
              filters.hideItem( $(this) )
            }
          })
        }
      }

      var forms = {
            checkFields: function(a){
              this.resetErrors();
              flag == false;
              a.find('[data-regex]').each( function(){ forms.matchFieldRegex( $(this), $(this).val(), $(this).data('regex') ) });
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

      var maps = {
            mapInit:function( center ){
                var canvas = this.canvas,
                    o = { zoom:zoom,   center:center };
                map = new google.maps.Map( document.getElementById('map-canvas'), o );
                marker = new google.maps.Marker({ map:map, position:center , draggable:true })
                latBox.val(center.lat())
                lngBox.val(center.lng())
                if( start != null ){
                  directions = new google.maps.DirectionsRenderer();
                  directions.setMap(map);
                }
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
            changeCoords: function(e){ latBox.val(e.latLng.lat()); lngBox.val(e.latLng.lng()); },
            calcRoute: function() {
              if( end.val().length > 0 ){
                var request = {
                  origin:start.val(),
                  destination:end.val(),
                  travelMode: google.maps.TravelMode.DRIVING
                };
                directionObj.route(request, function(result, status) {
                  if (status == google.maps.DirectionsStatus.OK) {
                    directions.setDirections(result);
                  }
                });
              }
            }
         }

      var edit = {
        'values': { 'id':'', 'hotel_booked':false, 'hotel_concierge': '', 'hotel_rates':'' },
        'editPath': function(a){
          return a.data('edit-url')
        },
        stringData:function(a){
          return $.param(edit.values);
        },
        booked:function(a){
          return a.find('input[type="checkbox"]').is(':checked');
        },
        extractData:function(a){
          edit.values.id = a.data('hotel-id')
          edit.values.hotel_booked = edit.booked(a)
          edit.values.hotel_concierge = a.find('.js-concierge').text()
          edit.values.hotel_rates = a.find('.js-rates').text()
        },
        removeIndicators:function(a){
          a.delay(2000).removeClass('success error')
        },
        saveValues:function(a){
          var data = edit.stringData()
              path = edit.editPath(a),
              parent = a;

          $.ajax({
            url: path,
            type: "post",
            cache:false,
            data: data,
            dataType: 'json',
            success: function(data, status){
              parent.addClass('success')
              location.reload();
            },
            error: function(data, status){
              parent.addClass('error')
            }
          })
        }
      }

      ///////////////////////////////////////////////////////////////////////////
      ////  GLOBAL JS
      ///////////////////////////////////////////////////////////////////////////

      $(document).on('click', '[data-dismiss]', function(){
        alerts.removeAlert( $(this) )
      })




      ///////////////////////////////////////////////////////////////////////////
      ////  CREATE HOTEL FORM JS
      ///////////////////////////////////////////////////////////////////////////

      // UNLOCK HOTEL FEE BOXES
      $('.allow-fee').on('change', function(){ forms.allowFees($(this)) });

      // INIT NEW HOTEL MAP AND SET EVENT LISTENER FOR MARKER DRAG
      if( document.getElementById('map-canvas') != null ){
        google.maps.event.addDomListener( window, 'load', maps.mapInit(startCoords) );
        google.maps.event.addListener(marker,'dragend', function(e){ maps.changeCoords(e) });
      }

      // CAPTURE HOTEL CREATE FORM SUBMIT FOR JS VALIDATION
      $('#js-create-hotel').submit( function(){ forms.checkFields( $(this) ) } );

      $(document).on('focusout', '.geolocate', function(){ addressToLocate = ''; maps.findHotel( $(this) ) });

      if( $('#js-create-hotel').hasClass('new') ){
        $(document).on('focusout','#js-check-hotel-name', function(){ forms.checkForHotelInstance( $(this) ); });
      }



      ///////////////////////////////////////////////////////////////////////////
      ////  HOTELS INDEX JS
      ///////////////////////////////////////////////////////////////////////////

      // FILTER ITEMS
      $('#js-filter').submit(function(e){
        e.preventDefault();
        filters.showAll();
        var form = $(this),
            val = filters.getFilterValue(form);
        if( val.length > 0 ){
            filters.checkItems(val);
        }
      })

      // FILTER ITEMS WITH SELECT
      $('#js-filter').change(function(e){
        e.preventDefault();
        filters.showAll();
        var form = $(this),
            val = filters.getFilterValue(form);
        if( val.length > 0 ){
            filters.checkItems(val);
        }
      })

      // RESET ALL FILTERS
      $(document).on('click', '#js-filter-reset', function(e){
        e.preventDefault();
        filters.showAll();
        $(this).closest('#js-filter').trigger('reset');
      })



      ///////////////////////////////////////////////////////////////////////////
      ////  DIRECTIONS JS
      ///////////////////////////////////////////////////////////////////////////

      $('#js-directions').submit(function(e){
        e.preventDefault();
        maps.mapInit( startCoords);
      })




      ///////////////////////////////////////////////////////////////////////////
      ////  EDITABLE CONTENT JS
      ///////////////////////////////////////////////////////////////////////////

      $('[contentEditable]').focus(function(){
        $(this).addClass('editing')
      })

      $('[contentEditable]').on( 'focusout', function(){
        $(this).removeClass('editing success error')
        var row = $(this).closest('tr');
        edit.extractData(row)
        edit.stringData( edit.values )
        edit.saveValues( row )
      })

      $('input[type="checkbox"]').change(function(){
        var row = $(this).closest('tr');
        edit.extractData(row)
        edit.stringData( edit.values )
        edit.saveValues( row )
      })



  })

})(jQuery, window);
