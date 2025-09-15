import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, Star, Clock, Trophy, Target, Lightbulb } from 'lucide-react';

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

const QuestionCard = styled.div`
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
  border: 2px solid ${props => props.theme.colors.border};
`;

const QuestionText = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ItemCard = styled(motion.button)`
  padding: ${props => props.theme.spacing.md};
  background: ${props => {
    if (props.isSelected) return props.theme.colors.primary;
    if (props.isCorrect) return '#10b981';
    if (props.isWrong) return '#ef4444';
    return 'white';
  }};
  color: ${props => {
    if (props.isSelected || props.isCorrect || props.isWrong) return 'white';
    return props.theme.colors.text;
  }};
  border: 2px solid ${props => {
    if (props.isSelected) return props.theme.colors.primary;
    if (props.isCorrect) return '#10b981';
    if (props.isWrong) return '#ef4444';
    return props.theme.colors.border;
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const CategoryOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CategoryButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.isSelected ? props.theme.colors.primary : 'white'};
  color: ${props => props.isSelected ? 'white' : props.theme.colors.text};
  border: 2px solid ${props => props.isSelected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 500;
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

const HintButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const Pinpoint = ({ onGameComplete, onScoreUpdate }) => {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [moves, setMoves] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);

  const questions = [
    {
      id: 1,
      text: "Which items are fruits?",
      items: ["Apple", "Carrot", "Banana", "Broccoli", "Orange", "Potato", "Grape", "Lettuce"],
      correctItems: ["Apple", "Banana", "Orange", "Grape"],
      categories: ["Fruits", "Vegetables", "Both", "Neither"],
      correctCategory: "Fruits",
      hint: "Think about sweet, juicy foods that grow on trees or vines"
    },
    {
      id: 2,
      text: "Which items are vehicles?",
      items: ["Car", "Bicycle", "Tree", "Airplane", "House", "Motorcycle", "Flower", "Bus"],
      correctItems: ["Car", "Bicycle", "Airplane", "Motorcycle", "Bus"],
      categories: ["Vehicles", "Buildings", "Both", "Neither"],
      correctCategory: "Vehicles",
      hint: "These are things that help people travel from one place to another"
    },
    {
      id: 3,
      text: "Which items are colors?",
      items: ["Red", "Blue", "Dog", "Green", "Cat", "Yellow", "Purple", "Bird"],
      correctItems: ["Red", "Blue", "Green", "Yellow", "Purple"],
      categories: ["Colors", "Animals", "Both", "Neither"],
      correctCategory: "Colors",
      hint: "These are the basic colors you see in a rainbow"
    },
    {
      id: 4,
      text: "Which items are tools?",
      items: ["Hammer", "Screwdriver", "Book", "Wrench", "Pencil", "Saw", "Paper", "Drill"],
      correctItems: ["Hammer", "Screwdriver", "Wrench", "Saw", "Drill"],
      categories: ["Tools", "Stationery", "Both", "Neither"],
      correctCategory: "Tools",
      hint: "These are things used for building, fixing, or making things"
    },
    {
      id: 5,
      text: "Which items are planets?",
      items: ["Earth", "Mars", "Moon", "Jupiter", "Sun", "Venus", "Star", "Saturn"],
      correctItems: ["Earth", "Mars", "Jupiter", "Venus", "Saturn"],
      categories: ["Planets", "Stars", "Both", "Neither"],
      correctCategory: "Planets",
      hint: "These are large objects that orbit around the Sun"
    }
  ];

  // Generate a new question
  const generateQuestion = () => {
    const question = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(question);
    setSelectedItems([]);
    setSelectedCategory(null);
    setIsComplete(false);
    setShowHint(false);
    setStatusMessage('Select the items that belong to the category, then choose the category!');
  };

  // Handle item selection
  const handleItemClick = (item) => {
    if (isComplete) return;
    
    const newSelectedItems = selectedItems.includes(item)
      ? selectedItems.filter(selected => selected !== item)
      : [...selectedItems, item];
    
    setSelectedItems(newSelectedItems);
    setMoves(prev => prev + 1);
    setStatusMessage('Good! Now select the correct category.');
  };

  // Handle category selection
  const handleCategoryClick = (category) => {
    if (isComplete) return;
    
    setSelectedCategory(category);
    setMoves(prev => prev + 1);
    
    // Check if the answer is correct
    const isItemsCorrect = arraysEqual(selectedItems.sort(), currentQuestion.correctItems.sort());
    const isCategoryCorrect = category === currentQuestion.correctCategory;
    
    if (isItemsCorrect && isCategoryCorrect) {
      setIsComplete(true);
      setScore(prev => prev + 100);
      setStatusMessage('Perfect! You got it right!');
      onGameComplete && onGameComplete(score + 100);
    } else if (isItemsCorrect || isCategoryCorrect) {
      setScore(prev => prev + 25);
      setStatusMessage('Partially correct! Try again.');
    } else {
      setScore(prev => Math.max(0, prev - 10));
      setStatusMessage('Not quite right. Try again!');
    }
  };

  // Check if two arrays are equal
  const arraysEqual = (a, b) => {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  };

  // Reset the question
  const handleReset = () => {
    generateQuestion();
    setStatusMessage('Question reset! Try again.');
  };

  // Next question
  const handleNext = () => {
    setQuestionNumber(prev => prev + 1);
    generateQuestion();
  };

  // Show hint
  const handleShowHint = () => {
    setShowHint(true);
    setStatusMessage(`Hint: ${currentQuestion.hint}`);
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

  // Initialize question on mount
  useEffect(() => {
    generateQuestion();
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

  const isItemCorrect = (item) => {
    return currentQuestion.correctItems.includes(item);
  };

  const isItemSelected = (item) => {
    return selectedItems.includes(item);
  };

  const isItemWrong = (item) => {
    return selectedItems.includes(item) && !isItemCorrect(item);
  };

  if (!currentQuestion) {
    return (
      <GameContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading question...</div>
        </div>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>
          <Target size={24} />
          Pinpoint Category
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
            Q{questionNumber}
          </StatItem>
        </GameStats>
      </GameHeader>

      <Instructions>
        <strong>Instructions:</strong> Look at all the items and figure out which ones belong to the same category. 
        Select those items, then choose the correct category name.
      </Instructions>

      <QuestionCard>
        <QuestionText>{currentQuestion.text}</QuestionText>
        
        <ItemsGrid>
          {currentQuestion.items.map((item, index) => (
            <ItemCard
              key={index}
              isSelected={isItemSelected(item)}
              isCorrect={isItemSelected(item) && isItemCorrect(item)}
              isWrong={isItemWrong(item)}
              onClick={() => handleItemClick(item)}
              disabled={isComplete}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {item}
            </ItemCard>
          ))}
        </ItemsGrid>

        <CategoryOptions>
          {currentQuestion.categories.map((category, index) => (
            <CategoryButton
              key={index}
              isSelected={selectedCategory === category}
              onClick={() => handleCategoryClick(category)}
              disabled={isComplete}
            >
              {category}
            </CategoryButton>
          ))}
        </CategoryOptions>

        <HintButton onClick={handleShowHint} disabled={showHint}>
          <Lightbulb size={16} />
          {showHint ? 'Hint Shown' : 'Show Hint'}
        </HintButton>
      </QuestionCard>

      <StatusMessage
        type={isComplete ? 'success' : statusMessage.includes('Not quite') ? 'error' : 'info'}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {statusMessage}
      </StatusMessage>

      <GameControls>
        <ControlButton onClick={handleReset}>
          <RotateCcw size={16} />
          Reset
        </ControlButton>
        {isComplete && (
          <ControlButton variant="success" onClick={handleNext}>
            <CheckCircle size={16} />
            Next Question
          </ControlButton>
        )}
      </GameControls>
    </GameContainer>
  );
};

export default Pinpoint;






