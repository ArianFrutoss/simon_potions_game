import { useState, useEffect, useRef } from 'react'
import useSound from 'use-sound';
import simon from './assets/sounds/sprite.mp3';
import './index.css';
import './App.css';

import yellowImage from './assets/imgs/yellow_potion.png';
import blueImage from './assets/imgs/blue_potion.png';
import redImage from './assets/imgs/red_potion.png';
import greenImage from './assets/imgs/green_potion.png';

function App() {
  
  const blueRef = useRef(null);
  const yellowRef = useRef(null);
  const greenRef = useRef(null);
  const redRef = useRef(null);

  const [play] = useSound(simon, {

    sprite: {

      one: [0, 500],
      two: [1000, 500],
      three: [2000, 500],
      four: [3000, 500],
      error: [4000, 1000],
    }
  })

  const colors = [

    {
      image: redImage,
      ref: redRef,
      sound: 'three',
    },
    {
      image: yellowImage,
      ref: yellowRef,
      sound: 'one',
    },
    {
      image: blueImage,
      ref: blueRef,
      sound: 'two',
    },
    {
      image: greenImage,
      ref: greenRef,
      sound: 'four',
    },
  ]

  const minNumber = 0;
  const maxNumber = 3;
  const speedGame = 300;

  const [sequence, setSequence] = useState([]);
  console.log(sequence);
  const [currentGame, setCurrentGame] = useState([]);
  console.log(currentGame);
  const [isAllowedToPlay, setIsAllowedToPlay] = useState(false);
  console.log(isAllowedToPlay);
  const [speed, setSpeed] = useState(speedGame);
  console.log(speed);
  const [turn, setTurn] = useState(0);
  console.log(turn);
  const [pulses, setPulses] = useState(0);
  console.log(pulses);
  const [success, setSuccess] = useState(0);
  console.log(success);
  const [isGameOn, setIsGameOn] = useState(false);
  console.log(isGameOn);

  const initGame = () => {

    setTimeout(() => {

      randomNumber();
    }, 1000)

    setIsGameOn(true);
  }
  
  const randomNumber = () => {
  
    setIsAllowedToPlay(false);
    const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
    setSequence([...sequence, randomNumber]);
    setTurn(turn + 1);
  }
  
  const handleClick = (index) => {
  
    if (isAllowedToPlay){
  
      play({id: colors[index].sound})
      colors[index].ref.current.style.opacity = (1);
      colors[index].ref.current.style.scale = (1);
  
      setTimeout(() => {
  
        colors[index].ref.current.style.opacity = (0);
        colors[index].ref.current.style.scale = (1);
        setCurrentGame([...currentGame, index]);
        setPulses(pulses + 1);
      },
  
      speed / 2)
    }
  }
  
  useEffect(() => {
  
    if(pulses > 0){
  
      if (Number(sequence[pulses - 1]) === Number(currentGame[pulses - 1])){
  
        setSuccess(success + 1);
      }
  
      else{
  
        const index = sequence[pulses - 1];
  
        if (index) colors[index].ref.current.style.opacity = (0);
        play({id: 'error'});
        setTimeout(() => {
  
          if (index) colors[index].ref.current.style.opacity = (0);
          setIsGameOn(false);
        }, speed * 2)
  
      setIsAllowedToPlay(false);
      }
    }
  }, [pulses])
  
  useEffect(() => {
  
    if (!isGameOn) {
      
      setSequence([]);
      setCurrentGame([]);
      setIsAllowedToPlay(false);
      setSpeed(speedGame);
      setSuccess(0);
      setPulses(0);
      setTurn(0);
    }
  }, [isGameOn])
  
  useEffect(() => {
  
    if (success === sequence.length && success > 0){
  
      setSpeed(speed - sequence.length * 2);
      setTimeout(() => {
  
        setSuccess(0);
        setPulses(0);
        setCurrentGame([]);
        randomNumber();
      }, 500)
    }
  }, [success])
  
  useEffect(() => {
  
    if(!isAllowedToPlay){
  
      sequence.map((item, index) => {
        
        if (colors[item] != null){

          setTimeout(() => {
  
            play({id: colors[item].sound});
            colors[item].ref.current.style.opacity = (1);
    
            setTimeout(() => {
    
              colors[item].ref.current.style.opacity = (0);
            }, speed / 2)
          }, speed * index)
        }
      })
    }
    setIsAllowedToPlay(true);
  }, [sequence])

  return (
    <>
      {
      isGameOn
      ?
      <>
      <div className='header'>
        <h1>Turn {turn}</h1>
      </div>
      <div className='container'>

        {colors.map((item, index) => {

          return (
            <div 
              key={index}
              ref={item.ref}
              className={`pad pad-${index}`}
              style={{ opacity: 0 }}
              onClick={() => handleClick(index)}
            >
              <img src={item.image} alt={`color-${index}`}/>
            </div>
          )
        })}
      </div>
    </>
  :
    <>
      <div className='header'>
        <h1>SUPER SIMON</h1>
      </div>
      <button onClick={initGame}>START</button>
    </>
  }
  </>
  )
}

export default App;
