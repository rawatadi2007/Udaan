import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, Star, Clock, Trophy, Crown } from 'lucide-react';

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

const QueensGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 2px;
  background: ${props => props.theme.colors.text};
  padding: 8px;
  border-radius: ${props => props.theme.borderRadius.md};
  margin: ${props => props.theme.spacing.lg} 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const RegionCell = styled.button`
  width: 50px;
  height: 50px;
  border: 2px solid ${props => {
    if (props.hasQueen) return '#f59e0b';
    if (props.isAttacked) return '#ef4444';
    if (props.isSelected) return props.theme.colors.primary;
    return 'transparent';
  }};
  background: ${props => {
    if (props.hasQueen) return '#fef3c7';
    if (props.isAttacked) return '#fecaca';
    if (props.region === 1) return '#dbeafe';
    if (props.region === 2) return '#dcfce7';
    if (props.region === 3) return '#fef3c7';
    if (props.region === 4) return '#fce7f3';
    return 'white';
  }};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  position: relative;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
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

const RegionLegend = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  background: ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.sm};
  border: 1px solid ${props => props.theme.colors.border};
`;

const Queens = ({ onGameComplete, onScoreUpdate }) => {
  const { t } = useTranslation();
  const [grid, setGrid] = useState([]);
  const [queens, setQueens] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [moves, setMoves] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [targetQueens, setTargetQueens] = useState(0);

  // Generate a new Queens puzzle
  const generatePuzzle = () => {
    const size = 6;
    const regions = generateRegions(size);
    const newGrid = Array(size).fill(null).map((_, row) =>
      Array(size).fill(null).map((_, col) => ({
        region: regions[row][col],
        hasQueen: false,
        isAttacked: false
      }))
    );
    
    setGrid(newGrid);
    setQueens([]);
    setIsComplete(false);
    setScore(0);
    setTimeElapsed(0);
    setMoves(0);
    setTargetQueens(4); // Target: place 4 queens
    setStatusMessage('Place queens so each region has exactly one queen!');
  };

  // Generate regions for the grid
  const generateRegions = (size) => {
    const regions = Array(size).fill(null).map(() => Array(size).fill(0));
    
    // Create 4 distinct regions
    const regionPatterns = [
      // Pattern 1: Quadrants
      [
        [1, 1, 1, 2, 2, 2],
        [1, 1, 1, 2, 2, 2],
        [1, 1, 1, 2, 2, 2],
        [3, 3, 3, 4, 4, 4],
        [3, 3, 3, 4, 4, 4],
        [3, 3, 3, 4, 4, 4]
      ],
      // Pattern 2: Horizontal strips
      [
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2],
        [3, 3, 3, 3, 3, 3],
        [4, 4, 4, 4, 4, 4]
      ],
      // Pattern 3: Vertical strips
      [
        [1, 2, 3, 4, 1, 2],
        [1, 2, 3, 4, 1, 2],
        [1, 2, 3, 4, 1, 2],
        [1, 2, 3, 4, 1, 2],
        [1, 2, 3, 4, 1, 2],
        [1, 2, 3, 4, 1, 2]
      ],
      // Pattern 4: Checkerboard-like
      [
        [1, 2, 1, 2, 1, 2],
        [2, 3, 2, 3, 2, 3],
        [1, 2, 1, 2, 1, 2],
        [2, 3, 2, 3, 2, 3],
        [1, 2, 1, 2, 1, 2],
        [2, 3, 2, 3, 2, 3]
      ]
    ];
    
    return regionPatterns[Math.floor(Math.random() * regionPatterns.length)];
  };

  // Check if a position is attacked by any queen
  const isAttacked = (row, col, queens) => {
    return queens.some(queen => 
      queen.row === row || 
      queen.col === col || 
      Math.abs(queen.row - row) === Math.abs(queen.col - col)
    );
  };

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (isComplete) return;
    
    const cell = grid[row][col];
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const newQueens = [...queens];
    
    if (cell.hasQueen) {
      // Remove queen
      newGrid[row][col].hasQueen = false;
      setQueens(newQueens.filter(queen => !(queen.row === row && queen.col === col)));
      setMoves(prev => prev + 1);
      setStatusMessage('Queen removed!');
    } else {
      // Check if we can place a queen here
      if (isAttacked(row, col, queens)) {
        setStatusMessage('Cannot place queen here - it would be attacked!');
        return;
      }
      
      // Check if this region already has a queen
      const regionQueens = queens.filter(queen => 
        grid[queen.row][queen.col].region === cell.region
      );
      
      if (regionQueens.length > 0) {
        setStatusMessage('This region already has a queen!');
        return;
      }
      
      // Place queen
      newGrid[row][col].hasQueen = true;
      newQueens.push({ row, col, region: cell.region });
      setQueens(newQueens);
      setMoves(prev => prev + 1);
      setScore(prev => prev + 25);
      setStatusMessage('Queen placed! Great move!');
    }
    
    // Update attacked cells
    newGrid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        cell.isAttacked = isAttacked(rowIndex, colIndex, newQueens);
      });
    });
    
    setGrid(newGrid);
    
    // Check if puzzle is complete
    if (newQueens.length === targetQueens) {
      setIsComplete(true);
      setScore(prev => prev + 100);
      setStatusMessage('Perfect! All regions have exactly one queen!');
      onGameComplete && onGameComplete(score + 100);
    }
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

  const regionColors = {
    1: '#dbeafe',
    2: '#dcfce7', 
    3: '#fef3c7',
    4: '#fce7f3'
  };

  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>
          <Crown size={24} />
          Queens Regions
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
            Queens: {queens.length}/{targetQueens}
          </StatItem>
        </GameStats>
      </GameHeader>

      <Instructions>
        <strong>Instructions:</strong> Place queens on the board so that each colored region has exactly one queen. 
        Queens cannot attack each other (no two queens in the same row, column, or diagonal).
      </Instructions>

      <RegionLegend>
        <LegendItem>
          <LegendColor color={regionColors[1]} />
          Region 1
        </LegendItem>
        <LegendItem>
          <LegendColor color={regionColors[2]} />
          Region 2
        </LegendItem>
        <LegendItem>
          <LegendColor color={regionColors[3]} />
          Region 3
        </LegendItem>
        <LegendItem>
          <LegendColor color={regionColors[4]} />
          Region 4
        </LegendItem>
      </RegionLegend>

      <StatusMessage
        type={isComplete ? 'success' : statusMessage.includes('Cannot') ? 'error' : 'info'}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {statusMessage}
      </StatusMessage>

      <QueensGrid>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <RegionCell
              key={`${rowIndex}-${colIndex}`}
              region={cell.region}
              hasQueen={cell.hasQueen}
              isAttacked={cell.isAttacked}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={isComplete}
            >
              {cell.hasQueen && <Crown size={24} />}
            </RegionCell>
          ))
        )}
      </QueensGrid>

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

export default Queens;






