import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Code, Star, Clock, Trophy } from 'lucide-react';

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

const ChallengeContainer = styled.div`
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

const CodeBlock = styled.div`
  background: #1e1e1e;
  color: #d4d4d4;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  margin: ${props => props.theme.spacing.lg} 0;
  text-align: left;
  overflow-x: auto;
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

const CodingBasics = ({ onGameComplete, onScoreUpdate }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState([]);

  const codingQuestions = [
    {
      question: "What does this code output?",
      code: "print('Hello, World!')",
      options: ["Hello, World!", "Error", "Nothing", "Hello World"],
      correct: 0
    },
    {
      question: "What is the result of: 5 + 3 * 2",
      options: ["16", "11", "13", "10"],
      correct: 1
    },
    {
      question: "Which keyword is used to create a loop in Python?",
      options: ["loop", "for", "while", "repeat"],
      correct: 2
    },
    {
      question: "What does this code do?",
      code: "if x > 0:\n    print('Positive')",
      options: ["Always prints 'Positive'", "Prints 'Positive' if x is greater than 0", "Prints 'Positive' if x is 0", "Prints 'Positive' if x is negative"],
      correct: 1
    },
    {
      question: "What is the correct way to create a list in Python?",
      options: ["list = [1, 2, 3]", "list = (1, 2, 3)", "list = {1, 2, 3}", "list = <1, 2, 3>"],
      correct: 0
    },
    {
      question: "What does len() function do?",
      options: ["Returns the length of a string or list", "Returns the largest number", "Returns the smallest number", "Returns the sum"],
      correct: 0
    },
    {
      question: "What is the output of: 'Hello' + 'World'",
      options: ["HelloWorld", "Hello World", "Error", "Hello + World"],
      correct: 0
    },
    {
      question: "Which symbol is used for comments in Python?",
      options: ["//", "/*", "#", "<!--"],
      correct: 2
    },
    {
      question: "What does range(5) return?",
      options: ["[0, 1, 2, 3, 4]", "[1, 2, 3, 4, 5]", "[0, 1, 2, 3, 4, 5]", "Error"],
      correct: 0
    },
    {
      question: "What is the correct way to define a function?",
      options: ["function myFunction():", "def myFunction():", "define myFunction():", "func myFunction():"],
      correct: 1
    }
  ];

  useEffect(() => {
    setQuestions(codingQuestions);
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
            <Code size={24} />
            Coding Basics
          </GameTitle>
        </GameHeader>
        
        <ChallengeContainer>
          <h3>Welcome to Coding Basics!</h3>
          <p>Learn programming fundamentals with 10 coding questions!</p>
          <p>Test your understanding of basic programming concepts.</p>
          <Button onClick={startGame}>Start Coding</Button>
        </ChallengeContainer>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>
          <Code size={24} />
          Coding Basics
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

      <ChallengeContainer>
        <Question>{questions[currentQuestion]?.question}</Question>
        {questions[currentQuestion]?.code && (
          <CodeBlock>{questions[currentQuestion].code}</CodeBlock>
        )}
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
      </ChallengeContainer>
    </GameContainer>
  );
};

export default CodingBasics;
