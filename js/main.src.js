var Game = new ( Backbone.View.extend({
	
	Models: {},
	Views: {},
	Instances: {},

	events: {
		'click a' : 'resetDefault',
		'click a[data-type="outerLink"]': 'outerLinkHandler'		
	},
	resetDefault: function(e){	
		e.preventDefault();
	},
	outerLinkHandler: function(e){
		document.location.href = $(e.currentTarget).attr('href');
	},
	initialize: function(){		
		this.setElement('body');
		if (navigator.appVersion.indexOf("Win")!=-1) $('html').addClass("win");	
		if (navigator.appVersion.indexOf("MSIE 10")!=-1) $('html').addClass("ie10");

		if(!Modernizr.csstransforms3d) $('html').addClass('no-animation')
	},
	correctBrowser: function(){
		var _b = BrowserDetect.browser,
			_v = BrowserDetect.version,
			_n = window.navigator.oscpu || false,
			res;

		 if (_n && (_n === 'Windows NT 5.1' || _n === 'Windows XP') || (_n === 'Windows NT 6.2' || _n === 'Windows 8') )  {
		 	if (_b === 'Firefox' && (_v < 10 || _v > 20)) {
		 		return '2'
		 	}
		 }

		 if ( (_b === 'Chrome' && _v < 20) || (_b === 'Firefox' && _v < 10 )  ||  (_b === 'Safari' && _v < 6) || (_b === 'Opera' && _v < 12) || (_b === 'Explorer' && _v < 9) ) return '1';
		 else return true;
	},	
	start: function(){
		var browser = this.correctBrowser();
		if (browser === true) {
			Game.Instances.startScreen = new Game.Views.Startscreen;
			Game.Instances.gameField = new Game.Views.Field;			
		} else if (browser === '1') {
			$('.browsers').show();
		} else if (browser === '2') {
			$('.browsers').find('a:eq(1)').remove().end().show();
		}
	}	
}))()

/* startScreen */
Game.Views.Startscreen = Backbone.View.extend({
	events: {
		'click .start-btn'   :  'startGame',
		'click .rules-btn'   :  'showRules',		
	},
	initialize: function(){
		this.setElement('.start-screen');
		this.$el.show();				
	},
	startGame: function(){		
		this.$el.fadeOut('200',function(){					
			Game.Instances.gameField.startGame();
			Game.Instances.gameField.startTimer();			
		})
	},
	showRules: function(){		
		this.$el.fadeOut('100',function(){

			if (!Game.Instances.rules) {				
				 Game.Instances.rules = new Game.Views.Rules;
				 Game.Instances.rules.$el.fadeIn('200');		
			}
			else {
				Game.Instances.rules.show();				
			}	
		})

	}	
});

/* rules */

Game.Views.Rules = Backbone.View.extend({
	events: {},
	initialize: function(){
		this.setElement('.rules-screen');		
		this.render();
	},
	show: function(){
		var self = this;

		this.$el.modal({
	    	onClose: function(rules){	    		
	    		self.$el.fadeOut(200,function(){
		    		$.modal.close();		    		
		    		Game.Instances.startScreen.$el.fadeIn(200);
	    		})	    		
	    	}
    	});

	},
	render: function(){	
		var self = this;

    	this.$el.modal({
	    	onClose: function(){
	    		self.$el.fadeOut(200,function(){
		    		$.modal.close();
		    		Game.Instances.startScreen.$el.fadeIn(200);
	    		})	    		
	    	},
	    	onShow: function(rules) {
	    		$(rules).fadeIn(200,function(){	    			
	    			self.$el.find('.rules-text').jScrollPane({	    				
	    				autoReinitialise: true,
	    			});	    			
	    		});
	    	}
    	});
	}
})


/* gameField */

Game.Models.Field = Backbone.Model.extend({
	defaults: {}
})

