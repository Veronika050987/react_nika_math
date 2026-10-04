import React, { useState, useEffect } from 'react';
import './MathGame.css';

import happy from './img/happy.png';
import unhappy from './img/unhappy.png';

const OPERATORS = {
  addition: '+',
  subtraction: '-',
  multiplication: '×',
  division: '÷'
};

export default function MathGame() {
  // Экран игры: 'menu' или 'game'
  const [screen, setScreen] = useState('menu');
  // Текущий режим: 'addition', 'subtraction', 'multiplication', 'division'
  const [mode, setMode] = useState(null);
  
  // Игровое состояние
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [score, setScore] = useState(0); // Прогресс (от 0 до 10)
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong' или null
  const [showModal, setShowModal] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0); // Всего решенных примеров

  // Генерация нового примера
  const generateQuestion = (currentMode) => {
    setFeedback(null);
    setShowModal(false);

    let n1 = Math.floor(Math.random() * 10); // 0 - 9
    let n2 = Math.floor(Math.random() * 10); // 0 - 9

    if (currentMode === 'subtraction') {
      // Чтобы не было отрицательных ответов для детей
      if (n1 < n2) {
        const temp = n1;
        n1 = n2;
        n2 = temp;
      }
    } else if (currentMode === 'division') {
  // 1. Делитель (на что делим) должен быть от 1 до 9 (на 0 делить нельзя!)
  const divisor = Math.floor(Math.random() * 9) + 1; 
  
  // 2. Частное (наш будущий ответ) тоже должно быть в пределах карточек (от 1 до 10)
  const quotient = Math.floor(Math.random() * 10) + 1; 
  
  // 3. Вычисляем делимое (что делим). Оно гарантированно разделится нацело!
  n1 = divisor * quotient; // Например, 3 * 4 = 12
  n2 = divisor;            // В примере будет: 12 ÷ 3 = 4 (ответ 4 есть на карточках!)
}

    setNum1(n1);
    setNum2(n2);
  };

  // Вычисление правильного ответа
  const getAnswer = () => {
    switch (mode) {
      case 'addition': return num1 + num2;
      case 'subtraction': return num1 - num2;
      case 'multiplication': return num1 * num2;
      case 'division': return num1 / num2;
      default: return 0;
    }
  };

  // Старт игры из меню
  const startMode = (selectedMode) => {
    setMode(selectedMode);
    setScore(0);
    setTotalQuestions(0); // Сбрасываем счётчик при начале новой игры
    setScreen('game');
    generateQuestion(selectedMode);
  };

  // Обработка клика по карточке с ответом
  const handleAnswerClick = (userAnswer) => {
    if (feedback !== null) return; // Защита от повторных кликов до генерации нового примера

    const actualAnswer = getAnswer();
    setTotalQuestions((prev) => prev + 1); // Увеличиваем общее число попыток

    if (userAnswer === actualAnswer) {
      setFeedback('correct');
      setScore((prev) => Math.min(prev + 1, 10));
      // Через 1.5 секунды переходим к следующему вопросу
      setTimeout(() => {
        generateQuestion(mode);
      }, 2300);
    } else {
      setFeedback('wrong');
      setCorrectAnswer(actualAnswer);
      setShowModal(true);
    }
  };

  // Сброс и возврат в меню
  const backToMenu = () => {
    setScreen('menu');
    setMode(null);
    setFeedback(null);
    setShowModal(false);
  };

  // Ограничение диапазона карточек (для сложения/умножения нужно больше 10)
  const maxCardValue = mode === 'multiplication' ? 81 : (mode === 'addition' ? 18 : 10);
  const cards = Array.from({ length: maxCardValue + 1 }, (_, i) => i);

  return (
    <div className='container'>
      {screen === 'menu' ? (
        <div className='menuBox'>
          <h1 className='title'> Математика для детей </h1>
          <p className='subtitle'>Выбери математическое действие:</p>
          <div className='menuButtons'>
            <button onClick={() => startMode('addition')} style={{...styles.btn, ...styles.btnAdd}}>➕ Сложение</button>
            <button onClick={() => startMode('subtraction')} style={{...styles.btn, ...styles.btnSub}}>➖ Вычитание</button>
            <button onClick={() => startMode('multiplication')} style={{...styles.btn, ...styles.btnMul}}>✖ Умножение</button>
            <button onClick={() => startMode('division')} style={{...styles.btn, ...styles.btnDiv}}>➗ Деление</button>
          </div>
        </div>
      ) : (
        <div className='gameBox'>
          <button 
            onClick={backToMenu} 
            onMouseEnter={() => setIsBackHovered(true)}
            onMouseLeave={() => setIsBackHovered(false)}
            style={{
            ...styles.btnBack,
            // Если мышка наведена, меняем цвет фона и немного приподнимаем кнопку
            backgroundColor: isBackHovered ? '#3b82f6' : '#4D96FF', 
            transform: isBackHovered ? 'translateY(-2px)' : 'translateY(0)',
            }}>
          ⬅ В меню
          </button>
          
          {/* Интерактивная шкала прогресса и смайлики */}
          <div className='progressRow'>
            <span style={{
              ...styles.emoji, 
              opacity: feedback === 'wrong' ? 1 : 0.3,
              transform: feedback === 'wrong' ? 'scale(1.3)' : 'scale(1)',
              filter: feedback === 'wrong' ? 'drop-shadow(0 0 10px red)' : 'none'
            }}>
              <img src={unhappy} width={40} height={40} alt='UNHAPPY' loading="lazy" aspectRatio= '1 / 1'/>           
            </span>
            
            <div style={styles.progressBarBg}>
              <div style={{...styles.progressBarFill, width: `${score * 10}%`}} />
            </div>

            <span style={{
              ...styles.emoji, 
              opacity: feedback === 'correct' ? 1 : 0.3,
              transform: feedback === 'correct' ? 'scale(1.3)' : 'scale(1)',
              filter: feedback === 'correct' ? 'drop-shadow(0 0 10px green)' : 'none'
            }}>
               <img src={happy} width={50} height={50} alt='HAPPY' loading="lazy" aspectRatio= '1 / 1'/>           
            </span>
          </div>

          {/* Поле с примером */}
          <div className='equationBox'>
            {num1} {OPERATORS[mode]} {num2} = ?
          </div>

          {/* Сетка карточек-ответов */}
          <div className='cardsGrid'>
            {cards.map((num) => (
              <button 
                key={num} 
                onClick={() => handleAnswerClick(num)} 
                className='cardBtn'
                disabled={feedback !== null}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Модальное окно при ошибке */}
          {showModal && (
            <div className='modalOverlay'>
              <div className='modalContent'>
                <h2 style={{color: '#e74c3c', marginTop: 0}}>Ой, неверно! 
                  <img src={unhappy} width={40} height={40} alt='UNHAPPY' loading="lazy" aspectRatio= '1 / 1'/>
                  </h2>
                <p className='modalText'>Правильный ответ:</p>
                <div className='correctBadge'>{correctAnswer}</div>
                <button 
                  onClick={() => generateQuestion(mode)} 
                  style={styles.btnNext}
                >
                  <span>Дальше</span> 
                </button>
              </div>
            </div>
          )}

          {/* Поздравление при победе (10 очков) */}
          {score === 10 && (
            <div className='modalOverlay'>
              <div className='modalContent'>
                <h2 style={{color: '#4D96FF', marginTop: 0}}>Игра завершена!</h2>
                <div style={{ margin: '20px 0' }}>
                  <p style={styles.modalText}>Твой результат:</p>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: '#2ecc71',
                    margin: '10px 0'
                    }}>
                    {score} из {totalQuestions}
                  </div>
            <p style={{ ...styles.modalText, fontSize: '1rem', color: '#7f8c8d' }}>
            (Правильных ответов / Всего попыток)
            </p>
            </div>
                <button onClick={backToMenu} style={styles.btnNext}>Отлично!</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Стили приложения
const styles = {
  
  btn: {
    padding: '16px 20px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    color: '#fff',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  
  btnAdd: { backgroundColor: '#FF6B6B' },
  btnSub: { backgroundColor: '#4D96FF' },
  btnMul: { backgroundColor: '#6BCB77' },
  btnDiv: { backgroundColor: '#FFD93D', color: '#2c3e50' },
  
  btnBack: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#4D96FF',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  
  emoji: {
    fontSize: '2.5rem',
    transition: 'all 0.3s ease',
    userSelect: 'none',
  },
  progressBarBg: {
    flex: 1,
    height: '20px',
    backgroundColor: '#e0e6ed',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2ecc71',
    transition: 'width 0.4s ease-out',
  },
  
btnNext: {
display: 'inline-flex',
alignItems: 'center',
justifyContent: 'center',
gap: '12px',
padding: '10px 24px',
fontSize: '1.2rem',
backgroundColor: '#4D96FF',
color: '#fff',
border: 'none',
borderRadius: '12px',
cursor: 'pointer',
fontWeight: 'bold',
}
};