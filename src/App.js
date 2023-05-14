import './logo.svg';
import './App.css';
import React,{useState,useEffect,useMemo, useRef} from 'react';
import { createContext } from 'react';
import { useContext } from 'react';
import { Button,TextField} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { Routes, Route, useNavigate} from "react-router-dom";
import Toolbar from '@mui/material/Toolbar';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import {Table } from 'semantic-ui-react';

const API="https://645eef119d35038e2d1a1aff.mockapi.io/data";
function App(){
  const navigate = useNavigate();
  const[fourDigit,setFourDigit]=useState('');
  const [text,setText]=useState('')
  return(
    <div className='App'>
      
    <AppBar position="static">
      <Toolbar>
      <Button color="inherit" onClick={() => navigate("/")}>HOME</Button>
      <Button color="inherit" onClick={() => navigate("/rules")}>INSTRUCTION</Button>
      <Button color="inherit" onClick={() => navigate("/number")}>GAME</Button>
      <Button color="inherit" onClick={() => navigate("/table")}>LEADERBOARD</Button>

      {/* <Button color="inherit" onClick={() => navigate("/check")}>CHECK</Button> */}
      </Toolbar>
    </AppBar>
    <Routes>
      <Route  path="/" element={<Home />}></Route>
      <Route  path="/number" element={<Number fourDigit={fourDigit} setFourDigit={setFourDigit} text={text} setText={setText}/>}></Route>
      <Route  path="/check" element={<Check fourDigit={fourDigit} text={text}/>}></Route>
      <Route path='/result' element={<Result/>}></Route>
      <Route path='/rules' element={<Rules/>}></Route>
      <Route path='/table' element={<LeaderBoard/>}></Route>

    </Routes>
    </div>
  )
}

function Home(){
  return(
    <div className='home'>

    </div>
  )
}

function Number({fourDigit,setFourDigit,text,setText}){
  // const[fourDigit,setFourDigit]=useState('');
  const navigate = useNavigate();

// Initialize an empty array to store generated numbers
var generatedNumbers = [];

// Function to generate a random four-digit number with unique digits
function generateNumber() {
  var number;
  var isUnique;
  
  do {
    number = Math.floor(1000 + Math.random() * 9000);
    isUnique = hasUniqueDigits(number);
  } while (isDuplicate(number) || !isUnique);
  
  return number;
}

// Function to check if a number already exists in the generatedNumbers array
function isDuplicate(number) {
  return generatedNumbers.includes(number);
}


// Function to check if a number has unique digits
function hasUniqueDigits(number) {
  var digitArray = number.toString().split('');
  return new Set(digitArray).size === digitArray.length;
}

// Function to generate a unique four-digit number for a given name
function generateUniqueNumber(name) {
  var number;
  do {
    number = generateNumber();
  } while (isDuplicate(number));
  
  // Store the generated number in the array
  generatedNumbers.push(number);
  // Return the number along with the name
  return number;

}
// var name=text;
function foo(name){
  var number=generateUniqueNumber(name);
  console.log(number)
  setFourDigit(number)
}
  return(
    <div style={{marginTop:"20px"}}>
      <h1>Generating the Guessing Number</h1>
       <TextField
        label="Enter the Name"
        variant='outlined'
        name="text"
        value={text}
        onChange={(e)=>setText(e.target.value)}
      />
    <Button onClick={()=>foo(text)}>Generate Number</Button>
    <br></br><br></br>
    {/* <p>{fourDigit}</p> */}
    <div className='go_check_bt'><Button  onClick={()=>navigate("/check")}>Go For Check</Button></div>
    {fourDigit>0?(<h1>Number Generated Successfully</h1>):null}
    </div>
  )
}
function Check({fourDigit,text}){
  const[guess,setGuess]=useState('');
  const[show,setShow]=useState(false);
  const[display,setDisplay]=useState("");
  const[count,setCount]=useState(0);
  useEffect(()=>{
    let numSplit=(fourDigit.toString()).split("")
    console.log(numSplit)
  },[fourDigit])
  
  function check(guess,fourDigit){
  let fourNum=fourDigit.toString().split("")//this is Array
  let guessNum=(guess.toString().split(""))//this is Array
  var answer='';
  for(let i=0;i<fourNum.length;i++){
    if(guessNum[i]==fourNum[i])
      answer=answer+ "+"
// guessNum.toString is a method is to convert the Array to String       
      else if(fourNum.toString().includes(guessNum[i]))
      answer=answer+"-"
    else
      answer=answer+"*"
}
setCount(count+1)
setShow(true)
setDisplay(answer)
  // console.log(answer)
  }
  return(
    <div>
      <h1>Guess the Four Digit Number</h1>
      <h1>Chance Used :{count} </h1>
      {/* <p>{fourDigit}</p> */}
      <TextField
        label="Enter gussing number"
        variant='outlined'
        name="guess"
        value={guess}
        onChange={(e)=>setGuess(e.target.value)}
      />
      <Button onClick={()=>check(guess,fourDigit)}>CHECK</Button>
      {show?(<div className='display'><h1>{display}</h1></div>):null}
      <Timer display={display} count={count} text={text}/>
    </div>
  )
}

