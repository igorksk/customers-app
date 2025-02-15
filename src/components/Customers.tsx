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
  const [sortBy, setSortBy] = useState<string>("");
  const [desc, setDesc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCustomers();
  }, [search, sortBy, desc, currentPage, pageSize]);

  const loadCustomers = async () => {
    const data = await customerService.getAll(search, sortBy, desc, currentPage, pageSize);
    setCustomers(data.customers);
  };

  const handleDelete = async (id: number) => {
    await customerService.delete(id);
    loadCustomers();
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

  return (
    <div className="p-4">
      <div className="flex mb-4 gap-2">
        <Search placeholder="Search customers" onSearch={setSearch} enterButton />
        <Select
          placeholder="Sort by"
          onChange={setSortBy}
          className="w-32"
          options={[
            { value: "name", label: "Name" },
            { value: "email", label: "Email" }
          ]}
        />
        <Select
          placeholder="Order"
          onChange={value => setDesc(value === "true")}
          className="w-32"
          options={[
            { value: "true", label: "Descending" },
            { value: "false", label: "Ascending" }
          ]}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add
        </Button>
      </div>
      <Table
        dataSource={customers}
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
        pagination={{ current: currentPage, pageSize, total: customers.length, onChange: setCurrentPage }}
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
