import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const IndicatorContainer = styled(motion.div)`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.isOnline 
    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'};
  color: white;
  box-shadow: ${props => props.theme.shadows.lg};
  animation: ${props => props.isOnline ? slideDown : slideUp} 0.3s ease-out;
`;

const IndicatorContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  max-width: 1200px;
  margin: 0 auto;
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const StatusText = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
`;

const StatusDescription = styled.div`
  font-size: 0.8rem;
  opacity: 0.9;
  margin-top: 2px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-left: ${props => props.theme.spacing.sm};
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PulseAnimation = styled.div`
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const OfflineIndicator = ({ isOnline }) => {
  const { t } = useTranslation();
  const [showIndicator, setShowIndicator] = useState(false);
  const [lastOnlineStatus, setLastOnlineStatus] = useState(isOnline);
  const [syncAttempts, setSyncAttempts] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Show indicator when status changes
    if (isOnline !== lastOnlineStatus) {
      setShowIndicator(true);
      setLastOnlineStatus(isOnline);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline, lastOnlineStatus]);

  const handleSync = async () => {
    if (!isOnline || isSyncing) return;
    
    setIsSyncing(true);
    setSyncAttempts(prev => prev + 1);
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would call the actual sync function
      // await syncData();
      
      setShowIndicator(false);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDismiss = () => {
    setShowIndicator(false);
  };

  if (!showIndicator) return null;

  return (
    <AnimatePresence>
      <IndicatorContainer
        isOnline={isOnline}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
      >
        <IndicatorContent>
          <StatusIcon>
            {isOnline ? (
              <CheckCircle size={20} />
            ) : (
              <PulseAnimation>
                <WifiOff size={20} />
              </PulseAnimation>
            )}
          </StatusIcon>
          
          <div>
            <StatusText>
              {isOnline ? 'Back Online' : 'You\'re Offline'}
            </StatusText>
            <StatusDescription>
              {isOnline 
                ? 'Your data will sync automatically'
                : 'Working offline - changes will sync when connected'
              }
            </StatusDescription>
          </div>
          
          {isOnline && (
            <ActionButton
              onClick={handleSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Wifi size={14} />
              )}
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </ActionButton>
          )}
          
          <ActionButton onClick={handleDismiss}>
            ✕
          </ActionButton>
        </IndicatorContent>
      </IndicatorContainer>
    </AnimatePresence>
  );
};

export default OfflineIndicator;









