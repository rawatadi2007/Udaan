import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Microscope, Star, Clock, Trophy } from 'lucide-react';

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

const ExperimentContainer = styled.div`
  text-align: center;
  margin: ${props => props.theme.spacing['2xl']} 0;
`;

const Question = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.lg} 0;
`;

const OptionButton = styled.button`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.backgroundSecondary};
  color: ${props => props.selected ? 'white' : props.theme.colors.text};
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
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
  margin: ${props => props.theme.spacing.md};
  
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

const ScienceLab = ({ onGameComplete, onScoreUpdate }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState([]);

  const scienceQuestions = [
    {
      question: "What is the chemical symbol for water?",
      options: ["H2O", "CO2", "NaCl", "O2"],
      correct: 0
    },
    {
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mercury", "Earth", "Mars"],
      correct: 1
    },
    {
      question: "What gas do plants absorb from the atmosphere?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
      correct: 2
    },
    {
      question: "What is the hardest natural substance?",
      options: ["Gold", "Iron", "Diamond", "Silver"],
      correct: 2
    },
    {
      question: "Which blood type is known as the universal donor?",
      options: ["A", "B", "AB", "O"],
      correct: 3
    },
    {
      question: "What is the speed of light?",
      options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
      correct: 0
    },
    {
      question: "Which organ produces insulin?",
      options: ["Liver", "Pancreas", "Kidney", "Heart"],
      correct: 1
    },
    {
      question: "What is the atomic number of carbon?",
      options: ["6", "12", "14", "8"],
      correct: 0
    },
    {
      question: "Which force keeps planets in orbit?",
      options: ["Magnetic", "Gravitational", "Electric", "Nuclear"],
      correct: 1
    },
    {
      question: "What is the pH of pure water?",
      options: ["5", "6", "7", "8"],
      correct: 2
    }
  ];

  useEffect(() => {
    setQuestions(scienceQuestions);
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setFeedback('');
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const correct = selectedAnswer === questions[currentQuestion].correct;
    
    if (correct) {
      setScore(score + 10);
      setFeedback('Correct! 🎉');
      onScoreUpdate(score + 10);
    } else {
      setFeedback(`Wrong! The correct answer is: ${questions[currentQuestion].options[questions[currentQuestion].correct]}`);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setFeedback('');
      } else {
        setGameStarted(false);
        onGameComplete(score + (correct ? 10 : 0));
      }
    }, 2000);
  };

  if (!gameStarted) {
    return (
      <GameContainer>
        <GameHeader>
          <GameTitle>
            <Microscope size={24} />
            Science Lab
          </GameTitle>
        </GameHeader>
        
        <ExperimentContainer>
          <h3>Welcome to Science Lab!</h3>
          <p>Test your science knowledge with 10 questions!</p>
          <p>Choose the correct answer for each question.</p>
          <Button onClick={startGame}>Start Experiment</Button>
        </ExperimentContainer>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>
          <Microscope size={24} />
          Science Lab
        </GameTitle>
        <ScoreBoard>
          <ScoreItem>
            <Star size={16} />
            {score} points
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

      <ExperimentContainer>
        <Question>{questions[currentQuestion]?.question}</Question>
        <OptionsContainer>
          {questions[currentQuestion]?.options.map((option, index) => (
            <OptionButton
              key={index}
              selected={selectedAnswer === index}
              onClick={() => handleAnswerSelect(index)}
            >
              {option}
            </OptionButton>
          ))}
        </OptionsContainer>
        <Button onClick={handleSubmit} disabled={selectedAnswer === null}>
          Submit Answer
        </Button>
        {feedback && <Feedback correct={feedback.includes('Correct')}>{feedback}</Feedback>}
      </ExperimentContainer>
    </GameContainer>
  );
};

export default ScienceLab;
