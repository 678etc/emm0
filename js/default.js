if (self == top) {
	window.open("404.html", "_self");
}

time_stamp = "";

function _bar() {
	if (document.getElementById('time-stamp')) {
		var x = document.getElementById('time-stamp').innerHTML;
		if (x.length == 14) {
			var y = x.substring(0, 4);
			var m = x.substring(4, 6);
			var d = x.substring(6, 8);
			var h = x.substring(8, 10);
			var mi = x.substring(10, 12);
			var s = x.substring(12, 14);
			var wArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
			time_stamp = 'Last updated on ' + y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s + '  ' + wArr[new Date(parseInt(y) + '-' + parseInt(m) + '-' + parseInt(d)).getDay()];
		}
	}
	var div = document.createElement("div");
	div.setAttribute("id", "bar");
	var first = document.body.firstChild;
	document.body.insertBefore(div, first);
	document.getElementById("bar").innerHTML = document.title;
	document.getElementById("bar").title = time_stamp;
}

function _nav() {
	new_element = document.createElement("p");
	new_element.setAttribute("id", "edit");
	new_element.setAttribute("class", "no-select");
	new_element.innerHTML = "<span>[edit]</span>";
	document.body.appendChild(new_element);

	new_element2 = document.createElement("p");
	new_element2.setAttribute("id", "back");
	new_element2.setAttribute("class", "no-select");
	new_element2.innerHTML = "<span onclick='javascript:history.go(-1)'>[go(-1)]</span>";
	document.body.appendChild(new_element2);

	new_element3 = document.createElement("p");
	new_element3.setAttribute("id", "home");
	new_element3.setAttribute("class", "no-select");
	new_element3.innerHTML = "<span onclick='location.href=&quot;left.html&quot;;_locate()'>[home]</span>";
	document.body.appendChild(new_element3);

	new_element4 = document.createElement("button");
	new_element4.setAttribute("id", "gotop");
	new_element4.onclick = topFunction;
	new_element4.innerHTML = "^";
	document.body.appendChild(new_element4);

	document.getElementById("edit").onclick = function() {
		var a = document.getElementsByTagName("pre")[0];
		if (a.contentEditable == "true") {
			a.contentEditable = "false";
			document.body.style.backgroundColor = "#000";
		} else {
			a.contentEditable = "true";
			document.body.style.backgroundColor = "#222222";
			// when the contenteditable gets focused, start listening to key presses
			a.addEventListener('focus', () =>
				window.addEventListener('keydown', onKeyDown)
			)
			// when the contenteditable looses focus, remove "keydown" event listener
			a.addEventListener('blur', () =>
				window.removeEventListener('keydown', onKeyDown)
			)
		}
	};

}

function onKeyDown(e) {
	console.log(e.keyCode)
	if (e.keyCode != 9) return // only allow TAB key
	e.preventDefault(); // prevent default behaviour, which is "blur"

	var sel = document.getSelection(),
		range = sel.getRangeAt(0),
		tabNodeValue = '\u0009', // tab; with 4 spaces use: Array(4).join('\u00a0')
		tabNode = document.createTextNode(tabNodeValue);

	range.insertNode(tabNode)
	range.setStartAfter(tabNode)
	range.setEndAfter(tabNode)
}

window.onscroll = function() {
	if(document.getElementById("gotop")){
		document.body.scrollTop > 500 || document.documentElement.scrollTop > 500 ? document.getElementById("gotop").style.display = "block" : document.getElementById("gotop").style.display = "none"		
	}
}

function topFunction() {
	if (!+[1, ]) {
		document.body.scrollIntoView();
	} else {
		document.body.scrollIntoView({
			behavior: "smooth"
		});
	}
}

function _locate() {
	top.postMessage("reset_locate", "*")
}

function _gallery() {
	//	document.body.classList.add('hes-gallery');	
	document.body.className += " hes-gallery";
	HesGallery.init();
}

function _amp() {
	if(document.title.search("\u3011") != -1){
		top.postMessage("webamp_on", "*")
	}else{
		top.postMessage("webamp_off", "*")
	}
}

