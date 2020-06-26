import React, { useState, useRef, createRef, KeyboardEvent, ClipboardEvent, FocusEvent } from 'react';

export function App() {
  const [code, setCode] = useState<string>();
  const [splittedCode, setSplittedCode] = useState<string[]>([]);

  const numberOfInputs = [1, 2, 3, 4, 5];
  const inputsRef = useRef(numberOfInputs.map(() => createRef() as React.MutableRefObject<HTMLInputElement>));

  const handleChange = (options: { event: React.ChangeEvent<HTMLInputElement>; currentIndex: number }) => {
    const value = options.event.target.value;
    const currentIndex = options.currentIndex;
    const newCode = splittedCode;
    splittedCode[currentIndex] = value;
    setSplittedCode(newCode);
  };

  const handlePaste = (options: { event: ClipboardEvent<HTMLInputElement> }) => {
    const clipboardData = options.event.clipboardData.getData('Text');
    const splittedClipboardData = clipboardData.split('');
    inputsRef.current.forEach((input, index) => {
      input.current.value = splittedClipboardData[index];
      input.current.blur();
    });
    const newCode = splittedClipboardData.slice(0, numberOfInputs.length);
    setSplittedCode(newCode);
  };

  const handleKeyUp = (options: { event: KeyboardEvent<HTMLInputElement>; currentIndex: number }) => {
    const event = options.event;
    const currentIndex = options.currentIndex;
    const value = event.currentTarget.value;
    const nextInput = inputsRef.current[currentIndex + 1]?.current;
    const prevInput = inputsRef.current[currentIndex - 1]?.current;

    if (event.keyCode === 8) {
      if (!prevInput) return;
      prevInput.focus();
      return;
    }
    if (!value) return;
    if (!nextInput) return;
    nextInput.focus();
  };

  const handleFocus = (options: { event: FocusEvent<HTMLInputElement> }) => {
    return options.event.target.select();
  };

  const handleVerifyCode = () => {
    const code = splittedCode.join('');
    setCode(code);
  };

  return (
    <div className='app'>
      <div className='container'>
        <h1>Dynamic input code!</h1>
        <p className='white'>Paste/Write your code</p>
        {code && <p className='white'>Your code is: {code}</p>}
        <div className='input-numbers'>
          <div className='input'>
            {numberOfInputs.map((_input, currentIndex) => (
              <input
                type='text'
                placeholder=' '
                maxLength={1}
                onChange={event => handleChange({ event, currentIndex })}
                onPaste={event => handlePaste({ event })}
                onKeyUp={event => handleKeyUp({ event, currentIndex })}
                onFocus={event => handleFocus({ event })}
                ref={inputsRef.current[currentIndex]}
                key={currentIndex}
              />
            ))}
          </div>
          <button className='priv-btn' onClick={handleVerifyCode}>
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
