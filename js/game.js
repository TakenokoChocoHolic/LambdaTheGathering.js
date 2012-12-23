var Game = {};
(function(root) {

    root.state = null;
    root.depth = 0;

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
        var KK = function () {
            return x;
        };
        if (typeof y === "undefined") {
            return KK;
        } else {
            return x;
        }
    };

    var S = function (f, g, x) {
        if (typeof g === "undefined") {
            return function (gg, xx) {
                var ff = f;

                if (typeof xx === "undefined") {
                    return function (xxx) {
                        var fff = ff,
                            ggg = gg;

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

                return ff(xx)(gg(xx));
            };
        } else {
            return f(x)(g(x));
        }
    };

    var inc = function (i) {
        return i;
    };

    var dec = function (i) {
        return i;
    };

    var attack = function (i, j, n) {
        var _attack = function (jj, nn) {
            var ii = i;
            var __attack = function (nnn) {
                var iii = ii,
                    jjj = jj;

                // TODO: error check
                var proponent = root.state.player[root.state.turn%2];
                var opponent = root.state.player[1-root.state.turn%2];
                proponent.slot[iii].vitality    -= nnn;
                opponent.slot[255-jjj].vitality -= ~~(nnn * 9 / 10);
            };

            if (typeof nn === "undefined") {
                return __attack;
            } else {
                return __attack(nn);
            }
        };
        if (typeof j === "undefined") {
            return _attack;
        } else if (typeof n === "undefined") {
            return _attack(j);
        } else {
            return _attack(j, n);
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

})(Game);

