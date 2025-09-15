import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Home, 
  Gamepad2, 
  User, 
  Settings, 
  Users, 
  Menu, 
  X,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import UdaanLogo from './UdaanLogo';

const NavbarContainer = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 0 ${props => props.theme.spacing.lg};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
`;

const LogoIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 30%, #f59e0b 70%, #f97316 100%);
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 15px rgba(30, 58, 138, 0.4);
  overflow: hidden;
  
  /* Starry background effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, #fff, transparent),
      radial-gradient(2px 2px at 40px 70px, #fff, transparent),
      radial-gradient(1px 1px at 90px 40px, #fff, transparent),
      radial-gradient(1px 1px at 130px 80px, #fff, transparent),
      radial-gradient(2px 2px at 160px 30px, #fff, transparent);
    background-repeat: repeat;
    background-size: 200px 100px;
    opacity: 0.8;
  }
  
  /* Paper airplane */
  &::after {
    content: '✈️';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(15deg);
    font-size: 1.8rem;
    z-index: 2;
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
  }
`;

const GraduationCap = styled.div`
  position: absolute;
  top: 8px;
  left: 12px;
  width: 12px;
  height: 8px;
  background: #1e40af;
  border-radius: 2px;
  z-index: 3;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 2px;
    background: #1e40af;
    border-radius: 1px;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -1px;
    left: 8px;
    width: 2px;
    height: 6px;
    background: #fbbf24;
    border-radius: 1px;
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: ${props => props.theme.spacing.lg};
    box-shadow: ${props => props.theme.shadows.lg};
    border-radius: 0 0 ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg};
  }
`;

const NavItem = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  background: ${props => props.isActive ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.isActive ? 'white' : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.background};
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const LanguageSelector = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  background: white;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

const LanguageDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  overflow: hidden;
  z-index: 1000;
  min-width: 150px;
`;

const LanguageOption = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  background: ${props => props.isActive ? props.theme.colors.background : 'transparent'};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  text-align: left;
  font-size: 0.9rem;
  transition: background 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.md};
  
  &:hover {
    background: ${props => props.theme.colors.background};
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const Navbar = ({ currentPage, setCurrentPage }) => {
  const { t, i18n } = useTranslation();
  const { currentUser, userType, changeLanguage } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const navItems = [
    { id: 'welcome', label: t('navigation.home'), icon: Home },
    { id: 'games', label: t('navigation.games'), icon: Gamepad2 },
    { id: 'profile', label: t('navigation.profile'), icon: User },
    ...(userType === 'teacher' ? [{ id: 'teacher', label: t('navigation.teacherDashboard'), icon: Users }] : []),
    { id: 'settings', label: t('navigation.settings'), icon: Settings }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' }
  ];

  const handleLanguageChange = async (languageCode) => {
    await changeLanguage(languageCode);
    setIsLanguageOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <NavbarContainer>
      <Logo onClick={() => setCurrentPage('welcome')}>
        <UdaanLogo size="medium" showText={true} />
      </Logo>

      <NavItems isOpen={isMenuOpen}>
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            isActive={currentPage === item.id}
            onClick={() => {
              setCurrentPage(item.id);
              setIsMenuOpen(false);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavItem>
        ))}
      </NavItems>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <LanguageSelector>
          <LanguageButton onClick={() => setIsLanguageOpen(!isLanguageOpen)}>
            <Globe size={16} />
            <span>{currentLanguage.flag}</span>
            <span>{currentLanguage.name}</span>
          </LanguageButton>
          
          {isLanguageOpen && (
            <LanguageDropdown
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {languages.map((lang) => (
                <LanguageOption
                  key={lang.code}
                  isActive={lang.code === i18n.language}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <span style={{ marginRight: '8px' }}>{lang.flag}</span>
                  {lang.name}
                </LanguageOption>
              ))}
            </LanguageDropdown>
          )}
        </LanguageSelector>

        {currentUser && (
          <UserInfo>
            <User size={16} />
            <span>{currentUser.name}</span>
          </UserInfo>
        )}

        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </MobileMenuButton>
      </div>
    </NavbarContainer>
  );
};

export default Navbar;




