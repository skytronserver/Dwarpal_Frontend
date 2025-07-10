import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Timer } from "lucide-react";
import { keyframes } from "@emotion/react";
import { styled } from "@mui/material/styles";

// Keyframe animations
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const gradientText = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Styled components
const AnimatedIcon = styled(Box)`
  animation: ${pulse} 2s infinite ease-in-out;
`;

const AnimatedTypography = styled(Typography)`
  animation: ${slideIn} 0.6s ease-out forwards;
  opacity: 0;
`;

const GradientTypography = styled(Typography)`
  background: linear-gradient(90deg, #2196f3, #1976d2, #0d47a1);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientText} 3s linear infinite;
`;

const AnimatedButton = styled(Button)`
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }

  &:hover:before {
    width: 300px;
    height: 300px;
  }
`;

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <AnimatedIcon>
          <Timer size={80} color="#1976d2" />
        </AnimatedIcon>

        <GradientTypography variant="h2" sx={{ fontWeight: "bold", mb: 1 }}>
          Coming Soon
        </GradientTypography>

        <AnimatedTypography 
          variant="h5" 
          color="textSecondary" 
          gutterBottom
          sx={{ animationDelay: "0.2s" }}
        >
          We're working hard to bring you something amazing
        </AnimatedTypography>

        <AnimatedTypography 
          variant="body1" 
          color="textSecondary" 
          sx={{ 
            maxWidth: 600, 
            mb: 4,
            animationDelay: "0.4s"
          }}
        >
          This feature is currently under development. We're putting the finishing 
          touches on it to ensure we deliver the best possible experience for you.
        </AnimatedTypography>

        <AnimatedButton
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/")}
          sx={{ 
            animationDelay: "0.6s",
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontSize: "1.1rem"
          }}
        >
          Back to Home
        </AnimatedButton>
      </Box>
    </Container>
  );
};

export default ComingSoon; 