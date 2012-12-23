var Game = {};
(function(root) {

    root.state = null;
    root.depth = 0;

    var zero = function () {
        root.depth++;
        return 0;
    };

    var succ = function (n) {
        root.depth++;
        return n + 1;
    };

    var dbl = function (n) {
        root.depth++;
        return n * 2;
    };

    var get = function (i) {
        root.depth++;
        return i;
    };

    var put = function () {
        root.depth++;
        return I;
    };

    var I = function (x) {
        root.depth++;
        return x;
    };

    var K = function (x, y) {
        root.depth++;
        var KK = function () {
            root.depth++;
            return x;
        };
        if (typeof y === "undefined") {
            return KK;
        } else {
            return x;
        }
    };

    var S = function (f, g, x) {
        root.depth++;
        if (typeof g === "undefined") {
            return function (gg, xx) {
                var ff = f;
                root.depth++;

                if (typeof xx === "undefined") {
                    return function (xxx) {
                        var fff = ff,
                            ggg = gg;

                        root.depth++;
                        return fff(xxx)(ggg(xxx));
                    };
                } else {
                    return ff(xx)(gg(xx));
                }
            };
        } else if (typeof x === "undefined") {
            return function (xx) {
                var ff = f,
                    gg = g;

                root.depth++;
                return ff(xx)(gg(xx));
            };
        } else {
            return f(x)(g(x));
        }
    };

    var inc = function (i) {
        root.depth++;
        return i;
    };

    var dec = function (i) {
        root.depth++;
        return i;
    };

    var attack = function (i, j, n) {
        var _attack = function (jj, nn) {
            var ii = i;
            var __attack = function (nnn) {
                var iii = ii,
                    jjj = jj;

                root.depth++;
                // TODO: error check
                var proponent = root.state.player[root.state.turn%2];
                var opponent = root.state.player[1-root.state.turn%2];
                proponent.slot[iii].vitality    -= nnn;
                opponent.slot[255-jjj].vitality -= ~~(nnn * 9 / 10);
            };

            root.depth++;
            if (typeof nn === "undefined") {
                return __attack;
            } else {
                return __attack(nn);
            }
        };

        root.depth++;
        if (typeof j === "undefined") {
            return _attack;
        } else if (typeof n === "undefined") {
            return _attack(j);
        } else {
            return _attack(j, n);
        }
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

    root.zero = zero;
    root.succ = succ;
    root.dbl = dbl;
    root.cI = I;
    root.cK = K;
    root.cS = S;
    root.get = get;
    root.put = put;
    root.inc = inc;
    root.dec = dec;
    root.attack = attack;
    root.step = step;

})(Game);