window.onload = function() {
	_bar();
	_nav();
	_gallery();
	_amp();
	
	//高亮定位
	window.addEventListener("message", function(x) {
		InstantSearch.highlight(document.getElementsByTagName("pre")[0], x.data);
		document.getElementsByClassName("highlight")[0].setAttribute('id', "a");
		var elementPosition = document.getElementById('a').offsetTop;
		window.scrollTo({
			top: elementPosition - 40, //位置修正
			behavior: "smooth" //平滑
		});
	}, false);
}

//关键词着色
//https://stackoverflow.com/questions/8644428/how-to-highlight-text-using-javascript
var InstantSearch = {
	"highlight": function(container, highlightText) {
		var internalHighlighter = function(options) {
			var id = {
					container: "container",
					tokens: "tokens",
					all: "all",
					token: "token",
					className: "className",
					sensitiveSearch: "sensitiveSearch"
				},
				tokens = options[id.tokens],
				allClassName = options[id.all][id.className],
				allSensitiveSearch = options[id.all][id.sensitiveSearch];

			function checkAndReplace(node, tokenArr, classNameAll, sensitiveSearchAll) {
				var nodeVal = node.nodeValue,
					parentNode = node.parentNode,
					i, j, curToken, myToken, myClassName, mySensitiveSearch, finalClassName, finalSensitiveSearch, foundIndex, begin, matched, end, textNode, span, isFirst;

				for (i = 0, j = tokenArr.length; i < j; i++) {
					curToken = tokenArr[i];
					myToken = curToken[id.token];
					myClassName = curToken[id.className];
					mySensitiveSearch = curToken[id.sensitiveSearch];
					finalClassName = (classNameAll ? myClassName + " " + classNameAll : myClassName);
					finalSensitiveSearch = (typeof sensitiveSearchAll !== "undefined" ? sensitiveSearchAll : mySensitiveSearch);
					isFirst = true;
					while (true) {
						if (finalSensitiveSearch) foundIndex = nodeVal.indexOf(myToken);
						else foundIndex = nodeVal.toLowerCase().indexOf(myToken.toLowerCase());
						if (foundIndex < 0) {
							if (isFirst) break;
							if (nodeVal) {
								textNode = document.createTextNode(nodeVal);
								parentNode.insertBefore(textNode, node);
							} // End if (nodeVal)
							parentNode.removeChild(node);
							break;
						} // End if (foundIndex < 0)
						isFirst = false;
						begin = nodeVal.substring(0, foundIndex);
						matched = nodeVal.substr(foundIndex, myToken.length);
						if (begin) {
							textNode = document.createTextNode(begin);
							parentNode.insertBefore(textNode, node);
						} // End if (begin)
						span = document.createElement("span");
						span.className += finalClassName;
						span.appendChild(document.createTextNode(matched));
						parentNode.insertBefore(span, node);

						nodeVal = nodeVal.substring(foundIndex + myToken.length);
					} // Whend
				} // Next i 
			}; // End Function checkAndReplace 
			function iterator(p) {
				if (p === null) return;
				var children = Array.prototype.slice.call(p.childNodes),
					i,
					cur;

				if (children.length) {
					for (i = 0; i < children.length; i++) {
						cur = children[i];
						if (cur.nodeType === 3) {
							checkAndReplace(cur, tokens, allClassName, allSensitiveSearch);
						} else if (cur.nodeType === 1) {
							iterator(cur);
						}
					}
				}
			}; // End Function iterator
			iterator(options[id.container]);
		} // End Function highlighter
		;
		internalHighlighter({
			container: container,
			all: {
				className: "highlighter"
			},
			tokens: [{
				token: highlightText,
				className: "highlight",
				sensitiveSearch: false
			}]
		}); // End Call internalHighlighter 
	} // End Function highlight
};




//图集
//<img src="../images/" data-subtext="图片说明"><br>
//https://www.cssscript.com/demo/mobile-compatible-responsive-gallery-hesgallery/
var HesGallery = {
	options: {
		minResolution: 0,
		wrapAround: false,
		showImageCount: true
	}
}

