import React from 'react';

interface LoaderProps {
  color?: string;
  size?: number; // scale multiplier e.g. 1, 1.2, 1.5
  className?: string;
}

export const GeometricBoxLoader: React.FC<LoaderProps> = ({ 
  color = '#155EEF', 
  size = 1,
  className = '' 
}) => {
  return (
    <div 
      className={`geometric-loader-container relative select-none flex items-center justify-center ${className}`}
      style={{
        transform: `scale(${size})`,
        transformOrigin: 'center center'
      }}
    >
      <style>{`
        .custom-box-loader {
          width: 112px;
          height: 112px;
          position: relative;
        }

        .custom-box-loader .box1,
        .custom-box-loader .box2,
        .custom-box-loader .box3 {
          border: 16px solid ${color};
          box-sizing: border-box;
          position: absolute;
          display: block;
          border-radius: 2px;
          transition: border-color 0.3s ease;
        }

        .custom-box-loader .box1 {
          width: 112px;
          height: 48px;
          margin-top: 64px;
          margin-left: 0px;
          animation: abox1 4s 1s forwards ease-in-out infinite;
        }

        .custom-box-loader .box2 {
          width: 48px;
          height: 48px;
          margin-top: 0px;
          margin-left: 0px;
          animation: abox2 4s 1s forwards ease-in-out infinite;
        }

        .custom-box-loader .box3 {
          width: 48px;
          height: 48px;
          margin-top: 0px;
          margin-left: 64px;
          animation: abox3 4s 1s forwards ease-in-out infinite;
        }

        @keyframes abox1 {
          0% {
            width: 112px;
            height: 48px;
            margin-top: 64px;
            margin-left: 0px;
          }
          12.5% {
            width: 48px;
            height: 48px;
            margin-top: 64px;
            margin-left: 0px;
          }
          25% {
            width: 48px;
            height: 48px;
            margin-top: 64px;
            margin-left: 0px;
          }
          37.5% {
            width: 48px;
            height: 48px;
            margin-top: 64px;
            margin-left: 0px;
          }
          50% {
            width: 48px;
            height: 48px;
            margin-top: 64px;
            margin-left: 0px;
          }
          62.5% {
            width: 48px;
            height: 48px;
            margin-top: 64px;
            margin-left: 0px;
          }
          75% {
            width: 48px;
            height: 112px;
            margin-top: 0px;
            margin-left: 0px;
          }
          87.5% {
            width: 48px;
            height: 48px;
            margin-top: 0px;
            margin-left: 0px;
          }
          100% {
            width: 48px;
            height: 48px;
            margin-top: 0px;
            margin-left: 0px;
          }
        }

        @keyframes abox2 {
          0% {
            width: 48px;
            height: 48px;
            margin-top: 0px;
            margin-left: 0px;
          }
          12.5% {
            width: 48px;
            height: 48px;
            margin-top: 0px;
            margin-left: 0px;
          }
          25% {
            width: 48px;
            height: 48px;
            margin-top: 0px;
            margin-left: 0px;
          }
          37.5% {
            width: 48px;
            height: 48px;
            margin-top: 0px;
            margin-left: 0px;
          }
          50% {
            width: 112px;
            height: 48px;
            margin-top: 0px;
            margin-left: 0px;
          }
          62.5% {
            width: 48px;
            height: 48px;
            margin-top: 0px;
            margin-left: 64px;
          }
          75% {
            width: 48px;
            height: 48px;
            margin-top: 0px;
            margin-left: 64px;
          }
          87.5% {
            width: 48px;
            height: 48px;
            margin-top: 0px;
            margin-left: 64px;
          }
          100% {
            width: 48px;
            height: 48px;
            margin-top: 0px;
            margin-left: 64px;
          }
        }

        @keyframes abox3 {
          0% {
            width: 48px;
            height: 48px;
            margin-top: 0px;
            margin-left: 64px;
          }
          12.5% {
            width: 48px;
            height: 48px;
            margin-top: 0px;
            margin-left: 64px;
          }
          25% {
            width: 48px;
            height: 112px;
            margin-top: 0px;
            margin-left: 64px;
          }
          37.5% {
            width: 48px;
            height: 48px;
            margin-top: 64px;
            margin-left: 64px;
          }
          50% {
            width: 48px;
            height: 48px;
            margin-top: 64px;
            margin-left: 64px;
          }
          62.5% {
            width: 48px;
            height: 48px;
            margin-top: 64px;
            margin-left: 64px;
          }
          75% {
            width: 48px;
            height: 48px;
            margin-top: 64px;
            margin-left: 64px;
          }
          87.5% {
            width: 48px;
            height: 48px;
            margin-top: 64px;
            margin-left: 64px;
          }
          100% {
            width: 112px;
            height: 48px;
            margin-top: 64px;
            margin-left: 0px;
          }
        }
      `}</style>
      <div className="custom-box-loader">
        <div className="box1" />
        <div className="box2" />
        <div className="box3" />
      </div>
    </div>
  );
};

export default GeometricBoxLoader;
