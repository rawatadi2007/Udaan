import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, Star, Clock, Trophy, Palette } from 'lucide-react';

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

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 4px;
  background: ${props => props.theme.colors.text};
  padding: 8px;
  border-radius: ${props => props.theme.borderRadius.md};
  margin: ${props => props.theme.spacing.lg} 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const ColorCell = styled.button`
  width: 70px;
  height: 70px;
  border: 3px solid ${props => {
    if (props.isSelected) return props.theme.colors.primary;
    if (props.isCorrect) return '#10b981';
    if (props.isWrong) return '#ef4444';
    return 'transparent';
  }};
  background: ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const ColorPalette = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  justify-content: center;
  margin: ${props => props.theme.spacing.lg} 0;
  flex-wrap: wrap;
`;

const ColorButton = styled.button`
  width: 50px;
  height: 50px;
  border: 3px solid ${props => props.isSelected ? props.theme.colors.primary : 'transparent'};
  background: ${props => props.color};
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${props => props.theme.shadows.md};
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

const PatternHint = styled.div`
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
`;

const Tango = ({ onGameComplete, onScoreUpdate }) => {
  const { t } = useTranslation();
  const [grid, setGrid] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [moves, setMoves] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [targetPattern, setTargetPattern] = useState([]);
  const [hint, setHint] = useState('');

  const colors = [
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#10b981', // Green
    '#f59e0b', // Orange
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f97316'  // Orange-red
  ];

  // Generate a new Tango puzzle
  const generatePuzzle = () => {
    const size = 4;
    const pattern = generatePattern();
    const newGrid = Array(size).fill(null).map(() => 
      Array(size).fill(null).map(() => ({
        color: colors[Math.floor(Math.random() * colors.length)],
        isLocked: false,
        isCorrect: false
      }))
    );
    
    setGrid(newGrid);
    setTargetPattern(pattern);
    setSelectedColor(null);
    setSelectedCell(null);
    setIsComplete(false);
    setScore(0);
    setTimeElapsed(0);
    setMoves(0);
    setStatusMessage('Harmonize the grid by matching the pattern!');
    setHint(generateHint(pattern));
  };

  // Generate a color pattern
  const generatePattern = () => {
    const patterns = [
      // Checkerboard
      [
        ['#3b82f6', '#ef4444', '#3b82f6', '#ef4444'],
        ['#ef4444', '#3b82f6', '#ef4444', '#3b82f6'],
        ['#3b82f6', '#ef4444', '#3b82f6', '#ef4444'],
        ['#ef4444', '#3b82f6', '#ef4444', '#3b82f6']
      ],
      // Gradient
      [
        ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'],
        ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc'],
        ['#8b5cf6', '#a855f7', '#c084fc', '#ddd6fe'],
        ['#a855f7', '#c084fc', '#ddd6fe', '#f3f4f6']
      ],
      // Rainbow
      [
        ['#ef4444', '#f97316', '#f59e0b', '#eab308'],
        ['#84cc16', '#22c55e', '#10b981', '#06b6d4'],
        ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6'],
        ['#a855f7', '#c084fc', '#e879f9', '#f0abfc']
      ],
      // Symmetrical
      [
        ['#3b82f6', '#ef4444', '#ef4444', '#3b82f6'],
        ['#10b981', '#f59e0b', '#f59e0b', '#10b981'],
        ['#10b981', '#f59e0b', '#f59e0b', '#10b981'],
        ['#3b82f6', '#ef4444', '#ef4444', '#3b82f6']
      ]
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  // Generate a hint for the pattern
  const generateHint = (pattern) => {
    const hints = [
      'Create a checkerboard pattern with two colors',
      'Make a gradient from one color to another',
      'Arrange colors in a rainbow pattern',
      'Create a symmetrical design',
      'Use only warm colors (red, orange, yellow)',
      'Use only cool colors (blue, green, purple)',
      'Make each row have the same pattern',
      'Make each column have the same pattern'
    ];
    
    return hints[Math.floor(Math.random() * hints.length)];
  };

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (isComplete || !selectedColor) return;
    
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    newGrid[row][col].color = selectedColor;
    
    setGrid(newGrid);
    setMoves(prev => prev + 1);
    
    // Check if this move is correct
    const isCorrect = selectedColor === targetPattern[row][col];
    newGrid[row][col].isCorrect = isCorrect;
    
    if (isCorrect) {
      setScore(prev => prev + 20);
      setStatusMessage('Great! That color is correct!');
    } else {
      setScore(prev => Math.max(0, prev - 5));
      setStatusMessage('Not quite right. Try again!');
    }
    
    // Check if puzzle is complete
    if (isPuzzleComplete(newGrid)) {
      setIsComplete(true);
      setScore(prev => prev + 100);
      setStatusMessage('Perfect! Grid harmonized successfully!');
      onGameComplete && onGameComplete(score + 100);
    }
    
    setGrid(newGrid);
  };

  // Check if puzzle is complete
  const isPuzzleComplete = (currentGrid) => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentGrid[row][col].color !== targetPattern[row][col]) {
          return false;
        }
      }
    }
    return true;
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setStatusMessage(`Selected color. Click a cell to apply it!`);
  };

  // Reset the puzzle
  const handleReset = () => {
    generatePuzzle();
    setStatusMessage('Puzzle reset! Try again.');
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

  // Initialize puzzle on mount
  useEffect(() => {
    generatePuzzle();
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

  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>
          <Palette size={24} />
          Tango Colors
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
            Moves: {moves}
          </StatItem>
        </GameStats>
      </GameHeader>

      <Instructions>
        <strong>Instructions:</strong> Harmonize the grid by matching the target pattern. 
        Select a color and click on a cell to apply it. Create beautiful color patterns!
      </Instructions>

      <PatternHint>
        <strong>Hint:</strong> {hint}
      </PatternHint>

      <StatusMessage
        type={isComplete ? 'success' : statusMessage.includes('Not quite') ? 'error' : 'info'}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {statusMessage}
      </StatusMessage>

      <ColorGrid>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <ColorCell
              key={`${rowIndex}-${colIndex}`}
              color={cell.color}
              isSelected={selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex}
              isCorrect={cell.isCorrect}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={isComplete}
            />
          ))
        )}
      </ColorGrid>

      <ColorPalette>
        {colors.map(color => (
          <ColorButton
            key={color}
            color={color}
            isSelected={selectedColor === color}
            onClick={() => handleColorSelect(color)}
          />
        ))}
      </ColorPalette>

      <GameControls>
        <ControlButton onClick={handleReset}>
          <RotateCcw size={16} />
          New Puzzle
        </ControlButton>
        {isComplete && (
          <ControlButton variant="success" onClick={generatePuzzle}>
            <CheckCircle size={16} />
            Next Puzzle
          </ControlButton>
        )}
      </GameControls>
    </GameContainer>
  );
};

export default Tango;






