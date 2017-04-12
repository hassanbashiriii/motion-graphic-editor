//html5 drag n drop for img
		function allowDrop(ev) {
		    ev.preventDefault();
		}

		function draged(ev) {
		    ev.dataTransfer.setData("text", ev.target.id);
		}

		function drop(ev) {
		    ev.preventDefault();
		    var data = ev.dataTransfer.getData("text");
		    var nodeCopy = document.getElementById(data).cloneNode(true);
		    // ev.target.appendChild(nodeCopy);
		    loadStuff(nodeCopy);
		    ev.stopPropagation();
		    return false;
		}


$( document ).ready(function() {
    
    ///////////////////vars
    //darg n drop positions
	var positions = {
		startLeft: 	0,
		dropLeft: 	0,
		startTop: 	0,
		dropTop: 	0,
	}

	//animations array
	var animations = [];
	var stuffs = [];

	//range input time values
	var time = 0;
	var recTime = 0;
  var record = 0;

	//////////functions
	//add objetcs
	function addStuff($selector ,$name ,$type){
		var stuff = {
			name:$name,
			type:$type,
			selector:$selector,
			startingPos: null,
			size: null
		}

		stuffs[stuffs.length] = stuff;

	}

    //add steps to wanimations array
	function addStep(x,y,id){	

		var step = {
			delay: recTime,
			duration: time - recTime,
			startLeft: positions.startLeft,
			startTop: positions.startTop,
			dropLeft: positions.dropLeft,
			dropTop: positions.dropTop,
			selector: id
		}

		animations[animations.length] = step;
		record = 0;

		var i = animations.length - 1;
        console.log(animations[i]);
		tl.fromTo($('#'+animations[i].selector), animations[i].duration, {top: animations[i].startTop, left: animations[i].startLeft}, {top: animations[i].dropTop, left: animations[i].dropLeft},animations[i].delay);
	}

	//Delete animation
	function deleteDiv(el) {
		for (var i = 0; i < animations.length; i++) {
			if(animations[i].selector == $(el).attr('id')){
				animations.splice(i);
			}
		} 
		$(el).remove();
	 }

    //show menu tabs
    $(".tab").click(function() {
          var focusId = $(this).attr('id');
          $(this).addClass('tab-active');
          $('#tabs').children().not(this).removeClass('tab-active');

          $('#sliding-menu :not(#sliding-menu #'+focusId+')').css({
                'visibility':'hidden',
                'opacity' : 0,
								'z-index' : 0
            });  ;

          $('#sliding-menu #'+focusId+', .char-img , .bg-img , input , button, p').css({
            'visibility':'visible',
            'opacity' : 1,
						'z-index' : 10
        }); 
    });
    	
    //darg n drop
    function draggableDiv(el){

		$(el).draggable({

		    // Find original position of dragged image.
		    start: function(event, ui) {

		    	// Show start dragged position of image.
		    	var Startpos = $(this).position();
		    	positions.startLeft = Startpos.left;
		    	positions.startTop = Startpos.top;
		    },

		    // Find position where image is dropped.
		    stop: function(event, ui) {

		    	// Show dropped position.
		    	var Stoppos = $(this).position();
		    	positions.dropLeft = Stoppos.left;
		    	positions.dropTop = Stoppos.top;

		    	if (record == 1) {
		    		addStep((positions.dropLeft - positions.startLeft),(positions.dropTop - positions.startTop), event.target.id );
		    	}
		    }
		});
	}

    //resizable widget
    function resizableDiv(el){
        $(el).resizable({
			aspectRatio: true,
            handles: "n, e, s, w, nw, ne, sw,se",
					 resize: function( event, ui ) {
            $(this).css({
				'top': parseInt(ui.position.top, 10) + ((ui.originalSize.height - ui.size.height)) / 2,
				'left': parseInt(ui.position.left, 10) + ((ui.originalSize.width - ui.size.width)) / 2
			});
				// handle fontsize here
		      var size = ui.size;
		      // something like this change the values according to your requirements
		      $(this).css("font-size", size.height + "px"); 
		    }
       });
    }

    //focus function
    function focusDiv(el) {
            $(el).mouseover(function() {
                $(this).css('border','solid 1px #e0e0e0');
                $(this).find('.ui-resizable-handle').css('opacity','1');
            });

            $(el).mouseleave(function() {
                $(this).css('border','none');
                $(this).find('.ui-resizable-handle').css('opacity','0');
            });
    }
		
		//create object on editor
		window.loadStuff = function loadStuff(el){
			addStuff($(el),$(el).attr('data-name'),$(el).attr('data-type'));

			var wrapperId = $(el).attr('data-name');

			var stuff = $('<div id=wrapper'+wrapperId+' data-flip="0" tabindex="-1"></div>');
			$('#content').append(stuff);
			stuff.addClass('ctxmenu');
			customContextmenu();

			if($(el).attr('data-type') == 'animation'){
				stuff.addClass('animation');
				animLoad(('wrapper'+wrapperId),$(el).attr('data-path'));
				stuffs[stuffs.length -1].path = $(el).attr('data-path');
				draggableDiv(stuff); 
				resizableDiv(stuff);
				focusDiv(stuff);
				
			}
			else if($(el).attr('data-type') == 'text'){
				stuff.append('<p>'+el.text()+'</p>');
				stuff.addClass('text-wrapper');
				stuffs[stuffs.length -1].isideText = '<p>'+el.text()+'</p>';
				draggableDiv(stuff); 
				resizableDiv(stuff);
				focusDiv(stuff);
			}

			else if($(el).attr('data-type') == 'background'){
				stuff.addClass('background');
				animLoad(('wrapper'+wrapperId),$(el).attr('data-path'));
				stuffs[stuffs.length -1].path = $(el).attr('data-path');
			}
		}

    //create animation container and load the svg animation
    function animLoad(id,path) { 
            var animData = {
            wrapper: document.getElementById(id),
            animType: 'svg',
            loop: true,
            path: path,
						autoplay: false
            };

            anim = bodymovin.loadAnimation(animData);
            window.onresize = anim.resize.bind(anim);
     }

     $('.char-img').dblclick(function(){
         loadStuff(this);
     });

     $("#txt-btn").click(function(){
			var txt = $('#txt-input').val();
			var txtDiv = $('<p class="bodymovin" data-type="text" id="'+txt+'">'+txt+'</p>');
			loadStuff(txtDiv);
		});

		$('#misc p').click(function(){
			var transition = $(this).attr('id');
		});

//timeline init
	content = $("#content")

    TweenLite.set(content, {visibility:"visible"})
    //instantiate a TimelineLite    
    var tl = new TimelineLite({onUpdate:updateSlider, onComplete: function(){ bodymovin.pause(); }});
    tl.set({}, {}, 10);
		tl.stop();
	
//slider init
    $("#slider").slider({
      range: false,
      min: 0,
      max: 100,
      step:.1,
      change: function(event, ui) {
      			//get slider value on change
		        time = ((ui.value/100) * tl.totalDuration())* tl.timeScale();
		    },
      slide: function ( event, ui ) {
        tl.pause();
        tl.progress( ui.value/100 );
				var framePerSlide = ((tl.totalDuration()* tl.timeScale()*24)/100)*ui.value;
				console.log(framePerSlide);
				bodymovin.goToAndStop(framePerSlide,true);
        }
    }); 

		function updateSlider() {
			$("#slider").slider("value", tl.progress() *100);
		} 
    
  var transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd';
  
	$( '#play-btn' ).click(function( e ) {
      tl.play();
    e.preventDefault();
    if ( $(this).hasClass('stop') ) {
      $( this ).removeClass( 'stop' )
               .addClass( 'to-play' );
			tl.pause();
			bodymovin.pause();
    } else if ( !$(this).hasClass('to-play') ) {    
      $( this ).addClass( 'stop' );
			tl.play();
			bodymovin.play();
    }
    
  });
  
  $( document ).on( transitionEnd, '.to-play', function() {
    
    $( this ).removeClass( 'to-play' );
    
  });
//play btn-end

    $('#btn').click(function(){
          tl.fromTo($('.bodymovin'), 1, {autoAlpha: 0},{autoAlpha: 1}, 1);
    });

		$('#btn1').click(function(){
          bodymovin.play();
    });

	//////////////////////contect menu////////////////////
	function customContextmenu() {
	  
	  "use strict";

	  function clickInsideElement( e, className ) {
	    var el = e.srcElement || e.target;
	    
	    if ( el.classList.contains(className) ) {
	      return el;
	    } else {
	      while ( el = el.parentNode ) {
	        if ( el.classList && el.classList.contains(className) ) {
	          return el;
	        }
	      }
	    }

	    return false;
	  }

	  /**
	   * Get's exact position of event.
	   * 
	   * @param {Object} e The event passed in
	   * @return {Object} Returns the x and y position
	   */
	  function getPosition(e) {
	    var posx = 0;
	    var posy = 0;

	    if (!e) var e = window.event;
	    
	    if (e.pageX || e.pageY) {
	      posx = e.pageX;
	      posy = e.pageY;
	    } else if (e.clientX || e.clientY) {
	      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	    }

	    return {
	      x: posx,
	      y: posy
	    }
	  }

	  /**
	   * Variables.
	   */
	  var contextMenuClassName = "context-menu";
	  var contextMenuItemClassName = "context-menu__item";
	  var contextMenuLinkClassName = "context-menu__link";
	  var contextMenuActive = "context-menu--active";

	  var taskItemClassName = "ctxmenu"
	  var taskItemInContext;

	  var clickCoords;
	  var clickCoordsX;
	  var clickCoordsY;

	  var menu = document.querySelector("#context-menu");
	  var menuItems = menu.querySelectorAll(".context-menu__item");
	  var menuState = 0;
	  var menuWidth;
	  var menuHeight;
	  var menuPosition;
	  var menuPositionX;
	  var menuPositionY;

	  var windowWidth;
	  var windowHeight;

	  /**
	   * Initialise our application's code.
	   */
	  function init() {
	    contextListener();
	    clickListener();
	    keyupListener();
	    resizeListener();
	  }

	  /**
	   * Listens for contextmenu events.
	   */
      var rClickEl;

	  function contextListener() {
	    document.addEventListener( "contextmenu", function(e) {
	      taskItemInContext = clickInsideElement( e, taskItemClassName );
          rClickEl = clickInsideElement( e, taskItemClassName );

	      if ( taskItemInContext ) {
	        e.preventDefault();
	        toggleMenuOn();
	        positionMenu(e);
	      } else {
	        taskItemInContext = null;
	        toggleMenuOff();
	      }
	    });
	  }

	  /**
	   * Listens for click events.
	   */
	  function clickListener() {
	    document.addEventListener( "click", function(e) {
	      var clickeElIsLink = clickInsideElement( e, contextMenuLinkClassName );

	      if ( clickeElIsLink ) {
	        e.preventDefault();
	        menuItemListener( clickeElIsLink );
	      } else {
	        var button = e.which || e.button;
	        if ( button === 1 ) {
	          toggleMenuOff();
	        }
	      }
	    });
	  }

	  /**
	   * Listens for keyup events.
	   */
	  function keyupListener() {
	    window.onkeyup = function(e) {
	      if ( e.keyCode === 27 ) {
	        toggleMenuOff();
	      }
	    }
	  }

	  /**
	   * Window resize event listener
	   */
	  function resizeListener() {
	    window.onresize = function(e) {
	      toggleMenuOff();
	    };
	  }

	  /**
	   * Turns the custom context menu on.
	   */
	  function toggleMenuOn() {
	    if ( menuState !== 1 ) {
	      menuState = 1;
	      menu.classList.add( contextMenuActive );
	    }
	  }

	  /**
	   * Turns the custom context menu off.
	   */
	  function toggleMenuOff() {
	    if ( menuState !== 0 ) {
	      menuState = 0;
	      menu.classList.remove( contextMenuActive );
	    }
	  }

	  /**
	   * Positions the menu properly.
	   * 
	   * @param {Object} e The event
	   */
	  function positionMenu(e) {
	    clickCoords = getPosition(e);
	    clickCoordsX = clickCoords.x;
	    clickCoordsY = clickCoords.y;

	    menuWidth = menu.offsetWidth + 4;
	    menuHeight = menu.offsetHeight + 4;

	    windowWidth = window.innerWidth;
	    windowHeight = window.innerHeight;

	    if ( (windowWidth - clickCoordsX) < menuWidth ) {
	      menu.style.left = windowWidth - menuWidth + "px";
	    } else {
	      menu.style.left = clickCoordsX + "px";
	    }

	    if ( (windowHeight - clickCoordsY) < menuHeight ) {
	      menu.style.top = windowHeight - menuHeight + "px";
	    } else {
	      menu.style.top = clickCoordsY + "px";
	    }
	  }

	  /**
	   * Dummy action function that logs an action when a menu item link is clicked
	   * 
	   * @param {HTMLElement} link The link that was clicked
	   */
	  function menuItemListener( link ) {
	    switch(link.getAttribute("data-action")) {
	    case 'record':
	        record = 1;
	        break;
	    case 'flip':
					if($(rClickEl).attr('data-flip') == 0){
	        	$(rClickEl).addClass('flip-horizontal');
						$(rClickEl).attr('data-flip',1);
					}
					else{
						$(rClickEl).removeClass('flip-horizontal');
						$(rClickEl).attr('data-flip',0);
					}
	        break;
	    case 'Delete':  
	        deleteDiv(rClickEl);
	        break;
	}
	    toggleMenuOff();
	  }
		
	  init();

	}

});

