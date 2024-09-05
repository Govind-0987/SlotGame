import React, { useState, useEffect } from 'react';
import Slot from './Slot';
import Sidebar from './Sidebar';
import { useUser } from './UserContext';

const SlotMachine = ({ updateBalance, balance }) => {
  const { user } = useUser();
  const [slots, setSlots] = useState(['🧋', '🍹', '🍰', ]);
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState([false, false, false]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (result === 'You Win!') {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const spinSlots = () => {
    setIsSpinning(true);
    updateBalance(-2);

    const slotItems = ['🍡', '🧋', '🧁', '🍹', '🍰', '🍭'];
    const newSlots = [];

    for (let i = 0; i < 3; i++) {
      newSlots.push(slotItems[Math.floor(Math.random() * slotItems.length)]);
    }

    const stopSlot = (index) => {
      setTimeout(() => {
        setSlots((prevSlots) => {
          const updatedSlots = [...prevSlots];
          updatedSlots[index] = newSlots[index];
          return updatedSlots;
        });
        setSpinning((prevSpinning) => {
          const updatedSpinning = [...prevSpinning];
          updatedSpinning[index] = false;
          return updatedSpinning;
        });

        if (index === 2) {
          if (newSlots.every((slot) => slot === newSlots[0])) {
            setResult('You Win!');
            updateBalance(30);
          } else {
            setResult('Try Again!');
          }
          setIsSpinning(false);
        }
      }, (index + 1) * (5000 / 3));
    };

    setSpinning([true, true, true]);
    stopSlot(0);
    stopSlot(1);
    stopSlot(2);
  };

  return (
    <div className="slot-machine-container">
      <div className="row grdyntbg">
        <div className="col-md-3">
          <Sidebar balance={balance} user={user} />
        </div>
        <div className="col-md-9 pt-5">
          <div className="slot-machine pt-5">
            <h4 className='mb-4'>Welcome to Slot game</h4>
            <div className="slots">
              {slots.map((slot, index) => (
                <Slot key={index} symbol={slot} spinning={spinning[index]} />
              ))}
            </div>
            <div className="playbg">
              <button
                onClick={spinSlots}
                className="spin-button"
                disabled={isSpinning}
              >
                ▶
              </button>
            </div>
            {result && <div className={`result ${result === 'You Win!' ? 'win' : ''}`}>{result}</div>}
            {showConfetti && <div className="confetti-ball">🎉</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;
