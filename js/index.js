$(function() {
	"use strict";
	var state = Game.initState();

	var renderSlots = function(parentElem, slotsData, callback) {
		var checkedClass = 'checked-slot';
		parentElem.empty();
		_.each(slotsData, function(slot, index) {
			var slotElem = $('<div class="slot" />');
			// vitality
			var v = slot.vitality * 255 / 10000;
			if (v < 0) v = 0;
			if (v > 255) v = 255;
			slotElem.css({
				'background-color': 'rgb(' + (255 - v) + ', ' + v + ', 0)'
			});
			// value
			var valueTxt = '?'
			if (typeof(slot.value) === 'number') {
				valueTxt = slot.value.toString();
			} else if (slot.value == Game.cI) {
				valueTxt = 'I';
			}
			slotElem.text(valueTxt);
			slotElem.attr('title', 'value: ' + valueTxt + ', vitality: ' + slot.vitality);
			if (callback) {
				slotElem.click(function() {
					var checkedElems = $('.' + checkedClass);
					if (checkedElems.length == 0) {
						slotElem.addClass(checkedClass);
						callback(index);
					} else if (checkedElems[0] == slotElem[0]) {
						slotElem.removeClass(checkedClass);
						callback(null);
					} else {
						checkedElems.removeClass(checkedClass);
						slotElem.addClass(checkedClass);
						callback(index);
					}
				});
			}
			parentElem.append(slotElem);
		});
	}

	var checkedIndex = null;
	var renderBoth = function() {
		renderSlots($('#userA .slots'), state.player[0].slot, function(ix) {
			checkedIndex = ix;
		});
		renderSlots($('#userB .slots'), state.player[1].slot, function(ix) {
			checkedIndex = ix;
		});
	}
	renderBoth();

	// Create buttons
	var dirs = ['card(slot)', 'slot(card)'];
	var cards = {
		"zero": Game.zero,
		"succ": Game.succ,
		"double": Game.dbl,
		'get': Game.get,
		'put': Game.put,
		'S': Game.cS,
		'K': Game.cK,
		'I': Game.cI,
		'inc': Game.inc,
		'dec': Game.dec,
		'attack': Game.attack,
		'help': Game.help,
		'copy': Game.copy,
		'revive': Game.revive,
		'zombie': Game.zombie,
	};

	function mkCmd(dir, cardFunc) {
		return function() {
			var slotNum = checkedIndex;
			if (slotNum !== null) {
				Game.step(slotNum, cardFunc, dir === dirs[0], state);
				renderBoth();
			} else {
				alert('!!! Select slot !!!');
			}
		};
	};
	parent = $('#buttons');
	_.each(cards, function(func, name) {
		var item = $('<li />').text(name);
		for (var j = 0; j < dirs.length; j++) {
			var dir = dirs[j];
			var btn = $('<button />').text(dir).click(mkCmd(dir, func));
			item.append(btn);
		}
		parent.append(item);
	});

	function advanceUserA() {}

	function advanceUserB() {}

	// Initialize components for AI programming
	var users = ['userA', 'userB'];
	_.each(users, function(formId) {
		var formElem = $('#' + formId + ' .cmd');
		formElem.children('textarea').val("function() {\n  var ret = {};\n  ret.slotNum = 0;\n  ret.card = Game.zero;\n  ret.cardToSlot = false;\n  return ret;\n}");
	});

	$('#advance').click(function() {
		_.each(users, function(formId) {
			var formElem = $('#' + formId + ' .cmd');
			var funcName = 'advance' + _(formId).capitalize();
			var text = formElem.children('textarea').val();
			eval(funcName + "=" + text);
		});

		var ret;
		ret = advanceUserA(_(state).clone());
		Game.step(ret.slotNum, ret.card, ret.cardToSlot, state);
		ret = advanceUserB(_(state).clone());
		Game.step(ret.slotNum, ret.card, ret.cardToSlot, state);
		renderBoth();
	});
});