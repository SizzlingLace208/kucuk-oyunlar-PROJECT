import React from 'react';

interface ContainerProps {
  children: any;
  className?: string;
}

const Container = ({ children, className = '' }: ContainerProps): JSX.Element => {
  return (
    <div className={`container mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
};

export default Container; 