const BASE_URL = "http://localhost:7082/api/customers";

const customerService = {
  async getAll() {
    const response = await fetch(BASE_URL);
    return response.json();
  },
  
  async create(customer: { name: string; email: string }) {
    await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });
  },
  
  async update(id: number, customer: { name: string; email: string }) {
    await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });
  },
  
  async delete(id: number) {
    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  },
};

export default customerService;
