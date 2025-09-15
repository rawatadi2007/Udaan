import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Wifi, 
  WifiOff,
  Download,
  Upload,
  Database,
  Trash2,
  Save,
  RefreshCw,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { database } from '../database/database';

const SettingsContainer = styled.div`
  max-width: 800px;
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
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.xl};
`;

const SettingsCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  backdrop-filter: blur(10px);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const SettingDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
`;

const SettingControl = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Toggle = styled.button`
  width: 50px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s ease;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.variant === 'primary' 
    ? props.theme.gradients.primary 
    : props.variant === 'danger'
    ? props.theme.gradients.error
    : props.theme.colors.background};
  color: ${props => props.variant === 'primary' || props.variant === 'danger' ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 0.8rem;
  color: ${props => props.status === 'online' ? props.theme.colors.success : props.theme.colors.error};
`;

const InfoBox = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.sm};
`;

const InfoIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  margin-top: 2px;
`;

const InfoText = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${props => props.theme.colors.background};
  border-radius: 3px;
  overflow: hidden;
  margin: ${props => props.theme.spacing.sm} 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.gradients.primary};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { 
    isOnline, 
    changeLanguage, 
    syncData,
    currentUser 
  } = useApp();
  
  const [settings, setSettings] = useState({
    language: i18n.language,
    autoSync: true,
    notifications: true,
    soundEffects: true,
    animations: true,
    highContrast: false,
    fontSize: 'medium'
  });
  
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'success', 'error'
  const [storageInfo, setStorageInfo] = useState({
    used: 0,
    total: 0,
    percentage: 0
  });

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await database.getSetting('appSettings');
        if (savedSettings) {
          setSettings({ ...settings, ...savedSettings });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Update storage info
  useEffect(() => {
    const updateStorageInfo = () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
          const used = estimate.usage || 0;
          const total = estimate.quota || 0;
          const percentage = total > 0 ? (used / total) * 100 : 0;
          
          setStorageInfo({
            used: Math.round(used / 1024 / 1024), // MB
            total: Math.round(total / 1024 / 1024), // MB
            percentage: Math.round(percentage)
          });
        });
      }
    };

    updateStorageInfo();
  }, []);

  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      await database.setSetting('appSettings', newSettings);
      
      // Handle specific setting changes
      if (key === 'language') {
        await changeLanguage(value);
      }
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const handleSync = async () => {
    if (!isOnline) {
      setSyncStatus('error');
      return;
    }

    setSyncStatus('syncing');
    try {
      await syncData();
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error('Error syncing data:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const handleExportData = async () => {
    try {
      const students = await database.getStudents();
      const progress = [];
      
      for (const student of students) {
        const studentProgress = await database.getStudentProgress(student.id);
        const achievements = await database.getStudentAchievements(student.id);
        
        progress.push({
          student,
          progress: studentProgress,
          achievements
        });
      }

      const data = {
        exportDate: new Date().toISOString(),
        students: progress
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rural-stem-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        await database.clear();
        window.location.reload();
      } catch (error) {
        console.error('Error clearing data:', error);
      }
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' }
  ];

  const fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'xlarge', label: 'Extra Large' }
  ];

  return (
    <SettingsContainer>
      <Header>
        <Title>{t('navigation.settings')}</Title>
        <Subtitle>Customize your learning experience</Subtitle>
      </Header>

      <SettingsGrid>
        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <Globe size={20} />
            <CardTitle>Language & Display</CardTitle>
          </CardHeader>

          <SettingItem>
            <SettingInfo>
              <SettingName>Language</SettingName>
              <SettingDescription>
                Choose your preferred language for the interface
              </SettingDescription>
            </SettingInfo>
            <SettingControl>
              <Select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </Select>
            </SettingControl>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingName>Font Size</SettingName>
              <SettingDescription>
                Adjust the text size for better readability
              </SettingDescription>
            </SettingInfo>
            <SettingControl>
              <Select
                value={settings.fontSize}
                onChange={(e) => handleSettingChange('fontSize', e.target.value)}
              >
                {fontSizes.map(size => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </Select>
            </SettingControl>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingName>High Contrast Mode</SettingName>
              <SettingDescription>
                Increase contrast for better visibility
              </SettingDescription>
            </SettingInfo>
            <SettingControl>
              <Toggle
                active={settings.highContrast}
                onClick={() => handleSettingChange('highContrast', !settings.highContrast)}
              />
            </SettingControl>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingName>Animations</SettingName>
              <SettingDescription>
                Enable or disable interface animations
              </SettingDescription>
            </SettingInfo>
            <SettingControl>
              <Toggle
                active={settings.animations}
                onClick={() => handleSettingChange('animations', !settings.animations)}
              />
            </SettingControl>
          </SettingItem>
        </SettingsCard>

        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CardHeader>
            <Wifi size={20} />
            <CardTitle>Sync & Storage</CardTitle>
          </CardHeader>

          <SettingItem>
            <SettingInfo>
              <SettingName>Connection Status</SettingName>
              <SettingDescription>
                Current internet connection status
              </SettingDescription>
            </SettingInfo>
            <SettingControl>
              <StatusIndicator status={isOnline ? 'online' : 'offline'}>
                {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                {isOnline ? 'Online' : 'Offline'}
              </StatusIndicator>
            </SettingControl>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingName>Auto Sync</SettingName>
              <SettingDescription>
                Automatically sync data when online
              </SettingDescription>
            </SettingInfo>
            <SettingControl>
              <Toggle
                active={settings.autoSync}
                onClick={() => handleSettingChange('autoSync', !settings.autoSync)}
              />
            </SettingControl>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingName>Manual Sync</SettingName>
              <SettingDescription>
                Sync your data with the server
              </SettingDescription>
            </SettingInfo>
            <SettingControl>
              <Button
                variant="primary"
                onClick={handleSync}
                disabled={!isOnline || syncStatus === 'syncing'}
              >
                {syncStatus === 'syncing' ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
              </Button>
            </SettingControl>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingName>Storage Usage</SettingName>
              <SettingDescription>
                Local storage usage and capacity
              </SettingDescription>
            </SettingInfo>
            <SettingControl>
              <div style={{ minWidth: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.8rem' }}>{storageInfo.used} MB used</span>
                  <span style={{ fontSize: '0.8rem' }}>{storageInfo.total} MB total</span>
                </div>
                <ProgressBar>
                  <ProgressFill progress={storageInfo.percentage} />
                </ProgressBar>
              </div>
            </SettingControl>
          </SettingItem>
        </SettingsCard>

        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardHeader>
            <Database size={20} />
            <CardTitle>Data Management</CardTitle>
          </CardHeader>

          <SettingItem>
            <SettingInfo>
              <SettingName>Export Data</SettingName>
              <SettingDescription>
                Download all student data and progress as a backup
              </SettingDescription>
            </SettingInfo>
            <SettingControl>
              <Button onClick={handleExportData}>
                <Download size={16} />
                Export
              </Button>
            </SettingControl>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingName>Clear All Data</SettingName>
              <SettingDescription>
                Permanently delete all student data and progress
              </SettingDescription>
            </SettingInfo>
            <SettingControl>
              <Button variant="danger" onClick={handleClearData}>
                <Trash2 size={16} />
                Clear Data
              </Button>
            </SettingControl>
          </SettingItem>

          <InfoBox>
            <InfoIcon>
              <Info size={16} />
            </InfoIcon>
            <InfoText>
              Data is stored locally on your device. Export your data regularly to prevent data loss.
              The app works completely offline, so your data is safe even without internet connection.
            </InfoText>
          </InfoBox>
        </SettingsCard>

        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CardHeader>
            <SettingsIcon size={20} />
            <CardTitle>Notifications & Sounds</CardTitle>
          </CardHeader>

          <SettingItem>
            <SettingInfo>
              <SettingName>Notifications</SettingName>
              <SettingDescription>
                Show notifications for achievements and progress updates
              </SettingDescription>
            </SettingInfo>
            <SettingControl>
              <Toggle
                active={settings.notifications}
                onClick={() => handleSettingChange('notifications', !settings.notifications)}
              />
            </SettingControl>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingName>Sound Effects</SettingName>
              <SettingDescription>
                Play sounds for game interactions and feedback
              </SettingDescription>
            </SettingInfo>
            <SettingControl>
              <Toggle
                active={settings.soundEffects}
                onClick={() => handleSettingChange('soundEffects', !settings.soundEffects)}
              />
            </SettingControl>
          </SettingItem>
        </SettingsCard>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default Settings;









