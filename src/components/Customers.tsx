import { useState, useEffect } from "react";
import { Table, Input, Button, Pagination, Select, Modal, Form } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import "antd/dist/reset.css";
import customerService from "../ApiService/CustomerService";

interface Customer {
  id: number;
  name: string;
  email: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await customerService.getAll();
    setCustomers(data);
  };

  const handleDelete = async (id: number) => {
    await customerService.delete(id);
    loadCustomers();
  };

  const handleSearch = (value: string) => {
    setSearch(value.toLowerCase());
  };

  const handleSort = (order: string) => {
    setSortOrder(order);
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue(customer);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      if (editingCustomer) {
        await customerService.update(editingCustomer.id, values);
      } else {
        await customerService.create(values);
      }
      setIsModalOpen(false);
      loadCustomers();
    });
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add
        </Button>
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
                <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
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
      <Modal
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please enter email" }]}>
            <Input type="email" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
