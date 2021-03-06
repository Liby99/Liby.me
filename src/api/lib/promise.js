module.exports = {
    all (arr, func, cb, error) {
        if (arr.length == 0) return cb();
        var c = 0, t = () => { if (++c == arr.length) cb() }
        for (var i = 0; i < arr.length; i++) func(arr[i], i, t, error);
    }
}
