"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Container,
  Text,
  VStack,
  HStack,
  Divider,
  useToast,
  Center,
  Spinner,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { MagicTable } from "../components/MagicTable";
import { MagicColumnInput } from "../components/MagicColumnInput";
import { PeopleModal } from "../components/PeopleModal";
import { getAccounts, getMagicColumns } from "../store/MagicColumns.store";
import { FilterDrawer } from "../components/FilterDrawer";
import { FiFilter } from "react-icons/fi";

interface Person {
  Name: string;
  Role: string;
  Company: string;
  Location: string;
  "LinkedIn URL": string;
  Email: string;
}

interface ResponseData {
  Name: string;
  answer: string;
  reasoning: string;
}

export default function Page() {
  const toast = useToast({
    position: "bottom-right",
    duration: 4000,
    isClosable: true,
    variant: "solid",
    // containerStyle: {
    //   margin: "16px",
    //   maxWidth: "380px",
    // },
  });

  const showWarningToast = (message: string) => {
    toast({
      title: "Warning",
      description: message,
      status: "warning",
      containerStyle: {
        margin: "16px",
        maxWidth: "380px",
      },
    });
  };

  const accountData = getAccounts();
  const magicColumnsData = getMagicColumns();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingQuestion, setLoadingQuestion] = useState("");
  const [magicColumnErrorMsg, setMagicColumnErrorMsg] = useState("");

  const [data, setData] = useState<any[]>([]);
  const [magicColumns, setMagicColumns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [peopleData, setPeopleData] = useState<Person[]>([]);

  const isQuestionExists = (newQuestion: string) => {
    return magicColumns.some(
      (col) => col.question.toLowerCase() === newQuestion.toLowerCase()
    );
  };

  useEffect(() => {
    accountData.fetchData();
  }, []);

  useEffect(() => {
    if (!accountData.loading) {
      const accData = accountData.getData();
      setData([...accData]);
      setIsInitialLoading(false);
    }
  }, [accountData.loading]);

  const handleNewQuestion = async (question: string) => {
    if (isQuestionExists(question)) {
      showWarningToast("This question has already been asked");
      return;
    }

    setIsLoading(true);
    setLoadingQuestion(question);

    const answerKey = question + " (Answer)";
    const reasonKey = question + " (Reasoning)";

    const loadingData = data.map((item: any) => ({
      ...item,
      [answerKey]: "...",
      [reasonKey]: "Analyzing...",
    }));

    setData(loadingData);
    setMagicColumns((prev) => [...prev, { question, answerKey, reasonKey }]);

    await magicColumnsData.fetchData(question);

    if (!magicColumnsData.loading && !magicColumnsData.getErrorMessage()) {
      console.log("here");
      const res: ResponseData[] = [...magicColumnsData.getData()];
      const enriched = data.map((item: any) => {
        const found = res.find((r) => r.Name === item.Name) as
          | ResponseData
          | undefined;
        if (!found) {
          return {
            ...item,
            [answerKey]: "No data",
            [reasonKey]: "Unable to analyze",
          };
        }
        return {
          ...item,
          [answerKey]: found.answer ?? "—",
          [reasonKey]: found.reasoning ?? "—",
        };
      });
      console.log("Enriched data:", enriched);
      setData(enriched);
      setIsLoading(false);
      setLoadingQuestion("");
    } else {
      setMagicColumnErrorMsg(magicColumnsData.getErrorMessage());
      setMagicColumns((prev) =>
        prev.filter((col) => col.question !== question)
      );

      setData((prev) =>
        prev.map((item: any) => {
          const { [answerKey]: _, [reasonKey]: __, ...rest } = item;
          return rest;
        })
      );
      setIsLoading(false);
      setLoadingQuestion("");
    }
  };

  const handleOnRowClick = async () => {
    try {
      const res = await fetch("http://localhost:8000/people");
      if (!res.ok) {
        throw new Error("Failed to fetch people data");
      }
      const data = await res.json();
      setPeopleData(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching people:", error);
      toast({
        title: "Error",
        description: "Failed to fetch people data",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box bg="gray.50" minH="100vh" py={8}>
        <Container maxW="7xl">
          <VStack spacing={6} align="stretch">
            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Heading size="lg" color="gray.800">
                      Magic Columns ✨
                    </Heading>
                  </VStack>
                </HStack>
                <Divider />
                <HStack width="100%" spacing={2}>
                  <Box flex="1">
                    <MagicColumnInput
                      onAsk={handleNewQuestion}
                      isDisabled={isInitialLoading}
                      isLoading={isLoading}
                      loadingQuestion={loadingQuestion}
                      errorMessage={magicColumnErrorMsg}
                      tryAgain={() => setMagicColumnErrorMsg("")}
                    />
                  </Box>
                  <IconButton
                    aria-label="Filter"
                    icon={<FiFilter />}
                    onClick={onOpen}
                    variant="outline"
                    height="40px"
                    alignSelf="end"
                  />
                </HStack>
                <FilterDrawer isOpen={isOpen} onClose={onClose} />
              </VStack>
            </Box>

            <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
              {isInitialLoading && data ? (
                <Box p={8}>
                  <Center flexDirection="column" gap={4}>
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                    <Text color="gray.600">Loading data...</Text>
                  </Center>
                </Box>
              ) : (
                <MagicTable
                  data={data}
                  magicColumns={magicColumns}
                  onRowClick={handleOnRowClick}
                  onDeleteColumn={(columnKey) => {
                    const updatedColumns = magicColumns.filter(
                      (col) => col.answerKey !== columnKey
                    );
                    setMagicColumns(updatedColumns);
                  }}
                />
              )}
            </Box>
          </VStack>
        </Container>
      </Box>
      <PeopleModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        peopleData={peopleData}
      />
    </>
  );
}