function Timer({display,count,text}){
  const [running, setRunning] = useState(true);
  const [time, setTime] = useState(0);

  // const [name, setName] = useState([]);
  //   const [seconds, setSeconds] = useState([]);
  //   const [chance, setChance] = useState([]);

const navigate=useNavigate();
  useEffect(() => {
    let interval;

    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running]);

  const startTimer = () => {
    setRunning(true);
  };
  // var i=0;
  function stopTimer(display,time){
    if(display=="++++"){
    setRunning(false);
    localStorage.setItem(`Name`,text)
    localStorage.setItem(`Time`,time)
    localStorage.setItem(`Chance`,count)
    // i=i+1
    }
  };
  function rank(count,time){
    var time_p=time*1
    var chance_p=count*.5
    var overall=Math.floor(time_p+chance_p)
    console.log(overall);
    localStorage.setItem("Rank",overall);
    navigate("/result")
  }

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
  };
  
  return(
    <div>
       <h1>Timer: {formatTime(time)}</h1>
      {/* {!running && (
        <button onClick={startTimer}>Start</button>
      )} */}
      {running && (
        <Button onClick={()=>stopTimer(display,time)}>Stop</Button>
      )}

      <Button onClick={()=>rank(time,count)}>VIEW SCORE</Button>
    </div>
  )
}
const movieValidationShema = yup.object({
  name: yup.string().required(),
 chance: yup.string().required().max(40),
  time: yup.number().required().min(0).max(1000),
  rank: yup.string().required(),
  
})
function Result(){
  const { handleSubmit, values, handleChange, handleBlur, touched, errors } =
    useFormik({
      initialValues: {
        name: localStorage.getItem("Name"),
        chance: localStorage.getItem("Chance"),
        time: localStorage.getItem("Time"),
        rank: localStorage.getItem("Rank")
      },
      validationSchema: movieValidationShema,
      onSubmit: (newMovie) => {
        console.log("Form values:", newMovie);
        addMovie(newMovie);
      },
    });
    const navigate = useNavigate();
    const addMovie = (newMovie) => {
      const CircularJSON = require('circular-json');
      fetch(`${API}`, {
        method: "POST",
        body:CircularJSON.stringify(newMovie),
        headers: { "Content-type": "application/json" }
      })
      .then(() => navigate("/table"))
    };
//   const [name, setName] = useState([]);
//   const [seconds, setSeconds] = useState([]);
//   const [chance, setChance] = useState([]);
//   // var i=0;
 
//  useEffect(()=>{
//   let name=localStorage.getItem(`Name`)
//   console.log(name)
//  let seconds=localStorage.getItem(`Time`)
//   let chance=localStorage.getItem(`Chance`)
//   if (name) {
//     setName(name);
//   }
//   if (seconds) {
//     setSeconds(seconds);
//   }
//   if (chance) {
//     setChance(chance);
//   }
//  },[])
//  const remove=()=>{
//   localStorage.removeItem("Name")
//   localStorage.removeItem("Time")
//   localStorage.removeItem("Chance")

//  }
  return(
    <form onSubmit={handleSubmit} className='add-movie-form'>
     <TextField
        label="name"
        variant='outlined'
        name="name"
        value={values.name}
        onChange={handleChange}onBlur={handleBlur}
      />
      {touched.name && errors.name ? errors.name : null}
      <TextField
        label="chance"
        variant='outlined'
        name="chance"
        value={values.chance}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.chance && errors.chance ? errors.chance : null}

      <TextField
        label="time"
        variant='outlined'
        name="time"
        value={values.time}
        onChange={handleChange}
        onBlur={handleBlur}
      />
       {touched.time && errors.time ? errors.time : null}
      <TextField
        label="rank"
        variant='outlined'
        name="rank"
        value={values.rank}
        onChange={handleChange}onBlur={handleBlur}
      />
    {touched.rank && errors.rank ? errors.rank : null}
   <Button type="submit" variant='contained' onClick={addMovie}>Add Data</Button>
    </form>
  )
}
function LeaderBoard(){
  const navigate=useNavigate();
  const [apiData, setAPIData] = useState([]);
  const callGetAPI = async () => {
    const res = await axios.get(API);
    setAPIData(res.data);
  }
  useEffect(() => {
    callGetAPI();
  }, []);
  return(
    <div >
      <h1>LeaderBoard</h1>
<div className='read'>
<Table singleLine>
        <Table.Header >
          <Table.Row >
          <Table.HeaderCell> No.</Table.HeaderCell>
            <Table.HeaderCell> Name</Table.HeaderCell>
            <Table.HeaderCell>Chance</Table.HeaderCell>
            <Table.HeaderCell>Time(in Seconds)</Table.HeaderCell>
            <Table.HeaderCell>Rank</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            apiData.map(data => (
              <Table.Row key={data.id}>
                 <Table.Cell>{data.id}.</Table.Cell>
                <Table.Cell>{data.name}</Table.Cell>
                <Table.Cell>{data.chance}</Table.Cell>
                <Table.Cell>{data.time}</Table.Cell>
                <Table.Cell>{data.rank}</Table.Cell>
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
      </div>
     <div className='back'>
      <Button  onClick={()=>navigate("/")}>Back</Button>
 </div>
    </div>
  )
}
function Rules(){
  return(
    <div>
      <h1>Game Instructions</h1>
      <p>1.First enter your name and click generate button</p>
      <p>2.Next click Go to Check butoon then the timer will be started</p>
      <p>3.Then type the guessing number and check</p>
      <p>4."+" means the number is correct</p>
      <p>5."" means the number is with in that four number</p>
      <p>6."-" means the number is not in that generate number</p>
      <p>7.when you check "++++" show then guess is correct then only you can stop the timer</p>
      <p>8.Next click view button and add the data to table </p>
      <p>9.the time and chance based your rank can be generated</p>
      <p>10.In Leaderboard you can your rank</p>
    </div>
  )
}
//useRef Hook
//<input type='text' value={text}  placeholder='Enter your name' onChange={(e)=>setText(e.target.value)}></input>
// 1.useRef is a Hook.Its used to store the Mutual values
// 2.and it doesn't cause of rendering.Its used to access the Dom elements directly.
// function App(){
//   const inputRef=useRef("");
//   console.log(inputRef.current.placeholder)
//   return(
//     <div className='App'>
//    <input ref={inputRef} type='text'placeholder='enter the name'></input>
//     </div>
//   )
// }

//Using use Context
// 1.useContext is used for avoid the props drilling and its will increase the performance of the react App.
// const Context= createContext(null);
// function App(){
//   const [name,setName]=useState("");
//   const data="hello"
//   return( 
//     <Context.Provider value={{name,setName,data}}>
//     <div className='App'>
//       <h1>Context API</h1> 
//       <Demo/>
//       <Demo1/>  
//       </div>
//       </Context.Provider> 
//   )
// }
// function Demo(){
//   const {setName}=useContext(Context);
//   return(
//     <div>
//       <input onChange={(e)=>setName(e.target.value)}></input>
//     </div>
//   )
// }
// function Demo1(){
//   const {name,data}=useContext(Context)
//   return(
//     <div>
     
//       <h1> {name.length>2?data:null}  {name}</h1>
//     </div>
//   )
// }


// useMemo using
// 1.useMemo is taking the callback function and value when the value is define the callback function render or not.
// 2.And Its return the Memorized value.it will increace the performance .Only used for the pure functions

// function Test(){
//   const [data1,setData1]=useState(0);
//   const [data2,setData2]=useState(0);
//   const button1=()=>{
//     setData1(data1+1)
//     console.log("button 1 render")
//   }
//   const button2=()=>{
//     setData2(data2+1)
//     console.log("button 2 render")
//   }
// const isEven=useMemo(()=>{
//   let i=0;
//   while(i<1000000000)
//     i++
//   return data1%2===0;
// },[data1])

//   return(
//     <div>
// <h1>Count One: {data1}</h1>
// <span>{isEven?"Even":"odd"}</span><br></br>
// <button onClick={button1}>Button1</button>
// <h1>Count Two: {data2}</h1>
// <button onClick={button2}>Button2</button>
//     </div>
//   )
// }


//Child to parent data passing
// 1.child to parent data pass method is using some kind of application.
// function Parent(){
//   const [text,setText]=useState("hi Guys");
//   function foo(obj){
//     setText(obj);
//   }
//   return(
//     <div>
// <h1>{text}</h1>
// <Child foo={foo}/>
//     </div>
//   )
// }
// function Child({foo}){
//   return(
//     <div>
//       <button onClick={()=>foo("bye Guys")}>Clike Me</button>
//     </div>
//   )
// }


// function App() {
//   const[data,setData]=useState([]);
//   useEffect(()=>{
//    fetch("https://dog.ceo/api/breeds/list/all")
//   .then(data=>data.json())
//   .then(res=>setData(res.message))
//   .catch(err=>console.log(err))
//   },[])
//   const objKeys=Object.keys(data).reduce((accum,val)=>{
//     accum[val.toUpperCase()]=data[val];
//     return accum
//   },{})
//   const result=Object.keys(objKeys)
//   console.log(result);
//   return (
   
//     <div className="App">
//      <h1>HELLO</h1>
//      <Box/>
//      </div>
//   );
// }
// function ColorBox({color}){
//   const styles={
//     height:"40px",
//     width:"100px",
//     margin:"10px",
//     paddingLeft:"200px",
//     marginLeft:"40%",
//     justifyContent:"center",
//     background:color
//   }
//   return(
//     <div style={styles}>

//     </div>
//   )
// }
// function Box(){
//   const[color,setColor]=useState("");
//   const[arr,setArr]=useState(["red","green"])
//   return(
//     <div >
// <h1>hello</h1>
// <div>
// <input type='text' value={color} onChange={(e)=>setColor(e.target.value)} style={{background:color}}></input>
// <button onClick={()=>setArr([...arr,color])}>Add Color</button>
// {arr.map((ele,key)=><ColorBox color={ele} index={key}/>)}
// </div>
//     </div>
//   )
// }

export default App;