function HesSingleGallery(index) {
	this.index = index;
	this.imgPaths = [];
	this.subTexts = [];
	this.altTexts = [];
	this.options = {};
	var gallery = document.getElementsByClassName('hes-gallery')[this.index];
	this.options.wrapAround = typeof gallery.dataset.wrap == 'undefined' ? HesGallery.options.wrapAround : gallery.dataset.wrap == 'true';
	this.options.showImageCount = typeof gallery.dataset.imgCount == 'undefined' ? HesGallery.options.showImageCount : gallery.dataset.imgCount == 'true';
	var disabledCount = 0;
	[].forEach.call(gallery.querySelectorAll('img:not(.ng):not(#hg-pic)'), function(image, i) {
		if (image.dataset.disabled == 'true') disabledCount++
		else {
			this.imgPaths.push(image.src || '');
			this.subTexts.push(image.dataset.subtext || '');
			this.altTexts.push(image.dataset.alt || '');
			image.setAttribute('onclick', 'HesGallery.show(' + (this.index) + ',' + (i - disabledCount) + ')');
		}
	}.bind(this));
	this.count = this.imgPaths.length;
}
HesGallery.setOptions = function(values) {
	for (var key in values) this.options[key] = values[key];
}

HesGallery.init = function() {
	if (!this.executed) {
		this.EOM = {};
		var gal = document.createElement('div')
		gal.id = "hgallery"
		gal.setAttribute('style', 'visibility:hidden;')
		document.body.appendChild(gal)
		this.EOM.galery = document.getElementById('hgallery');
		this.EOM.galery.innerHTML += "<div id='hg-bg' onclick='HesGallery.hide()'></div>";
		this.EOM.galery.innerHTML += "<div id='hg-pic-cont'><img id='hg-pic' onmouseover='startDrag(this,this);' onmousewheel='bbimg(this)' ondblclick='HesGallery.hide()' /></div>";
		this.EOM.galery.innerHTML += "<span id='hg-prev' onclick='HesGallery.prev()'>prev</span>";
		this.EOM.galery.innerHTML += "<span id='hg-next' onclick='HesGallery.next()'>next</span>";
		this.EOM.b_prev = document.getElementById('hg-prev');
		this.EOM.b_next = document.getElementById('hg-next');
		this.EOM.pic_cont = document.getElementById('hg-bg');
		this.executed = true;
	}
	this.EOM.pic_cont.classList = 'hg-transition';
	this.count = document.querySelectorAll('.hes-gallery').length;
	this.galleries = [];
	for (var i = 0; i < this.count; i++) {
		this.galleries[i] = new HesSingleGallery(i);
	}
}
HesGallery.show = function(g, i) {
	top.postMessage("gallery_hide_right", "*");
	if (innerWidth < this.options.minResolution) return false;
	this.currentImg = i;
	this.currentGal = g;
	this.open = true;
	if (this.EOM.pic_cont.classList == 'hg-transition') this.EOM.pic_cont.classList.remove('hg-transition');
	document.getElementById('hg-pic').setAttribute('src', this.galleries[g].imgPaths[i]);
	document.getElementById('hg-pic').alt = this.galleries[g].altTexts[i];
	document.body.style.overflow = "hidden";
	this.EOM.galery.classList = 'open';
	this.EOM.pic_cont.dataset.subtext = this.galleries[g].subTexts[i];
	if (
		this.galleries[this.currentGal].options.showImageCount &&
		this.galleries[this.currentGal].imgPaths.length != 1
	) this.EOM.pic_cont.dataset.howmany = (this.currentImg + 1) + '/' + this.galleries[g].count;
	else this.EOM.pic_cont.dataset.howmany = '';
	if (this.galleries[this.currentGal].imgPaths.length == 1) {
		this.EOM.b_prev.classList = 'hg-unvisible';
		this.EOM.b_next.classList = 'hg-unvisible';
	} else if (this.currentImg + 1 == 1 && !this.galleries[this.currentGal].options.wrapAround) {
		this.EOM.b_prev.classList = 'hg-unvisible';
		this.EOM.b_next.classList = '';
	} else if (this.currentImg + 1 == this.galleries[this.currentGal].count && !this.galleries[this.currentGal].options.wrapAround) {
		this.EOM.b_next.classList = 'hg-unvisible';
		this.EOM.b_prev.classList = '';
	} else {
		this.EOM.b_next.classList = '';
		this.EOM.b_prev.classList = '';
	}
}
HesGallery.hide = function() {
	top.postMessage("gallery_show_right", "*");
	this.EOM.pic_cont.classList.add('hg-transition');
	this.EOM.galery.classList = '';
	this.open = false;
	document.getElementsByTagName("body")[0].style.overflow = "auto";
}
HesGallery.next = function() {
	if (this.galleries[this.currentGal].options.wrapAround && this.currentImg == this.galleries[this.currentGal].count - 1)
		this.show(this.currentGal, 0);
	else if (this.currentImg + 1 < this.galleries[this.currentGal].count)
		this.show(this.currentGal, this.currentImg + 1);
}
HesGallery.prev = function() {
	if (this.galleries[this.currentGal].options.wrapAround && this.currentImg == 0)
		this.show(this.currentGal, this.galleries[this.currentGal].count - 1);
	else if (this.currentImg + 1 > 1)
		this.show(this.currentGal, this.currentImg - 1);
}
HesGallery.setOptions({
	minResolution: 0,
	showImageCount: true,
	wrapAround: true
});

