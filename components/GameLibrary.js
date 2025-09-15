import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Play, 
  Star, 
  Clock, 
  Trophy,
  Calculator,
  Microscope,
  Code,
  Puzzle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { database } from '../database/database';

// Import puzzle games
import MiniSudoku from './games/MiniSudoku';
import Zip from './games/Zip';
import Tango from './games/Tango';
import Queens from './games/Queens';
import Pinpoint from './games/Pinpoint';
import Crossclimb from './games/Crossclimb';

// Import regular games
import MathAdventure from './games/MathAdventure';
import ScienceLab from './games/ScienceLab';
import CodingBasics from './games/CodingBasics';

const GameLibraryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['2xl']};
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.lg};
  background: linear-gradient(45deg, #ffffff, #f0f9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
`;

const ControlsSection = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  min-width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  padding-left: 3rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: ${props => props.theme.borderRadius.xl};
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  size: 20;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: ${props => props.theme.borderRadius.xl};
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const FilterDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  overflow: hidden;
  z-index: 1000;
  min-width: 200px;
  margin-top: ${props => props.theme.spacing.sm};
`;

const FilterOption = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: none;
  background: ${props => props.isActive ? props.theme.colors.background : 'transparent'};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  text-align: left;
  font-size: 0.9rem;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const GameCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: ${props => props.theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.lg};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.xl};
  }
`;

const GameImage = styled.div`
  height: 200px;
  background: ${props => props.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  position: relative;
  overflow: hidden;
`;

const GameOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${GameCard}:hover & {
    opacity: 1;
  }
`;

const PlayButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const GameContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const GameTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
`;

const GameDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const GameMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const GameDifficulty = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textSecondary};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.8rem;
  font-weight: 500;
`;

const GameStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.8rem;
`;

const GameFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GameProgress = styled.div`
  flex: 1;
  margin-right: ${props => props.theme.spacing.md};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${props => props.theme.colors.background};
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.gradients.primary};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const StartButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['2xl']};
  color: white;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${props => props.theme.spacing.lg};
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const EmptyDescription = styled.p`
  opacity: 0.8;
  max-width: 400px;
  margin: 0 auto;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.backgroundTertiary};
    transform: translateY(-1px);
  }
`;

