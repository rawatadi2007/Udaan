import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Calculator, Star, Clock, Trophy } from 'lucide-react';

const GameContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
  background: rgba(255, 255, 255, 0.95);
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
`;

const GameHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const GameTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ScoreBoard = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  align-items: center;
`;

const ScoreItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const QuestionContainer = styled.div`
  text-align: center;
  margin: ${props => props.theme.spacing['2xl']} 0;
`;

const Question = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const AnswerInput = styled.input`
  width: 200px;
  padding: ${props => props.theme.spacing.md};
  font-size: 1.5rem;
  text-align: center;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  margin: 0 ${props => props.theme.spacing.md};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Feedback = styled.div`
  text-align: center;
  margin: ${props => props.theme.spacing.lg} 0;
  font-size: 1.2rem;
  font-weight: 500;
  color: ${props => props.correct ? props.theme.colors.success : props.theme.colors.error};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 4px;
  overflow: hidden;
  margin: ${props => props.theme.spacing.lg} 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.gradients.primary};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const MathAdventure = ({ onGameComplete, onScoreUpdate }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState([]);

  const generateQuestions = () => {
    const newQuestions = [];
    for (let i = 0; i < 10; i++) {
      const num1 = Math.floor(Math.random() * 20) + 1;
      const num2 = Math.floor(Math.random() * 20) + 1;
      const operation = ['+', '-', '*'][Math.floor(Math.random() * 3)];
      
      let question, answer;
      switch (operation) {
        case '+':
          question = `${num1} + ${num2}`;
          answer = num1 + num2;
          break;
        case '-':
          question = `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`;
          answer = Math.max(num1, num2) - Math.min(num1, num2);
          break;
        case '*':
          question = `${num1} × ${num2}`;
          answer = num1 * num2;
          break;
        default:
          question = `${num1} + ${num2}`;
          answer = num1 + num2;
      }
      
      newQuestions.push({ question, answer });
    }
    return newQuestions;
  };

  useEffect(() => {
    setQuestions(generateQuestions());
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [timeLeft, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(45);
    setCurrentQuestion(0);
    setScore(0);
    setAnswer('');
    setFeedback('');
  };

  const handleTimeUp = () => {
    setGameStarted(false);
    onGameComplete(score);
  };

  const handleSubmit = () => {
    const userAnswer = parseInt(answer);
    const correctAnswer = questions[currentQuestion].answer;
    
    if (userAnswer === correctAnswer) {
      setScore(score + 10);
      setFeedback('Correct! 🎉');
      onScoreUpdate(score + 10);
    } else {
      setFeedback(`Wrong! The answer is ${correctAnswer}`);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswer('');
        setFeedback('');
      } else {
        setGameStarted(false);
        onGameComplete(score + (userAnswer === correctAnswer ? 10 : 0));
      }
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && answer.trim() !== '') {
      handleSubmit();
    }
  };

  if (!gameStarted) {
    return (
      <GameContainer>
        <GameHeader>
          <GameTitle>
            <Calculator size={24} />
            Math Adventure
          </GameTitle>
        </GameHeader>
        
        <QuestionContainer>
          <h3>Welcome to Math Adventure!</h3>
          <p>Solve 10 math problems as quickly as you can!</p>
          <p>You have 45 seconds per question.</p>
          <Button onClick={startGame}>Start Adventure</Button>
        </QuestionContainer>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>
          <Calculator size={24} />
          Math Adventure
        </GameTitle>
        <ScoreBoard>
          <ScoreItem>
            <Star size={16} />
            {score} points
          </ScoreItem>
          <ScoreItem>
            <Clock size={16} />
            {timeLeft}s
          </ScoreItem>
          <ScoreItem>
            <Trophy size={16} />
            {currentQuestion + 1}/10
          </ScoreItem>
        </ScoreBoard>
      </GameHeader>

      <ProgressBar>
        <ProgressFill progress={((currentQuestion + 1) / questions.length) * 100} />
      </ProgressBar>

      <QuestionContainer>
        <Question>{questions[currentQuestion]?.question}</Question>
        <div>
          <AnswerInput
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Your answer"
            autoFocus
          />
          <Button onClick={handleSubmit} disabled={answer.trim() === ''}>
            Submit
          </Button>
        </div>
        {feedback && <Feedback correct={feedback.includes('Correct')}>{feedback}</Feedback>}
      </QuestionContainer>
    </GameContainer>
  );
};

export default MathAdventure;
