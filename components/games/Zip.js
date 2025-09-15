import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, Star, Clock, Trophy, ArrowRight, ArrowDown, ArrowUp, ArrowLeft } from 'lucide-react';

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

const PathGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 2px;
  background: ${props => props.theme.colors.text};
  padding: 8px;
  border-radius: ${props => props.theme.borderRadius.md};
  margin: ${props => props.theme.spacing.lg} 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const PathCell = styled.button`
  width: 60px;
  height: 60px;
  border: none;
  background: ${props => {
    if (props.isStart) return '#10b981';
    if (props.isEnd) return '#ef4444';
    if (props.isPath) return '#3b82f6';
    if (props.isSelected) return '#f59e0b';
    return 'white';
  }};
  color: ${props => {
    if (props.isStart || props.isEnd || props.isPath) return 'white';
    return props.theme.colors.text;
  }};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  
  &:hover {
    background: ${props => {
      if (props.isStart) return '#059669';
      if (props.isEnd) return '#dc2626';
      if (props.isPath) return '#2563eb';
      return props.theme.colors.background;
    }};
    transform: scale(1.05);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const DirectionPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.sm};
  max-width: 200px;
  margin: 0 auto ${props => props.theme.spacing.lg};
`;

const DirectionButton = styled.button`
  width: 50px;
  height: 50px;
  border: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.isSelected ? props.theme.colors.primary : 'white'};
  color: ${props => props.isSelected ? 'white' : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.isSelected ? props.theme.colors.primary : props.theme.colors.background};
    transform: scale(1.05);
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

const Zip = ({ onGameComplete, onScoreUpdate }) => {
  const { t } = useTranslation();
  const [grid, setGrid] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [moves, setMoves] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [targetPath, setTargetPath] = useState([]);

  // Generate a new Zip puzzle
  const generatePuzzle = () => {
    const size = 5;
    const newGrid = Array(size).fill(null).map(() => Array(size).fill({ type: 'empty' }));
    
    // Set start and end points
    const start = { row: 0, col: 0 };
    const end = { row: size - 1, col: size - 1 };
    
    newGrid[start.row][start.col] = { type: 'start' };
    newGrid[end.row][end.col] = { type: 'end' };
    
    // Generate a random target path
    const path = generateRandomPath(start, end, size);
    setTargetPath(path);
    
    setGrid(newGrid);
    setCurrentPath([]);
    setIsComplete(false);
    setScore(0);
    setTimeElapsed(0);
    setMoves(0);
    setStatusMessage('Complete the path from start (green) to end (red)!');
  };

  // Generate a random valid path
  const generateRandomPath = (start, end, size) => {
    const path = [start];
    let current = { ...start };
    
    while (current.row !== end.row || current.col !== end.col) {
      const directions = [];
      
      // Right
      if (current.col < size - 1) {
        directions.push({ row: current.row, col: current.col + 1 });
      }
      // Down
      if (current.row < size - 1) {
        directions.push({ row: current.row + 1, col: current.col });
      }
      
      // Randomly choose a direction
      const next = directions[Math.floor(Math.random() * directions.length)];
      path.push(next);
      current = next;
    }
    
    return path;
  };

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (isComplete) return;
    
    const cell = grid[row][col];
    if (cell.type === 'start' && currentPath.length === 0) {
      // Start the path
      setCurrentPath([{ row, col }]);
      setStatusMessage('Choose a direction to continue the path!');
    } else if (cell.type === 'end' && currentPath.length > 0) {
      // Try to complete the path
      const newPath = [...currentPath, { row, col }];
      setCurrentPath(newPath);
      
      if (isValidPath(newPath)) {
        setIsComplete(true);
        setScore(prev => prev + 100);
        setStatusMessage('Congratulations! Path completed successfully!');
        onGameComplete && onGameComplete(score + 100);
      } else {
        setStatusMessage('Invalid path! Try again.');
        setCurrentPath([]);
      }
    } else if (cell.type === 'empty' && currentPath.length > 0) {
      // Add to path
      const newPath = [...currentPath, { row, col }];
      setCurrentPath(newPath);
      setMoves(prev => prev + 1);
      
      if (isValidPath(newPath)) {
        setScore(prev => prev + 10);
        setStatusMessage('Good move! Continue the path.');
      } else {
        setScore(prev => Math.max(0, prev - 5));
        setStatusMessage('Invalid move! Try a different direction.');
        setCurrentPath(currentPath); // Revert
      }
    }
  };

  // Check if current path is valid
  const isValidPath = (path) => {
    if (path.length < 2) return true;
    
    const last = path[path.length - 1];
    const secondLast = path[path.length - 2];
    
    // Check if move is adjacent (up, down, left, right)
    const rowDiff = Math.abs(last.row - secondLast.row);
    const colDiff = Math.abs(last.col - secondLast.col);
    
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  // Handle direction selection
  const handleDirectionSelect = (direction) => {
    setSelectedDirection(direction);
    setStatusMessage(`Selected direction: ${direction}. Click a cell to place the path.`);
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

  const isCellInPath = (row, col) => {
    return currentPath.some(cell => cell.row === row && cell.col === col);
  };

  const getDirectionIcon = (direction) => {
    switch (direction) {
      case 'up': return <ArrowUp size={20} />;
      case 'down': return <ArrowDown size={20} />;
      case 'left': return <ArrowLeft size={20} />;
      case 'right': return <ArrowRight size={20} />;
      default: return null;
    }
  };

  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>
          <Star size={24} />
          Zip Path
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
        <strong>Instructions:</strong> Create a path from the green start cell to the red end cell. 
        Click on adjacent cells to build your path. You can only move up, down, left, or right.
      </Instructions>

      <StatusMessage
        type={isComplete ? 'success' : statusMessage.includes('Invalid') ? 'error' : 'info'}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {statusMessage}
      </StatusMessage>

      <PathGrid>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <PathCell
              key={`${rowIndex}-${colIndex}`}
              isStart={cell.type === 'start'}
              isEnd={cell.type === 'end'}
              isPath={isCellInPath(rowIndex, colIndex)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={isComplete}
            >
              {cell.type === 'start' && 'S'}
              {cell.type === 'end' && 'E'}
              {isCellInPath(rowIndex, colIndex) && '●'}
            </PathCell>
          ))
        )}
      </PathGrid>

      <DirectionPad>
        <div></div>
        <DirectionButton
          isSelected={selectedDirection === 'up'}
          onClick={() => handleDirectionSelect('up')}
        >
          <ArrowUp size={20} />
        </DirectionButton>
        <div></div>
        
        <DirectionButton
          isSelected={selectedDirection === 'left'}
          onClick={() => handleDirectionSelect('left')}
        >
          <ArrowLeft size={20} />
        </DirectionButton>
        <div></div>
        <DirectionButton
          isSelected={selectedDirection === 'right'}
          onClick={() => handleDirectionSelect('right')}
        >
          <ArrowRight size={20} />
        </DirectionButton>
        
        <div></div>
        <DirectionButton
          isSelected={selectedDirection === 'down'}
          onClick={() => handleDirectionSelect('down')}
        >
          <ArrowDown size={20} />
        </DirectionButton>
        <div></div>
      </DirectionPad>

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

export default Zip;






