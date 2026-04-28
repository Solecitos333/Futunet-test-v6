const { describe, it, mock, afterEach, beforeEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const vm = require('vm');
const { JSDOM } = require('jsdom');

describe('debounce', () => {
  let context;

  beforeEach(() => {
    mock.timers.enable();
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, { url: 'http://localhost' });
    const code = fs.readFileSync('js/catalog.js', 'utf8');

    context = {
      window: dom.window,
      document: dom.window.document,
      console: console,
      setTimeout: global.setTimeout,
      clearTimeout: global.clearTimeout,
      IntersectionObserver: class { observe() {} disconnect() {} },
      URLSearchParams: dom.window.URLSearchParams,
      location: dom.window.location,
      localStorage: dom.window.localStorage,
      fetch: mock.fn(),
    };
    vm.createContext(context);
    vm.runInContext(code, context);
  });

  afterEach(() => {
    mock.timers.reset();
  });

  it('should delay function execution', (t) => {
    const fn = mock.fn();
    const debounced = context.debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    assert.strictEqual(fn.mock.calls.length, 0);

    mock.timers.tick(50);
    assert.strictEqual(fn.mock.calls.length, 0);

    mock.timers.tick(50);
    assert.strictEqual(fn.mock.calls.length, 1);
  });

  it('should pass arguments to the debounced function', (t) => {
    const fn = mock.fn();
    const debounced = context.debounce(fn, 100);

    debounced('arg1', 'arg2');

    mock.timers.tick(100);
    assert.strictEqual(fn.mock.calls.length, 1);
    assert.deepStrictEqual(fn.mock.calls[0].arguments, ['arg1', 'arg2']);
  });

  it('should preserve this context', (t) => {
    const fn = mock.fn();
    const debounced = context.debounce(fn, 100);

    const obj = { method: debounced };
    obj.method('test');

    mock.timers.tick(100);
    assert.strictEqual(fn.mock.calls.length, 1);
    assert.strictEqual(fn.mock.calls[0].this, obj);
  });

  it('should execute multiple times if delayed sufficiently', (t) => {
    const fn = mock.fn();
    const debounced = context.debounce(fn, 100);

    debounced();
    mock.timers.tick(100);
    assert.strictEqual(fn.mock.calls.length, 1);

    debounced();
    mock.timers.tick(100);
    assert.strictEqual(fn.mock.calls.length, 2);
  });
});
