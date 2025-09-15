import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, Star, Clock, Trophy } from 'lucide-react';

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

const SudokuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  background: ${props => props.theme.colors.text};
  padding: 4px;
  border-radius: ${props => props.theme.borderRadius.md};
  margin: ${props => props.theme.spacing.lg} 0;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
`;

const SudokuCell = styled.input`
  width: 60px;
  height: 60px;
  border: none;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  background: ${props => {
    if (props.isGiven) return props.theme.colors.background;
    if (props.isValid === false) return '#fecaca';
    if (props.isValid === true) return '#dcfce7';
    return 'white';
  }};
  color: ${props => props.isGiven ? props.theme.colors.textSecondary : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all 0.2s ease;
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    background: white;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const NumberPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.sm};
  max-width: 200px;
  margin: 0 auto ${props => props.theme.spacing.lg};
`;

const NumberButton = styled.button`
  width: 50px;
  height: 50px;
  border: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.isSelected ? props.theme.colors.primary : 'white'};
  color: ${props => props.isSelected ? 'white' : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
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

const MiniSudoku = ({ onGameComplete, onScoreUpdate }) => {
  const { t } = useTranslation();
  const [grid, setGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [moves, setMoves] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  // Generate a new Mini Sudoku puzzle
  const generatePuzzle = () => {
    // Create a solved 3x3 grid
    const solved = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    
    // Shuffle the grid
    const shuffled = shuffleGrid(solved);
    const puzzle = createPuzzle(shuffled);
    
    setGrid(puzzle);
    setSolution(shuffled);
    setIsComplete(false);
    setScore(0);
    setTimeElapsed(0);
    setMoves(0);
    setStatusMessage('Fill in the missing numbers!');
  };

  // Shuffle a 3x3 grid while maintaining sudoku rules
  const shuffleGrid = (grid) => {
    const newGrid = grid.map(row => [...row]);
    
    // Randomly swap rows within the same group
    for (let i = 0; i < 3; i++) {
      const row1 = Math.floor(Math.random() * 3);
      const row2 = Math.floor(Math.random() * 3);
      [newGrid[row1], newGrid[row2]] = [newGrid[row2], newGrid[row1]];
    }
    
    // Randomly swap columns within the same group
    for (let i = 0; i < 3; i++) {
      const col1 = Math.floor(Math.random() * 3);
      const col2 = Math.floor(Math.random() * 3);
      for (let row = 0; row < 3; row++) {
        [newGrid[row][col1], newGrid[row][col2]] = [newGrid[row][col2], newGrid[row][col1]];
      }
    }
    
    return newGrid;
  };

  // Create puzzle by removing some numbers
  const createPuzzle = (solvedGrid) => {
    const puzzle = solvedGrid.map(row => row.map(cell => ({
      value: cell,
      isGiven: Math.random() < 0.4, // 40% chance of being given
      isValid: null
    })));
    
    // Ensure at least 4 cells are given
    const givenCells = puzzle.flat().filter(cell => cell.isGiven).length;
    if (givenCells < 4) {
      // Add more given cells
      const emptyCells = puzzle.flat().filter(cell => !cell.isGiven);
      for (let i = 0; i < 4 - givenCells && i < emptyCells.length; i++) {
        emptyCells[i].isGiven = true;
      }
    }
    
    return puzzle;
  };

  // Check if the current grid is valid
  const isValidMove = (row, col, value) => {
    // Check row
    for (let c = 0; c < 3; c++) {
      if (c !== col && grid[row][c].value === value) {
        return false;
      }
    }
    
    // Check column
    for (let r = 0; r < 3; r++) {
      if (r !== row && grid[r][col].value === value) {
        return false;
      }
    }
    
    return true;
  };

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (grid[row][col].isGiven || isComplete) return;
    
    setSelectedCell({ row, col });
    setStatusMessage('Select a number to fill the cell');
  };

  // Handle number selection
  const handleNumberSelect = (number) => {
    setSelectedNumber(number);
    setStatusMessage(`Selected number ${number}. Click a cell to place it.`);
  };

  // Handle cell value change
  const handleCellChange = (row, col, value) => {
    if (grid[row][col].isGiven || isComplete) return;
    
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    newGrid[row][col].value = value;
    
    // Validate the move
    const isValid = value === 0 || isValidMove(row, col, value);
    newGrid[row][col].isValid = value === 0 ? null : isValid;
    
    setGrid(newGrid);
    setMoves(prev => prev + 1);
    
    if (value !== 0) {
      if (isValid) {
        setScore(prev => prev + 10);
        setStatusMessage('Good move!');
      } else {
        setScore(prev => Math.max(0, prev - 5));
        setStatusMessage('Invalid move! Try again.');
      }
    }
    
    // Check if puzzle is complete
    if (isPuzzleComplete(newGrid)) {
      setIsComplete(true);
      setStatusMessage('Congratulations! Puzzle completed!');
      onGameComplete && onGameComplete(score + timeElapsed);
    }
  };

  // Check if puzzle is complete and correct
  const isPuzzleComplete = (currentGrid) => {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (currentGrid[row][col].value === 0) {
          return false;
        }
      }
    }
    
    // Check if all numbers 1-9 are present
    const numbers = currentGrid.flat().map(cell => cell.value).sort();
    return numbers.join('') === '123456789';
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
          <Star size={24} />
          Mini Sudoku
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

      <StatusMessage
        type={isComplete ? 'success' : statusMessage.includes('Invalid') ? 'error' : 'info'}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {statusMessage}
      </StatusMessage>

      <SudokuGrid>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              type="text"
              value={cell.value || ''}
              onChange={(e) => handleCellChange(rowIndex, colIndex, parseInt(e.target.value) || 0)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              isGiven={cell.isGiven}
              isValid={cell.isValid}
              disabled={cell.isGiven}
              maxLength={1}
            />
          ))
        )}
      </SudokuGrid>

      <NumberPad>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
          <NumberButton
            key={number}
            isSelected={selectedNumber === number}
            onClick={() => handleNumberSelect(number)}
          >
            {number}
          </NumberButton>
        ))}
      </NumberPad>

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

export default MiniSudoku;






