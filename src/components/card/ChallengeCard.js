import React from "react";
import { Card, Button } from "antd";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ token, css }) => ({
  card: css`
    position: relative;
    width: 265px;
    height: 392px;
    border: none;
    box-shadow: none;
    cursor: pointer;
    transition: transform 0.2s ease;
    background: transparent;
    
    &:hover {
      transform: scale(1.05);
    }
    
    .ant-card-body {
      padding: 0;
      height: 100%;
    }
  `,
  
  cardBackground: css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    border-radius: 8px;
  `,
  
  title: css`
    position: absolute;
    width: 170px;
    top: 262px;
    left: 42px;
    font-weight: 600;
    color: var(--syn-1);
    font-size: 12.9px;
    font-family: 'Poppins', Helvetica;
    z-index: 2;
  `,
  
  subtitle: css`
    position: absolute;
    width: 190px;
    top: 305px;
    left: 42px;
    font-weight: 400;
    color: var(--syn-1);
    font-size: 11.3px;
    font-family: 'Poppins', Helvetica;
    z-index: 2;
  `,
  
  buttonWrapper: css`
    position: absolute;
    width: 87px;
    height: 35px;
    top: 331px;
    left: 42px;
    z-index: 2;
  `,
  
  button: css`
    width: 100%;
    height: 100%;
    background: var(--syn);
    border-radius: 35.86px;
    border: 1.5px solid #05042e;
    color: var(--syn-1);
    font-size: 15.5px;
    font-weight: bold;
    font-family: 'OPPOSans-Bold', Helvetica;
  `
}));

export const ChallengeCard = ({
  id,
  title,
  subtitle,
  hasButton,
  buttonText,
  buttonPosition,
  onClick
}) => {
  const { styles } = useStyles();

  // 统一用 public/assets 下的绝对路径
  const challengeImages = {
    1: "/assets/subtract-1.svg",
    2: "/assets/subtract-2.svg",
    3: "/assets/subtract.svg",
    4: "/assets/subtract-5.svg",
    5: "/assets/subtract-3.svg",
    6: "/assets/subtract-4.svg"
  };
  const backgroundImage = challengeImages[id] || "/assets/subtract-1.svg";

  return (
    <Card 
      className={styles.card}
      onClick={onClick}
      hoverable={false}
      bordered={false}
    >
      {/* Background */}
      <div 
        className={styles.cardBackground}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '100% 100%'
        }}
      />
      
      {/* Content */}
      {title && (
        <div className={styles.title}>
          {title}
        </div>
      )}
      {subtitle && (
        <div className={styles.subtitle}>
          {subtitle}
        </div>
      )}
      {hasButton && (
        <div className={styles.buttonWrapper}>
          <Button 
            className={styles.button}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {buttonText}
          </Button>
        </div>
      )}
    </Card>
  );
};