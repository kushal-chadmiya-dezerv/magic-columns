"use client";
import {
  VStack,
  Button,
  Text,
  HStack,
  Box,
  Icon,
  Input,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState } from "react";
import { FiAlertCircle, FiRefreshCcw } from "react-icons/fi";

const pulseAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

interface MagicColumnInputProps {
  onAsk: (q: string) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  loadingQuestion?: string;
  errorMessage?: string;
  tryAgain?: () => void;
}

export const MagicColumnInput = ({
  onAsk,
  isDisabled,
  isLoading,
  loadingQuestion,
  errorMessage,
  tryAgain,
}: MagicColumnInputProps) => {
  const [question, setQuestion] = useState("");

  if (isLoading && loadingQuestion) {
    return (
      <VStack spacing={3} align="stretch">
        <Text fontSize="sm" color="gray.600">
          Ask a question about the companies
        </Text>
        <Box
          p={4}
          borderRadius="lg"
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
        >
          <VStack align="stretch" spacing={3}>
            <Text fontWeight="medium" color="gray.700">
              {loadingQuestion}
            </Text>
            <HStack spacing={2}>
              <Box
                h="2"
                w="2"
                borderRadius="full"
                bg="blue.500"
                sx={{
                  animation: `${pulseAnimation} 1s ease-in-out infinite`,
                }}
              />
              <Box
                h="2"
                w="2"
                borderRadius="full"
                bg="blue.500"
                sx={{
                  animation: `${pulseAnimation} 1s ease-in-out infinite 0.2s`,
                }}
              />
              <Box
                h="2"
                w="2"
                borderRadius="full"
                bg="blue.500"
                sx={{
                  animation: `${pulseAnimation} 1s ease-in-out infinite 0.4s`,
                }}
              />
              <Text fontSize="sm" color="gray.600" ml={2}>
                Analyzing...
              </Text>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    );
  }

  if (errorMessage) {
    return (
      <VStack spacing={4} align="stretch" w="full">
        <Box
          p={6}
          borderRadius="xl"
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          role="alert"
        >
          <VStack spacing={4} align="stretch">
            <HStack spacing={3}>
              <Icon as={FiAlertCircle} w={5} h={5} color="red.500" />
              <Text fontSize="md" fontWeight="medium" color="red.700">
                An Error Occurred
              </Text>
            </HStack>

            <Text fontSize="sm" color="red.600">
              {errorMessage}
            </Text>

            <Button
              leftIcon={<FiRefreshCcw />}
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={tryAgain}
              alignSelf="flex-start"
            >
              Retry
            </Button>
          </VStack>
        </Box>
      </VStack>
    );
  }

  return (
    <VStack spacing={3} align="stretch">
      <Text fontSize="sm" color="gray.600">
        Ask a question about the companies
      </Text>
      <HStack spacing={4} width="100%">
        <Box flex="1" width="100%">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question like 'Are they a developer tooling company?'"
            isDisabled={isDisabled}
            width="100%"
          />
        </Box>
        <Button
          colorScheme="blue"
          px={6}
          h="40px"
          isDisabled={!question || isDisabled}
          onClick={() => {
            if (question) {
              onAsk(question);
              setQuestion("");
            }
          }}
          flexShrink={0}
        >
          Ask
        </Button>
      </HStack>
    </VStack>
  );
};
