const habits = [
    {name: 'water',done:true},
    {name: 'run', done: false},
    {name: 'read',done:true}
];

function sumArray(nums){
    let sum = 0;
    for (let i = 0; i < nums.length; i++) { // arrays are zero-indexed;
        // length is 3, nums[3] is undefined, and < 3 is 2, which
        // nums[2] is last index. perfectly zero-indexed.
        sum+=nums[i];
    }
    return sum;
}
console.log(sumArray([1,2,3]));

// const getCompletedHabitNames = habits.filter(h => h.done).map(h => h.name);

function getCompletedHabitNames(params){
    return params.filter(x=>x.done).map(x=>x.name);
}

console.log(getCompletedHabitNames(habits));

function addHabit(args){
    return ([...habits,args]);
}
console.log(addHabit({name: 'fly',done:false}));
console.log(habits); // nothing changed

console.log(' - - - ')

// this way is more optimal since prev. used global habits array instead
// of taking it as a param. works, but its tied to one specific array.

function findHabit(habitArrType, name){
    return habitArrType.find(h=>h.name === name);
}
console.log(findHabit(habits,'water'));
console.log(findHabit(habits,'drink')); // undefined

// if i want smth else instead of it returning 'undefined', i do one of these

// option 1) nullish coalescing (return a default or smth)

function findHabibi(arr,name){
    return arr.find(h=>h.name === name) ?? null;
}

console.log(' - - - ');

// option 2) explicit fallback

function findHabibi(arr,name){
    const found = arr.find(h=>h.name ===name);
    if (!found){
        return {name,done: false, missing: true}; // sentinel
    }
    return found;
}

console.log('no-undefined',findHabibi(habits,'push-ups')); // undefined
