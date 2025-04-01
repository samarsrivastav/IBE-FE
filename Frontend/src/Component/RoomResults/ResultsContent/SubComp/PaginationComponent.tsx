import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <Stack spacing={2} alignItems="center" marginTop={2}>
      <Pagination count={totalPages} page={currentPage} onChange={onPageChange} color="primary" />
    </Stack>
  );
};

export default PaginationComponent;
