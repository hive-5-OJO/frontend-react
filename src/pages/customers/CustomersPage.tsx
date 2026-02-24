import DashboardLayout from '../../components/layout/DashboardLayout';

interface SortField {
  field: string;
  order: 'asc' | 'desc';
}

const CustomersPage = () => {
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };
  return (
    <DashboardLayout>
      <>고객 관리 페이지입니다</>
    </DashboardLayout>
  );
};

export default CustomersPage;