const GameLibrary = () => {
  const { t } = useTranslation();
  const { games, currentUser, updateGameProgress } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [studentProgress, setStudentProgress] = useState({});
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameScore, setGameScore] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const categories = [
    { id: 'all', label: 'All Games', icon: <Play size={16} /> },
    { id: 'math', label: t('games.math'), icon: <Calculator size={16} /> },
    { id: 'science', label: t('games.science'), icon: <Microscope size={16} /> },
    { id: 'coding', label: t('games.coding'), icon: <Code size={16} /> },
    { id: 'logic', label: t('games.logic'), icon: <Puzzle size={16} /> },
    { id: 'puzzles', label: 'Puzzle Games', icon: <Puzzle size={16} /> }
  ];

  // Regular games mapping
  const regularGameComponents = {
    1: MathAdventure,    // Math Adventure
    2: MathAdventure,    // गणित का सफर (Hindi Math Adventure)
    3: ScienceLab,       // Science Lab
    4: CodingBasics      // Coding Basics
  };

  // Puzzle games data
  const puzzleGames = [
    {
      id: 'mini-sudoku',
      title: 'Mini Sudoku',
      description: 'The classic game, made mini',
      category: 'puzzles',
      difficulty: 'beginner',
      icon: '🧮',
      component: MiniSudoku
    },
    {
      id: 'zip-path',
      title: 'Zip Path',
      description: 'Complete the path',
      category: 'puzzles',
      difficulty: 'beginner',
      icon: '🔗',
      component: Zip
    },
    {
      id: 'tango-colors',
      title: 'Tango Colors',
      description: 'Harmonize the grid',
      category: 'puzzles',
      difficulty: 'intermediate',
      icon: '🎨',
      component: Tango
    },
    {
      id: 'queens-regions',
      title: 'Queens Regions',
      description: 'Crown each region',
      category: 'puzzles',
      difficulty: 'advanced',
      icon: '👑',
      component: Queens
    },
    {
      id: 'pinpoint-category',
      title: 'Pinpoint Category',
      description: 'Guess the category',
      category: 'puzzles',
      difficulty: 'intermediate',
      icon: '🎯',
      component: Pinpoint
    },
    {
      id: 'crossclimb-trivia',
      title: 'Crossclimb Trivia',
      description: 'Unlock a trivia ladder',
      category: 'puzzles',
      difficulty: 'intermediate',
      icon: '📈',
      component: Crossclimb
    }
  ];

  const gameGradients = {
    math: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    science: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    coding: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    logic: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    puzzles: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  };

  const gameIcons = {
    math: '🧮',
    science: '🔬',
    coding: '💻',
    logic: '🧩',
    puzzles: '🧩'
  };

  // Load student progress
  useEffect(() => {
    const loadProgress = async () => {
      if (currentUser) {
        try {
          const progress = await database.getStudentProgress(currentUser.id);
          const progressMap = {};
          progress.forEach(p => {
            progressMap[p.gameId] = p;
          });
          setStudentProgress(progressMap);
        } catch (error) {
          console.error('Error loading progress:', error);
        }
      }
    };

    loadProgress();
  }, [currentUser]);

  // Combine regular games with puzzle games
  const allGames = [...games, ...puzzleGames];

  const filteredGames = allGames.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (game.description || game.content?.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  console.log('All games:', allGames);
  console.log('Filtered games:', filteredGames);
  console.log('Puzzle games:', puzzleGames);

  const handleGameStart = async (gameId) => {
    console.log('Starting game with ID:', gameId);
    
    // Check if it's a puzzle game
    const puzzleGame = puzzleGames.find(game => game.id === gameId);
    console.log('Found puzzle game:', puzzleGame);
    
    if (puzzleGame) {
      console.log('Setting selected game to:', puzzleGame);
      setSelectedGame(puzzleGame);
      return;
    }

    // Check if it's a regular game
    const gameIdNum = parseInt(gameId);
    const gameComponent = regularGameComponents[gameIdNum];
    console.log('Found regular game component:', gameComponent);
    
    if (gameComponent) {
      // Create a game object for regular games
      const regularGame = {
        id: gameId,
        title: games.find(g => g.id === gameIdNum)?.title || 'Game',
        component: gameComponent,
        category: games.find(g => g.id === gameIdNum)?.category || 'general'
      };
      console.log('Setting selected regular game to:', regularGame);
      setSelectedGame(regularGame);
      return;
    }

    // For other games, check if user is selected
    if (!currentUser) {
      alert('Please select a student first');
      return;
    }

    try {
      await updateGameProgress(gameId, {
        level: 1,
        score: 0,
        completed: false,
        timeSpent: 0
      });
      
      // Here you would navigate to the actual game
      console.log('Starting game:', gameId);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const handleGameComplete = async (finalScore) => {
    if (!selectedGame) return;

    // Only update progress if a user is selected
    if (currentUser) {
      try {
        await updateGameProgress(selectedGame.id, {
          level: 1,
          score: finalScore,
          completed: true,
          timeSpent: 0
        });
      } catch (error) {
        console.error('Error updating game progress:', error);
      }
    }
    
    setGameScore(finalScore);
    setStatusMessage(`Game completed! Final score: ${finalScore}`);
  };

  const handleScoreUpdate = (score) => {
    setGameScore(score);
  };

  const handleBackToLibrary = () => {
    setSelectedGame(null);
    setGameScore(0);
  };

  const getProgressPercentage = (gameId) => {
    const progress = studentProgress[gameId];
    if (!progress) return 0;
    return Math.round((progress.level / 10) * 100); // Assuming 10 levels per game
  };

  // Debug: Log current state
  console.log('Current selectedGame state:', selectedGame);
  console.log('Current currentUser state:', currentUser);

  // Render selected puzzle game
  if (selectedGame) {
    console.log('Rendering selected game:', selectedGame);
    const GameComponent = selectedGame.component;
    console.log('Game component:', GameComponent);
    
    try {
      return (
        <GameLibraryContainer>
          <div style={{ marginBottom: '1rem' }}>
            <ControlButton onClick={handleBackToLibrary}>
              ← Back to Games
            </ControlButton>
          </div>
          <GameComponent 
            onGameComplete={handleGameComplete}
            onScoreUpdate={handleScoreUpdate}
          />
        </GameLibraryContainer>
      );
    } catch (error) {
      console.error('Error rendering game component:', error);
      return (
        <GameLibraryContainer>
          <div style={{ marginBottom: '1rem' }}>
            <ControlButton onClick={handleBackToLibrary}>
              ← Back to Games
            </ControlButton>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Error loading game</h3>
            <p>There was an error loading the game. Please try again.</p>
            <button onClick={handleBackToLibrary}>Back to Games</button>
          </div>
        </GameLibraryContainer>
      );
    }
  }

  if (allGames.length === 0) {
    return (
      <GameLibraryContainer>
        <EmptyState>
          <EmptyIcon>🎮</EmptyIcon>
          <EmptyTitle>No Games Available</EmptyTitle>
          <EmptyDescription>
            Games are being loaded. Please check back in a moment.
          </EmptyDescription>
        </EmptyState>
      </GameLibraryContainer>
    );
  }

  return (
    <GameLibraryContainer>
      <Header>
        <Title>Game Library</Title>
        <Subtitle>
          Choose from our collection of interactive STEM games designed for rural students
        </Subtitle>
      </Header>

      <ControlsSection>
        <SearchBox>
          <SearchIcon size={20} />
          <SearchInput
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>

        <div style={{ position: 'relative' }}>
          <FilterButton onClick={() => setShowFilters(!showFilters)}>
            <Filter size={16} />
            Filter by Category
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </FilterButton>

          <AnimatePresence>
            {showFilters && (
              <FilterDropdown
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {categories.map((category) => (
                  <FilterOption
                    key={category.id}
                    isActive={selectedCategory === category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowFilters(false);
                    }}
                  >
                    {category.icon}
                    {category.label}
                  </FilterOption>
                ))}
              </FilterDropdown>
            )}
          </AnimatePresence>
        </div>
      </ControlsSection>

      <GamesGrid>
        {filteredGames.map((game) => {
          const progress = studentProgress[game.id];
          const progressPercentage = getProgressPercentage(game.id);
          const isPuzzleGame = puzzleGames.some(pg => pg.id === game.id);
          
          return (
            <GameCard
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <GameImage gradient={gameGradients[game.category] || gameGradients.math}>
                <span>{isPuzzleGame ? game.icon : (gameIcons[game.category] || '🎮')}</span>
                <GameOverlay>
                  <PlayButton onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Play button clicked for game:', game.id);
                    handleGameStart(game.id);
                  }}>
                    <Play size={24} />
                  </PlayButton>
                </GameOverlay>
              </GameImage>

              <GameContent>
                <GameTitle>{game.title}</GameTitle>
                <GameDescription>
                  {isPuzzleGame ? game.description : (game.content?.description || 'Interactive learning game')}
                </GameDescription>

                <GameMeta>
                  <GameDifficulty>{game.difficulty}</GameDifficulty>
                  <GameStats>
                    <Clock size={14} />
                    <span>{isPuzzleGame ? 'Puzzle' : (game.content?.levels || 1)} levels</span>
                  </GameStats>
                </GameMeta>

                {progress && (
                  <GameProgress>
                    <ProgressBar>
                      <ProgressFill progress={progressPercentage} />
                    </ProgressBar>
                    <ProgressText>{progressPercentage}% Complete</ProgressText>
                  </GameProgress>
                )}

                <GameFooter>
                  <StartButton onClick={() => handleGameStart(game.id)}>
                    <Play size={16} />
                    {progress ? t('games.resume') : t('games.play')}
                  </StartButton>
                </GameFooter>
              </GameContent>
            </GameCard>
          );
        })}
      </GamesGrid>
    </GameLibraryContainer>
  );
};

export default GameLibrary;



