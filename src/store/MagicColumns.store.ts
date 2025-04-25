interface FilterParams {
  name?: string;
  funding_stage?: string;
  min_employees?: number;
  max_employees?: number;
}

import { hookstate, useHookstate } from "@hookstate/core";

const accountsInitialState = hookstate({
  data: [],
  isLoading: false,
  errorMessage: "",
  filters: {
    name: undefined,
    funding_stage: undefined,
    min_employees: undefined,
    max_employees: undefined,
  } as FilterParams,
});

export const getAccounts = () => {
  const state = useHookstate(accountsInitialState);
  return {
    loading: state.isLoading.get(),
    fetchData: async (filters?: FilterParams) => {
      if (!state.isLoading.get()) {
        state.isLoading.set(true);
        try {
          const queryParams = new URLSearchParams();
          if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
              if (value !== undefined) {
                queryParams.append(key, value.toString());
              }
            });
          }

          const url = `http://localhost:8000/accounts?${queryParams.toString()}`;
          const res = await fetch(url);
          if (!res.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await res.json();
          state.data.set(data);
        } catch (error) {
          state.errorMessage.set(
            "Failed to load data. Please refresh the page."
          );
        } finally {
          state.isLoading.set(false);
        }
      }
    },
    getData: () => state.data.get({ noproxy: true }),
    getErrorMessage: () => state.errorMessage.get(),
    setFilters: (filters: FilterParams) => {
      state.filters.set(filters);
    },
    getFilters: () => state.filters.get({ noproxy: true }),
  };
};

const magicColumnsInitialState = hookstate({
  data: [],
  isLoading: false,
  errorMessage: "",
});

export const getMagicColumns = () => {
  const state = useHookstate(magicColumnsInitialState);
  return {
    loading: state.isLoading.get(),
    fetchData: async (question: string) => {
      if (!state.isLoading.get()) {
        state.errorMessage.set("");
        state.isLoading.set(true);
        try {
          const res = await fetch(
            `http://localhost:8000/magic/question?question=${question}`
          );
          const data = await res.json();
          if (data?.error) {
            state.errorMessage.set("Failed to process your question");
          } else {
            state.data.set(data.data);
          }
        } catch (error) {
          state.errorMessage.set("Failed to process your question");
        } finally {
          state.isLoading.set(false);
        }
      }
    },
    getData: () => state.data.get({ noproxy: true }),
    getErrorMessage: () => state.errorMessage.get(),
  };
};
