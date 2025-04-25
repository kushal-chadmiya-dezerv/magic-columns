import {
  HStack,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { FiLinkedin, FiMail, FiMapPin } from "react-icons/fi";

interface Person {
  Name: string;
  Role: string;
  Company: string;
  Location: string;
  "LinkedIn URL": string;
  Email: string;
}

interface Props {
  isModalOpen: boolean;
  onClose: () => void;
  peopleData: Person[];
}

export const PeopleModal: React.FC<Props> = ({
  isModalOpen,
  onClose,
  peopleData,
}) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent maxW="900px">
        <ModalHeader>People Information</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Name & Role</Th>
                <Th>Contact</Th>
                <Th>Location</Th>
              </Tr>
            </Thead>
            <Tbody>
              {peopleData.map((person, index) => (
                <Tr key={index}>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="500">{person.Name}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {person.Role}
                      </Text>
                    </VStack>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={2}>
                      {person.Email && (
                        <HStack spacing={2}>
                          <Icon as={FiMail} color="gray.500" />
                          <Link
                            href={`mailto:${person.Email}`}
                            color="blue.500"
                          >
                            {person.Email}
                          </Link>
                        </HStack>
                      )}
                      {person["LinkedIn URL"] && (
                        <HStack spacing={2}>
                          <Icon as={FiLinkedin} color="gray.500" />
                          <Link
                            href={person["LinkedIn URL"]}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="blue.500"
                          >
                            LinkedIn Profile
                          </Link>
                        </HStack>
                      )}
                    </VStack>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Icon as={FiMapPin} color="gray.500" />
                      <Text>{person.Location}</Text>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
