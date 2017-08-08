

export const selectedClass = f => x => f(x) ? " selected" : "";
//export const and = (f, g) => x => f(x) && g(x);
export const combineEvery = fs => x => fs.every(f => f(x));

//export selected;

