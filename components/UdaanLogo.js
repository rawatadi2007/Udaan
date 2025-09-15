import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: ${props => props.margin || '0'};
`;

const LogoImage = styled.img`
  width: ${props => props.size === 'small' ? '80px' : '120px'};
  height: ${props => props.size === 'small' ? '80px' : '120px'};
  object-fit: contain;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const UdaanLogo = ({ size = 'normal', showText = true, margin }) => {
  return (
    <LogoContainer size={size} margin={margin}>
      <LogoImage 
        src="/images/udaan-logo.png" 
        alt="Udaan Logo" 
        size={size}
        onError={(e) => {
          console.log('Logo image not found. Please add udaan-logo.png to public/images/ directory');
          e.target.style.display = 'none';
        }}
      />
    </LogoContainer>
  );
};

export default UdaanLogo;
