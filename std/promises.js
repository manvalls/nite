var Resolver = require('y-resolver');

exports.defer = Resolver.defer;
exports.resolve = Resolver.resolve;
exports.reject = Resolver.reject;
exports.race = Resolver.race;
exports.all = Resolver.all;
exports.when = Resolver.when;
exports.get = Resolver.Yielded.get;