var params = {
	zoomVal: 1,
	left: 0,
	top: 0,
	currentX: 0,
	currentY: 0,
	flag: false
};

function bbimg(o) {
	params.zoomVal += event.wheelDelta / 1200;
	if (params.zoomVal >= 0.2) {
		o.style.transform = "scale(" + params.zoomVal + ")";
	} else {
		params.zoomVal = 0.2;
		o.style.transform = "scale(" + params.zoomVal + ")";
		return false;
	}
}
var getCss = function(o, key) {
	return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
};
var startDrag = function(bar, target, callback) {
	if (getCss(target, "left") !== "auto") {
		params.left = getCss(target, "left");
	}
	if (getCss(target, "top") !== "auto") {
		params.top = getCss(target, "top");
	}
	bar.onmousedown = function(event) {
		params.flag = true;
		if (!event) {
			event = window.event;
			bar.onselectstart = function() {
				return false;
			}
		}
		var e = event;
		params.currentX = e.clientX;
		params.currentY = e.clientY;
	};
	document.onmouseup = function() {
		params.flag = false;
		if (getCss(target, "left") !== "auto") {
			params.left = getCss(target, "left");
		}
		if (getCss(target, "top") !== "auto") {
			params.top = getCss(target, "top");
		}
	};
	document.onmousemove = function(event) {
		var e = event ? event : window.event;

		if (params.flag) {
			var nowX = e.clientX,
				nowY = e.clientY;
			var disX = nowX - params.currentX,
				disY = nowY - params.currentY;
			target.style.left = parseInt(params.left) + disX + "px";
			target.style.top = parseInt(params.top) + disY + "px";
			target.style.position = "relative";

			if (typeof callback == "function") {
				callback((parseInt(params.left) || 0) + disX, (parseInt(params.top) || 0) + disY);
			}

			if (event.preventDefault) {
				event.preventDefault();
			}
			return false;
		}
	}
};

function keyDown(e) {
	if(document.getElementById('hgallery')){
		var xxxx = document.getElementById('hgallery');
		var zzzz = document.getElementById('hg-pic');
		if (xxxx.getAttribute('class') == 'open') {
			if (e.which == 40) { //down
				e.which = 0;
				e.returnValue = false;
				HesGallery.hide();
				return false;
			}
			if (e.which == 38) { //up    
				e.which = 0;
				e.returnValue = false;
				zzzz.style.transform = "scale(1)";
				params.zoomVal = 1;
				zzzz.style.left = 0;
				zzzz.style.top = 0;
				return false;
			}
			if (e.which == 37) { //left      
				e.which = 0;
				e.returnValue = false;
				HesGallery.prev();
				return false;
			}
			if (e.which == 39) { //right      
				e.which = 0;
				e.returnValue = false;
				HesGallery.next();
				return false;
			}
		};
	}
};
document.onkeydown = keyDown;