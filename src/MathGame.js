import React, { useState, useEffect } from 'react';

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
      // Исключаем деление на 0 и делаем деление нацело
      if (n2 === 0) n2 = 1;
      // Генерируем частное и находим делимое
      const quotient = Math.floor(Math.random() * 10);
      n1 = quotient * n2; 
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
    setScreen('game');
    generateQuestion(selectedMode);
  };

  // Обработка клика по карточке с ответом
  const handleAnswerClick = (userAnswer) => {
    if (feedback !== null) return; // Защита от повторных кликов до генерации нового примера

    const actualAnswer = getAnswer();

    if (userAnswer === actualAnswer) {
      setFeedback('correct');
      setScore((prev) => Math.min(prev + 1, 10));
      // Через 1.5 секунды переходим к следующему вопросу
      setTimeout(() => {
        generateQuestion(mode);
      }, 1500);
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
    <div style={styles.container}>
      {screen === 'menu' ? (
        <div style={styles.menuBox}>
          <h1 style={styles.title}> Математика для детей </h1>
          <p style={styles.subtitle}>Выбери математическое действие:</p>
          <div style={styles.menuButtons}>
            <button onClick={() => startMode('addition')} style={{...styles.btn, ...styles.btnAdd}}>➕ Сложение</button>
            <button onClick={() => startMode('subtraction')} style={{...styles.btn, ...styles.btnSub}}>➖ Вычитание</button>
            <button onClick={() => startMode('multiplication')} style={{...styles.btn, ...styles.btnMul}}>✖ Умножение</button>
            <button onClick={() => startMode('division')} style={{...styles.btn, ...styles.btnDiv}}>➗ Деление</button>
          </div>
        </div>
      ) : (
        <div style={styles.gameBox}>
          <button onClick={backToMenu} style={styles.btnBack}>⬅ В меню</button>
          
          {/* Интерактивная шкала прогресса и смайлики */}
          <div style={styles.progressRow}>
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
          <div style={styles.equationBox}>
            {num1} {OPERATORS[mode]} {num2} = ?
          </div>

          {/* Сетка карточек-ответов */}
          <div style={styles.cardsGrid}>
            {cards.map((num) => (
              <button 
                key={num} 
                onClick={() => handleAnswerClick(num)} 
                style={styles.cardBtn}
                disabled={feedback !== null}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Модальное окно при ошибке */}
          {showModal && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <h2 style={{color: '#e74c3c', marginTop: 0}}>Ой, неверно! 
                  <img src={unhappy} width={40} height={40} alt='UNHAPPY' loading="lazy" aspectRatio= '1 / 1'/>
                  </h2>
                <p style={styles.modalText}>Правильный ответ:</p>
                <div style={styles.correctBadge}>{correctAnswer}</div>
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
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <h2 style={{color: '#2ecc71', marginTop: 0}}>🎉 Победа! 🎉</h2>
                <p style={styles.modalText}>Ты отлично справился со всеми заданиями!</p>
                <button onClick={backToMenu} style={styles.btnNext}>Ура!</button>
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
  container: {
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    padding: '20px',
    boxSizing: 'border-box',
  },
  menuBox: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '1.1rem',
    marginBottom: '30px',
  },
  menuButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
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
  gameBox: {
    position: 'relative',
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    maxWidth: '650px',
    width: '100%',
    textAlign: 'center',
  },
  btnBack: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#eee',
    cursor: 'pointer',
    fontWeight: '600',
  },
  progressRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '40px',
    marginBottom: '30px',
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
  equationBox: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: '30px 0',
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '16px',
    border: '2px dashed #e2e8f0',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
    gap: '12px',
    marginTop: '20px',
  },
  cardBtn: {
    aspectRatio: '1',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    backgroundColor: '#fff',
    border: '3px solid #cbd5e1',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
    color: '#334155',
    boxShadow: '0 4px 0 #cbd5e1',
    outline: 'none',
    ':active': {
      transform: 'translateY(4px)',
      boxShadow: 'none',
    }
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '24px',
    zIndex: 10,
  },
  modalContent: {
    textAlign: 'center',
    padding: '20px',
  },
  modalText: {
    fontSize: '1.2rem',
    color: '#64748b',
    margin: '5px 0',
  },
  correctBadge: {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#2ecc71',
    margin: '15px 0',
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