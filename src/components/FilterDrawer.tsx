import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  VStack,
  Select,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useState } from "react";
import { getAccounts } from "../store/MagicColumns.store";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { setFilters, fetchData, getFilters } = getAccounts();
  const currentFilters = getFilters();

  const [filters, setLocalFilters] = useState({
    name: currentFilters.name || "",
    funding_stage: currentFilters.funding_stage || "",
    min_employees: currentFilters.min_employees || "",
    max_employees: currentFilters.max_employees || "",
  });

  const handleApplyFilters = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
    setFilters(cleanFilters);
    fetchData(cleanFilters);
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Filter Accounts</DrawerHeader>
        <DrawerBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Company Name</FormLabel>
              <Input
                placeholder="Filter by name"
                value={filters.name}
                onChange={(e) =>
                  setLocalFilters({ ...filters, name: e.target.value })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Funding Stage</FormLabel>
              <Select
                placeholder="Select funding stage"
                value={filters.funding_stage}
                onChange={(e) =>
                  setLocalFilters({ ...filters, funding_stage: e.target.value })
                }
              >
                <option value="seed">Seed</option>
                <option value="series_a">Series A</option>
                <option value="series_b">Series B</option>
                <option value="series_c">Series C</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Min Employees</FormLabel>
              <NumberInput
                value={filters.min_employees}
                onChange={(value) =>
                  setLocalFilters({ ...filters, min_employees: value })
                }
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Max Employees</FormLabel>
              <NumberInput
                value={filters.max_employees}
                onChange={(value) =>
                  setLocalFilters({ ...filters, max_employees: value })
                }
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <Button
              colorScheme="blue"
              width="100%"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