Game.Views.Field = Backbone.View.extend({
	events: {
		'click .congrat a' : function(){
			this.showResultPage(this.userResult);
		},
		'click .reload' : 'reload'
	},

	loaderTimer:false,	

	userResult: {
		seconds: 0,
		errors: 0
	},

	imgPathArray: [],
	puzzlePath: false, 

	successDrops: 0,
	previousGame: false,
	touchedField: false,

	key : {
		'bewua' :'njik', 'huqoq' :'yret', 'knpgj' :'hunp', 'buasu' :'jufg', 'vydss' :'tlit', 'yuvga' : 'ygcc', 'ygbgp' :'hfin',
		'yaydt' :'ppzf', 'kjtad' :'ayib', 'ngprr' :'opdb', 'ghnoq' :'gcgf', 'zjodl' :'olfz', 'vqeyq' : 'bhyf', 'nopmx' :'qwrh', 
		'uqhbg' :'kjof', 'bmkof' :'uege', 'pnbsd' :'bauj', 'qvhva' :'qwfs', 'nkiad' :'knzg', 'bsdia' : 'jiaq', 'bxzsu' :'bhfa', 
		'udsab' :'hzgt', 'ndbao' :'okfs', 'nasip' :'gjik', 'ojojq' :'uytq', 'naalo' :'mbpr', 'vmtvg' : 'lajf', 'vgvku' :'nvck', 
		'gyasj' :'abfg', 'ubuaa' :'bjga', 'gyasm' :'nigs', 'bbavq' :'bgua', 'dhkgh' :'jogj', 'cfcct' : 'ojqr', 'fgczx' :'badg', 
		'mladc' :'nkfe', 'vhavq' :'pikq', 'nkgds' :'nasd', 'vhvty' :'gnkh', 'mjlkk' :'pqmj', 'bfgap' : 'bkhr', 'vgasq' :'iqrq', 
		'bugka' :'lhmn', 'bvfha' :'ngii', 'amkfd' :'qbir', 'bnvck' :'jggq', 'bkbiv' :'nbqb', 'vyvas' : 'qvro', 'vpdqb' :'bnok', 
		'vhasq' :'hoht', 'uasdb' :'higt', 'vtgqn' :'mhpo', 'bjabq' :'qjah', 'qwbfr' :'gnjg', 'ndsaj' : 'ynhe', 'bdsuq' :'bzgi'
	},
	browser	: BrowserDetect.browser,
	os : BrowserDetect.OS,
	
	initialize: function(){		
		this.setElement('.game-screen');

	},
	reload : function(){		
		var self = this;

		this.$el.find('.game-field').fadeOut(200,function(){
			self.startGame();			
			$(this).fadeIn(300);
		})
	},	
	startGame: function(){
		var self = this;
			
		$.modal('<span class="loader">Загрузка...</span>', {
			close: false
		});

		this.puzzlePath = this.getRandomPicture();				
		
		
		this.origImg = $('<img/>').attr('src','images/puzzles/'+ this.puzzlePath +'/orig.PNG').addClass('orig');		
		this.origImg.on('load',function(){ self.loaded +=1 });	
		
		$.ajax({
		   type: "GET",
		   url: 'images/puzzles/'+ this.puzzlePath +'/info.json',
		   cache: false,
		   success: function(data){
		     self.$el.find('.congrat div:first').html(data.text);
		     self.loaded +=1;
		   }
		 });

		this.clearGameField();		

		this.$el.fadeIn('200');

		this.prepareForShuffle();
		this.insertGrid();

		this.loadPuzzle();
		
	},	
	clearGameField: function(){
		this.$el.find('.puzzle').draggable( "destroy" ).remove();
		this.$el.find('.dropField div').droppable( "destroy" ).remove();
		this.$el.find('.congrat').hide();
		this.$el.find('.grid, .orig, .fade').remove();
		
	    this.clearErrors();
	    this.successDrops = 0;
	},
	insertGrid: function() {
		var fade = $('<img src="images/puzzles/'+ this.puzzlePath +'/fade.PNG" class="fade">'),
			grid = $('<img src="images/puzzles/grid.PNG" class="grid">');

			$('.game-image').append(fade).append(grid);
	},
	prepareDroppableFields: function(){
		var field, puzzlesField = this.$el.find('.dropField');

		for (i in this.key) {

			field = $('<div class="'+ i +'"/>');
			field.appendTo(puzzlesField);

			var self = this;

			field.droppable({
				accept: 'img[src="images/puzzles/'+ this.puzzlePath +'/'+ this.key[i] +'.PNG"]',
				drop: function( event, ui ) {
					var draggedPuzzle = $(ui.draggable), 
					    className = draggedPuzzle.attr('src').split('/').pop().slice(0, -4);										
					
					draggedPuzzle.appendTo('.dropField')
								 .addClass(className);
				}
			});			
		}
	},
	prepareForShuffle: function(arr){
		var imgArr = [], imgPath, z = 1;

		for (i in this.key) {			
			imgPath = 'images/puzzles/'+ this.puzzlePath +'/'+ this.key[i] +'.PNG';
			imgArr.push ([imgPath,z]);
			z++;
		}			
		return imgArr;
	},
	getRandomPicture: function(){
		var res;

		if (this.imgPathArray.length > 0) {
			res = this.shuffle(this.imgPathArray);
		} else {
			for (var i=1;i<101;i++) {				
				this.imgPathArray.push(i);
			}			
			res = this.shuffle(this.imgPathArray);
		}

		if(!this.previousGame) {			
			this.previousGame = res[1];
		}
		if (res[1] !== this.previousGame) {
			this.previousGame = res[1];		
			return res[1];
		} else {
			this.previousGame = res[2];			
			return res[2];
		}
	},	
	loadPuzzle: function(){
		var img, i = 0, self = this,
		    top = -40,left = 0,right = 0, nextPuzzleSet = false,
		    puzzles = this.prepareForShuffle(), puzzlesLength = puzzles.length;

			 
		puzzles = this.shuffle(puzzles);
		this.prepareDroppableFields();

		this.$el.hide();
		for (i; i < puzzlesLength; i++) {
		 	
		 	if (i < 8) {
		 		top+=42;		 		
				
				img = $('<img/>').addClass('puzzle').attr('src',puzzles[i][0]);
			 	img.css({ top: top, zIndex: puzzles[i][1]});

		 		this.$el.find('.puzzleSet.left').append(img);		 										

		 		nextPuzzleSet = true;
		 		continue;
		 	}
		 	if (i >= 8 && i < 48) {

		 		if (nextPuzzleSet) {		 			
		 			top = 0;
		 			left = 0;
		 			nextPuzzleSet = false;

		 		} else {			 		
			 		left += 53;
		 		}

		 		if (left === 689 ) {
		 			left = 0;
		 			top += 52;		 			
		 		}

		 		if ( i === 47 ) {
		 			top = 38;
		 			left = 590;
		 		}

		 		img = $('<img/>').addClass('puzzle').attr('src',puzzles[i][0]);
			 	img.css({ top: top, left: left, zIndex: puzzles[i][1]});			 	   

		 		this.$el.find('.puzzleSet.bottom').append(img);

		 		continue;
		 	}

		 	if (i >= 48) {	 		
		 		
		 		if (top === 38 && left === 590) {
		 			left = 0;
		 			right = 0;	
		 			top = -42;
		 		}

		 		top+=42;
		 					 	
		 		img = $('<img/>').addClass('puzzle').attr('src',puzzles[i][0]);
			 	img.css({ top: top, right: right, zIndex: puzzles[i][1] });			 	   
			 	
		 		this.$el.find('.puzzleSet.right').append(img);
		 	}		 	
		 	
		} 
		this.$el.find('img.puzzle').draggable({
			drag: function(){
	            var offset = $(this).offset(),
	            	x = offset.left,
	            	y = offset.top;
	            
	            	console.log (x,y);
		        if (self.browser === 'Explorer') {
		        	if (x > 160 && x < 880 && y > 80 && y < 420) self.touchedField = true; 		            
		            	else self.touchedField = false; 
		        }    
		        else if (self.browser === 'Firefox' && self.os === 'Windows') {		        	
		        	if (x > 190 && x < 880 && y > 80 && y < 420) self.touchedField = true; 		            
		            	else self.touchedField = false; 		        

		        } else {
		            if (x > 320 && x < 900 && y > 80 && y < 420) self.touchedField = true; 		            
		            	else  self.touchedField = false; 
		        }
	        }, 
			revert: function(droped) {
				if (droped) {					
					self.successDrops += 1;					
					$(this).css('zIndex','1');

					if (self.successDrops === 56 ) self.showCongratiolations();	

					return false;
				}
				 else {				 	
					if (self.touchedField) self.$el.find('.errorsCount #errors').html(self.userResult.errors += 1);
				 	
				 	return true;
				 }
			}
		});

		setTimeout(function(){
			self.startTimer();		
			self.$el.show();
			$.modal.close();
		},2500)

	},
	showCongratiolations: function(){
		var	congrat = this.$el.find('.congrat'),
			self = this,
			text;

		this.$el.find('.puzzle, .grid, .fade').fadeOut(500);

		setTimeout(function(){
			self.origImg.appendTo('.dropField');
			self.$el.find('.congrat').appendTo('.puzzleSet.bottom').show();
			clearInterval(self.timer);
		}, 600);
	},
	clearErrors: function(){		
		this.$el.find('.errorsCount #errors').html(this.userResult.errors = 0);
	},
	shuffle: function(o){		
	    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	    return o;
	},
	startTimer: function(){
		var self = this;

		if (this.timer) {
			clearInterval(this.timer);
			this.userResult.seconds = 0;
			this.$el.find('.timer').html('0:00');
		}

		this.timer = setInterval(function(){
			self.$el.find('.timer').html(self.formatTime(self.userResult.seconds += 1));				
		},1000);
	},
	formatTime: function(seconds){
		var d = Number(seconds),
			h = Math.floor(d / 3600),
			m = Math.floor(d % 3600 / 60),
			s = Math.floor(d % 3600 % 60);

		return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s); 
	},
	showResultPage: function(userResult){		
		this.$el.fadeOut('100',function(){
		 	if (!Game.Instances.result) {			
				 Game.Instances.result = new Game.Views.Result(userResult);
				 Game.Instances.result.$el.fadeIn('200');
		 	} else {
		 		 Game.Instances.result.$el.fadeIn('200');
		 	}
		})
	}
});

