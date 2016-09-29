(function( $, _w, _d ) {

    var messages = (function( lang ) {
        if ( ! lang || ! /fr|ja/.test( lang ) ) { // English
            return {
                autoStart:      'Create new custom fields ?'
                , noData:         'No valid data found, exiting'
                , noDataFound:    'No data found for row %s'
                , storageDisable: 'Sorry to tell you that your browser does not currently support the Session Storage feature. Please active the HTML5 Storage feature if need be or switch to a browser with session storages enabled'
            };
        }
        if ( lang === 'ja' ) { // 日本語
            return {
                autoStart:      '新しいカスタムフィールドの作成を開始してよろしでしょうか？'
                , noData:         'No valid data found, exiting'
                , noDataFound:    'ロー%sではデーターが見つかりませんでした。'
                , storageDisable: '今使用しているブラウザーではデーターをストレージに保存することができません。HTML5ストレージを有効にしてくださいもしくは別のブラウザーを使用してお願い致します。'
            };
        }
        if ( lang === 'fr' ) { // Français
            return {
                autoStart:      '新しいカスタムフィールドの作成を開始してよろしでしょうか？'
            , noData:         'No valid data found, exiting'
            , noDataFound:    'Aucune données trouvées à la ligne %s'
            , storageDisable: '今使用しているブラウザーではデーターをストレージに保存することができません。HTML5ストレージを有効にしてくださいもしくは別のブラウザーを使用してお願い致します。'
            };
        }
        else {

        }
    })( document.documentElement.lang || 'en' );

    var doLog = (function() {
        if ( $ && $.MTAppMsg ) {
            return function( str, tpe ) {
                $.MTAppMsg({
                    msg:  str
                  , type: tpe
                });
            };
        }
        else if ( _w && window.console && _w.console.log ) {
            return function( str, tpe ) {
                _w.console[ tpe ]( str );
            };
        }
    })( $ || false );

    // HTML5 Storage Stuff

    if ( ! _w.sessionStorage ) {
        doLog( messages.storageDisable, 'info' );
        return false;
    }

    var initializeSession = function( o ) {
      sessionStorage.setItem( 'keyid',  o.key );
      sessionStorage.setItem( 'data', JSON.stringify( { rows: o.rows } ) );
      sessionStorage.setItem( 'step', 'began' );
      return true;
    };

    var terminateSession = function() {
        sessionStorage.removeItem( 'keyid' );
        sessionStorage.removeItem( 'data' );
        sessionStorage.removeItem( 'step' );
        return false;
    };

    var getSessionItem = function( k, t ) { // Key, Type
        var v = sessionStorage.getItem( k ) || false;
        if ( ! v ) {
          return false;
        }
        if ( t && t === 'integer' ) {
            v = parseInt( v, 10 );
        }
        return  v;
    };

    var setSessionItem = function( k, p ) { // Key, Value Or Operand-Param
        var v = p || 0;
        if ( /^\+/.test( v ) ) {
            v = getSessionItem( k, 'integer' ) + parseInt( v.replace( '+', '' ), 10 );
        }
        sessionStorage.setItem( k, v );
        return true;
    };

    // Automator

    var automate = function() {
        var myData = JSON.parse( JSON.parse( getSessionItem( 'data' ) ).rows );
        if ( ! myData ) {
            doLog( messages.noData, 'error' );
            return terminateSession();
        }
        var n = getSessionItem( 'step', 'integer' ) || 0
          , rowData = myData[ n ];
        if ( ! rowData || ! rowData.length ) {
            doLog( messages.noDataFound.replace( '%s', getSessionItem( 'step' ) ), 'error' );
            return terminateSession();
        }
        [
            [ '#obj_type' ]
          , [ '#name' ]
          , [ '#description' ]
          , [ '#type' ]
          , [ '#required' ]
          , [ '#default', '#options' ]
          , [ '#basename' ]
          , [ '#tag' ]
        ].forEach(function( curr, i, arr ) {
            setTimeout(function() {
                var el   = _d.querySelector( curr[ 0 ] )
                  , skip = false;
                if ( i === 5 ) {
                    if ( /hidden/.test( el.parentNode.parentNode.className ) ) {
                        el = _d.querySelector( curr[ 1 ] );
                        if ( ! el || ( el && /hidden/.test( el.parentNode.parentNode.className ) ) ) {
                            skip = true; // No Options, No Default settings possible
                        }
                    }
                }
                if ( skip ) {
                    // Nothing to do
                }
                else if ( el ) {
                    switch ( ( el.tagName || '' ).toUpperCase() ) {
                        case 'INPUT':
                            if ( ( el.getAttribute( 'type' ) || '' ).toUpperCase() === 'CHECKBOX' ) {
                                el.checked = parseInt( rowData[ i ], 10 ) > 0 ? true : false;
                            }
                            else {
                                el.value = rowData[ i ];
                            }
                        break;
                        case 'TEXTAREA':
                            el.value = rowData[ i ];
                        break;
                        case 'SELECT':
                            for ( var o = 0, lim = el.getElementsByTagName( 'option' ).length; o < lim; o++ ) {
                                if ( el.options[ o ].value === rowData[ i ] ) {
                                    el.selectedIndex = o;
                                }
                            }
                            if ( _w.changeType && typeof _w.changeType === 'function' ) {
                                changeType( el );
                            }
                        break;
                        default:
                        break;
                    }
                }
                else {
                    doLog( 'HTML Node ' + curr + ' not found', 'warning' );
                }
                if ( i === arr.length - 1 ) {
                    if ( myData[ n + 1 ] ) {
                        setTimeout(function() {
                            setSessionItem( 'step', '+1' );
                            _d.getElementById( '__mode' ).parentNode.submit();
                        }, 100 * ( i + 1 ) );
                    }
                    else {
                        setTimeout(function() {
                            setSessionItem( 'step', 'completed' ); // Just in case
                            terminateSession();
                            _d.getElementById( '__mode' ).parentNode.submit();
                        }, 100 * ( i + 1 ) );
                    }
                }
            }, 100 * ( i + 1 ) );
        });
        return true;
    };

    // Check current session

    //  Creating new custom fields
    if ( sessionStorage.keyid && ! /completed/.test( sessionStorage.step || 'completed' ) ) {
        if ( ! /saved/.test( _d.location.href ) ) {
            // Autofill values
            sessionStorage.step = ( getSessionItem( 'step' ) || '' ).replace( 'began', '0' );
            return automate();
        }
        else {
            // Custom field saved. Next one...
            return setTimeout(function() {
                _d.location.href = _d.location.href.replace( /&id=\d+/, '' ).replace( /&save[a-zA-Z-_]+\=\w+/g, '' );
            }, 450 );
        }
    }

    // From here initalizing new session via html5 storage
    var plugin = _d.getElementById( 'custom_field_automator' );
    if ( ! plugin ) { // Nothing to do
        return false;
    }

    var myKey = plugin.getAttribute( 'data-key' ) || false;
    if ( ! myKey ) {
        doLog( 'SpreadSheet Key ID is missing', 'error' );
        return false;
    }

    var myStep = getSessionItem( 'step' );
    if ( ! myStep ) {
        // API Callback
        _w.callbackCFA = function( data ) {
            var rows = [];
            $( data.feed.entry ).each(function(){
          		  var row = parseInt( this.gs$cell.row );
                var col = parseInt( this.gs$cell.col );
                var t = this.gs$cell.$t;
                while ( rows.length < row ) {
          			    rows.push( [] );
          		  }
                while( rows[ row - 1 ].length < col) {
          			    rows[ row - 1 ].push('');
          		  }
                rows[ row - 1 ][ col - 1 ] = t;
          	});
            // Skip spreadsheet header
            rows.shift();
            // New session
            terminateSession();
            initializeSession({
                key:  myKey
              , rows: rows
            });
            // Ready ? Go
            if ( _w.confirm( messages.autoStart ) ) {
                var currURL = _d.location.href
                  , nextURL = [
                        currURL.split( '?' )[ 0 ]
                      , '?__mode=view&_type=field&blog_id='
                      , mtappVars && mtappVars.blog_id ? mtappVars.blog_id : ( _w.blogID || currURL.match( /blog_id=(\d+)/ )[ 1 ] )
                    ].join( '' );
                _d.location.href = nextURL;
            }
        };
        // Retrieve Google Spreadsheet via JSONP
        var js = _d.createElement( 'script' );
        js.src = [
            'http://spreadsheets.google.com/feeds/cells/'
          , myKey
          , '/'
          , '1' // シート
          , '/public/values?alt=json-in-script&callback=callbackCFA'
        ].join( '' );
        js.type = 'text/javascript';
        _d.body.appendChild( js );
    }

})( window.jQuery || false, window, document );