import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, Star, Clock, Trophy, TrendingUp, HelpCircle } from 'lucide-react';

const GameContainer = styled.div`
  max-width: 600px;
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

const GameStats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  align-items: center;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const LadderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const LadderRung = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md};
  background: ${props => {
    if (props.isCompleted) return '#dcfce7';
    if (props.isCurrent) return '#dbeafe';
    if (props.isLocked) return '#f3f4f6';
    return 'white';
  }};
  border: 2px solid ${props => {
    if (props.isCompleted) return '#10b981';
    if (props.isCurrent) return props.theme.colors.primary;
    if (props.isLocked) return props.theme.colors.border;
    return props.theme.colors.border;
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.3s ease;
  position: relative;
  
  ${props => props.isCurrent && `
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  `}
`;

const RungNumber = styled.div`
  width: 30px;
  height: 30px;
  background: ${props => {
    if (props.isCompleted) return '#10b981';
    if (props.isCurrent) return props.theme.colors.primary;
    if (props.isLocked) return props.theme.colors.border;
    return props.theme.colors.background;
  }};
  color: ${props => {
    if (props.isCompleted || props.isCurrent) return 'white';
    return props.theme.colors.textSecondary;
  }};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
`;

const RungContent = styled.div`
  flex: 1;
  margin: 0 ${props => props.theme.spacing.md};
`;

const RungQuestion = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const RungAnswer = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
`;

const RungStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const AnswerInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  margin-bottom: ${props => props.theme.spacing.md};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const AnswerOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const AnswerOption = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.isSelected ? props.theme.colors.primary : 'white'};
  color: ${props => props.isSelected ? 'white' : props.theme.colors.text};
  border: 2px solid ${props => props.isSelected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isSelected ? props.theme.colors.primary : props.theme.colors.background};
    transform: translateY(-1px);
  }
`;

const GameControls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.variant === 'primary' 
    ? props.theme.gradients.primary 
    : props.variant === 'success'
    ? props.theme.gradients.success
    : props.theme.colors.background};
  color: ${props => props.variant === 'primary' || props.variant === 'success' ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
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

const StatusMessage = styled(motion.div)`
  text-align: center;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-weight: 500;
  
  ${props => {
    if (props.type === 'success') {
      return `
        background: #dcfce7;
        color: #166534;
        border: 1px solid #bbf7d0;
      `;
    } else if (props.type === 'error') {
      return `
        background: #fecaca;
        color: #991b1b;
        border: 1px solid #fca5a5;
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};
      `;
    }
  }}
`;

