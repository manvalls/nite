var Resolver = require('y-resolver');

exports.defer = Resolver.defer;
exports.resolve = Resolver.accept;
exports.reject = Resolver.reject;
exports.race = Resolver.race;
exports.all = Resolver.all;
exports.get = Resolver.Yielded.get;
