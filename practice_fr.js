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

function findHabit(param){
    habits.find(h => h.name === param); // if not there,
    // what can i do to return smth else instead of undefined
}
console.log(findHabit('drink'));
