import axios from "axios";
import { useEffect, useState } from "react";
import "./Employees.css";

export default function Employees() {
  const token = localStorage.getItem("token");

  const [employees, setEmployees] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [target, setTarget] = useState("all");
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    auto_email: false
  });

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const loadEmployees = () => {
    axios
      .get("http://localhost:3001/employees", {
        headers: { Authorization: token }
      })
      .then(res => setEmployees(res.data))
      .catch(logout);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const submitForm = async () => {
    if (form.id) {
      await axios.put(
        `http://localhost:3001/employees/${form.id}`,
        form,
        { headers: { Authorization: token } }
      );
    } else {
      await axios.post(
        "http://localhost:3001/employees",
        form,
        { headers: { Authorization: token } }
      );
    }

    setForm({ id: null, name: "", email: "", auto_email: false });
    setIsDialogOpen(false);
    loadEmployees();
  };

  const editEmployee = (emp) => {
    setForm(emp);
    setIsDialogOpen(true);
  };

  const openDialog = () => {
    setForm({ id: null, name: "", email: "", auto_email: false });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setForm({ id: null, name: "", email: "", auto_email: false });
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Delete employee?")) return;

    await axios.delete(
      `http://localhost:3001/employees/${id}`,
      { headers: { Authorization: token } }
    );

    loadEmployees();
  };

   const sendGroupEmail = async () => {
    const message = prompt("Enter email message");
    if (!message) return;

    await axios.post(
      "http://localhost:3001/send-email-group",
      { target, message },
      { headers: { Authorization: token } }
    );

    alert("Emails sent successfully");
  };

  return (
    <div className="employee-container">
      <div className="header">
        <h2>Manage Employees</h2>
        <div>
          <button className="add-btn" onClick={openDialog}>Add Employee</button>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

         <div className="email-actions">
        <select value={target} onChange={e => setTarget(e.target.value)}>
          <option value="all">All Users</option>
          <option value="enabled">Enabled Users</option>
          <option value="disabled">Disabled Users</option>
        </select>

        <button className="email-btn" onClick={sendGroupEmail}>
          Send Common Email
        </button>
      </div>

      {/* DIALOG MODAL */}
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3>{form.id ? "Edit Employee" : "Add New Employee"}</h3>
              <button className="close-btn" onClick={closeDialog}>✕</button>
            </div>

            <div className="dialog-form">
              <input
                placeholder="Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={form.auto_email}
                  onChange={e =>
                    setForm({ ...form, auto_email: e.target.checked })
                  }
                />
                Auto Email Enabled
              </label>
            </div>

            <div className="dialog-footer">
              <button className="cancel-btn" onClick={closeDialog}>Cancel</button>
              <button className="submit-btn" onClick={submitForm}>
                {form.id ? "Update Employee" : "Add Employee"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>AUTO EMAIL</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>
                <span className={emp.auto_email ? "status active" : "status inactive"}>
                  {emp.auto_email ? "Enabled" : "Disabled"}
                </span>
              </td>
              <td>
                <button onClick={() => editEmployee(emp)}>Edit</button>
                <button className="danger" onClick={() => deleteEmployee(emp.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
