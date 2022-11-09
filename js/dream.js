function setChangePage(element, isLoop, needScrollClass) {

	var pageData = {
		curPage: 1,
		prevPage: null,
		PageL: element.querySelectorAll('.page').length,
		type: null,
		canTouch: true,
		startY: 0,
		endY: 0,
		diff: 0,
	}
	var startEvt, moveEvt, endEvt;
	if ("ontouchstart" in window) {
		// 移动端用户滑动事件
		startEvt = "touchstart";
		moveEvt = "touchmove";
		endEvt = "touchend";
	} else {
		// PC端鼠标移动事件
		startEvt = "mousedown";
		moveEvt = "mousemove";
		endEvt = "mouseup";
	}
	element.addEventListener(startEvt, touchStart, false);
	element.addEventListener(moveEvt, touchMove, false);
	element.addEventListener(endEvt, touchEnd, false);

	function touchStart(e) {
		pageData.startY = startEvt == "touchstart" ? e.touches[0].pageY : e.pageY;
		pageData.endY = '';
		pageData.diff = '';
	}

	function touchMove(e) {
		e.preventDefault();
		pageData.endY = startEvt == "touchstart" ? e.touches[0].pageY : e.pageY;
		pageData.diff = pageData.endY - pageData.startY;
	}

	function touchEnd(e) {
		if (Math.abs(pageData.diff) > 150 && pageData.canTouch) {
			changeDoBefore(pageData.diff);
		}
		// setTimeout(function(){
		pageData.startY = '';
		pageData.endY = '';
		pageData.diff = '';
		// },500);
	}


	function changeDoBefore(diffNum) {
		if (diffNum > 0) {
			// 向下滑动进入前一页
			pageData.type = 2;
			if (pageData.curPage <= 1) {
				if (isLoop) {
					pageData.prevPage = 1;
					pageData.curPage = pageData.PageL;
					changeDo();
				}
			} else {
				pageData.prevPage = pageData.curPage;
				pageData.curPage--;
				changeDo();
			}
		} else {
			// 向上滑动进入下一页
			pageData.type = 1;
			if (pageData.curPage >= pageData.PageL) {
				if (isLoop) {
					pageData.prevPage = pageData.PageL;
					pageData.curPage = 1;
					changeDo();
				}
			} else {
				pageData.prevPage = pageData.curPage;
				pageData.curPage++;
				changeDo();
			}
		}
	}
	$("ul>li").click(function() {
		var pageIndex = $(this).index();
		changeDoBefore(pageIndex);
		console.log();
	})

	function changeDo() {
		if (pageData.type == 1) {
			element.querySelector('.page' + pageData.prevPage).classList.remove('inTop', 'outTop', 'inDown',
				'outDown', 'hide');
			element.querySelector('.page' + pageData.prevPage).classList.add('outTop');
			element.querySelector('.page' + pageData.curPage).classList.remove('inTop', 'outTop', 'inDown',
				'outDown', 'hide');
			element.querySelector('.page' + pageData.curPage).classList.add('inTop');
		} else if (pageData.type == 2) {
			element.querySelector('.page' + pageData.prevPage).classList.remove('inTop', 'outTop', 'inDown',
				'outDown', 'hide');
			element.querySelector('.page' + pageData.prevPage).classList.add('outDown');
			element.querySelector('.page' + pageData.curPage).classList.remove('inTop', 'outTop', 'inDown',
				'outDown', 'hide');
			element.querySelector('.page' + pageData.curPage).classList.add('inDown');
		}

		if (needScrollClass && startEvt == "touchstart") {
			scrollEleData.canTouch = false;
			setTimeout(function() {
				scrollEleData.canTouch = true;
			}, 500);
		}

		pageData.canTouch = false;
		setTimeout(function() {
			pageData.canTouch = true;
			element.querySelector('.page' + pageData.prevPage).classList.add('hide');
		}, 500);

		// 执行翻页页面内部可滚动时，设置进入页面后滚动条位置
		if (needScrollClass && element.querySelector('.page' + pageData.curPage).querySelector('.' +
				needScrollClass)) {
			element.querySelector('.page' + pageData.curPage).querySelector('.' + needScrollClass).scrollTop = 0;
		}
	}
	// 执行翻页页面内部可滚动（移动端需要）
	if (needScrollClass && startEvt == "touchstart") {
		var scrollEleData = {
			canTouch: true,
			startY: 0,
			endY: 0,
			diff: 0,
		}
		// console.log(element.querySelectorAll('.' + needScrollClass).length);
		element.querySelectorAll('.' + needScrollClass).forEach(function(item, index) {
			// console.log(item,index);
			item.addEventListener("touchstart", scrollEleTouchStart, false);
			item.addEventListener("touchmove", scrollEleTouchMove, false);
			item.addEventListener("touchend", scrollEleTouchEnd, false);

			function scrollEleTouchStart(e) {
				// e.stopPropagation();
				element.removeEventListener("touchmove", touchMove, false);
				scrollEleData.startY = e.touches[0].pageY;
				scrollEleData.endY = '';
				scrollEleData.diff = '';
			}

			function scrollEleTouchMove(e) {
				scrollEleData.endY = e.touches[0].pageY;
				scrollEleData.diff = scrollEleData.endY - scrollEleData.startY;
			}

			function scrollEleTouchEnd(e) {
				element.addEventListener("touchmove", touchMove, false);
				// console.log(scrollEleData.canTouch);
				if (Math.abs(scrollEleData.diff) > 150 && scrollEleData.canTouch) {
					changeDoBefore(scrollEleData.diff);
				}
				// setTimeout(function(){
				scrollEleData.startY = '';
				scrollEleData.endY = '';
				scrollEleData.diff = '';
				// },500);
			}
			item.addEventListener("scroll", scrollDo, false);

			function scrollDo(e) {
				// console.log(e.target.clientHeight , e.target.scrollTop , e.target.scrollHeight);
				if ((e.target.clientHeight + e.target.scrollTop + 2 >= e.target.scrollHeight) || (e.target
						.scrollTop == 0)) {
					setTimeout(function() {
						scrollEleData.canTouch = true;
					}, 500);
				} else {
					scrollEleData.canTouch = false;
				}
			}
		})
	}

}
setChangePage(document.getElementsByClassName('page_box')[0], '', 'scroll_box');
