import React, { useState } from "react";
import "./App.css";

const TOTAL_TABLES = 10; // Increased from 8 to 10
const SEATS_PER_TABLE = 4;
const TOTAL_SEATS = TOTAL_TABLES * SEATS_PER_TABLE;

const App = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bookedSeats, setBookedSeats] = useState([]);

  const toggleSeat = (id) => {
    if (bookedSeats.includes(id)) return; // Prevent booking an already booked seat

    setSelectedSeats((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((seatId) => seatId !== id)
        : [...prevSelected, id]
    );
  };

  const addCustomer = () => {
    if (name && phone && selectedSeats.length > 0) {
      const newCustomer = {
        id: Date.now(),
        name,
        phone,
        guestCount: selectedSeats.length,
        seats: [...selectedSeats].sort((a, b) => a - b),
        checkIn: new Date().toLocaleTimeString(),
        checkOut: "--",
      };

      setCustomers([...customers, newCustomer]);
      setBookedSeats([...bookedSeats, ...selectedSeats]);
      setSelectedSeats([]);
      setName("");
      setPhone("");
    }
  };

  const checkoutCustomer = (id, seats) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((cust) =>
        cust.id === id ? { ...cust, checkOut: new Date().toLocaleTimeString() } : cust
      )
    );

    setBookedSeats((prevBookedSeats) => prevBookedSeats.filter((seat) => !seats.includes(seat)));
  };

  const removeCustomer = (id) => {
    const customer = customers.find((c) => c.id === id);
    if (!customer) return;

    setCustomers((prevCustomers) => prevCustomers.filter((c) => c.id !== id));
    setBookedSeats((prevBookedSeats) => prevBookedSeats.filter((seat) => !customer.seats.includes(seat)));
  };

  return (
    <div className="container">
      <h1>Restaurant Customer Management</h1>

      <div className="stats-container">
        <div className="card">
          <h3>Total Capacity</h3>
          <p>{TOTAL_SEATS}</p>
        </div>
        <div className="card">
          <h3>Seats Left</h3>
          <p>{TOTAL_SEATS - bookedSeats.length}</p>
        </div>
      </div>

      <div className="form-card">
        <label>Customer:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter customer name" />

        <label>Phone:</label>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" />

        <label>Guest Count:</label>
        <input type="number" value={selectedSeats.length} readOnly />

        <button onClick={addCustomer} disabled={selectedSeats.length === 0}>
          Add Customer
        </button>
      </div>

      <div className="tables-container">
        {Array.from({ length: TOTAL_TABLES }, (_, tableIndex) => (
          <div key={tableIndex} className="table">
            {[1, 2, 3, 4].map((seatOffset) => {
              const seatId = tableIndex * 4 + seatOffset;
              return (
                <div
                  key={seatId}
                  className={`seat ${["top", "left", "right", "bottom"][seatOffset - 1]} ${
                    bookedSeats.includes(seatId) ? "booked" : selectedSeats.includes(seatId) ? "selected" : ""
                  }`}
                  onClick={() => toggleSeat(seatId)}
                ></div>
              );
            })}
            <div className="table-center">{tableIndex + 1}</div> {/* Updated to show Table Number */}
          </div>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Guest Count</th>
            <th>Seats</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Remove Entry</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cust) => (
            <tr key={cust.id}>
              <td>{cust.name}</td>
              <td>{cust.phone}</td>
              <td>{cust.guestCount}</td>
              <td>{cust.seats.join(", ")}</td>
              <td>{cust.checkIn}</td>
              <td>
                {cust.checkOut === "--" ? (
                  <button className="checkout-btn" onClick={() => checkoutCustomer(cust.id, cust.seats)}>
                    Click to Checkout
                  </button>
                ) : (
                  cust.checkOut
                )}
              </td>
              <td>
                <button className="delete-btn" onClick={() => removeCustomer(cust.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;