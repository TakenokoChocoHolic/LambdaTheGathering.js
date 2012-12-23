var Game = {};
(function(root) {

    root.state = null;
    root.depth = 0;

    var args_to_array = function (args) {
        var len, array, i;

        len = args.length;
        array = [];
        for (i=0; i<len; i++) array[i] = args[i];

        return array;
    };

    var make_curry = function (func) {
        var required_length = func.length;
        var curried_func = function () {
            var ret;
            var args = args_to_array(arguments);

            if (args.length >= required_length) {
                ret = func.apply(null, args.slice(0, required_length));
                if (typeof ret === 'function') {
                    ret = make_curry(ret).apply(null, args.slice(required_length));
                }
            } else {
                ret = function () {
                    var adds = args_to_array(arguments);
                    return curried_func.apply(null, args.concat(adds));
                };
            }
            return ret;
        };
        return curried_func;
    };

    var wrapper = function (func) {
        return function () {
            root.depth++;
            return make_curry(func).apply(null, arguments);
        };
    };

    var zero = function () {
        return 0;
    };

    var succ = function (n) {
        return n + 1;
    };

    var dbl = function (n) {
        return n * 2;
    };

    var get = function (i) {
        return i;
    };

    var put = function () {
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
        return i;
    };

    var dec = function (i) {
        return i;
    };

    var attack = function (i, j, n) {
        // TODO: error check
        var proponent = root.state.player[root.state.turn%2];
        var opponent = root.state.player[1-root.state.turn%2];
        proponent.slot[i].vitality    -= n;
        opponent.slot[255-j].vitality -= ~~(n * 9 / 10);
    };

    var step = function (slot_num, func, dir, state) {
        root.state = state;
        root.depth = 0;

        var t = state.turn % 2,
            proponent = state.player[t],
            slot = proponent.slot[slot_num];

        if (true) {
            slot.value = slot.value(func);
        } else {
            slot.value = func(slot.value);
        }
    };

    root.zero   = wrapper(zero);
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
    root.step   = wrapper(step);

})(Game);

