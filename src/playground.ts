//制造一个promise
const nature = () =>{

    console.log('正常执行1' );

    //制造一个promise 2个回调函数，成功执行 resolve 失败执行reject
    return new Promise( ( resolve,reject ) => {

        setTimeout( () => {

            resolve('承诺达成，会看到我3');

        },2000);
      

    });   
};


//承诺达成执行 写法简化前
// nature().then(data =>{

//     console.log(data);

// });

//承诺达成执行 写法简化
const demo = async() => {

    const data = await nature();
    console.log(data);
}

demo();

console.log('正常执行2');



//回调函数模式模拟
// const temp = callback => {  //可以传入匿名函数，只有参数

//     const name = '测试的sunyi';  //其他函数自己的属性
    
//     callback(name);  //回调函数访问其他函数的属性

// };


// temp( tempname =>{   //可以传入匿名函数，只有参数
  
//     console.log(tempname);


// } );

 