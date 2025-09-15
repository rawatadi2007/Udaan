import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Play, 
  Users, 
  BookOpen, 
  Award, 
  Globe, 
  Wifi, 
  WifiOff,
  Star,
  Target,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import UdaanLogo from './UdaanLogo';

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: ${props => props.theme.spacing['2xl']};
  text-align: center;
  color: white;
  position: relative;
  overflow-y: auto;
`;

const HeroSection = styled(motion.div)`
  max-width: 800px;
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.lg};
  background: linear-gradient(45deg, #ffffff, #f0f9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.h2)`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: ${props => props.theme.spacing.lg};
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.8;
  margin-bottom: ${props => props.theme.spacing['2xl']};
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ActionButtons = styled(motion.div)`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing['2xl']};
  border: none;
  border-radius: ${props => props.theme.borderRadius.xl};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  justify-content: center;
  
  background: ${props => props.variant === 'primary' 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: 2px solid ${props => props.variant === 'primary' 
    ? 'rgba(255, 255, 255, 0.3)' 
    : 'rgba(255, 255, 255, 0.2)'};
  
  &:hover {
    background: ${props => props.variant === 'primary' 
      ? 'rgba(255, 255, 255, 0.3)' 
      : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FeaturesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  max-width: 1000px;
  width: 100%;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.lg};
  color: white;
  font-size: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: white;
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  line-height: 1.5;
  color: white;
`;

const StatsSection = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing['2xl']};
  margin-top: ${props => props.theme.spacing['2xl']};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.lg};
  }
`;

const StatItem = styled.div`
  text-align: center;
  color: white;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.xs};
  background: linear-gradient(45deg, #ffffff, #f0f9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const Welcome = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { students, games, isOnline } = useApp();

  const features = [
    {
      icon: <Play size={24} />,
      title: t('games.title'),
      description: 'Interactive STEM games for all subjects'
    },
    {
      icon: <Globe size={24} />,
      title: 'Multilingual',
      description: 'Available in Hindi, Marathi, Kannada & English'
    },
    {
      icon: isOnline ? <Wifi size={24} /> : <WifiOff size={24} />,
      title: isOnline ? 'Online' : 'Offline',
      description: isOnline ? 'Connected and synced' : 'Works without internet'
    },
    {
      icon: <Award size={24} />,
      title: 'Achievements',
      description: 'Gamified learning with rewards and progress tracking'
    },
    {
      icon: <Users size={24} />,
      title: 'Teacher Tools',
      description: 'Dashboard for progress monitoring and class management'
    },
    {
      icon: <Heart size={24} />,
      title: 'Rural Focus',
      description: 'Designed specifically for rural school needs'
    }
  ];

  const stats = [
    { number: students.length, label: 'Students' },
    { number: games.length, label: 'Games' },
    { number: '4', label: 'Languages' },
    { number: '100%', label: 'Offline' }
  ];

  return (
    <WelcomeContainer>
      <HeroSection
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <UdaanLogo size="large" showText={true} />
        </motion.div>
        
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {t('welcome.subtitle')}
        </Subtitle>
        
        <Description
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {t('welcome.description')}
        </Description>
      </HeroSection>

      <ActionButtons
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <ActionButton
          variant="primary"
          onClick={() => onNavigate('games')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play size={20} />
          {t('welcome.getStarted')}
        </ActionButton>
        
        <ActionButton
          onClick={() => onNavigate('profile')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Users size={20} />
          {t('welcome.teacherLogin')}
        </ActionButton>
      </ActionButtons>

      <FeaturesGrid
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>

      <StatsSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        {stats.map((stat, index) => (
          <StatItem key={index}>
            <StatNumber>{stat.number}</StatNumber>
            <StatLabel>{stat.label}</StatLabel>
          </StatItem>
        ))}
      </StatsSection>
    </WelcomeContainer>
  );
};

export default Welcome;




