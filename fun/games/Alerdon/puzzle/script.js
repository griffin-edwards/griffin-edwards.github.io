// ***
// Combination Lock
// ***
let waterColors = [
	"#00657B",
	"#ffaf43", 
	"lightblue",
	"coral", //correct
	"red",
	"purple",
	"peachpuff",
	"brown",
	"green",
	"aqua",
];
let treeColors = [
	"#00657B",
	"#3CBDFF", //correct
	"peachpuff",
	"purple",
	"blue",
	"lightblue",
	"red",
	"orchid",
	"seagreen",
	"brown",
];
let leafColors = [
	"#00657B",
	"cadetblue",
	"#5CC92B", //correct
	"purple",
	"peachpuff",
	"orchid",
	"lightblue",
	"red",
	"brown",
	"seagreen",
];
let wineColors = [
	"#00657B",
	"crimson",
	"lightblue",
	"peachpuff",
	"cadetblue",
	"orchid",
	"goldenrod", 
	"#B195FF", //correct
	"red",
	"purple",
];

let backgroundColors = [
	waterColors,
	treeColors,
	leafColors,
	wineColors,
];


var combinationLock = {
	combination: 3127,
	locked: true,
	wheels: [0, 0, 0, 0],
	increment: function(wheel) {
		if (this.wheels[wheel] === 9) {
			this.wheels[wheel] = 0;
		} else {
			this.wheels[wheel]++;
		}
	},
	decrement: function(wheel) {
		if (this.wheels[wheel] === 0) {
			this.wheels[wheel] = 9;
		} else {
			this.wheels[wheel]--;
		}
	},
	check: function() {
		if (this.combination === parseInt(this.wheels.join(''))) {
			this.locked = false;
		} else {
			this.locked = true;
		}
	},
	spin: function() {
		// randomize the wheels
		for (i = 0; i < 4; i++) {
			this.wheels[i] = getRandomInt(10, -1);
		}
	},
	reset: function(){
		wheels = [0,0,0,0]
	}
}

// ***
// Reusable Functions
// ***

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// ***
// Presentation
// ***

// Increment buttons
var increments = document.getElementsByClassName('increment');

var checkSuccess = document.getElementsByClassName("locked");

for (var i = 0; i < increments.length; i++) {
    increments[i].addEventListener('click', function(){
    	let wheelIndex = parseInt(this.getAttribute('index'));
    	combinationLock.increment(wheelIndex);
		//document.getElementById("digit").style.color = "blue";
		document.querySelectorAll('.digit')[wheelIndex].style.background = backgroundColors[wheelIndex][combinationLock.wheels[wheelIndex]];
    	document.querySelectorAll('.digit')[wheelIndex].value = combinationLock.wheels[wheelIndex];
    });
}

for (var i = 0; i < checkSuccess.length; i++) {
    checkSuccess[i].addEventListener('click', function(){
    	checkLock();
    });
}


// Decrement buttons
var decrements = document.getElementsByClassName('decrement');

for (var i = 0; i < decrements.length; i++) {
    decrements[i].addEventListener('click', function(){
    	let wheelIndex = parseInt(this.getAttribute('index'));
    	combinationLock.decrement(wheelIndex);
		document.querySelectorAll('.digit')[wheelIndex].style.background = backgroundColors[wheelIndex][combinationLock.wheels[wheelIndex]];
    	document.querySelectorAll('.digit')[wheelIndex].value = combinationLock.wheels[wheelIndex];
    });
}

// Keypress
var wheels = document.getElementsByClassName('digit');

for (var i = 0; i < wheels.length; i++) {
	wheels[i].addEventListener('keyup', function(e){

		// arrow key up
		if (e.which === 38) {
			let wheelIndex = parseInt(this.getAttribute('index'));
			combinationLock.increment(wheelIndex);
			document.querySelectorAll('.digit')[wheelIndex].value = combinationLock.wheels[wheelIndex];
			checkLock();
		}

		// arrow key down
		if (e.which === 40) {
			let wheelIndex = parseInt(this.getAttribute('index'));
			combinationLock.decrement(wheelIndex);
			document.querySelectorAll('.digit')[wheelIndex].value = combinationLock.wheels[wheelIndex];
			checkLock();
		}

		// number key (0 - 9)
		if (e.which > 47 && e.which < 58 ) {
			let wheelIndex = parseInt(this.getAttribute('index'));
			combinationLock.wheels[wheelIndex] = parseInt(document.querySelectorAll('.digit')[wheelIndex].value);
			checkLock();
		}

		// if number is longer than 1 digit
		if (this.value.length > 1) {
			this.value = 0;
		}

		// if number is less that 1 digit
		if (this.value.length < 1) {
			this.value = 0;
		}
	});
}

// Check lock
function checkLock() {
	combinationLock.check();
	if (combinationLock.locked === false) {
		document.querySelector('#indicator').classList.remove('locked');
		document.querySelector('#indicator').classList.add('unlocked');
	} else {
		//document.querySelector('#indicator').classList.add('locked');
		//document.querySelector('#indicator').classList.remove('unlocked');
		combinationLock.reset();
		var needsToBeReset = document.getElementsByClassName('digit');
		for (var i = 0; i < needsToBeReset.length; i++) {
			needsToBeReset[i].style.background = "#00657B";
			needsToBeReset[i].value = 0;
		};
		
	}
}

//Slider Code
var DEG = document.querySelector(':root');

(function () {
    var $container = $('#maic-circle');
    var $slider = $('#magic-slider');
    var sliderW2 = $slider.width()/2;
    var sliderH2 = $slider.height()/2;    
    var radius = 50;
    var deg = 0;    
    var elP = $('#magic-circle').offset();
    var elPos = { x: elP.left, y: elP.top};
    var X = 0, Y = 0;
    var mdown = false;
    $('#magic-circle')
    .mousedown(function (e) { mdown = true; })
    .mouseup(function (e) { mdown = true; })
    .mousemove(function (e) {
        if (mdown) {
           var mPos = {x: e.clientX-elPos.x, y: e.clientY-elPos.y};
           var atan = Math.atan2(mPos.x-radius, mPos.y-radius);
           deg = -atan/(Math.PI/180) + 180; // final (0-360 positive) degrees from mouse position 
           document.querySelector(':root').style.setProperty('--rotate-deg', deg+'deg'); 

           X = Math.round(radius* Math.sin(deg*Math.PI/180));    
           Y = Math.round(radius*  -Math.cos(deg*Math.PI/180));
           $slider.css({ left: X+radius-sliderW2, top: Y+radius-sliderH2 });              
           // AND FINALLY apply exact degrees to ball rotation
           $slider.css({ WebkitTransform: 'rotate(' + deg + 'deg)'});
           $slider.css({ '-moz-transform': 'rotate(' + deg + 'deg)'});
           //
           // PRINT DEGREES
           $('input[name="angle"]').val(Math.ceil(deg));
        }
    });
})();

//Change Color