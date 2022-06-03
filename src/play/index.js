
const getTemp = () =>{

	return false;
}

const drive = () =>{

	const temp = getTemp();
		
        if(!temp ){

          throw new Error('没油了');  //程序终止
        }

      console.log('正常行驶');

};



try {
     drive();
} catch(error) {
    console.log(error.message);    //error对象的message属性
}