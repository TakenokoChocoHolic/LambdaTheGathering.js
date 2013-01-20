var Game = {};
(function(root) {

    root.state = null;
    root.depth = 0;

    var args2array = function (args) {
        var len, array, i;

        len = args.length;
        array = [];
        for (i=0; i<len; i++) array[i] = args[i];

        return array;
    };

    var makeCurry = function (func) {
        var requiredLength = func.length;
        var curriedFunc = function () {
            var ret;
            var args = args2array(arguments);

            if (args.length >= requiredLength) {
                ret = func.apply(null, args.slice(0, requiredLength));
                if (typeof ret === 'function') {
                    ret = makeCurry(ret).apply(null, args.slice(requiredLength));
                }
            } else {
                ret = function () {
                    var adds = args2array(arguments);
                    return curriedFunc.apply(null, args.concat(adds));
                };
            }
            return ret;
        };
        return curriedFunc;
    };

    var wrapper = function (func) {
        return function () {
            if (root.depth >= 1000) {
                throw 'number of function applications exceeds 1000';
            }
            root.depth++;
            return makeCurry(func).apply(null, arguments);
        };
    };

    var proponent = function () {
        return root.state.player[root.state.turn % 2];
    };

    var opponent = function () {
        return root.state.player[1 - root.state.turn % 2];
    };

    var validateNumber = function (i) {
        if (typeof i !== 'number') {
            throw 'number is expected, but get ' + i;
        }
    };

    var validateSlotNumber = function (i) {
        if (typeof i !== 'number' || i < 0 || 255 < i) {
            throw 'invalid slot number ' + i;
        }
    };

    var zero = function () {
        return 0;
    };

    var succ = function (n) {
        validateNumber(n);

        if (n < 65535) {
            return n + 1;
        } else {
            if (n !== 65535) {
                console.log('succ : too large number ' + n);
            }
            return 65535;
        }
    };

    var dbl = function (n) {
        validateNumber(n);

        if (n < 32768) {
            return n * 2;
        } else {
            return 65535;
        }
    };

    var get = function (i) {
        validateSlotNumber(i);

        var slot = proponent().slot[i];
        return slot.value;
    };

    var put = function (x) {
        return I;
    };

    var I = function (x) {
        return x;
    };

    var K = function (x, y) {
        return x;
    };

    var S = function (f, g, x) {
        return f(x)(f(x));
    };

    var inc = function (i) {
        validateSlotNumber(i);

        var slot = proponent().slot[i];
        if (0 < slot.vitality && slot.vitality < 65535) {
            slot.vitality += 1;
        }
        return I;
    };

    var dec = function (i) {
        validateSlotNumber(i);

        var slot = opponent().slot[255-i];
        if (slot.vitality > 0) {
            slot.vitality -= 1;
        }
        return I;
    };

    var attack = function (i, j, n) {
        validateSlotNumber(i);
        validateSlotNumber(j);

        proponent().slot[i].vitality    -= n;
        opponent().slot[255-j].vitality -= Math.floor(n * 9 / 10);
        return I;
    };

    var help = function (i, j, n) {
        validateSlotNumber(i);
        validateSlotNumber(j);

        var prop = proponent();
        prop.slot[i].vitality -= n;
        prop.slot[j].vitality += Math.floor(n * 11 / 10);
        return I;
    };

    var copy = function (i) {
        validateSlotNumber(i);

        return opponent().slot[i].value;
    };

    var revive = function (i) {
        validateSlotNumber(i);

        var slot = proponent().slot[i];
        if (slot.vitality <= 0) {
            slot.vitality = 1;
        }
        return I;
    };

    var zombie = function (i, x) {
        validateSlotNumber(i);

        var slot = opponent().slot[i];
        if (slot.vitality <= 0) {
            slot.value = x;
            slot.vitality = -1;
        } else {
            throw 'tried to apply zombie to alive slot';
        }

        return I;
    };

    var applyCard = function (func, arg) {
        var ret;
        root.depth = 0;
        try {
            ret = func(arg);
        } catch(e) {
            console.log(e);
            ret = I;
        }
        return ret;
    };

    var processZombies = function (state, player) {
        state.zombieMode = true;

        player.slot.forEach(function (slot) {
            if (slot.vitality === -1) {
                applyCard(slot.value, I);
                slot.value = I;
            }
        });

        state.zombieMode = false;
    };

    var initState = function () {
        var initPlayer = function () {
            var slot = [], i;
            for (i=0; i<256; i++) {
                slot.push({ "vitality": 10000, "value": I });
            }

            return { "slot": slot };
        };

        return { "player": [ initPlayer(), initPlayer() ] };
    };

    var step = function (slotNum, card, cardToSlot, state) {
        root.state = state;

        var t = state.turn % 2,
            proponent = state.player[t],
            slot = proponent.slot[slotNum];

        processZombies(state, proponent);

        if (cardToSlot) {
            slot.value = applyCard(card, slot.value);
        } else {
            slot.value = applyCard(slot.value, card);
        }
    };

    root.zero   = 0;
    root.succ   = wrapper(succ);
    root.dbl    = wrapper(dbl);
    root.cI     = wrapper(I);
    root.cK     = wrapper(K);
    root.cS     = wrapper(S);
    root.get    = wrapper(get);
    root.put    = wrapper(put);
    root.inc    = wrapper(inc);
    root.dec    = wrapper(dec);
    root.attack = wrapper(attack);
    root.help   = wrapper(help);
    root.copy   = wrapper(copy);
    root.revive = wrapper(revive);
    root.zombie = wrapper(zombie);

    root.step   = step;
    root.initState = initState();

})(Game);

