// warming up with js syntax

// variables; rule of thumb: default to const, use let when you need to reassign.
const name = 'Bob'; // can't reassign
let count = 0; // can reassign
count = 1;

// primitives & printing
const s = 'clarity.' // string
const n = 67; // number (no int/float distinction)
const b = true; // boolean (lowercase syntax)
const nothing = null; // intentionally empty
const missing = undefined; // not set

console.log(s,n,b); // print to terminal
console.log(`I have ${s}`); // backticks for interpolation! ` not '

// arrays
const nums = [1,2,3];
nums.push(4); // mutates; [1,2,3,4]
nums.length;
nums[0];
nums[nums.length-1];
const more = [...nums, 5,6,7] // this is a spread; copy. + add (does not mutate)
console.log(nums)
console.log(more)

// objects
const habits = { name: 'water', done: false};
habits.name; // 'water'
habits['name']; // same as above
habits.done = true; // mutate a property; const locks the binding, not the contents!
const updated = {...habits,done: true}; // new object, done overriden
console.log(habits,updated);

// three ways to write functions
function add(a,b) {
    return a + b;
}
const add2 = (a,b) => {
    return a + b;
};
const add3 = (a,b) => a +b; // implicit return when no braces

// conditionals
if (count === 0) { /// === is strict equality; == does weird type coercion like '1' == 1 is true for some reason
    console.log('zero');
} else if (count < 3) {
    console.log('small');
} else {
    console.log('big');
}

// array methods (the big four)
const habitsz = [
    {name: 'water', done: true},
    {name: 'run', done: false},
    {name: 'read',done: true},
];

// filter: keep elements where fn returns true
const done = habitsz.filter(h => h.done);
// [{name:'water',done:true},{name:'read',done:true}]

// map: transform each element
const names = habitsz.map(h => h.name);
// ['water','run','read']

// find: first element where fn (function) returns true, or undefined
const water = habitsz.find(h => h.name === 'water');
// {name:'water',done:true}

// forEach: just run a function on each, no return
habitsz.forEach(h => console.log(h.name));

// chaining
const doneNames = habitsz.filter(h => h.done).map(h => h.name);
// ['water','read]
// h => h.done is a function passed as an arg...

// destructuring (shortcut for pulling fields out)
const habiti =  {namez: 'water', donez: true};
const {namez, donez} = habiti;
// name === 'water', done === true
const arr = [10,20,30];
const [first, second] = arr;
// first === 10, second === 20

// async/await; some operations are slow (reading a file, network call),
// so they return a promise (placeholder for a future value)
import fs from 'node:fs/promises';
// w/out await: u get the promise object, not the contents

const promise = fs.readFile('habits.json','utf-8');

console.log(promise); // Promise { <pending> } (u don't want ts)

// with await: waits for it, gives u the actual string
const contents = await fs.readFile('habits.json','utf-8');
console.log(contents); // '[{"name":"water"}]'
// await is only for async function (but also bun allows top level of a module)

// uhh async function always returns a promise? even if i return 69?
async function loadNumber() {
    const text = await fs.readFile('habits.json','utf-8');
    const habibi = JSON.parse(text);
    return habibi;
}
const habibi = await loadNumber();
console.log(habibi)
// if i forget await; text is a promise, not a str... JSON.parse(Promise) blows up;
// don't forget await gng

// JSON
const obj = {food: 'pizza', done: true};
const str = JSON.stringify(obj); // '{"name":"water","done":true}'
const back = JSON.parse(str); // {name:'water',done:true}
// stringify = object to string (haha like spotify but stringify)
// parse = string -> object
// will need ts when i read/write habits.json...

// In utils.js:
// export function add(a,b) {return a *b};
// export const PI = 3.14;
// in other file:
import { addts,PI} from './utils.js'
console.log(addts(6,7));
console.log(PI);
// Make sure ur package.json has "type": "module" so import/export works. (bun init does this for you.)

// map, Promise, await recap

// map basically transforms each element via function and returns
// new array of the same length
const lol = [6,7,8,9].map(n => n**2); // [36,49,64,81], same length transformed
console.log(lol) //runs function on every element & collects the results

// filter shrinks (keeps some), map transforms (keeps all, changes each)

// from discrete: filter returns a subset; map returns same count, reshaped.

const receipt = fs.readFile('utils.json'); // Promise (the receipt)
const meal = await fs.readFile('utils.json'); // string (the actual contents)