Game.Views.Result = Backbone.View.extend({
	events: {
		'click #playAgain' : 'restartGame',
		'click .saveBtn' : 'save',		
	},

	started: false,
	encryptKey: false,

	initialize: function(userResult){
		this.setElement('.result-screen');
		this.getKey();
		this.userResult = userResult;
		this.on('saved failed',this.showResult);		
		this.render();
	},
	getKey: function(){
		var self = this;
		$.get('ajax/gamestore.php',{action:'getkey'}, 	function(data) {					
			response = JSON.parse(data);			
  			response.res === 1 ? self.encryptKey = response.data : console.log('error. Key not recieved');  //сделал console.log как обработчик ошибки. Можно менять на что угодно
		 });
	},
	restartGame: function(){
		this.$el.fadeOut('100',function(){			
			Game.Instances.gameField.startGame();		
		})
	},
	save: function(){
		var stringToEncrypt = 'errors: ' + this.userResult.errors + ',seconds: ' + this.userResult.seconds + '#',
			codedData = new Blowfish(this.encryptKey).encrypt(stringToEncrypt),
			self = this,
			response;

		$.post('ajax/gamestore.php', 
			{ 
				have_code: "1", //для совместимости с gamestore.php
				action: 'store',
				data: codedData
			}, 
			function(data) {						
				response = JSON.parse(data);			
				if (response.res === 0 && response.data.length > 0 ) {
					document.location.href = response.data;
				} else if (response.res === 1) {
					 self.trigger('saved',{saved: true});				
				  } 	  			
		    }
		);
	},
	showResult: function(e){				
		this.$el.fadeOut('100',function(){				
			Game.Instances.saveResult = new Game.Views.SaveResult(e);
			Game.Instances.saveResult.$el.fadeIn('200');			
		})
	},	
	render: function(){	
		this.$el.find('.seconds span').html(this.userResult.seconds);
		this.$el.find('.errors span').html(this.userResult.errors);    	
	}
})
Game.Views.SaveResult = Backbone.View.extend({
	events: {
		'click .backToGame' : 'backToGame'
	},
	initialize: function(e){
		this.setElement('.save-result')
		this.isSaved = e.saved;
		this.render();		
	},
	backToGame: function(){	
		this.$el.fadeOut('100',function(){			
			$.modal.close();			
			Game.Instances.startScreen.$el.fadeIn('100');

		})
	},
	render: function(){		
		this.$el.modal({closeClass:'saveCloseImg'});		
	}
})



jQuery(document).ready(function($) {
	Game.start();
});
