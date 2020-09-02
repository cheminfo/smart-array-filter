"use strict";

import { filter } from "..";

var test = [
  {
    a: "a",
    b: "b",
    c: ["pppcpp", "D"],
    d: {
      e: 123,
      f: {
        g: ["h"],
      },
    },
    neg: -3.5,
    spec: "[]",
    bool: true,
  },
  {
    h: "h",
    i: ["jkl"],
    m: {
      n: {
        O: "OoO",
      },
      bool: true,
    },
  },
];

describe("filter", () => {
  it("no keywords: filter nothing", () => {
    assert(undefined, 2);
    assert({ keywords: null }, 2);
  });

  it("1 keyword, OR", () => {
    assert({ keywords: ["a"], predicate: "OR" }, 1);
    assert({ keywords: ["C"], predicate: "OR" }, 1);
    assert({ keywords: ["d"], predicate: "OR" }, 1);
    assert({ keywords: ["oo"], predicate: "OR" }, 1);
    assert({ keywords: ["123"], predicate: "OR" }, 1);
    assert({ keywords: ["h"], predicate: "OR" }, 2);
    assert({ keywords: ["z"], predicate: "OR" }, 0);
  });

  it("1 keyword, AND", () => {
    assert({ keywords: ["a"] }, 1);
    assert({ keywords: ["a"], predicate: "AND" }, 1);
    assert({ keywords: ["c"], predicate: "AND" }, 1);
    assert({ keywords: ["d"], predicate: "AND" }, 1);
    assert({ keywords: ["123"], predicate: "AND" }, 1);
    assert({ keywords: ["h"], predicate: "AND" }, 2);
    assert({ keywords: ["z"], predicate: "AND" }, 0);
  });

  it("2 keywords, OR", () => {
    assert({ keywords: ["a", "b"], predicate: "OR" }, 1);
    assert({ keywords: ["c", "123"], predicate: "OR" }, 1);
    assert({ keywords: ["d", "x"], predicate: "OR" }, 1);
    assert({ keywords: ["x", "123"], predicate: "OR" }, 1);
    assert({ keywords: ["x", "y"], predicate: "OR" }, 0);
  });

  it("2 keywords, AND", () => {
    assert({ keywords: ["a", "b"] }, 1);
    assert({ keywords: ["a", "b"], predicate: "AND" }, 1);
    assert({ keywords: ["c", "123"], predicate: "AND" }, 1);
    assert({ keywords: ["d", "x"], predicate: "AND" }, 0);
    assert({ keywords: ["x", "123"], predicate: "AND" }, 0);
    assert({ keywords: ["x", "y"], predicate: "AND" }, 0);
  });

  it("case sensitive", () => {
    assert({ keywords: ["kl", "oO"], caseSensitive: true }, 1);
    assert({ keywords: ["kl", "oo"], caseSensitive: true }, 0);
  });

  it("exclusion", () => {
    assert({ keywords: ["-a"] }, 1);
    assert({ keywords: ["-h"] }, 0);
    assert({ keywords: ["-oo"] }, 1);
    assert({ keywords: ["-xzfe"] }, 2);
  });

  it("with property name", () => {
    assert({ keywords: ["a:a"] }, 1);
    assert({ keywords: ["A:a"] }, 0);
    assert({ keywords: ["a:A"] }, 1);
    assert({ keywords: ["a:b"] }, 0);
    assert({ keywords: ["e:123"] }, 1);
  });

  it("exact word", () => {
    assert({ keywords: "oo" }, 1);
    assert({ keywords: "=oo" }, 0);
    assert({ keywords: "a:=a" }, 1);
    assert({ keywords: "a:=b" }, 0);
    assert({ keywords: "=b" }, 1);
  });

  it("complex", () => {
    assert({ keywords: "a:a -x:aoe, e:123;  -o:bae   " }, 1);
    assert({ keywords: ["a:a", "-x:aoe", "e:123", "-o:bae"] }, 1);
  });

  it("array of primitives", () => {
    assert({ keywords: ["pcp"] }, 1);
    assert({ keywords: ["c:D"] }, 1);
    expect(filter([1, 2, 3], { keywords: ["1"] })).toEqual([1]);
    expect(filter([1, 2, 3], { keywords: [">1"] })).toEqual([2, 3]);
    expect(filter(["test", "Hello"], { keywords: ["es"] })).toEqual(["test"]);
    expect(filter(["test", "Hello"], { keywords: ["hell"] })).toEqual([
      "Hello",
    ]);
    expect(
      filter(["test", "Hello"], {
        keywords: ["hell"],
        caseSensitive: true,
      })
    ).toEqual([]);
  });

  it("is", () => {
    assert({ keywords: ["is:bool"] }, 2);
    assert({ keywords: ["is:other"] }, 0);
    assert({ keywords: ["is:a"] }, 1);
    assert({ keywords: ["is:c"] }, 0);
  });

  it("math operators", () => {
    assert({ keywords: ["e:123"] }, 1);
    assert({ keywords: ["e:125"] }, 0);
    assert({ keywords: ["e:=123"] }, 1);
    assert({ keywords: ["e:=125"] }, 0);

    assert({ keywords: ["e:<123"] }, 0);
    assert({ keywords: ["e:<200"] }, 1);
    assert({ keywords: ["e:<100"] }, 0);

    assert({ keywords: ["e:<=123"] }, 1);
    assert({ keywords: ["e:<=200"] }, 1);
    assert({ keywords: ["e:<=100"] }, 0);

    assert({ keywords: ["e:>125"] }, 0);
    assert({ keywords: ["e:>123"] }, 0);
    assert({ keywords: ["e:>120"] }, 1);

    assert({ keywords: ["e:>=123"] }, 1);
    assert({ keywords: ["e:>=120"] }, 1);
    assert({ keywords: ["e:>=125"] }, 0);

    assert({ keywords: ["e:..100"] }, 0);
    assert({ keywords: ["e:..123"] }, 1);
    assert({ keywords: ["e:..200"] }, 1);

    assert({ keywords: ["e:200.."] }, 0);
    assert({ keywords: ["e:123.."] }, 1);
    assert({ keywords: ["e:100.."] }, 1);

    assert({ keywords: ["e:100..150"] }, 1);
    assert({ keywords: ["e:150..200"] }, 0);
    assert({ keywords: ["e:10..20"] }, 0);
    assert({ keywords: ["e:20..10"] }, 0);
    assert({ keywords: ["e:150..100"] }, 0);
  });

  it("special characters", () => {
    assert({ keywords: ["."] }, 0);
    assert({ keywords: ["[]"] }, 1);
  });

  it("numbers", () => {
    assert({ keywords: ["(-3.5)"] }, 1);
    assert({ keywords: ["4"] }, 0);
    assert({ keywords: ["54.6"] }, 0);
    assert({ keywords: ["(-54.6)"] }, 0);
  });

  it("index", () => {
    var result = filter(test, { keywords: ["a:a"], index: true });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(0);

    result = filter(test, { keywords: ["is:bool"], index: true });
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(1);
  });

  it("strict number parser", () => {
    assert({ keywords: ["123"] }, 1);
    assert({ keywords: ["a123"] }, 0);
    assert({ keywords: ["a123b"] }, 0);
    assert({ keywords: ["123b"] }, 0);
  });
});

function assert(options, length) {
  expect(filter(test, options)).toHaveLength(length);
}