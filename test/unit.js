var expect = require('expect.js');
var path = require('path');

var Container = require('../lib/container');
var Obj1 = require('./lib/obj-1');
var Obj2 = require('./lib/obj-2');
var Obj3 = require('./lib/obj-3');
var Obj4 = require('./lib/obj-4');
var Obj5 = require('./lib/obj-5');
var Dependency1 = require('./lib/dependency-1');
var Dependency2 = require('./lib/dependency-2');
var Dependency3 = require('./lib/dependency-3');
var Dependency4 = require('./lib/dependency-4');
var Dependency5 = require('./lib/dependency-5');

describe('unit - container', function () {

    this.timeout(30000);

    context('', function () {

        beforeEach('setup', function (done) {

            done();
        });

        afterEach('stop', function (done) {
            done();
        });

        it('successfully resolves first-level dependencies', function (done) {

            var container = new Container();

            container.register('Bob', Dependency1, function () {
                container.register('Mary', Dependency2, function () {
                    container.register('Joe', Obj1, ['Bob', 'Mary'], function () {

                        // 'Joe' depends on 'Bob' and 'Mary'
                        container.resolve('Joe', function (err, result) {

                            result.testMethod(function (err, testResult) {
                                expect(testResult).to.equal('success');
                                done();
                            });

                        });
                    });
                });
            });
        });

        it('successfully resolves nested dependencies', function (done) {

            var container = new Container();

            container.register('Bob', Dependency1, function () {
                // 'Jack' depends on 'Bob'
                container.register('Jack', Dependency4, ['Bob'], function () {
                    // 'Joe' depends on 'Jack'
                    container.register('Jim', Obj4, ['Jack'], function () {
                        container.resolve('Jim', function (err, result) {

                            result.testMethod(function (err, testResult) {
                                expect(testResult).to.equal('success');
                                done();
                            });
                        });
                    });
                });
            });
        });

        it('successfully resolves anonymous object value dependencies', function (done) {

            /*
             ie: a constructor dependency is an anonymous object, which itself contains a
             key whose value is an object that we've registered...

             MyPrototype(arg1, {key1: '@inject:dependency_x'})
             */

            var container = new Container();

            container.register('Bob', Dependency1, function () {

                // anonymous object 'Ellie' depends on 'Bob'
                container.register('Ellie', {key1: '@inject:Bob', key2: 'Blah'}, function () {

                    // 'Chuck' depends on 'Ellie'
                    container.register('Chuck', Obj5, ['Ellie'], function () {

                        container.resolve('Chuck', function (err, result) {

                            result.testMethod(function (err, testResult) {
                                expect(testResult).to.equal('success');
                                done();
                            });
                        });
                    });
                });
            });

        });

        it('successfully resolves anonymous object directly', function (done) {

            var container = new Container();

            container.register('Freddie', {key1: 'Hello'}, function () {

                container.resolve('Freddie', function (err, result) {
                    expect(result.key1).to.equal('Hello');
                    done();
                });
            });
        });

        it('successfully resolves a static object as a dependency', function (done) {
            var container = new Container();

            container.register('Milo', Dependency3, function () {
                // 'Mask' depends on 'Milo'
                container.register('Mask', Obj2, ['Milo'], function () {

                    container.resolve('Mask', function (err, result) {
                        var testResult = result.testMethod();

                        expect(testResult).to.equal('success');

                        done();
                    });
                });
            });
        });

        it('successfully resolves a static object directly', function (done) {
            var container = new Container();

            container.register('Milo', Dependency3, function () {
                container.resolve('Milo', function (err, result) {
                    expect(result.testMethod()).to.equal('success');

                    done();
                });
            });
        });

        it('successfully resolves a static object directly 2', function (done) {
            var container = new Container();

            console.log(Dependency5);

            container.register('Toast', 'buttered', function () {

                container.register('Marmite', Dependency5, ['Toast'], function () {

                    container.resolve('Marmite', function (err, result) {

                        console.log('BINDINGS LENGTH: ', container.bindingLen);

                        expect(result.testMethod()).to.equal('buttered');

                        done();
                    });
                });
            });
        });

        it('successfully resolves a number primitive', function (done) {
            var container = new Container();

            container.register('Olive', 2, function () {

                // 'Popeye' depends on 'Olive'
                container.register('Popeye', Obj3, ['Olive'], function () {

                    container.resolve('Popeye', function (err, result) {

                        var testResult = result.testMethod();

                        expect(testResult).to.equal(2);
                        done();
                    });
                });
            });
        });

        it('successfully resolves a boolean primitive', function (done) {
            var container = new Container();

            container.register('Olive', true, function () {

                // 'Popeye' depends on 'Olive'
                container.register('Popeye', Obj3, ['Olive'], function () {

                    container.resolve('Popeye', function (err, result) {
                        var testResult = result.testMethod();

                        expect(testResult).to.equal(true);
                        done();
                    });
                });
            });
        });

        it('successfully resolves a string primitive', function (done) {
            var container = new Container();

            container.register('Olive', 'Squeak!', function () {

                // 'Popeye' depends on 'Olive'
                container.register('Popeye', Obj3, ['Olive'], function () {

                    container.resolve('Popeye', function (err, result) {
                        var testResult = result.testMethod();

                        expect(testResult).to.equal('Squeak!');
                        done();
                    });
                });
            });
        });
    });
});