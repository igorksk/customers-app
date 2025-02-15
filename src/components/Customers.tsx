import React, { useState, useEffect } from "react";
import { Table, Input, Button, Pagination, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import "antd/dist/reset.css";


interface Customer {
  id: number;
  name: string;
  email: string;
}

const initialCustomers: Customer[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Alice Brown", email: "alice@example.com" },
];

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const handleDelete = (id: number) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const handleSearch = (value: string) => {
    setSearch(value.toLowerCase());
  };

  const handleSort = (order: string) => {
    setSortOrder(order);
  };

  const filteredCustomers = customers.filter(
    (c) => c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search)
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (!sortOrder) return 0;
    return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
  });

  return (
    <div className="p-4">
      <div className="flex mb-4 gap-2">
        <Search placeholder="Search customers" onSearch={handleSearch} enterButton />
        <Select
          placeholder="Sort by"
          onChange={handleSort}
          className="w-32"
          options={[
            { value: "asc", label: "Name Asc" },
            { value: "desc", label: "Name Desc" }
          ]}
        />
        <Button type="primary" icon={<PlusOutlined />}>Add</Button>
      </div>
      <Table
        dataSource={sortedCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        rowKey="id"
        columns={[
          { title: "ID", dataIndex: "id" },
          { title: "Name", dataIndex: "name" },
          { title: "Email", dataIndex: "email" },
          {
            title: "Actions",
            render: (_: any, record: Customer) => (
              <div className="flex gap-2">
                <Button icon={<EditOutlined />} />
                <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
              </div>
            ),
          },
        ]}
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredCustomers.length}
        onChange={setCurrentPage}
        className="mt-4"
      />
    </div>
  );
}