const Instructions = styled.div`
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.background};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.gradients.primary};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const Crossclimb = ({ onGameComplete, onScoreUpdate }) => {
  const { t } = useTranslation();
  const [ladder, setLadder] = useState([]);
  const [currentRung, setCurrentRung] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [moves, setMoves] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [streak, setStreak] = useState(0);

  const triviaQuestions = [
    {
      id: 1,
      question: "What is the capital of India?",
      answer: "New Delhi",
      options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
      difficulty: "Easy",
      points: 10
    },
    {
      id: 2,
      question: "Which planet is closest to the Sun?",
      answer: "Mercury",
      options: ["Venus", "Mercury", "Earth", "Mars"],
      difficulty: "Easy",
      points: 10
    },
    {
      id: 3,
      question: "What is 15 × 8?",
      answer: "120",
      options: ["100", "120", "140", "160"],
      difficulty: "Medium",
      points: 20
    },
    {
      id: 4,
      question: "Which is the largest mammal?",
      answer: "Blue whale",
      options: ["Elephant", "Blue whale", "Giraffe", "Hippopotamus"],
      difficulty: "Medium",
      points: 20
    },
    {
      id: 5,
      question: "What is the chemical symbol for gold?",
      answer: "Au",
      options: ["Go", "Au", "Gd", "Ag"],
      difficulty: "Hard",
      points: 30
    },
    {
      id: 6,
      question: "Who wrote 'Romeo and Juliet'?",
      answer: "William Shakespeare",
      options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
      difficulty: "Hard",
      points: 30
    },
    {
      id: 7,
      question: "What is the square root of 144?",
      answer: "12",
      options: ["10", "11", "12", "13"],
      difficulty: "Medium",
      points: 20
    },
    {
      id: 8,
      question: "Which country has the most population?",
      answer: "China",
      options: ["India", "China", "United States", "Brazil"],
      difficulty: "Easy",
      points: 10
    },
    {
      id: 9,
      question: "What is the speed of light?",
      answer: "299,792,458 m/s",
      options: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "300,792,458 m/s"],
      difficulty: "Hard",
      points: 30
    },
    {
      id: 10,
      question: "Which is the smallest prime number?",
      answer: "2",
      options: ["1", "2", "3", "5"],
      difficulty: "Medium",
      points: 20
    }
  ];

  // Generate a new ladder
  const generateLadder = () => {
    const shuffled = [...triviaQuestions].sort(() => Math.random() - 0.5);
    const ladderQuestions = shuffled.slice(0, 5).map((q, index) => ({
      ...q,
      rungNumber: index + 1,
      isCompleted: false,
      isCurrent: index === 0,
      isLocked: index > 0,
      userAnswer: '',
      isCorrect: null
    }));
    
    setLadder(ladderQuestions);
    setCurrentRung(0);
    setIsComplete(false);
    setScore(0);
    setTimeElapsed(0);
    setMoves(0);
    setStreak(0);
    setStatusMessage('Answer the questions to climb the ladder!');
  };

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!userAnswer && !selectedOption) {
      setStatusMessage('Please enter an answer or select an option!');
      return;
    }

    const answer = userAnswer || selectedOption;
    const currentQuestion = ladder[currentRung];
    const isCorrect = answer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim();
    
    const newLadder = [...ladder];
    newLadder[currentRung].userAnswer = answer;
    newLadder[currentRung].isCorrect = isCorrect;
    newLadder[currentRung].isCompleted = true;
    
    if (isCorrect) {
      const points = currentQuestion.points + (streak * 5);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setStatusMessage(`Correct! +${points} points! Streak: ${streak + 1}`);
      
      // Unlock next rung
      if (currentRung < ladder.length - 1) {
        newLadder[currentRung + 1].isLocked = false;
        newLadder[currentRung + 1].isCurrent = true;
        newLadder[currentRung].isCurrent = false;
        setCurrentRung(prev => prev + 1);
      } else {
        setIsComplete(true);
        setStatusMessage('Congratulations! You completed the ladder!');
        onGameComplete && onGameComplete(score + points);
      }
    } else {
      setStreak(0);
      setScore(prev => Math.max(0, prev - 5));
      setStatusMessage(`Incorrect! The answer was: ${currentQuestion.answer}`);
    }
    
    setLadder(newLadder);
    setUserAnswer('');
    setSelectedOption(null);
    setMoves(prev => prev + 1);
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setUserAnswer('');
  };

  // Reset the ladder
  const handleReset = () => {
    generateLadder();
    setStatusMessage('Ladder reset! Try again.');
  };

  // Timer effect
  useEffect(() => {
    if (!isComplete) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isComplete]);

  // Initialize ladder on mount
  useEffect(() => {
    generateLadder();
  }, []);

  // Update score in parent component
  useEffect(() => {
    onScoreUpdate && onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ladder.length > 0 ? (ladder.filter(rung => rung.isCompleted).length / ladder.length) * 100 : 0;

  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>
          <TrendingUp size={24} />
          Crossclimb Trivia
        </GameTitle>
        <GameStats>
          <StatItem>
            <Trophy size={16} />
            {score} pts
          </StatItem>
          <StatItem>
            <Clock size={16} />
            {formatTime(timeElapsed)}
          </StatItem>
          <StatItem>
            Streak: {streak}
          </StatItem>
        </GameStats>
      </GameHeader>

      <Instructions>
        <strong>Instructions:</strong> Answer trivia questions to climb the ladder! 
        Get questions right to unlock the next rung. Build up streaks for bonus points!
      </Instructions>

      <ProgressBar>
        <ProgressFill progress={progress} />
      </ProgressBar>

      <StatusMessage
        type={isComplete ? 'success' : statusMessage.includes('Incorrect') ? 'error' : 'info'}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {statusMessage}
      </StatusMessage>

      <LadderContainer>
        {ladder.map((rung, index) => (
          <LadderRung
            key={rung.id}
            isCompleted={rung.isCompleted}
            isCurrent={rung.isCurrent}
            isLocked={rung.isLocked}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <RungNumber
              isCompleted={rung.isCompleted}
              isCurrent={rung.isCurrent}
              isLocked={rung.isLocked}
            >
              {rung.isCompleted ? '✓' : rung.rungNumber}
            </RungNumber>
            
            <RungContent>
              <RungQuestion>{rung.question}</RungQuestion>
              {rung.isCompleted && (
                <RungAnswer>Answer: {rung.answer}</RungAnswer>
              )}
            </RungContent>
            
            <RungStatus>
              {rung.isCompleted ? (
                rung.isCorrect ? (
                  <CheckCircle size={16} color="#10b981" />
                ) : (
                  <XCircle size={16} color="#ef4444" />
                )
              ) : rung.isCurrent ? (
                <HelpCircle size={16} color="#3b82f6" />
              ) : (
                <Star size={16} color="#6b7280" />
              )}
            </RungStatus>
          </LadderRung>
        ))}
      </LadderContainer>

      {ladder.length > 0 && ladder[currentRung] && !isComplete && (
        <div>
          <AnswerInput
            type="text"
            placeholder="Type your answer here..."
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              setSelectedOption(null);
            }}
          />
          
          <AnswerOptions>
            {ladder[currentRung].options.map((option, index) => (
              <AnswerOption
                key={index}
                isSelected={selectedOption === option}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </AnswerOption>
            ))}
          </AnswerOptions>
          
          <ControlButton variant="primary" onClick={handleSubmitAnswer}>
            <CheckCircle size={16} />
            Submit Answer
          </ControlButton>
        </div>
      )}

      <GameControls>
        <ControlButton onClick={handleReset}>
          <RotateCcw size={16} />
          New Ladder
        </ControlButton>
        {isComplete && (
          <ControlButton variant="success" onClick={generateLadder}>
            <CheckCircle size={16} />
            Next Ladder
          </ControlButton>
        )}
      </GameControls>
    </GameContainer>
  );
};

export default Crossclimb;






