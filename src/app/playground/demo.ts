export const greet =  ( name: string )=> {

    return `您好,${name}`;

};

const greeting = greet('孙一');
console.log( greeting );